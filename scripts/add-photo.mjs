// Add one of our real photos to the site.
//   node scripts/add-photo.mjs <input.jpg> <name> [focusX focusY]
// - auto-rotates, strips ALL metadata (incl. GPS location), caps the long edge at 2400px
// - writes public/photos/<name>.jpg and records size + blur preview in content/photos.json
// Then reference it in content/placeholder.ts (or upload it in the Studio once Sanity is connected).
import sharp from 'sharp'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const [input, name, fx, fy] = process.argv.slice(2)
if (!input || !name || !/^[a-z0-9-]+$/.test(name)) {
  console.error('Usage: node scripts/add-photo.mjs <input.jpg> <kebab-case-name> [focusX focusY]')
  process.exit(1)
}

const root = process.cwd()
const outDir = path.join(root, 'public', 'photos')
const manifestPath = path.join(root, 'content', 'photos.json')
await mkdir(outDir, { recursive: true })

const out = await sharp(input)
  .rotate() // apply EXIF orientation, then metadata is dropped on re-encode
  .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 84, mozjpeg: true, progressive: true })
  .toBuffer({ resolveWithObject: true })

await writeFile(path.join(outDir, `${name}.jpg`), out.data)
const tiny = await sharp(out.data).resize(20).jpeg({ quality: 55 }).toBuffer()

let manifest = {}
try {
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
} catch {}
manifest[name] = {
  src: `/photos/${name}.jpg`,
  width: out.info.width,
  height: out.info.height,
  blurDataURL: `data:image/jpeg;base64,${tiny.toString('base64')}`,
  ...(fx && fy ? { hotspot: { x: Number(fx), y: Number(fy) } } : {}),
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`✓ ${name}: ${out.info.width}×${out.info.height}, ${(out.data.length / 1024).toFixed(0)} KB`)
