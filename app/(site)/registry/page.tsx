import type { Metadata } from 'next'
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { getContent } from '@/lib/content'
import { PageHeader } from '@/components/ui/PageHeader'
import { Photo } from '@/components/ui/Photo'
import { Parallax } from '@/components/motion/Parallax'
import { Reveal } from '@/components/motion/Reveal'

export const metadata: Metadata = { title: 'Registry' }

export default async function RegistryPage() {
  const { registry } = await getContent()
  return (
    <>
      <PageHeader eyebrow="Registry" title={registry.heading} lead={registry.body} />
      <Parallax amount={8} className="h-[40vh] w-full md:h-[55vh]">
        <Photo image={registry.image} sizes="100vw" className="h-full w-full" />
      </Parallax>
      <Reveal as="ul" stagger className="section-y container-x grid gap-6 md:grid-cols-3">
        {registry.links.map((r) => (
          <li key={r.id}>
            <a href={r.url} target="_blank" rel="noreferrer" className="group flex h-full min-h-56 flex-col justify-between border border-line p-8 transition-colors duration-500 hover:border-primary hover:bg-primary hover:text-primary-ink">
              <ArrowUpRight aria-hidden size={26} weight="light" className="self-end transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
              <span>
                <span className="block font-display text-h2">{r.name}</span>
                {r.note && <span className="mt-2 block opacity-70">{r.note}</span>}
              </span>
            </a>
          </li>
        ))}
      </Reveal>
    </>
  )
}
