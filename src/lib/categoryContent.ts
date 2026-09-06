import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// Folder-based content. Each category (and Editorial Design subcategory) is a
// folder under public/images/categories/ containing a meta.json and any number
// of numbered image files. Drop in `04.jpg` and it appears — no code change.

const ROOT = join(process.cwd(), "public/images/categories");
const IMG_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;

export type CategoryMeta = {
  title: string;
  subtitle: string;
  description: string;
};

export type CategoryContent = {
  meta: CategoryMeta;
  /** web paths, e.g. /images/categories/shringar/01.jpg — sorted by filename */
  images: string[];
};

/**
 * @param segments folder path under categories/, e.g. ["shringar"] or
 *        ["editorial-design", "rivaaz"]
 */
export function getCategoryContent(
  segments: string[],
): CategoryContent | null {
  const dir = join(ROOT, ...segments);
  const metaPath = join(dir, "meta.json");
  if (!existsSync(metaPath)) return null;

  const meta = JSON.parse(readFileSync(metaPath, "utf8")) as Partial<CategoryMeta>;

  const images = readdirSync(dir)
    .filter((f) => IMG_EXT.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => "/" + ["images", "categories", ...segments, f].join("/"));

  return {
    meta: {
      title: meta.title ?? segments[segments.length - 1],
      subtitle: meta.subtitle ?? "",
      description: meta.description ?? "",
    },
    images,
  };
}
