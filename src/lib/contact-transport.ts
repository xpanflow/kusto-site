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
): Promise<SubmitResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const r = await fetcher(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (r.status === 429) return { ok: false, kind: "rate" };
    const body: unknown = await r.json();
    if (!body || typeof body !== "object") return { ok: false, kind: "error" };
    const data = body as Record<string, unknown>;
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
