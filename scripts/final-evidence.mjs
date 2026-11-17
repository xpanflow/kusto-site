import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const b = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
for (const lang of ["zh", "en"]) {
  const p = await b.newPage({
    viewport: { width: 768, height: 1024 },
    reducedMotion: "reduce",
  });
  await p.goto("http://127.0.0.1:8787" + (lang === "zh" ? "/" : "/en/"));
  await p.screenshot({
    path: `docs/implementation/visual/final-${lang}-tablet.png`,
  });
  await p.setViewportSize({ width: 390, height: 844 });
  await p.screenshot({
    path: `docs/implementation/visual/final-${lang}-full.png`,
    fullPage: true,
  });
  await p.locator(".menu-toggle").click();
  await p.screenshot({
    path: `docs/implementation/visual/final-${lang}-menu.png`,
  });
  await p.close();
}
const p = await b.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await p.goto("http://127.0.0.1:8787/en/");
await p.evaluate(() => (document.body.style.zoom = "2"));
await p.screenshot({ path: "docs/implementation/visual/final-zoom200.png" });
await b.close();
const preview = readFileSync("dist/en/index.html", "utf8"),
  release = readFileSync(".test-site/dist/en/index.html", "utf8");
assert(preview.includes("noindex,nofollow"));
assert(!preview.includes('rel="canonical"'));
assert(release.includes("https://site.example.test/en/"));
assert(release.includes('hreflang="x-default"'));
assert(release.includes("index,follow"));
assert(!release.includes("noindex,nofollow"));
writeFileSync(
  "docs/implementation/seo-validation.json",
  JSON.stringify(
    {
      preview: "noindex; no canonical",
      isolatedRelease:
        "self canonical; alternates; index; HTTPS test origin only in ignored test build",
      timestamp: new Date().toISOString(),
    },
    null,
    2,
  ),
);
console.log("Final viewports and preview/release SEO verified");
