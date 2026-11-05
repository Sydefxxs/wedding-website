import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { getGuestPhotos, getUploadSettings } from '@/lib/guest-photos'
import { PhotoShare } from './PhotoShare'

export const metadata: Metadata = { title: 'Share Photos' }

export default async function PhotosPage() {
  const [photos, settings] = await Promise.all([getGuestPhotos(), getUploadSettings()])
  return (
    <>
      <PageHeader eyebrow="Share photos" title="Through your eyes" lead="Took a photo you love? Add it here so everyone can see it — and download any of them to keep." />
      <PhotoShare photos={photos} settings={settings} />
    </>
  )
}
