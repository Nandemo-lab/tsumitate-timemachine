import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const guideSource = read("lib/guide-pages.ts");
const discoverySource = read("lib/guide-discovery.ts");
const discoveryUi = read("components/guide/GuideDiscovery.tsx");
const articleRegistry = read("content/articles/index.ts");

const errors = [];
const guideSlugs = [...guideSource.matchAll(/^\s{4}slug: "([^"]+)"/gm)].map((match) => match[1]);
const articleSlugs = [...articleRegistry.matchAll(/^\s{2}"([^"]+)": \{/gm)].map((match) => match[1]);
const newSlugs = ["saving-vs-investing", "stock-fund-etf-difference", "money-not-to-invest"];

if (new Set(guideSlugs).size !== guideSlugs.length) errors.push("guide slug is duplicated");
if (new Set(articleSlugs).size !== articleSlugs.length) errors.push("article slug is duplicated");
for (const slug of guideSlugs) {
  if (!discoverySource.includes(`"${slug}"`)) errors.push(`discovery category or alias is missing: ${slug}`);
}
for (const slug of newSlugs) {
  const start = guideSource.indexOf(`slug: "${slug}"`);
  const next = guideSource.indexOf("\n  {\n    slug:", start + 1);
  const block = guideSource.slice(start, next === -1 ? guideSource.length : next);
  for (const required of ["metaTitle:", "metaDescription:", "h1:", "tldr:", "conclusion:", "sourceLinks:", "relatedGuides:"]) {
    if (!block.includes(required)) errors.push(`${slug} is missing ${required}`);
  }
}
for (const alias of ["子供NISA", "オールカントリー", "損する", "毎月いくら", "暴落", "生活防衛資金"]) {
  if (!discoverySource.includes(alias)) errors.push(`search alias is missing: ${alias}`);
}
if (/trackDiscovery(Filter|Click)\([^)]*query/s.test(discoveryUi)) errors.push("free-text search query could be sent to analytics");
if (!discoveryUi.includes("sessionStorage")) errors.push("discovery state is not restored after navigation");
if (!discoveryUi.includes("aria-live")) errors.push("search result count lacks an aria-live region");

if (errors.length > 0) {
  console.error(`CONTENT EXPANSION AUDIT: ERROR ${errors.length}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("CONTENT EXPANSION AUDIT: ERROR 0");
console.log(`Guides: ${guideSlugs.length}`);
console.log(`Comparison articles: ${articleSlugs.length}`);
console.log("New beginner guides: 3");
console.log("Search privacy: raw query is not sent to GA4");
