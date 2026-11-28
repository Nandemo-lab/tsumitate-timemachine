import ogImages from './.open-next/og-static-map.json'
import staticRoutes from './.open-next/static-route-map.json'

const knownStaticRoutes = new Set(staticRoutes)

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const preview = env.PREVIEW_MODE !== 'false'
    if (url.pathname === '/robots.txt' && preview) {
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
      if (preview) headers.set('X-Robots-Tag', 'noindex, nofollow')
      if (!exact) headers.set('X-OG-Fallback', 'generic')
      return new Response(response.body, { status: response.status, headers })
    }
    // Public pages are static. The development-only /admin/seo must remain
    // unavailable, and no request may boot an OpenNext server on Free.
    const pathname = url.pathname.replace(/\/$/, '') || '/'
    if (!knownStaticRoutes.has(pathname) && !pathname.startsWith('/_next/') &&
        !pathname.startsWith('/og-static/')) {
      return new Response('<!doctype html><html lang="ja"><meta charset="utf-8"><title>ページが見つかりません</title><main><h1>ページが見つかりません</h1><a href="/">トップへ</a></main></html>', {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' },
      })
    }
    const response = await env.ASSETS.fetch(request)
    const headers = new Headers(response.headers)
    if (preview) headers.set('X-Robots-Tag', 'noindex, nofollow')
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
  },
}
