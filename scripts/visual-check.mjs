import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
const step = process.argv[2],
  target = process.argv[3] || "";
const root = "docs/implementation/visual";
mkdirSync(root, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const results = [];
for (const [locale, path] of [
  ["zh", "/"],
  ["en", "/en/"],
])
  for (const [size, width, height] of [
    ["desktop", 1440, 900],
    ["mobile", 390, 844],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    const errors = [];
    const remote = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (
        !r.url().startsWith("http://127.0.0.1:") &&
        !r.url().startsWith("data:")
      )
        remote.push(r.url());
    });
    await page.goto(
      (process.env.VISUAL_URL || "http://127.0.0.1:4321") + path,
      { waitUntil: "networkidle" },
    );
    if (target)
      await page.locator(target).evaluate((el) =>
        window.scrollTo({
          top: el.getBoundingClientRect().top + scrollY - 76,
          behavior: "instant",
        }),
      );
    await page.screenshot({ path: `${root}/${step}-${locale}-${size}.png` });
    results.push({
      locale,
      size,
      errors,
      remote,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    });
    await page.close();
  }
await browser.close();
writeFileSync(
  `${root}/${step}.json`,
  JSON.stringify(
    { step, time: new Date().toISOString(), target, results },
    null,
    2,
  ),
);
if (results.some((r) => r.errors.length || r.overflow)) {
  console.log(results);
  process.exitCode = 1;
}
