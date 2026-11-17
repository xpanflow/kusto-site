import { siteConfig } from "../../site.config";
export function GET() {
  return new Response(
    siteConfig.siteUrl
      ? `User-agent: *\nAllow: /\nSitemap: ${siteConfig.siteUrl}/sitemap.xml\n`
      : "User-agent: *\nDisallow: /\n",
    { headers: { "Content-Type": "text/plain" } },
  );
}
