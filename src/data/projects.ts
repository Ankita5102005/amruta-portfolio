// ============================================================
// PLACEHOLDER CONTENT — this is the file that changes most
// once you sit down with the client. Swap `gradient` for a
// real photo later (see the comment in ProjectCard.tsx).
// ============================================================

export type Project = {
  id: string;
  look: string; // e.g. "Look 01" — sequence label, meaningful in a lookbook
  title: string;
  category: string;
  year: string;
  description: string;
  gradient: string; // placeholder swatch until real photography exists
};

export const projects: Project[] = [
  {
    id: "01",
    look: "Look 01",
    title: "Undertow",
    category: "Outerwear",
    year: "2025",
    description:
      "Raw-edge wool coats built around a single seam line, cut to move with the body rather than structure against it.",
    gradient: "linear-gradient(135deg, #3f4a3b 0%, #16140f 100%)",
  },
  {
    id: "02",
    look: "Look 02",
    title: "Second Skin",
    category: "Knitwear",
    year: "2025",
    description:
      "Hand-loomed knit separates exploring tension and drape across four undyed fibers.",
    gradient: "linear-gradient(135deg, #9c6b43 0%, #cfc7b4 100%)",
  },
  {
    id: "03",
    look: "Look 03",
    title: "Field Notes",
    category: "Tailoring",
    year: "2024",
    description:
      "Deconstructed workwear silhouettes reassembled with tailoring details borrowed from menswear archives.",
    gradient: "linear-gradient(135deg, #16140f 0%, #9c6b43 100%)",
  },
  {
    id: "04",
    look: "Look 04",
    title: "Low Tide",
    category: "Eveningwear",
    year: "2024",
    description:
      "Bias-cut slip dresses in hand-dyed silk, each piece unrepeatable due to the dye process itself.",
    gradient: "linear-gradient(135deg, #cfc7b4 0%, #3f4a3b 100%)",
  },
  {
    id: "05",
    look: "Look 05",
    title: "Terra",
    category: "Accessories",
    year: "2024",
    description:
      "Vegetable-tanned leather goods finished by hand, aging intentionally with wear.",
    gradient: "linear-gradient(135deg, #9c6b43 0%, #16140f 100%)",
  },
  {
    id: "06",
    look: "Look 06",
    title: "Afterimage",
    category: "Capsule",
    year: "2023",
    description:
      "A six-piece capsule built entirely from deadstock fabric sourced within a 50-mile radius of the studio.",
    gradient: "linear-gradient(135deg, #3f4a3b 0%, #cfc7b4 100%)",
  },
];
