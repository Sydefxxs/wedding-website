import type { Metadata } from 'next'
import { AirplaneTilt } from '@phosphor-icons/react/dist/ssr'
import { getContent } from '@/lib/content'
import { PageHeader } from '@/components/ui/PageHeader'
import { Photo } from '@/components/ui/Photo'
import { Parallax } from '@/components/motion/Parallax'
import { Reveal } from '@/components/motion/Reveal'
import { ButtonLink } from '@/components/ui/Button'

export const metadata: Metadata = { title: 'Travel & Stay' }

export default async function TravelPage() {
  const { travel, hotels } = await getContent()
  return (
    <>
      <PageHeader eyebrow="Travel & stay" title={travel.heading} lead={travel.body} />

      <Parallax amount={10} className="h-[55vh] w-full md:h-[75vh]">
        <Photo image={travel.image} sizes="100vw" className="h-full w-full" />
      </Parallax>

      <section className="section-y container-x grid gap-16 md:grid-cols-12" aria-labelledby="flying">
        <Reveal className="md:col-span-4">
          <h2 id="flying" className="text-h2">Flying in</h2>
        </Reveal>
        <Reveal stagger className="divide-y divide-line border-y border-line md:col-span-7 md:col-start-6">
          {travel.airports.map((a) => (
            <div key={a.code} className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-6">
              <span className="flex items-center gap-3 font-display text-h2"><AirplaneTilt aria-hidden size={22} weight="light" className="text-accent" />{a.code}</span>
              <span><span className="block font-medium">{a.name}</span><span className="text-ink-2">{a.drive}</span></span>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="bg-paper-2 section-y" aria-labelledby="hotels">
        <div className="container-x">
          <Reveal className="mb-14 md:mb-20">
            <p className="eyebrow mb-4 text-accent">Where to stay</p>
            <h2 id="hotels" className="text-h1">Hotel blocks</h2>
          </Reveal>
          <Reveal stagger className="grid gap-12 md:grid-cols-3 md:gap-8">
            {hotels.map((h, i) => (
              <article key={h.id} className={i === 1 ? 'md:mt-20' : undefined}>
                <Photo image={h.image} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/3] w-full" />
                <h3 className="mt-6 text-h3">{h.name}</h3>
                <p className="mt-1 text-ink-2">{h.distance} · {h.price}</p>
                {(h.code || h.deadline || h.note) && (
                  <ul className="mt-4 space-y-1 text-[0.95rem]">
                    {h.code && <li>Group code: <span className="font-medium tracking-wide">{h.code}</span></li>}
                    {h.deadline && <li className="text-ink-2">{h.deadline}</li>}
                    {h.note && <li className="text-ink-2">{h.note}</li>}
                  </ul>
                )}
                {h.bookingUrl && <ButtonLink href={h.bookingUrl} variant="secondary" className="mt-6">Book</ButtonLink>}
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section-y container-x" aria-labelledby="tips">
        <Reveal><h2 id="tips" className="mb-14 text-h1">Good to know</h2></Reveal>
        <Reveal stagger className="grid gap-12 md:grid-cols-3">
          {travel.tips.map((t, i) => (
            <div key={t.title} className="border-t border-line pt-6">
              <p className="font-display text-ink-2">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 text-h3">{t.title}</h3>
              <p className="mt-3 text-ink-2">{t.body}</p>
            </div>
          ))}
        </Reveal>
      </section>
    </>
  )
}
