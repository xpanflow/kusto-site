import { test, expect } from "@playwright/test";
// Block accidental live submissions. Individual provider tests override this with mocks.
test.beforeEach(async ({ page }) => {
  await page.route("https://formspree.io/**", (route) => route.abort());
});
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
      await page.locator("form").screenshot({
        path: `docs/implementation/visual/formspree-generic-${response}.png`,
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
test("disabled mode never requests", async ({ page }) => {
  await page.route("http://127.0.0.1:4322/", async (route) => {
    const response = await route.fetch();
    const html = (await response.text()).replace(
      "&quot;mode&quot;:&quot;remote&quot;",
      "&quot;mode&quot;:&quot;disabled&quot;",
    );
    await route.fulfill({ response, body: html });
  });
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

for (const path of ["/", "/en/"]) {
  for (const result of [
    "success",
    "field-error",
    "rate",
    "server",
    "nonjson",
    "incomplete",
    "network",
  ]) {
    test(`Formspree ${path} ${result}`, async ({ page }) => {
      const requests: Record<string, unknown>[] = [];
      await page.route("https://formspree.io/f/myewwkwl", async (route) => {
        requests.push(route.request().postDataJSON());
        if (result === "network") return route.abort();
        const status =
          result === "field-error"
            ? 422
            : result === "rate"
              ? 429
              : result === "server"
                ? 500
                : 200;
        await route.fulfill({
          status,
          contentType: result === "nonjson" ? "text/html" : "application/json",
          body:
            result === "nonjson"
              ? "<p>error</p>"
              : JSON.stringify(
                  result === "success"
                    ? { next: "https://formspree.io/thanks" }
                    : result === "field-error"
                      ? {
                          errors: [
                            {
                              field: "email",
                              code: "TYPE_EMAIL",
                              message: "Invalid email",
                            },
                          ],
                        }
                      : {},
                ),
        });
      });
      await page.goto(path + "#contact");
      await page.locator("[name=name]").fill("Example Person");
      await page.locator("[name=company]").fill("Example Company");
      // Check WeChat-only as well as email submissions against the provider adapter.
      if (result === "success")
        await page.locator("[name=wechat]").fill("example-id");
      else await page.locator("[name=email]").fill("person@example.test");
      await page.locator("[type=submit]").click();
      await expect(page.locator("[data-contact]")).toHaveAttribute(
        "data-state",
        result === "success" ? "success" : "error",
      );
      expect(requests).toHaveLength(1);
      expect(requests[0]).toMatchObject({
        source: "kusto-cargo-site",
        locale: path === "/" ? "zh-CN" : "en",
      });
      if (result === "success") {
        expect(requests[0]?.email).toBeUndefined();
        await expect(page.locator("[name=name]")).toHaveValue("");
        await expect(page).toHaveURL(new RegExp("#contact$"));
      } else {
        await expect(page.locator("[name=name]")).toHaveValue("Example Person");
        if (result === "field-error")
          await expect(page.locator("[name=email]")).toBeFocused();
      }
      if (result === "success" || result === "field-error")
        await page
          .locator("form")
          .screenshot({
            path: `docs/implementation/visual/formspree-${path === "/" ? "zh" : "en"}-${result}.png`,
          });
    });
  }
}
