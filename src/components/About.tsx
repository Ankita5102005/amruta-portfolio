"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center border-t border-line"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
        style={{ background: "linear-gradient(160deg, #cfc7b4, #9c6b43)" }}
        className="aspect-[4/5] w-full max-w-md"
        // Swap for a real portrait: <Image src="..." fill className="object-cover" />
      />

      <div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="label-caps text-clay mb-4"
        >
          About the Studio
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-2xl md:text-3xl italic leading-snug"
        >
          Every piece starts on the body, not the sketchpad — patterns are
          drafted through draping, then refined over repeated fittings.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-ink/70 max-w-md"
        >
          Replace this paragraph with the designer's real background,
          training, and point of view once you've sat down with them —
          this is placeholder copy only.
        </motion.p>
      </div>
    </section>
  );
}
