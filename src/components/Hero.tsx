"use client";

import { motion } from "framer-motion";

// Split into words so each can animate in individually — the
// "orchestrated page-load moment" the brief calls for.
const headline = "Clothing built from the seam outward.";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const word = {
  hidden: { opacity: 0, y: "100%" },
  show: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  return (
    <section
      id="top"
      className="min-h-screen flex flex-col justify-center px-6 md:px-10 pt-24"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="label-caps text-clay mb-6"
      >
        Fall / Winter Collection — Est. 2023
      </motion.p>

      <motion.h1
        variants={container}
        initial="hidden"
        animate="show"
        className="font-display font-light italic text-[10vw] sm:text-[7vw] leading-[0.95] max-w-4xl overflow-hidden"
        aria-label={headline}
      >
        {headline.split(" ").map((w, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
            <motion.span variants={word} className="inline-block">
              {w}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="mt-8 max-w-md text-ink/70"
      >
        A working portfolio of collections, capsules, and one-off pieces —
        each one designed and constructed by hand in the studio.
      </motion.p>

      {/* Scroll cue — small ambient loop, respects reduced motion via CSS above */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="mt-16 flex items-center gap-3 label-caps text-ink/50"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="block w-px h-6 bg-ink/40"
        />
        Scroll
      </motion.div>
    </section>
  );
}
