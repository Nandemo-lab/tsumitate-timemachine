import app from './.open-next/worker.js'
import ogImages from './.open-next/og-static-map.json'

export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from './.open-next/worker.js'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    if (url.pathname === '/robots.txt') {
      return new Response('User-agent: *\nDisallow: /\n', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' },
      })
    }
    if (url.pathname === '/api/og') {
      url.searchParams.sort()
      const exact = ogImages[url.searchParams.toString()]
      const image = exact || ogImages['static=1']
      const assetUrl = new URL(image, url)
      const response = await env.ASSETS.fetch(new Request(assetUrl, request))
      const headers = new Headers(response.headers)
      headers.set('Content-Type', 'image/png')
      headers.set('X-Robots-Tag', 'noindex, nofollow')
      if (!exact) headers.set('X-OG-Fallback', 'generic')
      return new Response(response.body, { status: response.status, headers })
    }
    const response = await app.fetch(request, env, ctx)
    const headers = new Headers(response.headers)
    headers.set('X-Robots-Tag', 'noindex, nofollow')
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
  },
}
