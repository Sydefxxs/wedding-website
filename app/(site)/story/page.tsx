import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { PageHeader } from '@/components/ui/PageHeader'
import { StoryTimeline } from '@/components/sections/StoryTimeline'

export const metadata: Metadata = { title: 'Our Story' }

export default async function StoryPage() {
  const { story, settings } = await getContent()
  return (
    <>
      <PageHeader eyebrow="Our story" title="How it all began" lead={`The short version of how ${settings.partnerOne} and ${settings.partnerTwo} ended up here.`} />
      <StoryTimeline story={story} />
    </>
  )
}
