import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
const b = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
for (const locale of ["zh", "en"]) {
  const p = await b.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await p.setContent(
    `<html lang="${locale === "zh" ? "zh-CN" : "en"}"><meta charset="utf-8"><style>body{margin:0;background:#10283f;color:#f5f7f8;font-family:system-ui,sans-serif;padding:70px;box-sizing:border-box;height:630px;border-bottom:12px solid #55d6c2}header{display:flex;align-items:center;gap:20px;font-size:30px}svg{width:70px;height:48px}h1{font-size:64px;line-height:1.2;max-width:1000px;letter-spacing:-2px;margin:48px 0 24px}h1 span{display:block;font-size:32px;color:#55d6c2;letter-spacing:0;margin-bottom:12px}p{font-size:22px;color:#b8c8d4}</style><header>${readFileSync("public/brand/mark-light.svg", "utf8")}KustoCargo · 途序</header><h1>${locale === "zh" ? "<span>AI 原生</span>国际货代 TMS 系统" : "<span>AI-native</span>International freight forwarding TMS"}</h1><p>${locale === "zh" ? "AI 业务集成 · 按流程定制 · MCP 连接" : "Integrated AI · Tailored workflows · MCP connections"}</p></html>`,
  );
  await p.screenshot({ path: `public/images/og-${locale}.png` });
  await p.close();
}
await b.close();
