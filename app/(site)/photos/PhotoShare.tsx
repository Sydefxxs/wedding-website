'use client'

import { useCallback, useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, DownloadSimple, ImageSquare, UploadSimple, X } from '@phosphor-icons/react'
import { uploadGuestPhoto } from './actions'
import type { GuestPhoto, UploadSettings } from '@/lib/guest-photos'
import { Button } from '@/components/ui/Button'
import { getLenis } from '@/components/motion/SmoothScroll'
import { cn } from '@/lib/utils'

type Item = GuestPhoto & { local?: boolean }
type Job = { id: string; name: string; status: 'waiting' | 'uploading' | 'done' | 'error'; error?: string }

const field = 'w-full border-0 border-b border-line bg-transparent px-0 py-3 outline-none placeholder:text-ink-2/60 focus:border-ink'
const isBlob = (u: string) => u.startsWith('blob:')
const thumb = (u: string) => (isBlob(u) ? u : `${u}?w=800&fit=max&auto=format`)
const full = (u: string) => (isBlob(u) ? u : `${u}?w=2400&fit=max&auto=format`)
const fileName = (p: Item, i: number) => `arath-ruby-${String(i + 1).padStart(3, '0')}${p.name ? `-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : ''}.jpg`

/** Shrink to max 2400px JPEG in the browser: faster uploads on cell data, and it drops location data. */
async function compress(file: File): Promise<File> {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const scale = Math.min(1, 2400 / Math.max(bmp.width, bmp.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bmp.width * scale)
    canvas.height = Math.round(bmp.height * scale)
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.86))
    if (!blob) return file
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '') || 'photo'}.jpg`, { type: 'image/jpeg' })
  } catch {
    return file // browser can't decode it (e.g. HEIC outside Safari) — the server still accepts it
  }
}

async function saveBlob(blob: Blob, name: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 10_000)
}

