import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { PageHeader } from '@/components/ui/PageHeader'
import { RsvpForm } from './RsvpForm'

export const metadata: Metadata = { title: 'RSVP' }

export default async function RsvpPage() {
  const { settings } = await getContent()
  return (
    <>
      <PageHeader eyebrow="RSVP" title="Will you join us?" lead={`Kindly reply by ${settings.rsvpDeadlineLabel}.`} />
      <section className="container-x pb-24 md:pb-40">
        <RsvpForm deadlineLabel={settings.rsvpDeadlineLabel} />
      </section>
    </>
  )
}
