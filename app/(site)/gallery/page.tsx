import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import { PageHeader } from '@/components/ui/PageHeader'
import { GalleryGrid } from '@/components/sections/GalleryGrid'

export const metadata: Metadata = { title: 'Gallery' }

export default async function GalleryPage() {
  const { gallery, settings } = await getContent()
  return (
    <>
      <PageHeader eyebrow="Gallery" title="Moments" lead={`Tap any photo to see it bigger.${settings.photoCredit ? ` ${settings.photoCredit}.` : ''}`} />
      <GalleryGrid images={gallery} />
    </>
  )
}
