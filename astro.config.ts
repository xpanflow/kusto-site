import { defineConfig } from "astro/config";

import { siteConfig } from "./site.config";

import { validateSiteConfig } from "./src/lib/site-config";
validateSiteConfig(siteConfig, process.env.KUSTO_RELEASE === "1");

export default defineConfig({
  output: "static",
  devToolbar: { enabled: false },
  site: siteConfig.siteUrl || undefined,
  trailingSlash: "always",
  i18n: {
    locales: [...siteConfig.locales],
    defaultLocale: siteConfig.defaultLocale,
    routing: { prefixDefaultLocale: false },
  },
});
