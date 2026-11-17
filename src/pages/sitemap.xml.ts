import { siteConfig } from "../../site.config";
export function GET() {
  const { siteUrl, paths } = siteConfig;
  const alternates = Object.entries(paths)
    .map(
      ([locale, path]) =>
        `<xhtml:link rel="alternate" hreflang="${locale}" href="${siteUrl}${path}"/>`,
    )
    .join("");
  const urls = siteUrl
    ? Object.values(paths)
        .map((path) => `<url><loc>${siteUrl}${path}</loc>${alternates}</url>`)
        .join("")
    : "";
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
