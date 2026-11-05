import Link from 'next/link'
import type { SiteSettings } from '@/lib/types'
import { Monogram } from '@/components/ui/Monogram'
import { ButtonLink } from '@/components/ui/Button'

/** Deepest-black band with gold details; the rose ampersand is the only red. */
export function Footer({ s }: { s: SiteSettings }) {
  return (
    <footer className="relative overflow-hidden bg-night text-ink">
      <div className="container-x py-24 md:py-32">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow mb-6 text-gold-light">Kindly reply by {s.rsvpDeadlineLabel}</p>
            <p className="font-display text-h1">
              We can’t wait to<br />
              <em className="font-light text-gold-light">celebrate with you.</em>
            </p>
            <ButtonLink href="/rsvp" variant="light" className="mt-10">RSVP now</ButtonLink>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <ul className="grid grid-cols-2 gap-y-3 text-[0.95rem] text-ink/80">
              {s.nav.map((l) => (
                <li key={l.href}><Link href={l.href} className="link-draw">{l.label}</Link></li>
              ))}
            </ul>
            {s.contactEmail && (
              <p className="mt-10 text-[0.95rem] text-ink/80">
                Questions? <a className="link-draw text-ink" href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a>
              </p>
            )}
          </div>
        </div>
        <div className="mt-24 flex flex-col items-start justify-between gap-6 border-t border-gold-light/30 pt-8 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Monogram a={s.partnerOne} b={s.partnerTwo} dark className="w-12 text-[3rem]" />
            <div>
              <p className="font-display text-xl leading-tight">
                {s.partnerOne} <em className="font-light text-rose">&amp;</em> {s.partnerTwo}{s.lastName && ` ${s.lastName}`}
              </p>
              <p className="eyebrow mt-1 text-[0.68rem] text-ink/65">{s.dateLabel} · {s.location}</p>
            </div>
          </div>
          <div className="text-sm text-ink/65 md:text-right">
            <p>{s.hashtag && <span className="mr-3">{s.hashtag}</span>}{s.footerNote}</p>
            {s.photoCredit && <p className="mt-1">{s.photoCredit}</p>}
          </div>
        </div>
      </div>
    </footer>
  )
}
