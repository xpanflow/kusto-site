import { zh, zhUI } from "../content/zh";
import { en, enUI } from "../content/en";
import type { Locale } from "./site-config";
export const sections = [
  "journey",
  "workflow",
  "collaboration",
  "finance",
  "ai",
  "tracking",
  "mcp",
  "deployment",
  "faq",
  "contact",
] as const;
export const content = (locale: Locale) =>
  locale === "zh-CN" ? { copy: zh, ui: zhUI } : { copy: en, ui: enUI };
export const languagePath = (locale: Locale) =>
  locale === "zh-CN" ? "/en/" : "/";
export const money = (value: number, locale: Locale) =>
  new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(
    value,
  );
export const date = (value: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value)) + " UTC";
