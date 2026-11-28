import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

// Isolated preview only. Serve already prerendered public pages as static
// assets, bypassing OpenNext's Worker CPU for ordinary HTML requests.
const root = process.cwd()
const manifest = JSON.parse(await readFile(join(root, '.next/prerender-manifest.json'), 'utf8'))
const sourceRoot = join(root, '.next/server/app')
const assetRoot = join(root, '.open-next/assets')
const ogImages = JSON.parse(await readFile(join(root, '.open-next/og-static-map.json'), 'utf8'))
const publicOrigin = process.env.OG_PUBLIC_ORIGIN || 'https://tsumitate-timemachine.com'
const preview = process.env.STATIC_TARGET !== 'production'
if (!/^https:\/\/[a-z0-9.-]+$/.test(publicOrigin)) {
  throw new Error('OG_PUBLIC_ORIGIN must be an HTTPS origin without a path')
}
const canonical = (raw) => {
  const url = new URL(raw.replaceAll('&amp;', '&').replaceAll('\\u0026', '&').replace(/\\+$/, ''))
  url.searchParams.sort()
      return url.searchParams.toString() || 'static=1'
}
let replacedOg = 0
let pages = 0
const staticRoutes = []

for (const [route, metadata] of Object.entries(manifest.routes)) {
  if (metadata.routeType !== 'page' || metadata.compute !== 'static') continue
  const relative = route === '/' ? 'index' : route.slice(1)
  for (const extension of ['html', 'rsc']) {
    const source = join(sourceRoot, `${relative}.${extension}`)
    const destination = join(assetRoot, `${relative}.${extension}`)
    await mkdir(dirname(destination), { recursive: true })
    const contents = await readFile(source, 'utf8')
    const replaced = contents.replace(/https:\/\/tsumitate-timemachine\.com\/api\/og(?:\?[^"'<\s]+)?/g, (url) => {
      const image = ogImages[canonical(url)]
      if (!image) throw new Error(`Missing precomputed OG image for ${route}`)
      replacedOg++
      // RSC flight data is embedded in a JavaScript string. The URL matcher
      // includes its trailing escaped quote; keep those backslashes intact.
      const escapedQuote = url.match(/\\+$/)?.[0] || ''
      return `${publicOrigin}${image}${escapedQuote}`
    })
    await writeFile(destination, replaced)
  }
  pages++
  staticRoutes.push(route)
}

if (pages < 98) throw new Error(`Expected at least 98 prerendered pages; found ${pages}`)
if (replacedOg < 98) throw new Error(`Only ${replacedOg} OG references replaced`)
const headers = await readFile(join(assetRoot, '_headers'), 'utf8').catch(() => '')
if (preview && !headers.includes('X-Robots-Tag: noindex, nofollow')) {
  throw new Error('Isolated preview must include noindex headers')
}
if (!preview && headers.includes('noindex')) {
  throw new Error('Production assets must not contain preview noindex headers; rebuild from a clean output')
}
const robots = preview
  ? 'User-agent: *\nDisallow: /\n'
  : await readFile(join(sourceRoot, 'robots.txt.body'), 'utf8')
await writeFile(join(assetRoot, 'robots.txt'), robots)
await writeFile(join(assetRoot, 'sitemap.xml'), await readFile(join(sourceRoot, 'sitemap.xml.body')))
await writeFile(join(root, '.open-next/static-route-map.json'), JSON.stringify(staticRoutes))
console.log(`Prepared ${pages} static HTML/RSC route pairs and ${replacedOg} OG references`)
