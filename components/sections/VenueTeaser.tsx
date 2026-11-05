import { MapPin } from '@phosphor-icons/react/dist/ssr'
import type { WeddingEvent } from '@/lib/types'
import { Photo } from '@/components/ui/Photo'
import { ImageReveal } from '@/components/motion/ImageReveal'
import { Reveal } from '@/components/motion/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { appleMapsUrl, googleMapsUrl } from '@/lib/utils'

/** Where it all happens — venue name, address, directions. Uses the first event's venue. */
export function VenueTeaser({ events }: { events: WeddingEvent[] }) {
  const first = events[0]
  if (!first) return null
  const image = events.find((e) => e.image)?.image
  const sameVenue = events.every((e) => e.venue === first.venue)

  return (
    <section className="section-y container-x">
      <div className="grid items-center gap-12 md:grid-cols-12">
        {image && (
          <ImageReveal className="md:col-span-7">
            <Photo image={image} sizes="(min-width: 768px) 58vw, 100vw" className="aspect-[4/3] w-full md:aspect-[3/2]" />
          </ImageReveal>
        )}
        <Reveal className={image ? 'md:col-span-4 md:col-start-9' : 'md:col-span-8'}>
          <p className="eyebrow mb-5 text-accent">The venue</p>
          <h2 className="text-h1">{first.venue}</h2>
          <p className="mt-6 flex gap-3 text-lead text-ink-2">
            <MapPin aria-hidden size={24} weight="light" className="mt-1 shrink-0 text-gold" />
            {first.address}
          </p>
          {sameVenue && events.length > 1 && (
            <p className="mt-4 text-ink-2">Ceremony, dinner and party are all here — no driving between events.</p>
          )}
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href={googleMapsUrl(first)}>Google Maps</ButtonLink>
            <ButtonLink href={appleMapsUrl(first)} variant="secondary">Apple Maps</ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
