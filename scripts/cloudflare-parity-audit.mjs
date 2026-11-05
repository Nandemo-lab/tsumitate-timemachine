const productionBase = process.argv[2] ?? "https://tsumitate-timemachine.com";
const candidateBase = process.argv[3] ?? "http://127.0.0.1:8788";

const sitemapResponse = await fetch(`${productionBase}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`production sitemap HTTP ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const failures = [];

function readTag(html, pattern) {
  return html.match(pattern)?.[1] ?? "";
}

function readCanonical(html) {
  return (
    readTag(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i) ||
    readTag(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical/i)
  );
}

let cursor = 0;
async function checkNext() {
  while (cursor < paths.length) {
    const path = paths[cursor++];
    try {
      const [productionResponse, candidateResponse] = await Promise.all([
        fetch(`${productionBase}${path}`),
        fetch(`${candidateBase}${path}`),
      ]);
      const [productionHtml, candidateHtml] = await Promise.all([
        productionResponse.text(),
        candidateResponse.text(),
      ]);
      const productionTitle = readTag(productionHtml, /<title>([^<]*)<\/title>/i);
      const candidateTitle = readTag(candidateHtml, /<title>([^<]*)<\/title>/i);
      const productionCanonical = readCanonical(productionHtml);
      const candidateCanonical = readCanonical(candidateHtml);
      const productionJsonLd = (productionHtml.match(/application\/ld\+json/g) ?? []).length;
      const candidateJsonLd = (candidateHtml.match(/application\/ld\+json/g) ?? []).length;

      if (
        productionResponse.status !== candidateResponse.status ||
        productionTitle !== candidateTitle ||
        productionCanonical !== candidateCanonical ||
        productionJsonLd !== candidateJsonLd
      ) {
        failures.push({
          path,
          status: `${productionResponse.status} -> ${candidateResponse.status}`,
          title: productionTitle === candidateTitle,
          canonical: productionCanonical === candidateCanonical,
          jsonLd: `${productionJsonLd} -> ${candidateJsonLd}`,
        });
      }
    } catch (error) {
      failures.push({ path, error: String(error) });
    }
  }
}

await Promise.all(Array.from({ length: 8 }, () => checkNext()));

const ogCases = [
  ["single", "/api/og?fund=orcan&year=2020&month=1&amount=30000", 200],
  ["compare", "/api/og?fund=orcan&fundB=sp500&year=2020&month=1&amount=30000", 200],
  ["G-quality boundary", "/api/og?fund=schd&year=2020&month=1&amount=30000", 422],
];
for (const [name, path, expectedStatus] of ogCases) {
  const response = await fetch(`${candidateBase}${path}`);
  if (response.status !== expectedStatus) {
    failures.push({ path, error: `${name}: expected ${expectedStatus}, got ${response.status}` });
  }
}

console.log(`Cloudflare parity audit: ${paths.length} sitemap URLs`);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
console.log("PASS: HTTP status, title, canonical, JSON-LD, dynamic OGP, and G-quality boundary match");
