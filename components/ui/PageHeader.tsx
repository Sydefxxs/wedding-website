import { SplitReveal } from '@/components/motion/SplitReveal'
import { Reveal } from '@/components/motion/Reveal'

/** Big editorial title used at the top of inner pages. */
export function PageHeader({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <header className="container-x pt-40 pb-16 md:pt-52 md:pb-24">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          {eyebrow && (
            <Reveal immediate>
              <p className="eyebrow mb-6 text-accent">{eyebrow}</p>
            </Reveal>
          )}
          <h1 className="text-h1">
            <SplitReveal text={title} by="word" immediate delay={150} />
          </h1>
        </div>
        {lead && (
          <Reveal immediate delay={500} className="self-end md:col-span-4">
            <p className="text-lead text-ink-2">{lead}</p>
          </Reveal>
        )}
      </div>
      <div aria-hidden className="mt-16 h-px w-full origin-left bg-line md:mt-24 hairline-draw" />
    </header>
  )
}
