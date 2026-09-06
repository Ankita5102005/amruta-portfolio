"use client";

import { motion } from "framer-motion";

// Closing section — black, compact (about half a viewport tall).
// Name / email / LinkedIn are PLACEHOLDERS; tagline is final copy.
const DESIGNER_NAME = "Designer Name";
const TAGLINE =
  "A working portfolio of collections, capsules, and one-off pieces — designed and constructed by hand.";
const EMAIL = "hello@example.com";
const LINKEDIN = "https://linkedin.com/";

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: i * 0.07,
    },
  }),
};

export default function EndSection() {
  return (
    <footer className="relative flex min-h-[55vh] flex-col justify-between overflow-hidden bg-noir px-6 pb-8 pt-16 text-ink md:px-12 md:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-[0.05]"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, #f0ece3 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="relative flex flex-1 flex-col justify-center"
      >
        <motion.p
          custom={0}
          variants={reveal}
          className="text-sm font-medium uppercase tracking-[0.2em] text-clay"
        >
          Get in touch
        </motion.p>

        <motion.a
          custom={1}
          variants={reveal}
          href={`mailto:${EMAIL}`}
          className="mt-3 inline-block w-fit font-display text-2xl font-light italic leading-tight text-ink underline decoration-ink/25 underline-offset-8 transition-colors hover:decoration-ink sm:text-3xl"
        >
          {EMAIL}
        </motion.a>

        <motion.p
          custom={2}
          variants={reveal}
          className="mt-6 max-w-md text-sm leading-relaxed text-ink/55"
        >
          {TAGLINE}
        </motion.p>

        <motion.a
          custom={3}
          variants={reveal}
          href={LINKEDIN}
          target="_blank"
          rel="noreferrer"
          className="mt-8 w-fit text-sm font-medium uppercase tracking-[0.2em] text-ink/60 transition-colors hover:text-ink"
        >
          LinkedIn
        </motion.a>
      </motion.div>

      <div className="relative mt-10 border-t border-ink/10 pt-5">
        <span className="text-xs uppercase tracking-[0.2em] text-ink/35">
          © {new Date().getFullYear()} {DESIGNER_NAME}
        </span>
      </div>
    </footer>
  );
}
