import { copyFile, mkdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

// Isolated preview only. Serve already prerendered public pages as static
// assets, bypassing OpenNext's Worker CPU for ordinary HTML requests.
const root = process.cwd()
const manifest = JSON.parse(await readFile(join(root, '.next/prerender-manifest.json'), 'utf8'))
const sourceRoot = join(root, '.next/server/app')
const assetRoot = join(root, '.open-next/assets')
let pages = 0

for (const [route, metadata] of Object.entries(manifest.routes)) {
  if (metadata.routeType !== 'page' || metadata.compute !== 'static') continue
  const relative = route === '/' ? 'index' : route.slice(1)
  for (const extension of ['html', 'rsc']) {
    const source = join(sourceRoot, `${relative}.${extension}`)
    const destination = join(assetRoot, `${relative}.${extension}`)
    await mkdir(dirname(destination), { recursive: true })
    await copyFile(source, destination)
  }
  pages++
}

if (pages < 98) throw new Error(`Expected at least 98 prerendered pages; found ${pages}`)
await readFile(join(assetRoot, '_headers'), 'utf8').then((headers) => {
  if (!headers.includes('X-Robots-Tag: noindex, nofollow')) {
    throw new Error('Isolated preview must include noindex headers')
  }
})
console.log(`Prepared ${pages} static HTML/RSC route pairs for isolated preview`)
