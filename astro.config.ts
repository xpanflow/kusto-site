import { defineConfig } from "astro/config";

import { siteConfig } from "./site.config";

export default defineConfig({
  output: "static",
  site: siteConfig.siteUrl || undefined,
  trailingSlash: "always",
  i18n: {
    locales: [...siteConfig.locales],
    defaultLocale: siteConfig.defaultLocale,
    routing: { prefixDefaultLocale: false },
  },
});
