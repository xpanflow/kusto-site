import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const b = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
await p.goto("http://127.0.0.1:4321/en/");
await p.waitForSelector(".journey-enhanced");
for (const [name, fraction] of [
  ["start", 0],
  ["middle", 0.6],
  ["end", 1],
  ["reverse", 0],
]) {
  await p.evaluate((f) => {
    const j = document.querySelector("#journey");
    scrollTo(0, j.offsetTop + (j.offsetHeight - innerHeight) * f);
  }, fraction);
  await p.waitForTimeout(700);
  await p.screenshot({
    path: `docs/implementation/visual/06-motion-${name}.png`,
  });
}
for (const width of [390, 1440, 390]) {
  await p.setViewportSize({ width, height: 844 });
  await p.waitForTimeout(200);
  assert.equal(
    await p.locator(".journey-enhanced").count(),
    width >= 1024 ? 1 : 0,
  );
}
await p.setViewportSize({ width: 1440, height: 900 });
await p.emulateMedia({ reducedMotion: "reduce" });
await p.waitForTimeout(200);
assert.equal(await p.locator(".journey-enhanced").count(), 0);
await p.goto("http://127.0.0.1:4321/en/#finance");
assert(await p.evaluate(() => scrollY > 0));
assert.deepEqual(errors, []);
await b.close();
console.log(
  "journey: scroll/reverse, resize, reduced motion, deep link passed",
);
