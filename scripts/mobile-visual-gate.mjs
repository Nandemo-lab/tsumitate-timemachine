import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const base = 'http://127.0.0.1:3000'
const pages = [
  '/', '/compare/orukan-vs-sp500', '/compare/orukan-vs-nasdaq100',
  '/compare/vti-vs-sp500', '/simulate/orcan/2024',
  '/simulate/orcan/2024?amount=50000',
  '/share?f=orcan&y=2024&m=1&ey=2026&em=9&a=50000',
  '/share?f=orcan&y=2024&m=1&ey=2026&em=9&a=10000',
  '/share?f=orcan&y=2024&m=1&ey=2026&em=9&a=30000',
  '/share?f=orcan&y=2024&m=1&ey=2026&em=9&a=100000',
  '/share?f=orcan&fb=sp500&y=2024&m=1&ey=2026&em=9&a=50000',
  '/share?f=orcan&y=2024&m=1&ey=2026&em=9&a=0',
  '/guide/orukan-ippon-de-ii',
  '/tools/own-data',
]
const widths = [375, 390, 430]
const results = []
await mkdir('mobile-evidence', { recursive: true })
const browser = await chromium.launch({ headless: true })
try {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
    for (const path of pages) {
      const page = await context.newPage()
      await page.addInitScript(() => {
        window.__mobileVitals = { lcpMs: null, cls: 0 }
        new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__mobileVitals.lcpMs = Math.round(entry.startTime) }).observe({ type: 'largest-contentful-paint', buffered: true })
        new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__mobileVitals.cls += entry.value }).observe({ type: 'layout-shift', buffered: true })
      })
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
      const response = await page.goto(base + path, { waitUntil: 'networkidle' })
      // Trigger lazy-loaded images before asserting that visible assets work.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
          scrollTo(0, y)
          await new Promise(resolve => setTimeout(resolve, 30))
        }
        scrollTo(0, 0)
      })
      await page.waitForLoadState('networkidle')
      if (path === '/tools/own-data') {
        await page.locator('#own-returns').fill('2025-01,10\n2025-02,-10')
        await page.getByRole('button', { name: '端末内で計算' }).click()
      }
      const layout = await page.evaluate(async () => ({
        viewport: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        labVitals: window.__mobileVitals,
        brokenImages: (await Promise.all([...new Set([...document.images].map(image => image.currentSrc).filter(Boolean))].map(src => new Promise(resolve => {
          const image = new Image()
          image.onload = () => resolve(null)
          image.onerror = () => resolve(src)
          image.src = src
        })))).filter(Boolean),
        tables: [...document.querySelectorAll('table')].map(table => ({ width: Math.round(table.getBoundingClientRect().width), parentWidth: Math.round(table.parentElement.getBoundingClientRect().width), scrollable: table.parentElement.scrollWidth > table.parentElement.clientWidth })),
        buttons: [...document.querySelectorAll('a, button')].filter(element => element.getBoundingClientRect().width > 0).length,
        text: document.body.innerText,
        ogDescription: document.querySelector('meta[property="og:description"]')?.content || '',
        bytes: performance.getEntriesByType('resource').reduce((n, r) => n + (r.transferSize || 0), 0),
      }))
      const slug = path === '/' ? 'home' : path.replace(/\W+/g, '-').replace(/^-|-$/g, '')
      await page.screenshot({ path: `mobile-evidence/${slug}-${width}.png`, fullPage: true })
      const amountChecks = new Map([
        ['10000', ['毎月1万円', '33万円']],
        ['30000', ['毎月3万円', '99万円']],
        ['50000', ['毎月5万円', '165万円']],
        ['100000', ['毎月10万円', '330万円']],
      ])
      const shareAmount = path.startsWith('/share') && amountChecks.get(new URLSearchParams(path.split('?')[1]).get('a'))
      const resultVisible = path === '/tools/own-data'
        ? layout.text.includes('60,000円') && layout.text.includes('56,700円') && layout.text.includes('元本割れ月数')
        : path.includes('amount=50000')
        ? layout.text.includes('毎月5万円') && layout.text.includes('165万円') && layout.text.includes('221万円')
        : path.includes('a=0') ? layout.text.includes('共有条件を確認できません')
          : shareAmount ? layout.text.includes(shareAmount[0]) && layout.text.includes(shareAmount[1]) && layout.text.includes('期間末評価額') && (!path.includes('fb=sp500') || layout.text.includes('S&P500'))
            : true
      const ogAccurate = !path.startsWith('/share') || (!layout.ogDescription.includes('3万円') && !layout.ogDescription.includes('30000'))
      const { text, ...metrics } = layout
      results.push({ path, width, status: response?.status(), ...metrics, resultVisible, ogAccurate, errors })
      await page.close()
    }
    await context.close()
  }
} finally { await browser.close() }
await writeFile('mobile-evidence/results.json', JSON.stringify(results, null, 2))
console.log(JSON.stringify(results, null, 2))
if (results.some(result => result.status !== 200 || result.documentWidth > result.viewport + 1 || result.brokenImages.length || result.errors.length || !result.resultVisible || !result.ogAccurate)) process.exitCode = 1
