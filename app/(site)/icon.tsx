import { ImageResponse } from 'next/og'
import { getContent } from '@/lib/content'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

/** Favicon built from our initials, so it updates when the names change in the Studio. */
export default async function Icon() {
  const { settings: s } = await getContent()
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 32, background: '#0e0c0d', color: '#f4ede4', fontSize: 24, fontFamily: 'serif', border: '2px solid #c9a961' }}>
        {s.partnerOne[0]}&amp;{s.partnerTwo[0]}
      </div>
    ),
    size,
  )
}
