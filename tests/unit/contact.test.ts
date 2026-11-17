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
