import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { PageHeader } from '@/components/ui/PageHeader'
import { Accordion } from '@/components/ui/Accordion'
import { Reveal } from '@/components/motion/Reveal'
import { ButtonLink } from '@/components/ui/Button'

export const metadata: Metadata = { title: 'FAQ' }

export default async function FaqPage() {
  const { faqs, settings } = await getContent()
  return (
    <>
      <PageHeader eyebrow="FAQ" title="Good questions" lead="Everything we think you might wonder. Still stuck? Just ask us." />
      <div className="container-x grid gap-14 pb-24 md:grid-cols-12 md:pb-40">
        <Reveal className="md:col-span-7 md:col-start-6 md:row-start-1">
          <Accordion items={faqs} />
        </Reveal>
        <Reveal delay={150} className="md:col-span-4 md:row-start-1">
          <div className="md:sticky md:top-32">
            <p className="text-lead text-ink-2">RSVPs close {settings.rsvpDeadlineLabel}.</p>
            <ButtonLink href="/rsvp" className="mt-6">RSVP</ButtonLink>
          </div>
        </Reveal>
      </div>
    </>
  )
}
