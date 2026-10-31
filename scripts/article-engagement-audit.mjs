import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const analytics = read("lib/analytics.ts");
const tracker = read("components/analytics/ArticleEngagementTracker.tsx");
const journey = read("components/editorial/ReadingJourney.tsx");
const article = read("app/articles/[slug]/page.tsx");
const guide = read("app/guide/[slug]/page.tsx");

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

for (const event of ["article_view", "article_end_reached", "related_article_click", "article_to_simulation"]) {
  assert(analytics.includes(`track(\"${event}\"`), `${event} is not defined`);
}
assert(analytics.includes('window.location.hostname !== "tsumitate-timemachine.com"'), "events are not production-host limited");
for (const forbidden of ["monthly_amount", "final_value", "profit", "return_rate", "email", "name"]) {
  const editorialSection = analytics.slice(analytics.indexOf("trackArticleView"));
  assert(!editorialSection.includes(forbidden), `editorial event leaks ${forbidden}`);
}
assert(tracker.includes("IntersectionObserver"), "article end is not observed in the rendered page");
assert(tracker.includes("endTracked.current"), "article end event has no duplicate guard");
assert(tracker.includes("viewTracked.current"), "article view event has no duplicate guard");
assert(journey.includes("trackRelatedArticleClick"), "related article clicks are not tracked");
assert(article.includes('contentType="article"') && article.includes('sourceType="article"'), "article template is not instrumented");
assert(guide.includes('contentType="guide"') && guide.includes('sourceType="guide"'), "guide template is not instrumented");

console.log("Article engagement audit: PASS");
