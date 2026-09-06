import { notFound } from "next/navigation";
import CollectionView from "@/components/CollectionView";
import { getCategoryContent } from "@/lib/categoryContent";

// Reads public/images/categories/editorial-design/[subcategory]/ — same
// meta.json + folder-listing logic as the top-level category pages.

export default async function EditorialSubcategoryPage({
  params,
}: {
  params: Promise<{ subcategory: string }>;
}) {
  const { subcategory } = await params;

  const content = getCategoryContent(["editorial-design", subcategory]);
  if (!content) notFound();

  return (
    <CollectionView
      eyebrow="Editorial Design"
      title={content.meta.title}
      subtitle={content.meta.subtitle}
      description={content.meta.description}
      images={content.images}
    />
  );
}
