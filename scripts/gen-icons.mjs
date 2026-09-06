/**
 * Generates the PWA app icons as PNGs. No image libraries in the toolchain,
 * so this rasterises a few rounded rectangles by hand and writes the PNG
 * chunks directly. Run with `node scripts/gen-icons.mjs`.
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'

const BG = [14, 16, 19]
const FG = [110, 231, 183]

function crc32(buf) {
  let c
  const table = []
  for (let n = 0; n < 256; n++) {
    c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  let crc = 0xffffffff
  for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function png(size, pixels) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // truecolour
  const raw = Buffer.alloc(size * (size * 3 + 1))
  let p = 0
  for (let y = 0; y < size; y++) {
    raw[p++] = 0 // no filter
    for (let x = 0; x < size; x++) {
      const [r, g, b] = pixels[y * size + x]
      raw[p++] = r
      raw[p++] = g
      raw[p++] = b
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/** Signed distance to a rounded rect, used for cheap antialiasing. */
function roundRectDist(x, y, cx, cy, hw, hh, r) {
  const dx = Math.abs(x - cx) - (hw - r)
  const dy = Math.abs(y - cy) - (hh - r)
  const ox = Math.max(dx, 0)
  const oy = Math.max(dy, 0)
  return Math.hypot(ox, oy) + Math.min(Math.max(dx, dy), 0) - r
}

function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ]
}

function render(size) {
  const s = size / 24 // work in the same 24-unit grid as the app's glyphs
  const pixels = new Array(size * size)
  // Dumbbell: two plates plus a connecting bar, kept inside the maskable
  // safe zone so Android's circular mask doesn't clip it.
  const shapes = [
    { cx: 12, cy: 12, hw: 5.6, hh: 0.95, r: 0.45 }, // bar
    { cx: 5.6, cy: 12, hw: 1.5, hh: 3.9, r: 0.75 }, // left plate
    { cx: 18.4, cy: 12, hw: 1.5, hh: 3.9, r: 0.75 }, // right plate
  ]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const ux = (x + 0.5) / s
      const uy = (y + 0.5) / s
      let d = Infinity
      for (const sh of shapes) {
        d = Math.min(d, roundRectDist(ux, uy, sh.cx, sh.cy, sh.hw, sh.hh, sh.r))
      }
      const aa = 1.2 / s // ~1px feather
      const t = Math.min(1, Math.max(0, 0.5 - d / aa))
      pixels[y * size + x] = t > 0 ? mix(BG, FG, t) : BG
    }
  }
  return pixels
}

for (const size of [192, 512]) {
  writeFileSync(`public/icon-${size}.png`, png(size, render(size)))
  console.log(`public/icon-${size}.png`)
}
