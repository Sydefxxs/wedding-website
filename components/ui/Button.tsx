import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'light'

const base =
  'group inline-flex h-12 items-center justify-center gap-3 rounded-full px-7 eyebrow transition-[background-color,color,border-color,transform] duration-500 ease-out-expo active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-ink hover:bg-primary-hover',
  secondary: 'border border-ink text-ink hover:bg-ink hover:text-paper',
  light: 'border border-white/70 text-white hover:bg-white hover:text-ink',
}

export function buttonClass(variant: Variant = 'primary', className?: string) {
  return cn(base, variants[variant], className)
}

function Arrow() {
  return <ArrowRight aria-hidden size={16} weight="light" className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
}

export function ButtonLink({ href, children, variant = 'primary', className, arrow = true, ...rest }: { href: string; children: ReactNode; variant?: Variant; className?: string; arrow?: boolean } & Omit<ComponentProps<typeof Link>, 'href'>) {
  const external = /^https?:/.test(href) || href.startsWith('data:')
  if (external) {
    return (
      <a href={href} className={buttonClass(variant, className)} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})} {...(rest as ComponentProps<'a'>)}>
        {children}
        {arrow && <Arrow />}
      </a>
    )
  }
  return (
    <Link href={href} className={buttonClass(variant, className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  )
}

export function Button({ children, variant = 'primary', className, arrow, ...rest }: { variant?: Variant; arrow?: boolean } & ComponentProps<'button'>) {
  return (
    <button className={buttonClass(variant, className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  )
}
