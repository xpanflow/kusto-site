# Kusto Cargo Website

A static marketing and main product website for **Kusto Cargo**, a product currently being developed for a customer.

## Planned experience

- A single page with sections revealed as visitors scroll down.
- Rich visual content that introduces the product and its value.
- A final section with a form for requesting trial access or sending a general enquiry.
- Chinese-first content with an English version; an animated opening followed by readable feature sections with simplified product UI illustrations.

## References

- Product source: `../kusto-cargo` (locally at `/home/xiaopan/workspace/kusto-cargo`).
- Design process reference: the previously discussed `.github/prompt/reference/` prompts for a personal portfolio website; that directory is not present in this checkout.

Use the reference's detailed planning and specification process as inspiration. Define this site's content and visual identity independently. Its multi-page structure, technology choices, and agent build workflow are not requirements for this project.

## Selected brand direction

- Brand name: **KustoCargo · 途序**.
- Logo: **option 02, interlocking connections**, in the middle row of the [third exploration board](docs/brand/logo-exploration-v3.png), selected on 2026-11-16. Options 01 and 03 are not selected.
- Meaning: connected participants and adaptable freight workflows.
- Logo colors: deep ocean navy (`#10283F`) and teal (`#087F8C`), with no yellow/orange accent.
- Website direction: a dark opening with light content sections; a China–Europe shipment journey shown through an animated route map.
- The board is a visual reference generated with the built-in image generation tool, not a production logo asset. Vector artwork and final lockup proportions remain to be prepared. The [generation prompt](docs/brand/logo-exploration-v3-prompt.txt) is retained alongside the board.

## Current status

The [site brief](docs/site-brief.md) records confirmed interview decisions and clearly separates proposed details. The initial website release is planned as static assets on Cloudflare Workers, connected to GitHub. The owner will connect and publish it manually.

The demo/trial form requires name, company, intent, and at least one of email or WeChat. Phone and requirements are optional. The user will configure submission handling later; see the [manual TODO](docs/manual-todo.md).

**Astro with static output is the selected framework.** The local Astro development environment and minimal Chinese/English pages are working. The remaining product page sections and visual design are tracked in the implementation prompts.

## Local development

Use the Node version pinned in `.nvmrc` and `.node-version`:

```bash
source "$HOME/.nvm/nvm.sh"
nvm use
npm ci
npm run dev
```

Open `http://localhost:4321/` for Chinese and `http://localhost:4321/en/` for English. To verify the current scaffold, run `npm run check`, `npm run format:check`, and `npm run build`; `npm run preview` serves the static build locally. The built files are in `dist/`.

In a restricted environment that cannot write Astro's user configuration directory, set `ASTRO_TELEMETRY_DISABLED=1` before the Astro commands. The current config has no public domain and the pages carry `noindex,nofollow` until the SEO/release stage.

## Implementation prompts

The [KustoCargo prompt package](.github/prompt/kusto-cargo/README.md) contains the executable design/development specifications, bilingual content baseline, animation storyboard, form contract, visual checks for each step, quality gates and a Cloudflare Workers handoff.

For the full local build, use [AUTONOMOUS-BUILD.md](.github/prompt/kusto-cargo/AUTONOMOUS-BUILD.md). It tells an Agent to complete every self-contained development step, inspect the rendered result after each step, and stop before GitHub connection or publishing.

Start with [00-START-HERE.md](.github/prompt/kusto-cargo/00-START-HERE.md) and resume from [PROGRESS.md](.github/prompt/kusto-cargo/PROGRESS.md). There are 13 phases: local environment and the Astro scaffold are in place, the new per-step visual baseline is next, and the final publication phase belongs to the owner.
