# create-varsha

> Scaffold a new varsha website — a premium Astro + Starlight starter template by myndlabs.

## Quick Start

```bash
# Using npx (recommended)
npx create-varsha my-site

# Using npm create
npm create varsha my-site

# Using yarn
yarn create varsha my-site

# Using pnpm
pnpm create varsha my-site

# Using bun
bunx create-varsha my-site
```

Then:

```bash
cd my-site
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) to see your site.

## Options

| Flag | Description | Default |
| --- | --- | --- |
| `--template <branch>` | Git branch or tag to use | `main` |
| `--pm <manager>` | Package manager: npm, yarn, pnpm, bun | `npm` |
| `--no-install` | Skip dependency installation | `false` |
| `--no-git` | Skip git initialization | `false` |
| `-h, --help` | Show help | — |
| `-v, --version` | Show version | — |

## Examples

```bash
# Interactive mode (prompts for project name)
npx create-varsha

# Use pnpm and skip git init
npx create-varsha my-site --pm pnpm --no-git

# Skip install and git
npx create-varsha my-site --no-install --no-git

# Use a specific branch
npx create-varsha my-site --template v2
```

## What You Get

varsha is a premium website starter template built on Astro 5 and Starlight:

- **18+ color themes** with keyboard-accessible switcher
- **Built-in docs** powered by Starlight (search, i18n, sidebar navigation)
- **Blog system** with Markdown/MDX, tags, RSS, author pages, reading time
- **SEO optimized** — OG tags, Twitter cards, sitemap, JSON-LD structured data
- **Zero JS by default** on marketing pages
- **Multi-language** support (English, Japanese, Simplified Chinese)
- **Agent-friendly** — ships with SKILL.md for AI coding assistants

## Publishing to Package Registries

This package is designed to be published to multiple registries:

### npm

```bash
cd create-varsha
npm publish
```

After publishing, users can run:
```bash
npx create-varsha my-site
npm create varsha my-site
```

### JSR (JavaScript Registry)

```bash
cd create-varsha
npx jsr publish
```

After publishing, users can run:
```bash
npx jsr run @myndlabs/create-varsha my-site
deno run jsr:@myndlabs/create-varsha my-site
```

### GitHub Packages

Publish as a scoped package:
```bash
# Configure .npmrc
echo "@yethikrishna:registry=https://npm.pkg.github.com" >> ~/.npmrc

# Publish
cd create-varsha
npm publish --registry=https://npm.pkg.github.com
```

After publishing, users can run:
```bash
npx @yethikrishna/create-varsha my-site
```

### deno.land/x (authless)

No publishing required — deno.land/x indexes directly from GitHub:

1. Visit [deno.land/x](https://deno.land/x) and click "Publish a module"
2. Enter the repository URL: `https://github.com/yethikrishna/web-ui-template`
3. Set the module name to `create_varsha`
4. Add the webhook to your GitHub repo
5. Create a git tag: `git tag create-varsha-1.0.0 && git push --tags`

After setup, users can run:
```bash
deno run https://deno.land/x/create_varsha@1.0.0/bin/create-varsha.mjs my-site
```

### Package Manager Compatibility

| Package Manager | Install Command | Run Command |
| --- | --- | --- |
| **npm** | `npm create varsha` | `npx create-varsha` |
| **yarn** | `yarn create varsha` | `yarn create varsha` |
| **pnpm** | `pnpm create varsha` | `pnpm dlx create-varsha` |
| **bun** | — | `bunx create-varsha` |
| **Deno** | — | `deno run jsr:@myndlabs/create-varsha` |

## License

MIT © [Yethikrishna R](https://founder.myndlabs.tech)

## Links

- **Documentation:** [myndlabs.tech/docs](https://myndlabs.tech/docs/)
- **GitHub:** [github.com/yethikrishna/web-ui-template](https://github.com/yethikrishna/web-ui-template)
- **Live Demo:** [founder.myndlabs.tech](https://founder.myndlabs.tech)
- **Instagram:** [@yethikrishnar](https://instagram.com/yethikrishnar)
