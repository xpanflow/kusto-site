export const limits = {
  name: 80,
  company: 120,
  email: 254,
  wechat: 100,
  phone: 40,
  intent: 5,
  message: 2000,
} as const;
export type Field = keyof typeof limits;
export type ContactValues = Record<Field, string>;
export type ErrorCode = "required" | "invalid" | "long" | "group";
export type FieldErrors = Partial<Record<Field, ErrorCode>>;
export function validateContact(input: Partial<ContactValues>) {
  const values = Object.fromEntries(
    Object.keys(limits).map((k) => [k, (input[k as Field] ?? "").trim()]),
  ) as ContactValues;
  const errors: FieldErrors = {};
  for (const field of Object.keys(limits) as Field[])
    if (values[field].length > limits[field]) errors[field] = "long";
  for (const field of ["name", "company"] as const)
    if (!values[field]) errors[field] = "required";
  if (!["demo", "trial"].includes(values.intent)) errors.intent = "invalid";
  if (!values.email && !values.wechat) {
    errors.email = "group";
    errors.wechat = "group";
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "invalid";
  return { values, errors, valid: Object.keys(errors).length === 0 };
}
