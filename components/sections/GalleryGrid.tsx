'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react'
import type { GalleryImage } from '@/lib/types'
import { Photo } from '@/components/ui/Photo'
import { ImageReveal } from '@/components/motion/ImageReveal'
import { getLenis } from '@/components/motion/SmoothScroll'

/** Masonry gallery with an accessible, swipeable, keyboard-friendly lightbox. */
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null)
  const lastTrigger = useRef<HTMLButtonElement | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const touchX = useRef<number | null>(null)
  const open = index !== null

  const close = useCallback(() => {
    setIndex(null)
    lastTrigger.current?.focus()
  }, [])
  const go = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length])

  useEffect(() => {
    if (!open) return
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      getLenis()?.start()
      document.documentElement.style.overflow = ''
    }
  }, [open, close, go])

  const current = index !== null ? images[index] : null

  return (
    <>
      <div className="container-x columns-2 gap-4 pb-24 md:columns-3 md:gap-6 md:pb-40">
        {images.map((img, i) => (
          <ImageReveal key={img.id} className="mb-4 break-inside-avoid md:mb-6" delay={(i % 3) * 120}>
            <button
              type="button"
              className="group block w-full cursor-zoom-in overflow-hidden"
              onClick={(e) => {
                lastTrigger.current = e.currentTarget
                setIndex(i)
              }}
              aria-label={`Open photo: ${img.alt}`}
            >
              <Photo image={img} fill={false} sizes="(min-width: 768px) 33vw, 50vw" imgClassName="transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.04]" />
            </button>
          </ImageReveal>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-4 text-paper md:p-12"
          onClick={(e) => e.target === e.currentTarget && close()}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
            touchX.current = null
          }}
        >
          <figure key={current.id} className="page-in relative flex max-h-full w-full max-w-6xl flex-col items-center">
            <Photo image={current} fill={false} sizes="100vw" className="max-h-[82vh] w-auto object-contain" />
            <figcaption className="mt-4 text-sm text-paper/70">
              {current.caption ?? current.alt} <span className="ml-3 tabular-nums">{(index ?? 0) + 1} / {images.length}</span>
            </figcaption>
          </figure>
          <button ref={closeBtn} type="button" onClick={close} aria-label="Close" className="absolute top-5 right-5 rounded-full p-3 hover:bg-white/10"><X size={26} weight="light" /></button>
          <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-3 rounded-full p-3 hover:bg-white/10 md:left-6"><ArrowLeft size={26} weight="light" /></button>
          <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-3 rounded-full p-3 hover:bg-white/10 md:right-6"><ArrowRight size={26} weight="light" /></button>
        </div>
      )}
    </>
  )
}
