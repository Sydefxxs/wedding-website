import Link from 'next/link'
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import type { WeddingEvent } from '@/lib/types'
import { Reveal } from '@/components/motion/Reveal'

export function WeekendList({ events }: { events: WeddingEvent[] }) {
  if (!events.length) return null
  return (
    <section className="section-y bg-paper-2">
      <div className="container-x">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <Reveal>
            <p className="eyebrow mb-4 text-accent">The big day</p>
            <h2 className="text-h1">Where to be, <em className="font-light text-rose">and when.</em></h2>
          </Reveal>
          <Reveal delay={150}><Link href="/schedule" className="eyebrow link-draw">Full schedule</Link></Reveal>
        </div>
        <Reveal as="ol" stagger className="border-t border-line">
          {events.map((e, i) => (
            <li key={e.id}>
              <Link href={`/schedule#${e.id}`} className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-1 border-b border-line py-7 md:grid-cols-12 md:py-9">
                <span className="font-display text-ink-2 tabular-nums md:col-span-1">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display text-h2 transition-transform duration-700 ease-out-expo group-hover:translate-x-3 md:col-span-5">{e.name}</span>
                <ArrowUpRight aria-hidden size={22} weight="light" className="justify-self-end text-ink-2 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 md:order-last md:col-span-1" />
                <span className="col-span-2 col-start-2 text-ink-2 md:col-span-3 md:col-start-auto">{e.dayLabel} · {e.timeLabel}</span>
                <span className="col-span-2 col-start-2 text-ink-2 md:col-span-2 md:col-start-auto">{e.venue}</span>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
