const base = process.argv[2] ?? "http://127.0.0.1:4321";
const sitemap = await fetch(`${base}/sitemap.xml`).then((response) => {
  if (!response.ok) throw new Error(`sitemap HTTP ${response.status}`);
  return response.text();
});
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const failures = [];
let breadcrumbPages = 0;
let checkedLinks = 0;

for (const absoluteUrl of urls) {
  const path = new URL(absoluteUrl).pathname;
  const response = await fetch(`${base}${path}`);
  if (!response.ok) {
    failures.push(`${path}: HTTP ${response.status}`);
    continue;
  }
  const html = await response.text();
  const nav = html.match(/<nav[^>]*data-breadcrumbs[^>]*>([\s\S]*?)<\/nav>/);
  if (!nav) continue;
  breadcrumbPages += 1;
  const hrefs = [...nav[1].matchAll(/href="([^"]+)"[^>]*data-breadcrumb-link|data-breadcrumb-link[^>]*href="([^"]+)"/g)]
    .map((match) => match[1] ?? match[2]);
  if (!hrefs.includes("/")) failures.push(`${path}: ホームリンクなし`);
  for (const href of hrefs) {
    checkedLinks += 1;
    const target = new URL(href, base);
    const targetResponse = await fetch(target);
    if (!targetResponse.ok) failures.push(`${path} -> ${target.pathname}: HTTP ${targetResponse.status}`);
  }
}

console.log(`Breadcrumb audit: ${breadcrumbPages} pages / ${checkedLinks} links`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("✓ すべてのパンくずリンクが実在ページへ到達");
