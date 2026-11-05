import { cn } from '@/lib/utils'

/** Initials in a gold ring (red ampersand on light backgrounds, gold on dark). Pass `draw` to animate the ring. */
export function Monogram({ a, b, className, draw = false, dark = false }: { a: string; b: string; className?: string; draw?: boolean; dark?: boolean }) {
  return (
    <span className={cn('relative inline-flex aspect-square items-center justify-center', className)} aria-label={`${a} and ${b}`}>
      <svg viewBox="0 0 100 100" className={cn('absolute inset-0 h-full w-full', dark ? 'text-gold-light' : 'text-gold')} aria-hidden>
        <circle
          cx="50" cy="50" r="47"
          fill="none" stroke="currentColor" strokeWidth="1"
          pathLength={1}
          strokeDasharray="1"
          className={draw ? 'monogram-ring' : undefined}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
      </svg>
      <span aria-hidden className="font-display text-[0.42em] leading-none tracking-wide">
        {a[0]}
        <em className={cn('mx-[0.12em] font-light not-italic', dark ? 'text-gold-light' : 'text-primary')}>&amp;</em>
        {b[0]}
      </span>
    </span>
  )
}
