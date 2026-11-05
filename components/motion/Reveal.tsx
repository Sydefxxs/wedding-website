'use client'

import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  as?: ElementType
  children: ReactNode
  className?: string
  /** animate each direct child one after another */
  stagger?: boolean
  delay?: number
  /** reveal immediately on mount (hero) instead of on scroll */
  immediate?: boolean
  id?: string
}

/** Fade + rise when scrolled into view (once). Pure CSS transition driven by an IntersectionObserver. */
export function Reveal({ as: Tag = 'div', children, className, stagger, delay = 0, immediate, id }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (stagger) Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty('--i', String(i)))
    if (immediate) {
      requestAnimationFrame(() => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [stagger, immediate])

  return (
    <Tag ref={ref} id={id} className={cn(stagger ? 'reveal-stagger' : 'reveal', className)} style={{ '--d': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  )
}
