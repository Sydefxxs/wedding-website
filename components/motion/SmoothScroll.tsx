'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// Phones show/hide the address bar while scrolling, which resizes the window.
// Don't recalculate every animation when that happens — it causes visible jumps.
ScrollTrigger.config({ ignoreMobileResize: true })

let lenis: Lenis | null = null
export const getLenis = () => lenis

/**
 * Smooth, gliding scroll on mouse wheels and trackpads, synced with GSAP ScrollTrigger.
 * Phones keep their own native touch scrolling (already smooth, and it's what guests expect).
 * Off for reduced-motion users.
 */
export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis = new Lenis({
      lerp: 0.085, // lower = longer, softer glide
      wheelMultiplier: 0.9,
      smoothWheel: true,
      anchors: true, // in-page links glide too
      autoRaf: false,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Late-loading fonts and photos change the page height; re-measure once they're in
    // so pinned/parallax sections don't jump mid-scroll.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh, { once: true })

    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [])

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
    // Let new images/fonts settle, then recalc triggers
    const t = setTimeout(() => ScrollTrigger.refresh(), 300)
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 1200)
    return () => {
      clearTimeout(t)
      clearTimeout(t2)
    }
  }, [pathname])

  return null
}
