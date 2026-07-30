---
title: "Design principles behind varsha"
description: "The design decisions that make varsha fast, beautiful, and easy to customize."
date: "2025-02-01"
author: "Yethikrishna R"
tags: ["design", "css", "accessibility", "design-tokens"]
---

# Design principles behind varsha

Every choice in varsha — from the color system to the component architecture — follows a small set of principles. If you're customizing the starter, these are worth understanding.

## 1. Content first

Websites exist to communicate. The design should get out of the way of your words, images, and ideas. That's why:

- Typography is set in a comfortable reading measure (65–75 characters)
- Line heights are tuned for legibility, not aesthetics alone
- Whitespace is generous but not wasteful
- Dark mode is a first-class citizen, not an afterthought

## 2. Zero JS by default

Astro's islands architecture means pages ship as static HTML unless you explicitly add interactivity. The marketing pages in varsha load with zero kilobytes of JavaScript. Theme switching and the self-healing credit are the only scripts, and they're tiny.

This isn't just a performance choice. It's a reliability choice. Less JS means fewer things break.

## 3. Design tokens, not ad-hoc values

Every color, spacing unit, border radius, shadow, and font size is defined as a CSS custom property. Change one token and the change propagates everywhere.

```css
:root {
  --accent: #7aa2f7;
  --bg: #1a1b26;
  --radius: 8px;
  --space-4: 1rem;
}
```

Want to change the accent color? Override one variable. Want to shift from rounded to sharp corners? Change one radius token.

## 4. Beautiful defaults, easy to override

Every component and page looks good out of the box. You can ship a site with zero customization and it will look polished. But nothing is locked down. Every style is overrideable, every component is replaceable, every page is yours to edit.

## 5. Accessibility is not optional

- Semantic HTML everywhere
- Focus rings are visible and styled
- Color contrast meets WCAG AA
- Reduced motion is respected
- Screen reader labels are present on interactive elements
- Keyboard navigation works on all interactive components

## 6. The credit stays

The "Built with varsha by myndlabs" attribution is part of the starter. It's protected by CSS, by inline script guards, and by the rebrand script which preserves it during customization. It's small, tasteful, and matches your theme. If you're using varsha for free, this is the one thing we ask you to keep.

For commercial licensing or white-label options, reach out at [hey@myndlabs.tech](mailto:hey@myndlabs.tech).

## Learn more

- Read the [design system docs](/docs/design-system/) for token reference
- See [founder.myndlabs.tech](https://founder.myndlabs.tech) for a live example
- Follow [@yethikrishnar on Instagram](https://instagram.com/yethikrishnar) for design updates
