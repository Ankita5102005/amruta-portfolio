import Link from "next/link";
import { getCategory } from "@/data/categories";

// Editorial Design sub-menu: two large clickable options for its
// subcategories (Rivaaz / Trend Books). Dark theme.

export default function EditorialDesignPage() {
  const cat = getCategory("editorial-design");
  const subs = cat?.subcategories ?? [];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-24 text-ink">
      <h1 className="font-gunter text-4xl uppercase leading-[1.05] tracking-[0.03em] md:text-6xl">
        Editorial Design
      </h1>

      <div className="mt-14 grid w-full max-w-3xl gap-6 sm:grid-cols-2">
        {subs.map((sub) => (
          <Link
            key={sub.id}
            href={`/portfolio/editorial-design/${sub.id}`}
            className="group flex aspect-square flex-col items-center justify-center border border-line p-8 text-center transition-colors hover:border-clay"
          >
            <span className="font-gunter text-xl uppercase tracking-[0.04em] text-ink transition-colors group-hover:text-clay">
              {sub.title}
            </span>
            {sub.subtitle && (
              <span className="label-caps mt-3 text-ink/50">{sub.subtitle}</span>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
