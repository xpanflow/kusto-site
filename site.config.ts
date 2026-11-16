import type { SiteConfig } from "./src/lib/site-config";

export const siteConfig: SiteConfig = {
  brand: { name: "KustoCargo", nameZh: "途序" },
  defaultLocale: "zh-CN",
  locales: ["zh-CN", "en"],
  paths: { "zh-CN": "/", en: "/en/" },
  siteUrl: "",
  form: {
    mode: "disabled",
    endpoint: "",
    transport: "json",
    timeoutMs: 15000,
  },
  release: {
    allowDisabledForm: false,
  },
};
