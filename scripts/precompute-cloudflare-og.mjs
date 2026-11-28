import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

// Run after Next and OpenNext builds, against a local Next server from the
// exact same build. No index returns or investment figures are recalculated.
const origin = process.env.OG_SOURCE_ORIGIN
if (!origin || !/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
  throw new Error('OG_SOURCE_ORIGIN must be a local Next server on 127.0.0.1')
}
const root = process.cwd()
const manifest = JSON.parse(await readFile(join(root, '.next/prerender-manifest.json'), 'utf8'))
const sourceRoot = join(root, '.next/server/app')
const assetsRoot = join(root, '.open-next/assets')
const imageRoot = join(assetsRoot, 'og-static')
await mkdir(imageRoot, { recursive: true })
const canonical = (raw) => {
  const cleaned = raw.replaceAll('&amp;', '&').replaceAll('\\u0026', '&').replace(/\\+$/, '')
  const url = new URL(cleaned)
  if (url.hostname !== 'tsumitate-timemachine.com' || url.pathname !== '/api/og') throw new Error('Unexpected OG origin')
  url.searchParams.sort()
  return url.searchParams.toString()
}
const originalUrls = new Set(['static=1'])
for (const [route, metadata] of Object.entries(manifest.routes)) {
  if (metadata.routeType !== 'page' || metadata.compute !== 'static') continue
  const relative = route === '/' ? 'index' : route.slice(1)
  const html = await readFile(join(sourceRoot, `${relative}.html`), 'utf8')
  for (const match of html.matchAll(/https:\/\/tsumitate-timemachine\.com\/api\/og\?[^"'<\s]+/g)) {
    originalUrls.add(canonical(match[0]))
  }
}
if (originalUrls.size < 30) throw new Error(`Only ${originalUrls.size} OG variants found; metadata extraction may be broken`)

const images = {}
for (const query of [...originalUrls].sort()) {
  const response = await fetch(`${origin}/api/og?${query}`, { signal: AbortSignal.timeout(45000) })
  const bytes = new Uint8Array(await response.arrayBuffer())
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/png') || bytes.length < 1000) {
    throw new Error(`OG generation failed for ${query}: ${response.status} ${response.headers.get('content-type')}`)
  }
  const file = `${createHash('sha256').update(query).digest('hex').slice(0,20)}.png`
  await writeFile(join(imageRoot, file), bytes)
  images[query] = `/og-static/${file}`
}
await writeFile(join(root, '.open-next/og-static-map.json'), JSON.stringify(images))
console.log(`Generated ${Object.keys(images).length} exact OG images; default ${images['static=1']}`)
