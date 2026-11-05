// Generates temporary placeholder photos into public/placeholders/
// plus a manifest (size + blur preview) used by the placeholder content.
// Run: node scripts/generate-placeholders.mjs
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.join(process.cwd(), 'public', 'placeholders')

// Warm, photo-like palettes (shadow, mid, light, glow)
const PALETTES = [
  ['#2b2420', '#6b5a4a', '#c9b49a', '#f3e3c8'], // candlelight
  ['#1f2620', '#4f5e46', '#9daa8a', '#e8ead6'], // sage garden
  ['#2a1d19', '#7d4c3a', '#c98f73', '#f4d6c2'], // terracotta dusk
  ['#22211f', '#55504a', '#a69d90', '#ece5d9'], // linen
  ['#1b1e24', '#3d4656', '#8c93a3', '#e6e1d8'], // blue hour
]

const slots = [
  ['hero-main', 2400, 1350],
  ['intro-portrait', 1200, 1500],
  ...Array.from({ length: 6 }, (_, i) => [`story-0${i + 1}`, i % 2 ? 1800 : 1400, i % 2 ? 1200 : 1750]),
  ['venue-ceremony', 1800, 1200],
  ['venue-reception', 1800, 1200],
  ['travel-city', 2400, 1030],
  ...Array.from({ length: 3 }, (_, i) => [`hotel-0${i + 1}`, 1200, 900]),
  ...Array.from({ length: 8 }, (_, i) => [`party-0${i + 1}`, 900, 1125]),
  ...Array.from({ length: 14 }, (_, i) => {
    const n = String(i + 1).padStart(2, '0')
    return [`gallery-${n}`, [0, 3, 4, 7, 9, 12].includes(i) ? 2000 : 1400, [0, 3, 4, 7, 9, 12].includes(i) ? 1333 : 1750]
  }),
  ['registry-banner', 2400, 800],
  ['og-share', 1200, 630],
]

function rand(seed) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

function svgFor(id, w, h, idx) {
  const [dark, mid, light, glow] = PALETTES[idx % PALETTES.length]
  const r = rand(idx * 7919 + 13)
  const bokeh = Array.from({ length: 18 }, () => {
    const cx = r() * w, cy = r() * h * 0.8, rad = (0.01 + r() * 0.05) * Math.max(w, h)
    return `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${glow}" opacity="${0.04 + r() * 0.12}"/>`
  }).join('')
  const lx = 0.25 + r() * 0.5, ly = 0.2 + r() * 0.35
  const fs = Math.round(Math.min(w, h) * 0.028)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="${light}"/>
      <stop offset="0.55" stop-color="${mid}"/>
      <stop offset="1" stop-color="${dark}"/>
    </linearGradient>
    <radialGradient id="l" cx="${lx}" cy="${ly}" r="0.6">
      <stop offset="0" stop-color="${glow}" stop-opacity="0.85"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <filter id="b"><feGaussianBlur stdDeviation="${Math.max(w, h) * 0.012}"/></filter>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0.09 0"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#l)"/>
  <g filter="url(#b)">${bokeh}</g>
  <rect width="100%" height="100%" filter="url(#n)"/>
  <text x="50%" y="${h - fs * 2.2}" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="${fs}" letter-spacing="${fs * 0.25}" fill="${glow}" opacity="0.55">PLACEHOLDER · ${id.toUpperCase()} · ${w}×${h}</text>
</svg>`
}

await mkdir(OUT, { recursive: true })
const manifest = {}
for (const [i, [id, w, h]] of slots.entries()) {
  const buf = await sharp(Buffer.from(svgFor(id, w, h, i))).jpeg({ quality: 82, mozjpeg: true }).toBuffer()
  await writeFile(path.join(OUT, `${id}.jpg`), buf)
  const tiny = await sharp(buf).resize(16).jpeg({ quality: 50 }).toBuffer()
  manifest[id] = { src: `/placeholders/${id}.jpg`, width: w, height: h, blurDataURL: `data:image/jpeg;base64,${tiny.toString('base64')}` }
  process.stdout.write('.')
}
await writeFile(path.join(process.cwd(), 'content', 'placeholder-images.json'), JSON.stringify(manifest, null, 2))
console.log(`\n${slots.length} placeholders written`)
