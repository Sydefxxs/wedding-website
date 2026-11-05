'use client'

import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Moves its child slower than the page as you scroll. `amount` = % of height (keep ≤ 15). */
export function Parallax({ children, amount = 10, className }: { children: ReactNode; amount?: number; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(inner.current, { yPercent: -amount }, {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: { trigger: wrap.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
  }, { scope: wrap })

  return (
    <div ref={wrap} className={cn('overflow-hidden', !className?.includes('absolute') && 'relative', className)}>
      <div ref={inner} className="absolute -inset-y-[15%] inset-x-0 will-change-transform">{children}</div>
    </div>
  )
}
