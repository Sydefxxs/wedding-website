import type { Metadata } from 'next'
import { CalendarPlus, MapPin, TShirt } from '@phosphor-icons/react/dist/ssr'
import { getContent } from '@/lib/content'
import { PageHeader } from '@/components/ui/PageHeader'
import { Photo } from '@/components/ui/Photo'
import { ImageReveal } from '@/components/motion/ImageReveal'
import { Reveal } from '@/components/motion/Reveal'
import { googleCalendarUrl, icsDataUrl, cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Schedule' }

export default async function SchedulePage() {
  const { events, settings: s } = await getContent()
  const couple = `${s.partnerOne} & ${s.partnerTwo}`
  const days = Array.from(new Set(events.map((e) => e.dayLabel)))

  return (
    <>
      <PageHeader eyebrow="Schedule" title="The weekend" lead="Everything we have planned, with times, places and what to wear. Add any event straight to your calendar." />
      <div className="container-x pb-24 md:pb-40">
        {days.map((day) => (
          <section key={day} className="mb-24 last:mb-0 md:mb-32" aria-labelledby={`day-${day}`}>
            <Reveal>
              <h2 id={`day-${day}`} className="eyebrow mb-10 text-accent">{day}</h2>
            </Reveal>
            <div className="space-y-20 md:space-y-28">
              {events.filter((e) => e.dayLabel === day).map((e, i) => (
                <article key={e.id} id={e.id} className="grid scroll-mt-28 items-center gap-10 md:grid-cols-12">
                  {e.image && (
                    <ImageReveal className={cn('md:col-span-6', i % 2 === 1 && 'md:order-last md:col-start-7')}>
                      <Photo image={e.image} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[3/2] w-full" />
                    </ImageReveal>
                  )}
                  <Reveal className={cn(e.image ? 'md:col-span-5' : 'md:col-span-8', e.image && i % 2 === 0 && 'md:col-start-8')}>
                    <p className="font-display text-display leading-none text-ink/90 md:text-[6rem]">{e.timeLabel}</p>
                    <h3 className="mt-4 text-h1">{e.name}</h3>
                    <p className="mt-6 text-ink-2">{e.description}</p>
                    <dl className="mt-8 space-y-3 border-t border-line pt-6 text-[0.98rem]">
                      <div className="flex gap-3">
                        <dt><MapPin aria-label="Where" size={20} weight="light" className="mt-0.5 text-ink-2" /></dt>
                        <dd>
                          <span className="font-medium">{e.venue}</span><br />
                          <span className="text-ink-2">{e.address}</span>
                        </dd>
                      </div>
                      {e.attire && (
                        <div className="flex gap-3">
                          <dt><TShirt aria-label="Attire" size={20} weight="light" className="mt-0.5 text-ink-2" /></dt>
                          <dd>{e.attire}</dd>
                        </div>
                      )}
                    </dl>
                    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                      {e.mapUrl && <a href={e.mapUrl} target="_blank" rel="noreferrer" className="eyebrow link-draw">Directions</a>}
                      <a href={googleCalendarUrl(e, couple)} target="_blank" rel="noreferrer" className="eyebrow link-draw inline-flex items-center gap-2">
                        <CalendarPlus aria-hidden size={16} weight="light" /> Google Calendar
                      </a>
                      <a href={icsDataUrl(e, couple)} download={`${e.id}.ics`} className="eyebrow link-draw">Apple / Outlook (.ics)</a>
                    </div>
                  </Reveal>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
