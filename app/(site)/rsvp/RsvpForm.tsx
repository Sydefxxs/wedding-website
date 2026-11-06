'use client'

import { useState, useTransition, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { Check, Minus, Plus } from '@phosphor-icons/react'
import { submitRsvp } from './actions'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { familyFromName, fillRsvpCopy, partySize } from '@/lib/rsvp'
import type { RsvpCopy } from '@/lib/types'

const field = 'w-full border-0 border-b border-line bg-transparent px-0 py-3 text-lg outline-none transition-colors placeholder:text-ink-2/60 focus:border-ink focus-visible:outline-none'
const label = 'eyebrow block text-ink-2'

type Props = { copy: RsvpCopy; dateLabel: string; deadlineLabel: string; couple: string; contactEmail?: string }

export function RsvpForm({ copy, dateLabel, deadlineLabel, couple, contactEmail }: Props) {
  const [done, setDone] = useState(false)
  const [name, setName] = useState('')
  const [family, setFamily] = useState('')
  const [familyEdited, setFamilyEdited] = useState(false)
  const [attending, setAttending] = useState<boolean | null>(null)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [bringingPlusOne, setBringingPlusOne] = useState(false)
  const [plusOnes, setPlusOnes] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [demo, setDemo] = useState(false)
  const [pending, start] = useTransition()

  const familyName = (familyEdited ? family : familyFromName(name)) || name.trim()
  const extras = copy.plusOnes && bringingPlusOne ? plusOnes : 0
  const total = partySize({ adults, children, plusOnes: extras })
  const tooMany = total > copy.maxParty

  const onName = (v: string) => {
    setName(v)
    if (!familyEdited) setFamily(familyFromName(v))
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (name.trim().split(/\s+/).length < 2) return setError('Please tell us your first and last name.')
    if (attending === null) return setError('Please let us know if you’ll be joining us.')
    if (attending && tooMany) return setError(`That’s more than ${copy.maxParty} people — please reach out to us and we’ll sort it out together.`)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const str = (k: string) => String(fd.get(k) ?? '').trim()
    start(async () => {
      const r = await submitRsvp({
        name: name.trim(),
        family: familyName,
        attending,
        adults: attending ? adults : 0,
        children: attending ? children : 0,
        plusOnes: attending ? extras : 0,
        plusOneNames: str('plusOneNames'),
        guestNames: str('guestNames'),
        email: str('email'),
        phone: str('phone'),
        song: str('song'),
        message: str('message'),
        website: str('website'),
      })
      if (!r.ok) return setError(r.error)
      setDemo(Boolean(r.demo))
      setDone(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  if (done) {
    const vars = { family: familyName, name, count: total, date: dateLabel }
    return (
      <div className="page-in mx-auto max-w-2xl text-center" role="status">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-primary-ink"><Check size={28} weight="light" aria-hidden /></span>
        <h2 className="mt-8 text-h1 text-balance">{fillRsvpCopy(attending ? copy.yesHeading : copy.noHeading, vars)}</h2>
        <p className="text-lead mx-auto mt-6 max-w-lg text-ink-2">{fillRsvpCopy(attending ? copy.yesMessage : copy.noMessage, vars)}</p>
        <p className="mt-8 font-display text-2xl italic text-gold-light">With love, {couple}</p>
        {demo && <p className="mt-6 text-sm text-warning">Preview mode: nothing was saved.</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {attending && <Link href="/schedule" className="eyebrow link-draw">Schedule & calendar</Link>}
          {attending && <Link href="/faq" className="eyebrow link-draw">FAQ</Link>}
          <button type="button" onClick={() => setDone(false)} className="eyebrow link-draw">Change our answer</button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="page-in mx-auto max-w-2xl" noValidate>
      {/* Honeypot: hidden from people and screen readers, bots fill it in */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-10">
        <div>
          <label htmlFor="name" className={label}>Your full name</label>
          <input id="name" name="name" autoComplete="name" required value={name} onChange={(e) => onName(e.target.value)} className={cn(field, 'mt-2 font-display text-3xl')} />
        </div>
        <div>
          <label htmlFor="family" className={label}>Your family, as you’d like us to greet you</label>
          <input
            id="family"
            name="family"
            value={familyEdited ? family : familyFromName(name)}
            onChange={(e) => { setFamily(e.target.value); setFamilyEdited(true) }}
            placeholder="The Lopez Family"
            className={cn(field, 'mt-2 font-display text-2xl')}
          />
        </div>
      </div>

      <fieldset className="mt-14 border-t border-line pt-8">
        <legend className="float-left w-full font-display text-h3">Will you be joining us?</legend>
        <div className="clear-both flex flex-wrap gap-3 pt-5">
          {([['Joyfully accepts', true], ['Regretfully declines', false]] as const).map(([lbl, val]) => (
            <Choice key={lbl} name="attending" checked={attending === val} onChange={() => setAttending(val)} accent={val}>{lbl}</Choice>
          ))}
        </div>
      </fieldset>

      {attending && (
        <div className="page-in">
          <fieldset className="mt-14 border-t border-line pt-8">
            <legend className="float-left w-full">
              <span className="block font-display text-h3">How many of your family are coming?</span>
              <span className="text-sm text-ink-2">Including you. Kids are welcome!</span>
            </legend>
            <div className="clear-both grid gap-6 pt-6 sm:grid-cols-2">
              <Stepper label="Adults" value={adults} min={1} max={copy.maxParty} onChange={setAdults} />
              <Stepper label="Children" value={children} min={0} max={copy.maxParty} onChange={setChildren} />
            </div>
          </fieldset>

          {copy.plusOnes && (
            <fieldset className="mt-14 border-t border-line pt-8">
              <legend className="float-left w-full font-display text-h3">Bringing a plus one?</legend>
              <div className="clear-both flex flex-wrap gap-3 pt-5">
                <Choice name="plusone" checked={!bringingPlusOne} onChange={() => setBringingPlusOne(false)}>Just us</Choice>
                <Choice name="plusone" checked={bringingPlusOne} onChange={() => setBringingPlusOne(true)} accent>Yes, bringing a guest</Choice>
              </div>
              {bringingPlusOne && (
                <div className="page-in mt-8 grid gap-8">
                  <Stepper label="How many guests" value={plusOnes} min={1} max={copy.maxParty} onChange={setPlusOnes} />
                  <div>
                    <label htmlFor="plusOneNames" className={label}>Their name{plusOnes > 1 ? 's' : ''}</label>
                    <input id="plusOneNames" name="plusOneNames" className={cn(field, 'mt-1')} />
                  </div>
                </div>
              )}
            </fieldset>
          )}

          <p className={cn('mt-10 font-display text-2xl', tooMany ? 'text-error' : 'text-gold-light')} aria-live="polite">
            {tooMany
              ? `That’s more than ${copy.maxParty} — please reach out to us${contactEmail ? ` at ${contactEmail}` : ''}.`
              : `${total} ${total === 1 ? 'seat' : 'seats'} for ${familyName || 'your family'}`}
          </p>

          <div className="mt-10 grid gap-8">
            <div>
              <label htmlFor="guestNames" className={label}>Names of everyone coming (optional)</label>
              <textarea id="guestNames" name="guestNames" rows={2} className={cn(field, 'mt-1 resize-none')} placeholder="Helps us with place cards" />
            </div>
            <div>
              <label htmlFor="song" className={label}>A song that’ll get you dancing</label>
              <input id="song" name="song" className={cn(field, 'mt-1')} />
            </div>
          </div>
        </div>
      )}

      {attending !== null && (
        <div className="page-in mt-14 grid gap-8 border-t border-line pt-10 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className={label}>Phone (optional)</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" className={cn(field, 'mt-1')} />
          </div>
          <div>
            <label htmlFor="email" className={label}>Email (optional)</label>
            <input id="email" name="email" type="email" autoComplete="email" className={cn(field, 'mt-1')} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className={label}>A note for {couple}</label>
            <textarea id="message" name="message" rows={3} className={cn(field, 'mt-1 resize-none')} />
          </div>
        </div>
      )}

      {error && <p role="alert" className="mt-6 text-error">{error}</p>}
      <Button type="submit" arrow disabled={pending} className="mt-10">{pending ? 'Sending…' : 'Send our RSVP'}</Button>
      <p className="mt-8 text-sm text-ink-2">Please reply by {deadlineLabel}. Plans changed? Just send it again — we’ll use your latest answer.</p>
    </form>
  )
}

function Choice({ name, checked, onChange, accent, children }: { name: string; checked: boolean; onChange: () => void; accent?: boolean; children: ReactNode }) {
  return (
    <label className={cn('cursor-pointer rounded-full border px-5 py-2.5 text-sm transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary', checked ? (accent ? 'border-primary bg-primary text-primary-ink' : 'border-ink bg-ink text-paper') : 'border-line hover:border-ink')}>
      <input type="radio" name={name} className="sr-only" checked={checked} onChange={onChange} />
      {children}
    </label>
  )
}

function Stepper({ label: text, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const btn = 'flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-ink disabled:opacity-30 disabled:hover:border-line'
  return (
    <div className="flex items-center justify-between gap-4" role="group" aria-label={text}>
      <span className="text-lg">{text}</span>
      <div className="flex items-center gap-4">
        <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${text.toLowerCase()}`}><Minus size={16} aria-hidden /></button>
        <output className="w-8 text-center font-display text-3xl tabular-nums" aria-live="polite">{value}</output>
        <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${text.toLowerCase()}`}><Plus size={16} aria-hidden /></button>
      </div>
    </div>
  )
}
