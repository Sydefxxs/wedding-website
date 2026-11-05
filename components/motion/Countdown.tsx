'use client'

import { useEffect, useState } from 'react'

const parts = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 }
}

export function Countdown({ to, className }: { to: string; className?: string }) {
  const target = new Date(to).getTime()
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- start the clock only on the client to avoid hydration mismatch
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  if (now !== null && now >= target) return <p className={className}>Today’s the day.</p>
  const p = now === null ? null : parts(target - now)
  const items: [string, number | undefined][] = [
    ['Days', p?.days], ['Hours', p?.hours], ['Minutes', p?.minutes], ['Seconds', p?.seconds],
  ]

  return (
    <dl className={className} aria-live="off">
      {items.map(([label, v]) => (
        <div key={label} className="flex flex-col items-center">
          <dd className="font-display text-4xl leading-none tabular-nums md:text-5xl">
            {v === undefined ? '—' : String(v).padStart(2, '0')}
          </dd>
          <dt className="eyebrow mt-2 text-[0.65rem] opacity-80">{label}</dt>
        </div>
      ))}
    </dl>
  )
}
