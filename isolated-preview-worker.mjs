import app from './.open-next/worker.js'

export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from './.open-next/worker.js'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    if (url.pathname === '/robots.txt') {
      return new Response('User-agent: *\nDisallow: /\n', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' },
      })
    }
    const response = await app.fetch(request, env, ctx)
    const headers = new Headers(response.headers)
    headers.set('X-Robots-Tag', 'noindex, nofollow')
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
  },
}
