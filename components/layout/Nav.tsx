'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { NavLink } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Monogram } from '@/components/ui/Monogram'
import { getLenis } from '@/components/motion/SmoothScroll'

export function Nav({ links, a, b, dateLabel }: { links: NavLink[]; a: string; b: string; dateLabel: string }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > (isHome ? window.innerHeight * 0.75 : 40))
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu whenever the route changes
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const root = document.documentElement
    if (open) {
      getLenis()?.stop()
      root.style.overflow = 'hidden'
    } else {
      getLenis()?.start()
      root.style.overflow = ''
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        menuBtn.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const overHero = isHome && !scrolled && !open
  const tone = overHero ? 'text-white' : 'text-ink'

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color,padding] duration-700 ease-out-expo',
          overHero ? 'border-b border-transparent bg-transparent py-5' : 'border-b border-line bg-paper/92 py-3 backdrop-blur-sm',
          open && 'border-transparent bg-paper',
          tone,
        )}
      >
        <div className="container-x flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Home">
            <Monogram a={a} b={b} dark={overHero} className="w-11 text-[2.6rem]" />
            <span className="hidden eyebrow text-[0.7rem] opacity-80 sm:inline">{dateLabel}</span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} aria-current={pathname === l.href ? 'page' : undefined} className="eyebrow link-draw py-1 text-[0.72rem]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/rsvp"
              className="eyebrow inline-flex h-10 items-center rounded-full bg-primary px-5 text-[0.72rem] text-primary-ink transition-colors duration-500 hover:bg-primary-hover"
            >
              RSVP
            </Link>
            <button
              ref={menuBtn}
              type="button"
              className="relative flex h-10 w-10 items-center justify-center lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={cn('absolute h-px w-6 bg-current transition-transform duration-500 ease-out-expo', open ? 'rotate-45' : '-translate-y-1')} />
              <span className={cn('absolute h-px w-6 bg-current transition-transform duration-500 ease-out-expo', open ? '-rotate-45' : 'translate-y-1')} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-0 z-40 flex flex-col bg-paper px-6 pt-28 pb-10 transition-[clip-path] duration-700 ease-out-expo lg:hidden',
          open ? '[clip-path:inset(0_0_0_0)]' : 'pointer-events-none [clip-path:inset(0_0_100%_0)]',
        )}
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {[{ label: 'Home', href: '/' }, ...links, { label: 'RSVP', href: '/rsvp' }].map((l, i) => (
              <li key={l.href} className="overflow-hidden">
                <Link
                  href={l.href}
                  className={cn('block font-display text-[2.6rem] leading-[1.15] transition-transform duration-700 ease-out-expo', open ? 'translate-y-0' : 'translate-y-full')}
                  style={{ transitionDelay: open ? `${120 + i * 50}ms` : '0ms' } as CSSProperties}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="eyebrow mt-auto text-ink-2">{a} &amp; {b} · {dateLabel}</p>
      </div>
    </>
  )
}
