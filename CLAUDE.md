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
