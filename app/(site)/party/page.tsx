import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { PageHeader } from '@/components/ui/PageHeader'
import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/motion/Reveal'
import type { Person } from '@/lib/types'

export const metadata: Metadata = { title: 'Wedding Party' }

function PeopleGrid({ people }: { people: Person[] }) {
  return (
    <Reveal stagger className="grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-4 md:gap-x-8">
      {people.map((p, i) => (
        <figure key={p.id} className={i % 4 === 1 || i % 4 === 3 ? 'md:mt-16' : undefined}>
          <div className="group relative overflow-hidden">
            <Photo image={p.image} sizes="(min-width: 768px) 25vw, 50vw" className="aspect-[4/5] w-full" imgClassName="transition-transform duration-[1.6s] ease-out-expo group-hover:scale-105" />
          </div>
          <figcaption className="mt-4">
            <p className="eyebrow text-[0.68rem] text-accent">{p.role}</p>
            <p className="mt-1 font-display text-h3">{p.name}</p>
            {p.note && <p className="mt-1 text-[0.95rem] text-ink-2">{p.note}</p>}
          </figcaption>
        </figure>
      ))}
    </Reveal>
  )
}

export default async function PartyPage() {
  const { people } = await getContent()
  const parents = people.filter((p) => p.group === 'parents')
  const padrinos = people.filter((p) => p.group !== 'parents')

  return (
    <>
      <PageHeader eyebrow="Wedding party" title="Our people" lead="The ones who raised us, and the ones helping us get to this day." />
      <div className="container-x space-y-28 pb-24 md:space-y-40 md:pb-40">
        {parents.length > 0 && (
          <section aria-labelledby="parents">
            <Reveal className="mb-12 md:mb-16">
              <h2 id="parents" className="text-h1">Our <em className="font-light text-gold-light">parents</em></h2>
            </Reveal>
            <PeopleGrid people={parents} />
          </section>
        )}
        {padrinos.length > 0 && (
          <section aria-labelledby="padrinos">
            <Reveal className="mb-12 md:mb-16">
              <h2 id="padrinos" className="text-h1">Our <em className="font-light text-gold-light">padrinos</em></h2>
              <p className="text-lead mt-4 max-w-[52ch] text-ink-2">Thank you for standing with us and helping make this day happen.</p>
            </Reveal>
            <PeopleGrid people={padrinos} />
          </section>
        )}
      </div>
    </>
  )
}
