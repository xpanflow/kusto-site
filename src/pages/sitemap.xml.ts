import { siteConfig } from "../../site.config";
export function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${
      siteConfig.siteUrl
        ? Object.values(siteConfig.paths)
            .map((path) => `<url><loc>${siteConfig.siteUrl}${path}</loc></url>`)
            .join("")
        : ""
    }</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
