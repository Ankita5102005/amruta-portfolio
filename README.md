# Fashion Portfolio — Starter

Next.js + TypeScript + Tailwind + Framer Motion starter, built so the
*content and design tokens* are the only things you should need to change
per client — the animation/component structure stays the same.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What to hand to Claude Code for a real client

1. Open `CLAUDE.md` first — it has the conventions Claude Code should follow.
2. Swap real content into `src/data/projects.ts`.
3. Update colors/fonts in `src/app/globals.css` (`:root` block).
4. Update copy in `Hero.tsx`, `About.tsx`, `Contact.tsx`, and the studio name
   in `Nav.tsx` / `layout.tsx`.
5. Once you have real photography, swap the gradient placeholders for
   `next/image` — see the comment in `ProjectCard.tsx`.

## What's already built

- Staggered word-reveal hero animation
- Continuous runway-ticker marquee (materials list)
- Scroll-triggered reveals on the collection grid
- Click-to-expand shared layout transition (card → full detail overlay)
- Reduced-motion support, visible focus states, responsive down to mobile
