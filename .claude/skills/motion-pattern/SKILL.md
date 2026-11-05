---
name: motion-pattern
description: Add or tune cinematic animation on the wedding site (reveals, parallax, scroll-drawn timeline, horizontal gallery, page transitions, text splits, countdown) using the shared GSAP/Lenis/CSS components with reduced-motion fallbacks.
---

# Motion patterns

Reuse what exists before writing a new timeline.

| Pattern | Where | Use for | Reduced-motion |
|---|---|---|---|
| Fade-rise reveal | `components/motion/Reveal.tsx` (`stagger`, `delay`, `immediate`) | Headings, paragraphs, lists | Fade only |
| Split text | `components/motion/SplitReveal.tsx` (`by="char"\|"word"`) | Names, page titles | Shown instantly |
| Photo curtain | `components/motion/ImageReveal.tsx` | Feature photos | Shown instantly |
| Parallax | `components/motion/Parallax.tsx` (`amount` ≤ 15) | Landscape photos, collages | Static |
| Scroll-drawn thread | `components/sections/StoryTimeline.tsx` (`.thread` scrub) | Our Story | Static line |
| Pinned sideways gallery | `components/sections/GalleryStrip.tsx` | Home gallery | Native swipe row |
| Page transition | `app/(site)/template.tsx` + `.page-curtain` / `.page-in` CSS | All routes | Instant |
| Ring draw | `.monogram-ring` on `<Monogram draw />` | Monogram | Shown drawn |
| Countdown | `components/motion/Countdown.tsx` | Hero | Plain numbers |
| Smooth scroll | `components/motion/SmoothScroll.tsx` (Lenis ↔ ScrollTrigger) | Global | Off |

## How the reveal system works
- An inline script adds `html.js`; only then do `.reveal`, `.reveal-stagger`, `.split`, `.img-reveal` start hidden (CSS in `app/globals.css`). No JS → everything visible.
- Each component adds `is-in` via IntersectionObserver. Observe an **unclipped** element (see ImageReveal) — a fully clipped target can report as never visible.

## Recipe for a new GSAP pattern
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
  }, { scope: ref })
  return <div ref={ref}>{children}</div>
}
```

## Rules
- Animate `transform` / `opacity` / `clip-path` only
- One hero moment per page; everything else subtle
- Don't give vertical hero photos parallax overscan (it pushes faces under the menu)
- Leave room for descenders in masked text (`.split-mask` padding)
- Test at CPU 4× throttle and with reduced motion on
