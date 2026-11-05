---
name: motion-pattern
description: Add or tune cinematic animation on the wedding site (reveals, parallax, pinned scroll timeline, horizontal gallery, page transitions, text splits, countdown) using the shared GSAP/Lenis/Framer Motion components with reduced-motion fallbacks.
---

# Motion patterns

Use the shared components in `components/motion/` before writing any custom timeline.

| Pattern | Component | Use for | Reduced-motion |
|---|---|---|---|
| Fade-rise reveal | `<Reveal stagger>` | Headings, paragraphs, cards | Opacity only |
| Split text | `<SplitReveal by="char|word|line">` | Hero names, page titles | Show instantly |
| Image zoom-in | `<ImageReveal>` (scale 1.08→1 + clip) | Feature photos | Opacity only |
| Parallax | `<Parallax speed={0.1}>` (max 0.15) | Background/hero photos | Static |
| Pinned timeline | `<PinnedTimeline>` | Our Story | Normal vertical list |
| Horizontal scroll | `<HorizontalScroll>` | Gallery strip (desktop) | Native scroll-snap row |
| Page transition | `<PageTransition>` (Framer Motion, ivory curtain) | All routes | Cross-fade 150ms |
| Draw-on SVG | `<DrawSVG>` | Monogram, signature, botanicals | Show drawn |
| Countdown | `<Countdown to={date}>` | Home | No flip, plain numbers |

## Recipe for a new pattern
```tsx
'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Example({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(ref.current!.children, {
        y: 24, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    })
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.from(ref.current!.children, { opacity: 0, duration: 0.4 })
    })
  }, { scope: ref })
  return <div ref={ref}>{children}</div>
}
```

## Rules
- transform/opacity only; `will-change` set only during the animation
- One hero moment per page
- Call `ScrollTrigger.refresh()` after images/fonts load; Lenis drives `ScrollTrigger.update`
- Test with CPU 4× throttle — must hold ~60fps
- Never block content: if JS fails, everything is visible
