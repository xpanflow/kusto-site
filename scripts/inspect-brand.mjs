import { chromium } from "@playwright/test";
const b = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const p = await b.newPage({ viewport: { width: 1000, height: 650 } });
await p.goto("http://127.0.0.1:4321");
await p.setContent(
  `<style>body{font:18px system-ui;margin:40px}section{padding:30px;display:flex;gap:40px;align-items:center;margin-bottom:20px}.dark{background:#10283f;color:white}img{width:auto}span{display:flex;flex-direction:column;gap:20px}</style>${["mark", "mark-light"].map((mark, i) => `<section class="${i ? "dark" : ""}">${[24, 32, 48].map((size) => `<span>${size}px<img src="http://127.0.0.1:4321/brand/${mark}.svg" height="${size}"></span>`).join("")}</section>`).join("")}`,
);
await p.screenshot({ path: "docs/implementation/visual/04-brand-sizes.png" });
await b.close();
