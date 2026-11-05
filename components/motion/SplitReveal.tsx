'use client'

import { useEffect, useRef, type CSSProperties, type ElementType } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  text: string
  as?: ElementType
  className?: string
  by?: 'char' | 'word'
  delay?: number
  immediate?: boolean
  stepMs?: number
}

/** Each letter/word slides up from behind a mask — the classic title-sequence reveal. */
export function SplitReveal({ text, as: Tag = 'span', className, by = 'char', delay = 0, immediate, stepMs }: Props) {
  const ref = useRef<HTMLElement>(null)
  const parts = by === 'char' ? Array.from(text) : text.split(/(\s+)/)
  const step = stepMs ?? (by === 'char' ? 45 : 90)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (immediate) {
      const t = setTimeout(() => el.classList.add('is-in'), 50)
      return () => clearTimeout(t)
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.classList.add('is-in')
        io.disconnect()
      }
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [immediate])

  let n = 0
  return (
    <Tag ref={ref} className={cn('split', className)} aria-label={text}>
      {parts.map((p, i) =>
        /^\s+$/.test(p) || p === ' ' ? (
          <span key={i} aria-hidden> </span>
        ) : (
          <span key={i} aria-hidden className="split-mask">
            <span className="split-inner" style={{ '--sd': `${delay + n++ * step}ms` } as CSSProperties}>
              {p}
            </span>
          </span>
        ),
      )}
    </Tag>
  )
}
