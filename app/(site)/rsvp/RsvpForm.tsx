'use client'

import { useState, useTransition, type FormEvent } from 'react'
import Link from 'next/link'
import { Check } from '@phosphor-icons/react'
import { findInvitation, submitRsvp, type Invitation } from './actions'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const field = 'w-full border-0 border-b border-line bg-transparent px-0 py-3 text-lg outline-none transition-colors placeholder:text-ink-2/60 focus:border-ink focus-visible:outline-none'
const label = 'eyebrow block text-ink-2'

export function RsvpForm({ deadlineLabel }: { deadlineLabel: string }) {
  const [step, setStep] = useState<'find' | 'reply' | 'done'>('find')
  const [name, setName] = useState('')
  const [inv, setInv] = useState<Invitation | null>(null)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const [demo, setDemo] = useState(false)
  const [pending, start] = useTransition()

  const key = (m: string, e: string) => `${m}::${e}`

  const onFind = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    start(async () => {
      const r = await findInvitation(name)
      if (!r.ok) return setError(r.error)
      setInv(r.invitation)
      setAnswers({})
      setStep('reply')
    })
  }

  const unanswered = inv ? inv.members.flatMap((m) => inv.events.map((ev) => key(m, ev.id))).filter((k) => !(k in answers)) : []

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inv) return
    if (unanswered.length) return setError('Please choose yes or no for everyone, for each event.')
    setError(null)
    const fd = new FormData(e.currentTarget)
    start(async () => {
      const r = await submitRsvp({
        invitationId: inv.id,
        household: inv.household,
        responses: inv.members.flatMap((m) => inv.events.map((ev) => ({ member: m, eventId: ev.id, eventName: ev.name, attending: answers[key(m, ev.id)] }))),
        email: String(fd.get('email') ?? ''),
        dietary: String(fd.get('dietary') ?? ''),
        song: String(fd.get('song') ?? ''),
        message: String(fd.get('message') ?? ''),
      })
      if (!r.ok) return setError(r.error)
      setDemo(Boolean(r.demo))
      setStep('done')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  const anyYes = Object.values(answers).some(Boolean)

  return (
    <div className="mx-auto max-w-2xl">
      <div aria-live="polite" className="sr-only">{step === 'reply' && inv ? `Found invitation for ${inv.household}` : ''}</div>

      {step === 'find' && (
        <form onSubmit={onFind} className="page-in" noValidate>
          <label htmlFor="name" className={label}>Your full name</label>
          <input id="name" name="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="As written on your invitation" className={cn(field, 'mt-2 font-display text-3xl')} aria-describedby={error ? 'err' : undefined} aria-invalid={Boolean(error)} />
          {error && <p id="err" role="alert" className="mt-4 text-error">{error}</p>}
          <Button type="submit" arrow disabled={pending} className="mt-10">{pending ? 'Looking…' : 'Find my invitation'}</Button>
          <p className="mt-8 text-sm text-ink-2">Please reply by {deadlineLabel}. You can update your answer any time before then.</p>
        </form>
      )}

      {step === 'reply' && inv && (
        <form onSubmit={onSubmit} className="page-in" noValidate>
          <p className="eyebrow text-accent">Invitation for</p>
          <h2 className="mt-2 text-h1">{inv.household}</h2>
          <button type="button" onClick={() => { setStep('find'); setError(null) }} className="link-draw mt-3 text-sm text-ink-2">Not you? Search again</button>

          <div className="mt-12 space-y-12">
            {inv.events.map((ev) => (
              <fieldset key={ev.id} className="border-t border-line pt-6">
                <legend className="float-left w-full">
                  <span className="block font-display text-h3">{ev.name}</span>
                  <span className="text-sm text-ink-2">{ev.dayLabel} · {ev.timeLabel}</span>
                </legend>
                <div className="clear-both space-y-4 pt-5">
                  {inv.members.map((m) => {
                    const k = key(m, ev.id)
                    return (
                      <div key={k} className="flex flex-wrap items-center justify-between gap-3">
                        <span>{m}</span>
                        <div className="flex gap-2" role="radiogroup" aria-label={`${m} — ${ev.name}`}>
                          {([['Joyfully accepts', true], ['Regretfully declines', false]] as const).map(([lbl, val]) => (
                            <label key={lbl} className={cn('cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary', answers[k] === val ? (val ? 'border-primary bg-primary text-primary-ink' : 'border-ink bg-ink text-paper') : 'border-line hover:border-ink')}>
                              <input type="radio" name={k} className="sr-only" checked={answers[k] === val} onChange={() => setAnswers((a) => ({ ...a, [k]: val }))} />
                              {lbl}
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-14 grid gap-8 border-t border-line pt-10">
            <div>
              <label htmlFor="email" className={label}>Email (for a confirmation & updates)</label>
              <input id="email" name="email" type="email" autoComplete="email" className={cn(field, 'mt-1')} />
            </div>
            {anyYes && (
              <>
                <div>
                  <label htmlFor="dietary" className={label}>Allergies or dietary needs</label>
                  <input id="dietary" name="dietary" className={cn(field, 'mt-1')} placeholder="Vegetarian, nut allergy…" />
                </div>
                <div>
                  <label htmlFor="song" className={label}>A song that’ll get you dancing</label>
                  <input id="song" name="song" className={cn(field, 'mt-1')} />
                </div>
              </>
            )}
            <div>
              <label htmlFor="message" className={label}>A note for us</label>
              <textarea id="message" name="message" rows={3} className={cn(field, 'mt-1 resize-none')} />
            </div>
          </div>

          {error && <p role="alert" className="mt-6 text-error">{error}</p>}
          <Button type="submit" arrow disabled={pending} className="mt-10">{pending ? 'Sending…' : 'Send RSVP'}</Button>
        </form>
      )}

      {step === 'done' && inv && (
        <div className="page-in text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-primary-ink"><Check size={28} weight="light" /></span>
          <h2 className="mt-8 text-h1">{anyYes ? 'We can’t wait to see you!' : 'We’ll miss you.'}</h2>
          <p className="text-lead mx-auto mt-5 max-w-md text-ink-2">
            {anyYes ? 'Your RSVP is in. Add the events to your calendar — see you April 24!' : 'Thank you for letting us know — you’ll be with us in spirit.'}
          </p>
          {demo && <p className="mt-6 text-sm text-warning">Demo mode: nothing was saved yet. RSVPs save to the Studio once Sanity is connected.</p>}
          {anyYes && (
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/schedule" className="eyebrow link-draw">Schedule & calendar</Link>
              <Link href="/faq" className="eyebrow link-draw">FAQ</Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
