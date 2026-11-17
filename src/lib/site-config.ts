export type Locale = "zh-CN" | "en";

export interface SiteConfig {
  brand: { name: string; nameZh: string };
  defaultLocale: Locale;
  locales: readonly Locale[];
  paths: Record<Locale, string>;
  siteUrl: string;
  form: {
    mode: "disabled" | "remote";
    endpoint: string;
    transport: "json";
    timeoutMs: number;
  };
  release: { allowDisabledForm: boolean };
}

export function validateSiteConfig(config: SiteConfig, release = false): void {
  if (config.siteUrl && !isHttpsOrigin(config.siteUrl)) {
    throw new Error("siteUrl must be an HTTPS origin without a path.");
  }

  if (config.form.mode === "remote" && !isHttpsUrl(config.form.endpoint)) {
    throw new Error("A remote form requires an HTTPS endpoint.");
  }

  if (release) {
    if (!config.siteUrl) {
      throw new Error("A release build requires siteUrl.");
    }
    if (config.form.mode === "disabled" && !config.release.allowDisabledForm) {
      throw new Error(
        "A release build requires a configured form or an explicit disabled-form decision.",
      );
    }
  }
}

function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" && !url.username && !url.password && !url.hash
    );
  } catch {
    return false;
  }
}

function isHttpsOrigin(value: string): boolean {
  if (!isHttpsUrl(value)) return false;
  const url = new URL(value);
  return url.origin === value;
}
