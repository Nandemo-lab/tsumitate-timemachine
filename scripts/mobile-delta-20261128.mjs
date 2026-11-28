import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const base = 'http://127.0.0.1:3000'
const paths = [
  '/compare/orukan-vs-nasdaq100',
  '/compare/orukan-vs-sp500',
  '/compare/vti-vs-sp500',
  '/compare/schd-vs-vym',
]
const widths = [375, 390, 430]
const results = []
await mkdir('mobile-delta-evidence', { recursive: true })
const browser = await chromium.launch({ headless: true })
try {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
    for (const path of paths) {
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
      const response = await page.goto(base + path, { waitUntil: 'networkidle' })
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
        tables: [...document.querySelectorAll('table')].map(table => ({
          width: Math.round(table.getBoundingClientRect().width),
          containerWidth: Math.round(table.parentElement.getBoundingClientRect().width),
          scrollable: table.parentElement.scrollWidth > table.parentElement.clientWidth,
        })),
        compareCta: [...document.querySelectorAll('a')].some(a => a.textContent?.includes('同じ2商品で条件を変える')),
        unapprovedAspLinks: [...document.querySelectorAll('a[href]')].map(a => a.href).filter(href => /(?:px\.a8\.net|h\.accesstrade\.net|af\.moshimo\.com)/i.test(href)),
      }))
      const jump = page.getByRole('link', { name: '途中経過と判定条件を見る' })
      let riskJumpVisible = false
      if (await jump.count()) {
        await jump.click()
        riskJumpVisible = await page.locator('#risk-path').evaluate(element => element.getBoundingClientRect().top < innerHeight && element.getBoundingClientRect().bottom > 0)
      }
      const slug = path.replace(/\W+/g, '-').replace(/^-|-$/g, '')
      await page.screenshot({ path: `mobile-delta-evidence/${slug}-${width}.png`, fullPage: true })
      results.push({ path, width, status: response?.status(), ...layout, riskJumpVisible, errors })
      await page.close()
    }
    await context.close()
  }
} finally { await browser.close() }
await writeFile('mobile-delta-evidence/results.json', JSON.stringify(results, null, 2))
console.log(JSON.stringify(results, null, 2))
if (results.some(r => r.status !== 200 || r.documentWidth > r.viewport + 1 || r.brokenImages.length || r.errors.length || !r.compareCta || !r.riskJumpVisible || r.unapprovedAspLinks.length || r.tables.some(t => t.width > t.containerWidth && !t.scrollable))) process.exitCode = 1
