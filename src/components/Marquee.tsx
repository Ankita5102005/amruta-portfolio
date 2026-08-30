"use client";

import { motion } from "framer-motion";

// Signature element: a continuous runway-program-style ticker.
// Framer's `animate` loop (not CSS keyframes) drives the scroll so
// it's easy to tweak speed/direction from one place.
const items = [
  "Wool",
  "Silk",
  "Deadstock Denim",
  "Vegetable-Tanned Leather",
  "Hand-Loomed Knit",
  "Raw Linen",
];

export default function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className="border-y border-line py-6 overflow-hidden">
      <motion.div
        className="marquee-track"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-display italic text-2xl md:text-3xl px-8 whitespace-nowrap text-ink/80"
          >
            {item}
            <span className="text-clay not-italic ml-8">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
