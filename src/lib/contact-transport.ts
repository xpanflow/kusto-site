import type { SiteConfig } from "./site-config";
import {
  limits,
  type FieldErrors,
  type Field,
  type ErrorCode,
} from "./contact-validation";
export type SubmitResult =
  { ok: true } | { ok: false; kind: "rate" | "error"; fields?: FieldErrors };
export async function sendContact(
  endpoint: string,
  payload: unknown,
  timeoutMs: number,
  fetcher: typeof fetch = fetch,
  transport: SiteConfig["form"]["transport"] = "json",
): Promise<SubmitResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let dataToSend = payload;
    if (transport === "formspree" && payload && typeof payload === "object") {
      const { email, ...rest } = payload as Record<string, unknown>;
      // An omitted email allows WeChat-only requests; never invent an address.
      dataToSend = {
        ...rest,
        ...(email ? { email } : {}),
        _subject: "KustoCargo — Demo / trial request",
      };
    }
    const r = await fetcher(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(dataToSend),
      signal: controller.signal,
    });
    if (r.status === 429) return { ok: false, kind: "rate" };
    const body: unknown = await r.json();
    if (!body || typeof body !== "object") return { ok: false, kind: "error" };
    const data = body as Record<string, unknown>;
    if (transport === "formspree") {
      // Formspree's official @formspree/core client identifies success by `next`.
      // Treat it as confirmation only; never navigate to a response-supplied URL.
      if (
        (r.status === 200 || r.status === 201) &&
        typeof data.next === "string" &&
        data.next.trim() &&
        data.ok !== false &&
        !Object.hasOwn(data, "errors") &&
        !Object.hasOwn(data, "error")
      )
        return { ok: true };
      const fields: FieldErrors = {};
      if ([400, 422].includes(r.status) && Array.isArray(data.errors)) {
        for (const error of data.errors) {
          if (!error || typeof error !== "object") continue;
          const { field, code } = error as Record<string, unknown>;
          if (typeof field !== "string" || !Object.hasOwn(limits, field))
            continue;
          const localCode =
            code === "REQUIRED_FIELD_EMPTY" || code === "REQUIRED_FIELD_MISSING"
              ? "required"
              : code === "TYPE_EMAIL" ||
                  code === "TYPE_TEXT" ||
                  code === "TYPE_NUMERIC"
                ? "invalid"
                : undefined;
          if (localCode) fields[field as Field] = localCode;
        }
      }
      return { ok: false, kind: "error", fields };
    }
    if (
      (r.status === 200 || r.status === 201) &&
      data.ok === true &&
      typeof data.submissionId === "string" &&
      data.submissionId.trim()
    )
      return { ok: true };
    const fields: FieldErrors = {};
    if (
      [400, 422].includes(r.status) &&
      data.ok === false &&
      data.code === "VALIDATION_ERROR" &&
      data.fieldErrors &&
      typeof data.fieldErrors === "object"
    )
      for (const [field, code] of Object.entries(data.fieldErrors)) {
        if (
          Object.hasOwn(limits, field) &&
          ["required", "invalid", "long", "group"].includes(String(code))
        )
          fields[field as Field] = code as ErrorCode;
      }
    return { ok: false, kind: "error", fields };
  } catch {
    return { ok: false, kind: "error" };
  } finally {
    clearTimeout(timer);
  }
}
