'use client'

import { useId, useState } from 'react'
import { Plus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export function Accordion({ items }: { items: { id: string; question: string; answer: string }[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null)
  const base = useId()
  return (
    <div className="border-t border-line">
      {items.map((it) => {
        const isOpen = open === it.id
        const panel = `${base}-${it.id}`
        return (
          <div key={it.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : it.id)}
                className="flex w-full items-center justify-between gap-6 py-7 text-left font-display text-h3 transition-colors hover:text-primary"
              >
                {it.question}
                <Plus aria-hidden size={22} weight="light" className={cn('shrink-0 transition-transform duration-500 ease-out-expo', isOpen && 'rotate-45')} />
              </button>
            </h3>
            <div id={panel} role="region" className={cn('grid transition-[grid-template-rows] duration-700 ease-out-expo', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="max-w-[60ch] pb-8 text-ink-2">{it.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
