import { describe, it, expect } from "vitest";
import {
  validateContact,
  limits,
  type Field,
} from "../../src/lib/contact-validation";
import { sendContact } from "../../src/lib/contact-transport";
const base = {
  name: " Test ",
  company: " Example ",
  email: "person@example.test",
  wechat: "",
  phone: "",
  intent: "demo",
  message: "",
};
describe("contact rules", () => {
  it.each([
    { email: "person@example.test", wechat: "" },
    { email: "", wechat: "ID" },
    { email: "person@example.test", wechat: "ID" },
  ])("accepts contact combinations %j", (contact) =>
    expect(validateContact({ ...base, ...contact }).valid).toBe(true),
  );
  it.each([
    { email: "", wechat: "" },
    { email: " ", wechat: " " },
    { email: "", wechat: "", phone: "+49 123" },
    { email: "bad", wechat: "ID" },
    { name: " " },
    { company: "" },
    { intent: "other" },
  ])("rejects invalid payload %j", (data) =>
    expect(validateContact({ ...base, ...data }).valid).toBe(false),
  );
  it("trims before validation", () =>
    expect(validateContact(base).values.name).toBe("Test"));
  it.each(Object.keys(limits) as Field[])("limits %s", (field) =>
    expect(
      validateContact({ ...base, [field]: "x".repeat(limits[field] + 1) })
        .errors[field],
    ).toBeTruthy(),
  );
});
describe("strict response contract", () => {
  it.each([200, 201])("accepts %s with valid JSON", async (status) =>
    expect(
      await sendContact(
        "https://forms.example.test",
        {},
        100,
        async () =>
          new Response(JSON.stringify({ ok: true, submissionId: "id" }), {
            status,
          }),
      ),
    ).toEqual({ ok: true }),
  );
  it.each([
    [200, {}],
    [200, { ok: true }],
    [200, { ok: true, submissionId: " " }],
    [202, { ok: true, submissionId: "id" }],
    [500, {}],
    [
      422,
      {
        ok: false,
        code: "VALIDATION_ERROR",
        fieldErrors: { email: "invalid", unknown: "invalid" },
      },
    ],
    [429, {}],
  ])("rejects %s %j", async (status, body) =>
    expect(
      (
        await sendContact(
          "https://forms.example.test",
          {},
          100,
          async () =>
            new Response(JSON.stringify(body), { status: Number(status) }),
        )
      ).ok,
    ).toBe(false),
  );
  it("rejects non JSON", async () =>
    expect(
      (
        await sendContact(
          "https://forms.example.test",
          {},
          100,
          async () => new Response("html"),
        )
      ).ok,
    ).toBe(false));
  it("aborts timed out requests", async () =>
    expect(
      (
        await sendContact(
          "https://forms.example.test",
          {},
          5,
          async (_, init) =>
            new Promise((_, reject) =>
              init?.signal?.addEventListener("abort", () =>
                reject(new Error("abort")),
              ),
            ),
        )
      ).ok,
    ).toBe(false));
});

describe("Formspree adapter", () => {
  const submit = (status: number, body: unknown) =>
    sendContact(
      "https://formspree.io/f/example",
      {},
      100,
      async () => new Response(JSON.stringify(body), { status }),
      "formspree",
    );
  it.each([200, 201])(
    "accepts Formspree next confirmation (%s)",
    async (status) => {
      expect(
        await submit(status, { next: "https://formspree.io/thanks" }),
      ).toEqual({ ok: true });
    },
  );
  it.each([
    [200, {}],
    [200, { ok: true }],
    [200, { next: "" }],
    [200, { next: "https://example.test", errors: [] }],
    [200, { next: "https://example.test", ok: false }],
    [500, { next: "https://example.test" }],
  ])("rejects unconfirmed Formspree response %s %j", async (status, body) => {
    expect((await submit(Number(status), body)).ok).toBe(false);
  });
  it("maps only known Formspree field codes and ignores arbitrary messages", async () => {
    expect(
      await submit(422, {
        errors: [
          { field: "email", code: "TYPE_EMAIL", message: "untrusted text" },
          { field: "name", code: "REQUIRED_FIELD_MISSING" },
          { field: "unknown", code: "TYPE_TEXT" },
          null,
        ],
      }),
    ).toEqual({
      ok: false,
      kind: "error",
      fields: { email: "invalid", name: "required" },
    });
  });
  it("handles Formspree rate limits", async () => {
    expect(await submit(429, {})).toEqual({ ok: false, kind: "rate" });
  });
  it("sends JSON headers and omits empty email for WeChat-only submissions", async () => {
    let sent: RequestInit | undefined;
    await sendContact(
      "https://formspree.io/f/example",
      { ...base, email: "", wechat: "example-id" },
      100,
      async (_, init) => {
        sent = init;
        return new Response(JSON.stringify({ next: "/thanks" }));
      },
      "formspree",
    );
    expect(sent?.headers).toMatchObject({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    const payload = JSON.parse(String(sent?.body));
    expect(payload.email).toBeUndefined();
    expect(payload.wechat).toBe("example-id");
    expect(payload._subject).toContain("KustoCargo");
  });
});
