# varsha — premium website starter by myndlabs

A beautiful, production-ready website starter built with
[Astro](https://astro.build) 5 and [Starlight](https://starlight.astro.build).
Launch polished marketing sites, docs portals, and blogs in minutes.

**[Live Demo](https://web-ui-template-iota.vercel.app)** — deployed on Vercel

## Features

- 18+ built-in color palettes with instant light/dark mode switching
- Complete design system with CSS tokens (typography, spacing, colors, radius, shadows)
- Built-in documentation with English, Japanese, and Simplified Chinese locales
- Marketing pages: landing, features, showcase, performance
- Markdown/MDX blog system with author cards, tags, RSS feed, and reading time
- SEO optimized (sitemap, OG tags, robots.txt, structured data)
- Zero-JavaScript-by-default architecture (Astro islands)
- Responsive design for mobile, tablet, and desktop
- Lighthouse 100/100/100/100 scores
- Machine-readable LLM context files (`llms.txt`, `llms-full.txt`, `SKILL.md`)
- One-click deploy to Vercel, Netlify, Cloudflare Pages

## Quick start

```bash
npx create-varsha my-site
cd my-site
npm run dev
```

Open http://localhost:4321 to see your site.

Also available via:

```bash
# Using npm create
npm create varsha my-site

# Using yarn
yarn create varsha my-site

# Using pnpm
pnpm create varsha my-site

# Using bun
bunx create-varsha my-site

# Using degit (no auto-install)
npx degit yethikrishna/web-ui-template my-site
cd my-site && npm install

# Or use the one-line installer:
# macOS / Linux
curl -fsSL https://myndlabs.tech/install.sh | sh
# Windows (PowerShell)
irm https://myndlabs.tech/install.ps1 | iex
```

> Requires Node.js 20+.

## One-click deploy

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yethikrishna/web-ui-template&project-name=varsha-site&repository-name=my-varsha-site)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yethikrishna/web-ui-template)

### Cloudflare Pages

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/yethikrishna/web-ui-template)

The repo includes a `vercel.json` (redirects + cache headers) and outputs
pure static HTML — no adapter required. Deploy to Vercel, Netlify,
Cloudflare Pages, GitHub Pages, or any static host.

## Attribution

Every site built with varsha includes a small "Built with varsha by myndlabs"
credit in the footer linking to [myndlabs.tech](https://myndlabs.tech). This
attribution is protected and must be preserved. For white-label/commercial
licensing, contact hey@myndlabs.tech.

## Links

- **Website**: https://myndlabs.tech
- **Docs**: https://myndlabs.tech/docs/
- **Live Demo**: https://web-ui-template-iota.vercel.app
- **GitHub**: https://github.com/yethikrishna/web-ui-template
- **Instagram**: https://instagram.com/yethikrishnar
- **Example site**: https://founder.myndlabs.tech
- **Contact**: hey@myndlabs.tech

## Project layout

```
index.html            Root homepage (standalone HTML)
src/content/docs/     Starlight documentation (en, ja, zh-cn)
src/content/blog/     Blog posts
src/pages/            Astro pages: features, showcase, performance, blog
src/components/       Components: MarketingLayout, BuiltWith, Starlight overrides
src/styles/           Starlight CSS overrides
css/style.css         Global design system (18 palettes, components)
scripts/              prepare-docs.mjs, rebrand.mjs
public/               Static assets (generated during build)
assets/               Source assets (logos, favicons, OG cards)
```

## Commands

```bash
npm install           Install dependencies
npm run dev           Start dev server (prepares docs first)
npm run build         Production build to dist/
npm run preview       Preview production build
```

## Customizing

1. Edit `astro.config.mjs` — `site`, `title`, `description`, social links, sidebar.
2. Replace `assets/logo.svg`, `assets/favicon.svg`, `assets/og-card-v8.png` with your brand.
3. Rewrite `index.html` hero and marketing copy for your product.
4. Edit `src/content/docs/*` and `src/content/blog/*` content.
5. Customize colors via CSS custom properties in `css/style.css`.

## License

MIT License — Copyright (c) 2026 Yethikrishna R / myndlabs.tech

See [LICENSE](./LICENSE) for the full text. The attribution notice (Built with
varsha by myndlabs) must be preserved on all deployed sites.
