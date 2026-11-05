'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Wraps a <Photo>: a curtain wipes up and the photo settles from a slight zoom.
 * The observer watches the unclipped outer box (a fully clipped element can report as never visible).
 */
export function ImageReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold: 0.01, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    // Safety net: never leave a photo hidden if the observer doesn't fire
    const t = setTimeout(() => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in')
    }, 2500)
    return () => {
      io.disconnect()
      clearTimeout(t)
    }
  }, [])
  return (
    <div ref={ref} className={cn('img-reveal', className)} style={{ '--d': `${delay}ms` } as CSSProperties}>
      <div className="img-reveal-clip">{children}</div>
    </div>
  )
}
