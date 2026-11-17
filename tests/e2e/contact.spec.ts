import { test, expect } from "@playwright/test";
const endpoint = "https://forms.example.test/request";
async function fill(page: import("@playwright/test").Page) {
  await page.goto("http://127.0.0.1:4323/en/#contact");
  await page.locator("[name=name]").fill("Example Person");
  await page.locator("[name=company]").fill("Example Company");
  await page.locator("[name=email]").fill("person@example.test");
}
for (const response of [
  "success",
  "422",
  "429",
  "500",
  "timeout",
  "nonjson",
  "incomplete",
  "network",
])
  test(`remote ${response}`, async ({ page }) => {
    const requests: Record<string, unknown>[] = [];
    await page.route(endpoint, async (route) => {
      requests.push(route.request().postDataJSON());
      if (response === "timeout") {
        await new Promise((r) => setTimeout(r, 500));
        return route.abort();
      }
      if (response === "network") return route.abort();
      const status =
        response === "422"
          ? 422
          : response === "429"
            ? 429
            : response === "500"
              ? 500
              : 200;
      await route.fulfill({
        status,
        contentType: response === "nonjson" ? "text/html" : "application/json",
        body:
          response === "nonjson"
            ? "<p>error</p>"
            : JSON.stringify(
                response === "success"
                  ? { ok: true, submissionId: "test-id" }
                  : response === "422"
                    ? {
                        ok: false,
                        code: "VALIDATION_ERROR",
                        fieldErrors: { email: "invalid" },
                      }
                    : { ok: true },
              ),
      });
    });
    await fill(page);
    await page.locator("[type=submit]").click();
    await expect(page.locator("[data-contact]")).toHaveAttribute(
      "data-state",
      response === "success" ? "success" : "error",
    );
    if (response === "422" || response === "success")
      await page
        .locator("form")
        .screenshot({
          path: `docs/implementation/visual/11-remote-${response}.png`,
        });
    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({
      schemaVersion: 1,
      locale: "en",
      source: "kusto-cargo-site",
      email: "person@example.test",
      wechat: "",
      intent: "demo",
    });
    if (response === "success") {
      await expect(page.locator("[name=name]")).toHaveValue("");
    } else {
      await expect(page.locator("[name=name]")).toHaveValue("Example Person");
      await page.locator("[type=submit]").click();
      await expect(page.locator("[data-contact]")).toHaveAttribute(
        "data-state",
        "error",
      );
      expect(requests[1]?.requestId).toBe(requests[0]?.requestId);
      await page.locator("[name=company]").fill("Changed company");
      await page.locator("[type=submit]").click();
      await expect(page.locator("[data-contact]")).toHaveAttribute(
        "data-state",
        "error",
      );
      expect(requests[2]?.requestId).not.toBe(requests[0]?.requestId);
      if (response === "422")
        await expect(page.locator("[name=email]")).toBeFocused();
    }
  });
test("validation and duplicate lock", async ({ page }) => {
  let count = 0;
  await page.route(endpoint, async (route) => {
    count++;
    await new Promise((r) => setTimeout(r, 100));
    await route.fulfill({ json: { ok: true, submissionId: "id" } });
  });
  await fill(page);
  await page.locator("[name=email]").fill("");
  await page.locator("[type=submit]").click();
  await expect(page.locator("[name=email]")).toBeFocused();
  expect(count).toBe(0);
  await page.locator("[name=wechat]").fill("example-id");
  await page.locator("form").evaluate((form) => {
    (form as HTMLFormElement).requestSubmit();
    (form as HTMLFormElement).requestSubmit();
  });
  await expect(page.locator("[data-contact]")).toHaveAttribute(
    "data-state",
    "success",
  );
  expect(count).toBe(1);
});
test("default disabled never requests", async ({ page }) => {
  let count = 0;
  page.on("request", (r) => {
    if (r.method() === "POST") count++;
  });
  await page.goto("/#contact");
  await expect(page.locator("[name=name]")).toBeDisabled();
  await page
    .locator("form")
    .evaluate((form) => (form as HTMLFormElement).requestSubmit());
  expect(count).toBe(0);
  await expect(page.locator("[data-contact]")).toHaveAttribute(
    "data-state",
    "disabled",
  );
});
