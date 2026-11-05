import { ImageResponse } from 'next/og'
import { cacheLife, cacheTag } from 'next/cache'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import { getContent } from '@/lib/content'

export const alt = 'Save the date'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PHOTO_W = 500

/** Crop our photo for the left panel (local file or Sanity CDN). */
async function photoData(src: string) {
  const buf = src.startsWith('/')
    ? await readFile(join(process.cwd(), 'public', src))
    : Buffer.from(await (await fetch(`${src}?w=1400&fm=jpg`)).arrayBuffer())
  const out = await sharp(buf)
    .resize(PHOTO_W, size.height, { fit: 'cover', position: sharp.strategy.attention })
    .jpeg({ quality: 84 })
    .toBuffer()
  return `data:image/jpeg;base64,${out.toString('base64')}`
}

/** All the file/network work, cached so the card can be pre-rendered at build time (and on static hosts). */
async function cardAssets() {
  'use cache'
  cacheTag('content')
  cacheLife('max')
  const { settings: s } = await getContent()
  const font = async (f: string) => (await readFile(join(process.cwd(), 'app/fonts/og', f))).toString('base64')
  const [serif, serifItalic, sans, photo] = await Promise.all([
    font('cormorant-garamond-latin-300-normal.woff'),
    font('cormorant-garamond-latin-300-italic.woff'),
    font('jost-latin-500-normal.woff'),
    photoData((s.shareImage ?? s.heroImage).src),
  ])
  return { s, serif, serifItalic, sans, photo }
}

/** The preview card people see when the link is texted or posted. Updates with the names/date in the Studio. */
export default async function OpengraphImage() {
  const a = await cardAssets()
  const { s, photo } = a
  const [serif, serifItalic, sans] = [a.serif, a.serifItalic, a.sans].map((b) => Buffer.from(b, 'base64'))
  const place = s.location.includes('[') ? '' : s.location

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#4a0f18', color: '#fffdfa' }}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={photo} width={PHOTO_W} height={size.height} style={{ objectFit: 'cover' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 72px' }}>
          <div style={{ fontFamily: 'Jost', fontSize: 20, letterSpacing: 6, textTransform: 'uppercase', color: '#d9bc7a' }}>Save the date</div>
          <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Cormorant', fontSize: 128, lineHeight: 0.95, marginTop: 28 }}>
            <span>{s.partnerOne}</span>
            <span style={{ display: 'flex', paddingLeft: 60 }}>
              <span style={{ fontFamily: 'Cormorant Italic', color: '#d9bc7a', marginRight: 24 }}>&amp;</span>
              {s.partnerTwo}
            </span>
          </div>
          <div style={{ width: 120, height: 1, background: '#d9bc7a', marginTop: 40 }} />
          <div style={{ fontFamily: 'Cormorant', fontSize: 44, marginTop: 28 }}>{s.dateLabel}</div>
          <div style={{ fontFamily: 'Jost', fontSize: 18, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,253,250,.72)', marginTop: 10 }}>
            {[s.lastName && `The ${s.lastName} wedding`, place].filter(Boolean).join(' · ')}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Cormorant', data: serif, weight: 300, style: 'normal' },
        { name: 'Cormorant Italic', data: serifItalic, weight: 300, style: 'italic' },
        { name: 'Jost', data: sans, weight: 500, style: 'normal' },
      ],
    },
  )
}
