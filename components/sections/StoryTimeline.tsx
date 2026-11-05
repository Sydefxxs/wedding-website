'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { StoryMoment } from '@/lib/types'
import { Photo } from '@/components/ui/Photo'
import { Parallax } from '@/components/motion/Parallax'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** A thread draws down the page as you read; each chapter alternates sides. */
export function StoryTimeline({ story }: { story: StoryMoment[] }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.thread', { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'bottom 70%', scrub: true },
      })
    })
  }, { scope: root })

  return (
    <div ref={root} className="container-x relative pb-24 md:pb-40">
      <div aria-hidden className="absolute top-0 bottom-0 left-5 w-px bg-line md:left-1/2">
        <div className="thread h-full w-full origin-top bg-accent" />
      </div>
      <ol className="space-y-28 md:space-y-48">
        {story.map((m, i) => {
          const right = i % 2 === 1
          return (
            <li key={m.id} className="relative grid items-center gap-10 pl-10 md:grid-cols-12 md:gap-0 md:pl-0">
              <span aria-hidden className="absolute top-2 left-5 h-3 w-3 -translate-x-1/2 rounded-full border border-accent bg-paper md:top-1/2 md:left-1/2" />
              <div className={cn('md:col-span-5', right ? 'md:col-start-8 md:row-start-1' : 'md:col-start-1')}>
                <Parallax amount={7} className={cn('w-full', m.image.width > m.image.height ? 'aspect-[3/2]' : 'aspect-[4/5]')}>
                  <Photo image={m.image} sizes="(min-width: 768px) 40vw, 90vw" className="h-full w-full" />
                </Parallax>
              </div>
              <Reveal className={cn('md:col-span-4 md:row-start-1', right ? 'md:col-start-2 md:text-right' : 'md:col-start-8')}>
                <p className="font-display text-h2 text-accent italic">{m.dateLabel}</p>
                <h2 className="mt-3 text-h2">{m.title}</h2>
                <p className="mt-5 text-ink-2">{m.body}</p>
              </Reveal>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
