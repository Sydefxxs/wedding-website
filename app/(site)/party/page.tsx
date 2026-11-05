import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { PageHeader } from '@/components/ui/PageHeader'
import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/motion/Reveal'

export const metadata: Metadata = { title: 'Wedding Party' }

export default async function PartyPage() {
  const { people } = await getContent()
  return (
    <>
      <PageHeader eyebrow="Wedding party" title="Our people" lead="The ones standing next to us — and who’ve been standing by us for years." />
      <Reveal stagger className="container-x grid grid-cols-2 gap-x-5 gap-y-14 pb-24 md:grid-cols-4 md:gap-x-8 md:pb-40">
        {people.map((p, i) => (
          <figure key={p.id} className={i % 4 === 1 || i % 4 === 3 ? 'md:mt-16' : undefined}>
            <div className="group relative overflow-hidden">
              <Photo image={p.image} sizes="(min-width: 768px) 25vw, 50vw" className="aspect-[4/5] w-full" imgClassName="transition-transform duration-[1.6s] ease-out-expo group-hover:scale-105" />
            </div>
            <figcaption className="mt-4">
              <p className="eyebrow text-[0.68rem] text-accent">{p.role}</p>
              <p className="mt-1 font-display text-h3">{p.name}</p>
              <p className="mt-1 text-[0.95rem] text-ink-2">{p.note}</p>
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </>
  )
}
