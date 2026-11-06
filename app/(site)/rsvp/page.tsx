import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { PageHeader } from '@/components/ui/PageHeader'
import { RsvpForm } from './RsvpForm'

export const metadata: Metadata = { title: 'RSVP' }

export default async function RsvpPage() {
  const { settings: s } = await getContent()
  return (
    <>
      <PageHeader eyebrow="RSVP" title={s.rsvp.heading} lead={`${s.rsvp.intro} Kindly reply by ${s.rsvpDeadlineLabel}.`} />
      <section className="container-x pb-24 md:pb-40">
        <RsvpForm
          copy={s.rsvp}
          dateLabel={s.dateLabel}
          deadlineLabel={s.rsvpDeadlineLabel}
          couple={`${s.partnerOne} & ${s.partnerTwo}`}
          contactEmail={s.contactEmail}
        />
      </section>
    </>
  )
}
