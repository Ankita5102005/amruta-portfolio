# Project conventions

Fashion portfolio site. Next.js App Router + TypeScript + Tailwind + Framer Motion.

## What changes per client vs. what doesn't
- **Changes:** `src/data/projects.ts` (real collections/photos), design tokens in
  `src/app/globals.css` (`:root` block), copy in `About.tsx` / `Contact.tsx` /
  `Hero.tsx`, studio name in `Nav.tsx` / `layout.tsx` metadata.
- **Stays the same:** component structure, animation patterns below, layout logic.

## Design tokens
Colors and fonts live in `src/app/globals.css` (`:root`) — never hardcode a hex
value in a component. Reference `var(--clay)` etc., or the Tailwind tokens
(`text-clay`, `bg-paper`, `border-line`) wired up via `@theme inline`.
The site runs a single **dark theme**: `--paper` is near-black (`#0a0a0a`),
`--ink` is cream (`#f0ece3`), `--clay` is signal red (`#d02c1e`). So
`bg-paper` = dark background, `text-ink` = light text everywhere.

## Adding content
Collection content is folder-based under
`public/images/categories/<category>/` (and
`public/images/categories/editorial-design/<subcategory>/` for that one).
Each folder has a `meta.json` (`title`, `subtitle`, `description`) plus any
number of numbered image files.

- **To add a photo to a collection**, just drop a numbered image file
  (e.g. `04.jpg`) into that category's folder. It's picked up automatically,
  sorted by filename — no code changes.
- **To edit a title / subtitle / description**, edit that folder's
  `meta.json`. No code changes.

`src/lib/categoryContent.ts` reads the folder; `src/data/categories.ts` only
holds the wheel ordering + gradients + which category has subcategories.

## Animation conventions
- Library: Framer Motion only — no CSS `@keyframes` for content animation
  (the marquee uses Framer's `animate` loop, not CSS).
- Scroll reveals: `whileInView` + `viewport={{ once: true }}`, duration 0.6–0.8s,
  easeOut. Stagger children with `staggerChildren: 0.1–0.15`.
- Page-load moments (hero only): stagger + `delayChildren`, easing
  `[0.22, 1, 0.36, 1]` for a slight overshoot-free "settle".
- Shared element transitions: match `layoutId` between the grid card image and
  the detail overlay image (see `ProjectCard.tsx` / `CollectionGrid.tsx`).
- Respect `prefers-reduced-motion` — already handled globally in `globals.css`;
  don't add motion that bypasses it.

## Placeholder content
Every image is currently a CSS gradient (`project.gradient` in
`data/projects.ts`) so the whole site runs without any real photography.
Swap for `next/image` once real photos exist — keep the same `layoutId` on
whichever element wraps the image so the expand transition keeps working.

## Structure
- `src/app/page.tsx` — assembles sections, don't add page logic here
- `src/components/` — one component per section, all client components
  (`"use client"`) since they all use Framer Motion
- `src/data/projects.ts` — single source of truth for collection content
