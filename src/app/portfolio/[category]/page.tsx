import { notFound, redirect } from "next/navigation";
import CollectionView from "@/components/CollectionView";
import { getCategoryContent } from "@/lib/categoryContent";

// Server component. Reads public/images/categories/[category]/ —
// meta.json for the header, every other file as a piece to show.
// Editorial Design has no grid of its own: redirect to its sub-menu.

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (category === "editorial-design") {
    redirect("/portfolio/editorial-design");
  }

  const content = getCategoryContent([category]);
  if (!content) notFound();

  return (
    <CollectionView
      title={content.meta.title}
      subtitle={content.meta.subtitle}
      description={content.meta.description}
      images={content.images}
    />
  );
}
