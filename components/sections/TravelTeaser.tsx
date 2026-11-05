import type { Hotel, TravelInfo } from '@/lib/types'
import { Photo } from '@/components/ui/Photo'
import { ImageReveal } from '@/components/motion/ImageReveal'
import { Reveal } from '@/components/motion/Reveal'
import { ButtonLink } from '@/components/ui/Button'

export function TravelTeaser({ travel, hotels }: { travel: TravelInfo; hotels: Hotel[] }) {
  return (
    <section className="section-y container-x">
      <ImageReveal>
        <Photo image={travel.image} sizes="100vw" className="aspect-[4/3] w-full md:aspect-[21/9]" />
      </ImageReveal>
      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="eyebrow mb-5 text-accent">Travel & stay</p>
          <h2 className="text-h1">{travel.heading}</h2>
        </Reveal>
        <Reveal delay={150} className="md:col-span-6 md:col-start-7">
          <p className="text-lead text-ink-2">{travel.body}</p>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8">
            <div>
              <dt className="eyebrow text-ink-2">Fly into</dt>
              <dd className="mt-2 font-display text-h3">{travel.airports.map((a) => a.code).join(' / ')}</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-2">Hotel blocks</dt>
              <dd className="mt-2 font-display text-h3">{hotels.length} options</dd>
            </div>
          </dl>
          <ButtonLink href="/travel" className="mt-10">Plan your trip</ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}
