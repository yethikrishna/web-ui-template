---
title: "Deploying your varsha site"
description: "A step-by-step guide to deploying your varsha website to Vercel, Netlify, Cloudflare Pages, or any static host."
date: "2025-02-15"
author: "Yethikrishna R"
tags: ["deployment", "guide", "vercel", "netlify", "cloudflare"]
---

# Deploying your varsha site

One of varsha's core goals is zero-friction deployment. Since the output is pure static HTML, you can deploy to virtually any hosting provider. Here's how to deploy to the most common platforms.

## Before you deploy

Make sure you've updated your site metadata in `astro.config.mjs`:

- `site`: Your production URL (e.g., `https://yourdomain.com`)
- `title`: Your site name
- `description`: A brief description for SEO
- Social links (GitHub, Instagram, etc.)

Also run a production build locally to catch any errors:

```bash
npm run build
```

The static output will be in the `dist/` directory.

## Vercel (recommended)

varsha generates pure static HTML, so no server adapter is needed. The easiest way to deploy:

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) and click "Add New Project"
3. Select your repository
4. Vercel auto-detects Astro — no configuration needed
5. Click "Deploy"

Alternatively, use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Netlify

1. Push your repo to GitHub
2. Go to [netlify.com](https://netlify.com) and click "Add new site"
3. Select your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click "Deploy"

Or use the Netlify CLI:

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## Cloudflare Pages

1. Push your repo to GitHub
2. Go to the Cloudflare dashboard → Pages → "Create a project"
3. Select your repo
4. Framework preset: **Astro**
5. Build command: `npm run build`
6. Build output directory: `dist`
7. Click "Save and Deploy"

## GitHub Pages

Add this to your `astro.config.mjs` (replace `vite` config with GitHub Pages base path):

```js
export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/your-repo-name/',
  // ... rest of config
});
```

Then enable GitHub Pages in your repository settings, using GitHub Actions for deployment.

## Any static host

Since the output is pure HTML/CSS/JS in `dist/`, you can deploy to any static host:

- **FTP/SFTP**: Upload the contents of `dist/` to your web root
- **S3/CloudFront**: Sync `dist/` to an S3 bucket with static website hosting
- **Nginx/Apache**: Serve `dist/` as your web root
- **Render, Railway, Fly.io**: All support static sites from the `dist/` directory

## Custom domain

Once deployed, point your custom domain at your host. Add your domain to the `site` field in `astro.config.mjs` for correct sitemap and OG URLs:

```js
site: 'https://yourdomain.com',
```

Redeploy after making this change.

## Need help?

- Read the [deployment docs](/docs/persistence-remote/) for detailed guides
- Check the [troubleshooting page](/docs/troubleshooting/) for common issues
- See [founder.myndlabs.tech](https://founder.myndlabs.tech) for a live deployed example
- DM us [@yethikrishnar on Instagram](https://instagram.com/yethikrishnar)
