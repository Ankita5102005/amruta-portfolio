// Placeholder dynamic route so the CategoryWheel links don't 404.
// Prompt B replaces this with the real category grid.

const LABELS: Record<string, string> = {
  athleisure: "Athleisure",
  "high-fashion": "High Fashion",
  streetwear: "Streetwear",
  eveningwear: "Eveningwear",
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const label =
    LABELS[category] ??
    category
      .split("-")
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="font-display text-[8vw] font-light italic leading-none text-ink">
        {label}
      </h1>
      <p className="label-caps mt-6 text-clay">Coming soon</p>
    </main>
  );
}
