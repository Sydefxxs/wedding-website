import type { SiteSettings } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Photo } from '@/components/ui/Photo'
import { Parallax } from '@/components/motion/Parallax'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Reveal } from '@/components/motion/Reveal'
import { Countdown } from '@/components/motion/Countdown'
import { ButtonLink } from '@/components/ui/Button'

/**
 * Landscape photo → full-bleed hero.
 * Portrait photo → full-bleed on phones, and on desktop a tall photo panel beside our names
 * (so a vertical photo is shown whole instead of being cropped to a strip).
 */
export function Hero({ s }: { s: SiteSettings }) {
  const portrait = s.heroImage.height > s.heroImage.width

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink text-white">
      <div className={cn('absolute inset-0 -z-10', portrait && 'md:left-auto md:w-[46vw]')}>
        {portrait ? (
          // No parallax overscan for vertical photos — it would push faces up under the menu
          <Photo image={s.heroImage} sizes="(min-width: 768px) 46vw, 100vw" priority className="h-full w-full" imgClassName="kenburns" />
        ) : (
          <Parallax amount={6} className="absolute inset-0">
            <Photo image={s.heroImage} sizes="100vw" priority className="h-full w-full" imgClassName="kenburns" />
          </Parallax>
        )}
        {/* Scrims: top for the menu, bottom for the names (phones / landscape) */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/55 to-transparent" />
        <div aria-hidden className={cn('absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent', portrait && 'md:hidden')} />
        {portrait && <div aria-hidden className="absolute inset-y-0 left-0 hidden w-32 bg-gradient-to-r from-ink to-transparent md:block" />}
      </div>
      <div aria-hidden className="grain absolute inset-0 -z-10" />

      <div className={cn('w-full px-5 pb-14 md:pb-20', portrait ? 'md:pr-[50vw] md:pl-[6vw]' : 'container-x')}>
        <Reveal immediate delay={500}>
          <p className="eyebrow mb-6 text-white/85">We’re getting married</p>
        </Reveal>

        <h1 className={cn('font-display font-light', portrait ? 'text-display md:text-[min(9.5rem,9.2vw)]' : 'text-display')}>
          <span className="block"><SplitReveal text={s.partnerOne} immediate delay={650} /></span>
          <span className={cn('block', portrait ? 'pl-[0.55em]' : 'pl-[0.6em] md:pl-[1.4em]')}>
            <em className="font-light text-[color-mix(in_oklab,var(--accent)_55%,white)]">
              <SplitReveal text="&" immediate delay={950} />
            </em>{' '}
            <SplitReveal text={s.partnerTwo} immediate delay={1050} />
          </span>
        </h1>

        <div className="mt-10 flex flex-wrap items-end gap-x-12 gap-y-8 border-t border-white/25 pt-8 md:mt-14">
          <Reveal immediate delay={1400}>
            <p className="font-display text-h3">{s.dateLabel}</p>
            <p className="eyebrow mt-2 text-white/75">{s.location}</p>
          </Reveal>
          <Reveal immediate delay={1550}>
            <Countdown to={s.date} className="flex gap-6 md:gap-8" />
          </Reveal>
          <Reveal immediate delay={1700} className={portrait ? undefined : 'ml-auto'}>
            <ButtonLink href="/rsvp" variant="light">RSVP</ButtonLink>
          </Reveal>
        </div>
      </div>

      <div aria-hidden className="absolute right-6 bottom-10 hidden flex-col items-center gap-3 md:flex">
        <span className="eyebrow text-[0.6rem] text-white/80 [writing-mode:vertical-rl]">Scroll</span>
        <span className="block h-14 w-px overflow-hidden bg-white/25"><span className="scrollcue block h-full w-full bg-white" /></span>
      </div>
    </section>
  )
}