export function PhotoShare({ photos, settings }: { photos: GuestPhoto[]; settings: UploadSettings }) {
  const router = useRouter()
  const [local, setLocal] = useState<Item[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [zipping, setZipping] = useState<string | null>(null)
  const [index, setIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const items: Item[] = [...local, ...photos.filter((p) => !local.some((l) => l.id === p.id))]

  const pick = (list: FileList | null) => {
    if (!list) return
    setFiles(Array.from(list).filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name)).slice(0, 30))
    setMessage(null)
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    pick(e.dataTransfer.files)
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!files.length) return setMessage({ tone: 'error', text: 'Choose at least one photo first.' })
    const fd = new FormData(e.currentTarget)
    const meta = { name: String(fd.get('name') ?? ''), caption: String(fd.get('caption') ?? ''), code: String(fd.get('code') ?? '') }
    setBusy(true)
    setMessage(null)
    const queue: Job[] = files.map((f, i) => ({ id: `${Date.now()}-${i}`, name: f.name, status: 'waiting' }))
    setJobs(queue)
    let saved = 0, demo = false, hidden = false, failed = 0, lastError = ''

    for (const [i, original] of files.entries()) {
      setJobs((js) => js.map((j, k) => (k === i ? { ...j, status: 'uploading' } : j)))
      const photo = await compress(original)
      const body = new FormData()
      body.set('photo', photo)
      Object.entries(meta).forEach(([k, v]) => body.set(k, v))
      const res = await uploadGuestPhoto(body).catch(() => ({ ok: false as const, error: 'Connection problem — please try again.' }))
      if (res.ok) {
        saved++
        demo ||= Boolean(res.demo)
        hidden ||= Boolean(res.hidden)
        if (res.demo || res.hidden) {
          const url = URL.createObjectURL(photo)
          const dims = await createImageBitmap(photo).then((b) => ({ width: b.width, height: b.height })).catch(() => ({ width: 4, height: 5 }))
          setLocal((l) => [{ id: queue[i].id, url, ...dims, name: meta.name || undefined, caption: meta.caption || undefined, local: true }, ...l])
        }
      } else {
        failed++
        lastError = res.error
      }
      setJobs((js) => js.map((j, k) => (k === i ? { ...j, status: res.ok ? 'done' : 'error', error: res.ok ? undefined : res.error } : j)))
      if (!res.ok && /code|closed/i.test(res.error)) break // no point retrying the rest
    }

    setBusy(false)
    setFiles([])
    if (inputRef.current) inputRef.current.value = ''
    if (saved && !demo && !hidden) router.refresh()
    setMessage(
      failed && !saved
        ? { tone: 'error', text: lastError }
        : {
            tone: 'ok',
            text: demo
              ? `Preview only: your ${saved === 1 ? 'photo shows' : `${saved} photos show`} below on this device, but nothing is saved yet. Uploads save once the site is fully connected.`
              : hidden
                ? `Thank you! ${saved === 1 ? 'Your photo' : `${saved} photos`} will appear once Arath & Ruby approve ${saved === 1 ? 'it' : 'them'}.`
                : `Thank you! ${saved === 1 ? 'Your photo is' : `${saved} photos are`} up.${failed ? ` ${failed} didn’t upload — ${lastError}` : ''}`,
          },
    )
  }

  const downloadAll = async () => {
    const list = items.filter((p) => !p.local)
    if (!list.length) return
    setZipping('Getting ready…')
    try {
      const { default: JSZip } = await import('jszip')
      const zip = new JSZip()
      for (const [i, p] of list.entries()) {
        setZipping(`Adding photo ${i + 1} of ${list.length}…`)
        const blob = await fetch(full(p.url)).then((r) => r.blob())
        zip.file(fileName(p, i), blob)
      }
      setZipping('Packing the zip…')
      await saveBlob(await zip.generateAsync({ type: 'blob' }), 'arath-ruby-wedding-photos.zip')
    } catch {
      setMessage({ tone: 'error', text: 'Couldn’t build the download — try again, or save photos one at a time.' })
    } finally {
      setZipping(null)
    }
  }

  const downloadOne = async (p: Item, i: number) => {
    const blob = await fetch(full(p.url)).then((r) => r.blob())
    await saveBlob(blob, fileName(p, i))
  }

  // Lightbox
  const open = index !== null
  const go = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length])
  useEffect(() => {
    if (!open) return
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIndex(null)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      getLenis()?.start()
      document.documentElement.style.overflow = ''
    }
  }, [open, go])
  const current = index !== null ? items[index] : null

  return (
    <>
      {/* Upload */}
      <section className="container-x pb-20 md:pb-28" aria-labelledby="share-heading">
        <div className="grid gap-12 border border-line bg-paper-2 p-6 md:grid-cols-12 md:p-12">
          <div className="md:col-span-5">
            <h2 id="share-heading" className="text-h2">Add your photos</h2>
            <p className="mt-4 text-ink-2">From the ceremony, the dance floor, the photo booth — anything you captured. Photos are shrunk on your phone before uploading, so it’s quick even on cell data.</p>
            {!settings.open && <p className="mt-6 text-warning">Uploads are closed right now — check back soon.</p>}
          </div>

          {settings.open && (
            <form onSubmit={onSubmit} className="space-y-6 md:col-span-6 md:col-start-7" noValidate>
              <label
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed px-6 py-10 text-center transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary',
                  dragging ? 'border-gold bg-paper' : 'border-line hover:border-gold',
                )}
              >
                <UploadSimple aria-hidden size={30} weight="light" className="text-gold" />
                <span className="font-display text-h3">{files.length ? `${files.length} photo${files.length > 1 ? 's' : ''} ready` : 'Choose photos'}</span>
                <span className="text-sm text-ink-2">Tap to pick from your phone, or drop them here · up to 30 at a time</span>
                <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => pick(e.target.files)} />
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="eyebrow block text-ink-2">Your name (optional)</label>
                  <input id="name" name="name" autoComplete="name" className={cn(field, 'mt-1')} />
                </div>
                <div>
                  <label htmlFor="caption" className="eyebrow block text-ink-2">Caption (optional)</label>
                  <input id="caption" name="caption" className={cn(field, 'mt-1')} placeholder="First dance!" />
                </div>
              </div>
              {settings.requiresCode && (
                <div>
                  <label htmlFor="code" className="eyebrow block text-ink-2">Upload code (on your table card)</label>
                  <input id="code" name="code" autoComplete="off" required className={cn(field, 'mt-1 tracking-[0.2em] uppercase')} />
                </div>
              )}

              <Button type="submit" arrow disabled={busy || !files.length}>{busy ? 'Uploading…' : 'Share photos'}</Button>

              {jobs.length > 0 && busy && (
                <ul className="space-y-1 text-sm text-ink-2" aria-live="polite">
                  {jobs.map((j) => (
                    <li key={j.id} className={cn(j.status === 'error' && 'text-error')}>
                      {j.status === 'done' ? '✓' : j.status === 'error' ? '✕' : j.status === 'uploading' ? '…' : '·'} {j.name}
                    </li>
                  ))}
                </ul>
              )}
              {message && (
                <p role={message.tone === 'error' ? 'alert' : 'status'} className={message.tone === 'error' ? 'text-error' : 'text-success'}>
                  {message.text}
                </p>
              )}
            </form>
          )}
        </div>
      </section>

      {/* Shared photos */}
      <section className="container-x pb-24 md:pb-40" aria-labelledby="shared-heading">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="shared-heading" className="text-h2">Shared by everyone</h2>
            <p className="mt-2 text-ink-2">{items.length ? `${items.length} photo${items.length === 1 ? '' : 's'}` : 'No photos yet — be the first!'}</p>
          </div>
          {items.some((p) => !p.local) && (
            <Button type="button" variant="secondary" onClick={downloadAll} disabled={Boolean(zipping)}>
              <DownloadSimple aria-hidden size={18} weight="light" /> {zipping ?? 'Download all'}
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 border border-line py-20 text-center text-ink-2">
            <ImageSquare aria-hidden size={40} weight="light" className="text-gold" />
            <p>Photos you and other guests share will show up here.</p>
          </div>
        ) : (
          <div className="columns-2 gap-4 md:columns-4 md:gap-5">
            {items.map((p, i) => (
              <figure key={p.id} className="group relative mb-4 break-inside-avoid md:mb-5">
                <button type="button" onClick={() => setIndex(i)} className="block w-full cursor-zoom-in overflow-hidden bg-paper-2" aria-label={`Open photo${p.name ? ` from ${p.name}` : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb(p.url)} alt={p.caption || `Wedding photo${p.name ? ` shared by ${p.name}` : ''}`} width={p.width} height={p.height} loading="lazy" className="h-auto w-full transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.04]" />
                </button>
                {(p.name || p.caption || p.local) && (
                  <figcaption className="mt-2 text-sm text-ink-2">
                    {p.caption}{p.caption && p.name ? ' · ' : ''}{p.name}{p.local && <span className="ml-1 text-warning">(preview)</span>}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </section>

      {current && index !== null && (
        <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-[70] flex items-center justify-center bg-night/95 p-4 text-ink md:p-12" onClick={(e) => e.target === e.currentTarget && setIndex(null)}>
          <figure key={current.id} className="page-in flex max-h-full w-full max-w-6xl flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={full(current.url)} alt={current.caption || 'Wedding photo'} className="max-h-[78vh] w-auto object-contain" />
            <figcaption className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-ink/75">
              <span>{current.caption}{current.caption && current.name ? ' · ' : ''}{current.name}</span>
              <span className="tabular-nums">{index + 1} / {items.length}</span>
              <button type="button" onClick={() => downloadOne(current, index)} className="eyebrow link-draw inline-flex items-center gap-2 text-gold-light">
                <DownloadSimple aria-hidden size={16} weight="light" /> Download
              </button>
            </figcaption>
          </figure>
          <button ref={closeRef} type="button" onClick={() => setIndex(null)} aria-label="Close" className="absolute top-5 right-5 rounded-full p-3 hover:bg-white/10"><X size={26} weight="light" /></button>
          {items.length > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-3 rounded-full p-3 hover:bg-white/10 md:left-6"><ArrowLeft size={26} weight="light" /></button>
              <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-3 rounded-full p-3 hover:bg-white/10 md:right-6"><ArrowRight size={26} weight="light" /></button>
            </>
          )}
        </div>
      )}
    </>
  )
}
