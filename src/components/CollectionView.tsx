"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  /** shown small above the title, e.g. "Editorial Design" */
  eyebrow?: string;
  /** a single tall strip (e.g. an exported portfolio deck) to show full-bleed
   *  and continuously scrollable, instead of the staggered thumbnail grid. */
  portfolioStrip?: string | null;
};

export default function CollectionView({
  title,
  subtitle,
  description,
  images,
  eyebrow,
  portfolioStrip,
}: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const open = openIdx !== null ? images[openIdx] : null;

  const close = useCallback(() => setOpenIdx(null), []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <main className="min-h-screen bg-paper px-6 py-24 text-ink md:px-10 md:py-32">
      {/* Header */}
      <header className="mx-auto max-w-3xl">
        {eyebrow && <p className="label-caps mb-4 text-ink/40">{eyebrow}</p>}
        <h1 className="font-gunter text-4xl uppercase leading-[1.05] tracking-[0.03em] sm:text-6xl">
          {title}
        </h1>
        {subtitle && <p className="label-caps mt-4 text-clay">{subtitle}</p>}
        {description && (
          <p className="mt-8 max-w-prose text-ink/70 leading-relaxed">
            {description}
          </p>
        )}
      </header>

      {/* Portfolio strip — one tall deck export, shown full-bleed and simply
          scrollable (no crop, no stagger — it's already laid out). */}
      {portfolioStrip ? (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-16 w-full max-w-3xl md:mt-20"
        >
          <Image
            src={portfolioStrip}
            alt={`${title} — full portfolio`}
            width={1400}
            height={1400}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full"
            priority={false}
          />
        </motion.div>
      ) : (
        /* Image stack — staggered left / right down the page */
        <div className="mx-auto mt-20 flex max-w-5xl flex-col gap-16 md:mt-28 md:gap-24">
          {images.map((src, i) => (
            <motion.button
              key={src}
              type="button"
              onClick={() => setOpenIdx(i)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`group block w-full max-w-[900px] cursor-zoom-in ${
                i % 2 === 0 ? "mr-auto" : "ml-auto"
              }`}
            >
              <div className="relative w-full overflow-hidden border border-line">
                <Image
                  src={src}
                  alt={`${title} — ${i + 1}`}
                  width={1600}
                  height={2000}
                  sizes="(max-width: 900px) 100vw, 900px"
                  className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </motion.button>
          ))}
          {images.length === 0 && (
            <p className="label-caps text-center text-ink/40">
              Photography coming soon
            </p>
          )}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-noir/90 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="relative max-h-[90vh] w-auto max-w-[90vw]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={open}
                alt={title}
                width={2000}
                height={2500}
                sizes="90vw"
                className="max-h-[90vh] w-auto object-contain"
              />
            </motion.div>
            <button
              onClick={close}
              aria-label="Close"
              className="label-caps absolute right-6 top-6 text-ink/70 transition-colors hover:text-ink"
            >
              Close ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
