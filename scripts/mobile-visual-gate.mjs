import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const base = 'http://127.0.0.1:3000'
const pages = [
  '/', '/compare/orukan-vs-sp500', '/compare/orukan-vs-nasdaq100',
  '/compare/vti-vs-sp500', '/simulate/orcan/2024',
  '/guide/orukan-ippon-de-ii',
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
      const layout = await page.evaluate(async () => ({
        viewport: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        brokenImages: (await Promise.all([...new Set([...document.images].map(image => image.currentSrc).filter(Boolean))].map(src => new Promise(resolve => {
          const image = new Image()
          image.onload = () => resolve(null)
          image.onerror = () => resolve(src)
          image.src = src
        })))).filter(Boolean),
        tables: [...document.querySelectorAll('table')].map(table => ({ width: Math.round(table.getBoundingClientRect().width), parentWidth: Math.round(table.parentElement.getBoundingClientRect().width), scrollable: table.parentElement.scrollWidth > table.parentElement.clientWidth })),
        buttons: [...document.querySelectorAll('a, button')].filter(element => element.getBoundingClientRect().width > 0).length,
      }))
      const slug = path === '/' ? 'home' : path.replace(/\W+/g, '-').replace(/^-|-$/g, '')
      await page.screenshot({ path: `mobile-evidence/${slug}-${width}.png`, fullPage: true })
      results.push({ path, width, status: response?.status(), ...layout, errors })
      await page.close()
    }
    await context.close()
  }
} finally { await browser.close() }
await writeFile('mobile-evidence/results.json', JSON.stringify(results, null, 2))
console.log(JSON.stringify(results, null, 2))
if (results.some(result => result.status !== 200 || result.documentWidth > result.viewport + 1 || result.brokenImages.length || result.errors.length)) process.exitCode = 1
