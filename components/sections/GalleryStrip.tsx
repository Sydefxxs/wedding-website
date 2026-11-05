'use client'

import { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { GalleryImage } from '@/lib/types'
import { Photo } from '@/components/ui/Photo'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Desktop: section pins and photos glide sideways as you scroll down. Mobile/reduced motion: swipeable row. */
export function GalleryStrip({ images }: { images: GalleryImage[] }) {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const el = track.current!
      const distance = () => el.scrollWidth - window.innerWidth
      gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
    })
  }, { scope: section })

  if (!images.length) return null
  const shown = images.slice(0, 9)

  return (
    <section ref={section} className="relative overflow-hidden bg-night py-20 text-ink md:flex md:h-screen md:items-center md:py-0">
      <div
        ref={track}
        className="flex snap-x snap-mandatory items-center gap-5 overflow-x-auto px-5 [scrollbar-width:none] md:gap-8 md:overflow-visible md:px-[8vw] md:will-change-transform"
      >
        <div className="w-[78vw] shrink-0 snap-start md:w-[30vw]">
          <p className="eyebrow mb-6 text-gold-light">Gallery</p>
          <h2 className="text-h1">A few of our <em className="font-light text-gold-light">favorite</em> frames.</h2>
          <Link href="/gallery" className="eyebrow link-draw mt-10 inline-block">See them all</Link>
        </div>
        {shown.map((img, i) => {
          const landscape = img.width > img.height
          return (
            <figure key={img.id} className={landscape ? 'w-[85vw] shrink-0 snap-center md:w-[42vw]' : 'w-[65vw] shrink-0 snap-center md:w-[24vw]'} style={{ marginTop: `${(i % 3) * 3}vh` }}>
              <Photo image={img} sizes="(min-width: 768px) 40vw, 85vw" className={landscape ? 'aspect-[3/2] w-full' : 'aspect-[4/5] w-full'} />
              {img.caption && <figcaption className="mt-3 text-sm text-ink/60">{img.caption}</figcaption>}
            </figure>
          )
        })}
      </div>
    </section>
  )
}
