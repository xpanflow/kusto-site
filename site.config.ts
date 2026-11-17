import type { SiteConfig } from "./src/lib/site-config";

export const siteConfig: SiteConfig = {
  brand: { name: "KustoCargo", nameZh: "途序" },
  defaultLocale: "zh-CN",
  locales: ["zh-CN", "en"],
  paths: { "zh-CN": "/", en: "/en/" },
  siteUrl: "https://kusto.xpanflow.com",
  form: {
    mode: "remote",
    endpoint: "https://formspree.io/f/myewwkwl",
    transport: "formspree",
    timeoutMs: 15000,
  },
  release: {
    allowDisabledForm: false,
  },
};
