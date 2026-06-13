import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(root, 'public')
mkdirSync(pub, { recursive: true })

// Modern, flat finance icon: pastel gradient with white bar-chart + rising dot.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c9b6f3"/>
      <stop offset="1" stop-color="#f6b3d6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#g)"/>
  <g fill="#ffffff">
    <rect x="150" y="296" width="58" height="126" rx="22"/>
    <rect x="227" y="236" width="58" height="186" rx="22"/>
    <rect x="304" y="166" width="58" height="256" rx="22"/>
  </g>
  <circle cx="333" cy="150" r="27" fill="#ffffff"/>
</svg>`

const buf = Buffer.from(svg)
const targets = [
  ['pwa-192.png', 192],
  ['pwa-512.png', 512],
  ['apple-touch-icon.png', 180],
  ['favicon.png', 48],
]

for (const [name, size] of targets) {
  await sharp(buf).resize(size, size).png().toFile(join(pub, name))
  console.log('wrote', name, size)
}
