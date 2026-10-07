// Single source of truth for the portfolio categories shown in the
// CategoryWheel and the /portfolio/[category] routes.
//
// `cover` — a real photo (public/images/categories/<id>/cover.png) used on
// the wheel card. Falls back to `gradient` (a CSS swatch) when there's no
// cover yet.
//
// `externalHref` — for a card that isn't a /portfolio/[id] gallery at all
// (e.g. Resume), link straight out instead.

export type Subcategory = {
  id: string;
  title: string;
  subtitle?: string;
};

export type Category = {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  cover?: string;
  externalHref?: string;
  subcategories?: Subcategory[];
};

// Order matters: the wheel lands on categories[0] first, holds ~2s, then
// rotates.
export const categories: Category[] = [
  {
    id: "empowerment-embodied",
    title: "Empowerment Embodied",
    subtitle: "Highstreet for Zara",
    gradient: "linear-gradient(150deg, #3a1412 0%, #7a2a1e 55%, #1a0908 100%)",
    cover: "/images/categories/empowerment-embodied/cover.png",
  },
  {
    id: "audacia-ornata",
    title: "Audacia Ornata",
    subtitle: "Atelier for Versace",
    gradient: "linear-gradient(150deg, #1c1a2e 0%, #6b2340 55%, #0c0a12 100%)",
    cover: "/images/categories/audacia-ornata/cover.png",
  },
  {
    id: "pop-anomaly",
    title: "Pop Anomaly",
    subtitle: "Menswear Design Project",
    gradient: "linear-gradient(150deg, #12222a 0%, #2f6b64 55%, #0a1416 100%)",
    cover: "/images/categories/pop-anomaly/cover.png",
  },
  {
    id: "shringar",
    title: "Shringar",
    subtitle: "Craft Documentation for Banarasi Silk",
    gradient: "linear-gradient(150deg, #3a2408 0%, #9c6b1e 55%, #1a1206 100%)",
    cover: "/images/categories/shringar/cover.png",
  },
  {
    id: "smriti",
    title: "Smriti",
    subtitle: "Sustainable Design from Godadis",
    gradient: "linear-gradient(150deg, #1c2a14 0%, #3f6b2e 55%, #0c120a 100%)",
    cover: "/images/categories/smriti/cover.png",
  },
  {
    id: "resume",
    title: "Resume",
    subtitle: "",
    gradient: "linear-gradient(150deg, #1a1a1a 0%, #3a3a3a 55%, #0a0a0a 100%)",
    externalHref: "/Resume.pdf",
  },
];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
