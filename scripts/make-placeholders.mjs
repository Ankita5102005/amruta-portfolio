// One-off: writes placeholder meta.json + gradient-swatch JPGs into every
// category folder so the folder-reading pages can be tested before real
// photos exist. Delete real images by hand; re-run to regenerate placeholders.
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), "public/images/categories");

// Minimal baseline JPEG (1x1) — enough for next/image to read. The visible
// swatch comes from the page's CSS gradient behind it; these files exist only
// so readdirSync has something to list.
const ONE_PX_JPG = Buffer.from(
  "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=",
  "base64",
);

const cats = [
  {
    dir: "empowerment-embodied",
    title: "Empowerment Embodied",
    subtitle: "Highstreet for Zara",
    description:
      "A highstreet capsule built for movement and presence — sharp tailoring loosened just enough to live in.",
  },
  {
    dir: "audacia-ornata",
    title: "Audacia Ornata",
    subtitle: "Atelier for Versace",
    description:
      "An atelier study in ornament and audacity: heavy embellishment carried on deliberately spare silhouettes.",
  },
  {
    dir: "pop-anomaly",
    title: "Pop Anomaly",
    subtitle: "Menswear",
    description:
      "Menswear that treats the familiar as raw material — proportion, print and hardware pushed just off-true.",
  },
  {
    dir: "shringar",
    title: "Shringar",
    subtitle: "Banarasi Silk Craft",
    description:
      "A collaboration with Banarasi weavers — traditional silk craft reframed through contemporary cut and drape.",
  },
  {
    dir: "jabberwocky-village",
    title: "Jabberwocky Village",
    subtitle: "Kidswear Collection",
    description:
      "A kidswear world of invented creatures and tall tales — playful, hard-wearing, made to be grown into.",
  },
  {
    dir: "editorial-design/rivaaz",
    title: "Rivaaz",
    subtitle: "Craft Documentation",
    description:
      "Editorial documentation of craft practice — process, hands and tools recorded alongside the finished work.",
  },
  {
    dir: "editorial-design/trend-books",
    title: "Trend Books",
    subtitle: "",
    description:
      "Seasonal trend books: research, direction and mood compiled for the studio and its collaborators.",
  },
  {
    dir: "digital-marketing",
    title: "Digital Marketing",
    subtitle: "Campaigns & Content",
    description:
      "Campaign creative and content built for social and digital — art direction through to finished assets.",
  },
  {
    dir: "about-me",
    title: "About Me",
    subtitle: "",
    description:
      "Placeholder — a short bio, training and approach go here once written.",
  },
  {
    dir: "selected-press",
    title: "Selected Press",
    subtitle: "Features & Interviews",
    description:
      "Placeholder — press features, interviews and mentions collected here.",
  },
];

for (const c of cats) {
  const dir = join(ROOT, c.dir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "meta.json"),
    JSON.stringify(
      { title: c.title, subtitle: c.subtitle, description: c.description },
      null,
      2,
    ) + "\n",
  );
  for (const n of ["01", "02", "03"]) {
    writeFileSync(join(dir, `${n}.jpg`), ONE_PX_JPG);
  }
  console.log("wrote", c.dir);
}
