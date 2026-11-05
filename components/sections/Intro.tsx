import type { SiteSettings } from '@/lib/types'
import { Photo } from '@/components/ui/Photo'
import { ImageReveal } from '@/components/motion/ImageReveal'
import { Reveal } from '@/components/motion/Reveal'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { ButtonLink } from '@/components/ui/Button'

export function Intro({ s }: { s: SiteSettings }) {
  const { intro } = s
  return (
    <section className="section-y container-x">
      <div className="grid items-center gap-14 md:grid-cols-12 md:gap-10">
        <ImageReveal className="md:col-span-5">
          <Photo image={intro.image} sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[4/5] w-full" />
        </ImageReveal>
        <div className="md:col-span-6 md:col-start-7">
          <Reveal><p className="eyebrow mb-6 text-accent">{intro.eyebrow}</p></Reveal>
          <h2 className="text-h1">
            <SplitReveal text={intro.heading} by="word" />
          </h2>
          <Reveal delay={200}>
            <p className="text-lead mt-8 max-w-[52ch] text-ink-2">{intro.body}</p>
            <p className="mt-6 max-w-[52ch] text-ink-2">{s.tagline}</p>
          </Reveal>
          <Reveal delay={350} className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/schedule">See the schedule</ButtonLink>
            <ButtonLink href="/story" variant="secondary" arrow={false}>Our story</ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
