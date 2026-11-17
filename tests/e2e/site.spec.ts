import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const path of ["/", "/en/"])
  for (const width of [320, 390, 768, 1440])
    test(`${path} ${width} navigation and examples`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      const remote: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("request", (r) => {
        if (!r.url().startsWith("http://127.0.0.1")) remote.push(r.url());
      });
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        path === "/" ? "zh-CN" : "en",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (width < 768) {
        await page.locator(".menu-toggle").click();
        await expect(page.locator(".menu-toggle")).toHaveAttribute(
          "aria-expanded",
          "true",
        );
        await page.keyboard.press("Escape");
        await expect(page.locator(".menu-toggle")).toBeFocused();
        await expect(page.locator(".menu-toggle")).toHaveAttribute(
          "aria-expanded",
          "false",
        );
      }
      for (const [root, id] of [
        ["workflow", "multi"],
        ["ai", "task-1"],
        ["ai", "task-2"],
        ["tracking", "air"],
      ]) {
        await page.locator(`#${root} [data-choice="${id}"]`).click();
        await expect(
          page.locator(`#${root} [data-panel="${id}"]`),
        ).toBeVisible();
      }
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      await page.locator('[data-intent="trial"]').first().click();
      await expect(page.locator('[name="intent"]')).toHaveValue("trial");
      await expect(page.locator("[name=name]")).toBeDisabled();
      await page.locator("#faq summary").first().click();
      await expect(page.locator("#faq details").first()).toHaveAttribute(
        "open",
        "",
      );
      await page.goto(path + "#finance");
      if (width < 768) await page.locator(".menu-toggle").click();
      await page.locator("[data-language]").click();
      expect(page.url()).toContain("#finance");
      expect(errors).toEqual([]);
      expect(remote).toEqual([]);
    });
test("no JS and animation failure retain all content", async ({ browser }) => {
  for (const js of [false, true]) {
    const page = await browser.newPage({
      javaScriptEnabled: js,
      viewport: { width: 390, height: 844 },
    });
    if (js) await page.route("**/*.js", (r) => r.abort());
    await page.goto("http://127.0.0.1:4322/en/");
    await expect(page.locator("h1")).toBeVisible();
    await page.locator(".menu-toggle").click();
    await expect(page.locator("#site-nav")).toBeVisible();
    await expect(page.locator("#contact")).toBeVisible();
    await expect(page.locator("[name=name]")).toBeDisabled();
    await page.close();
  }
});
test("reduced motion, resize, scroll reversal", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en/");
  await expect(page.locator(".journey-enhanced")).toHaveCount(1);
  await page.locator("#workflow").scrollIntoViewIfNeeded();
  await page.evaluate(() => scrollTo(0, 0));
  for (const width of [390, 1440, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.locator(".journey-enhanced")).toHaveCount(
      width === 1440 ? 1 : 0,
    );
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator(".journey-enhanced")).toHaveCount(0);
});
test("accessibility both languages and 200% layout", async ({ page }) => {
  for (const path of ["/", "/en/"]) {
    await page.goto(path);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations).toEqual([]);
    await page.evaluate(() => (document.body.style.zoom = "2"));
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
