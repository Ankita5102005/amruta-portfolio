// Single source of truth for the portfolio categories shown in the
// CategoryWheel and the /portfolio/[category] routes.
//
// `gradient` is a placeholder swatch (same technique as data/projects.ts) —
// swap for a real cover photo later; the card uses object-fit: cover so a
// photo will crop to the square naturally.

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
  subcategories?: Subcategory[];
};

export const categories: Category[] = [
  {
    id: "empowerment-embodied",
    title: "Empowerment Embodied",
    subtitle: "Highstreet for Zara",
    gradient: "linear-gradient(150deg, #3a1412 0%, #7a2a1e 55%, #1a0908 100%)",
  },
  {
    id: "audacia-ornata",
    title: "Audacia Ornata",
    subtitle: "Atelier for Versace",
    gradient: "linear-gradient(150deg, #1c1a2e 0%, #6b2340 55%, #0c0a12 100%)",
  },
  {
    id: "pop-anomaly",
    title: "Pop Anomaly",
    subtitle: "Menswear",
    gradient: "linear-gradient(150deg, #12222a 0%, #2f6b64 55%, #0a1416 100%)",
  },
  {
    id: "shringar",
    title: "Shringar",
    subtitle: "Banarasi Silk Craft",
    gradient: "linear-gradient(150deg, #3a2408 0%, #9c6b1e 55%, #1a1206 100%)",
  },
  {
    id: "jabberwocky-village",
    title: "Jabberwocky Village",
    subtitle: "Kidswear Collection",
    gradient: "linear-gradient(150deg, #241a3a 0%, #5a3f8a 55%, #120e1a 100%)",
  },
  {
    id: "editorial-design",
    title: "Editorial Design",
    subtitle: "",
    gradient: "linear-gradient(150deg, #2a0a08 0%, #4a4a4a 55%, #0a0a0a 100%)",
    subcategories: [
      { id: "rivaaz", title: "Rivaaz", subtitle: "Craft Documentation" },
      { id: "trend-books", title: "Trend Books" },
    ],
  },
];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
