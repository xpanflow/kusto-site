import {
  cpSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  symlinkSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
// Explicit allowlist: never copy .git, .env, credentials or unrelated files.
const root = resolve(".test-site");
mkdirSync(root, { recursive: true });
for (const name of [
  "src",
  "public",
  "astro.config.ts",
  "site.config.ts",
  "tsconfig.json",
  "package.json",
])
  cpSync(name, `${root}/${name}`, { recursive: true });
if (!existsSync(`${root}/node_modules`))
  symlinkSync(resolve("node_modules"), `${root}/node_modules`, "dir");
let config = readFileSync(`${root}/site.config.ts`, "utf8")
  .replace(/siteUrl: "[^"]*"/, 'siteUrl: "https://site.example.test"')
  .replace('mode: "disabled"', 'mode: "remote"')
  .replace(
    /endpoint: "[^"]*"/,
    'endpoint: "https://forms.example.test/request"',
  )
  .replace('transport: "formspree"', 'transport: "json"')
  .replace("timeoutMs: 15000", "timeoutMs: 250");
writeFileSync(`${root}/site.config.ts`, config);
const result = spawnSync(
  process.execPath,
  [resolve("node_modules/astro/bin/astro.mjs"), "build"],
  {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, KUSTO_RELEASE: "1", ASTRO_TELEMETRY_DISABLED: "1" },
  },
);
if (result.status) process.exit(result.status);
console.log("ISOLATED TEST BUILD ONLY: .test-site/dist");
