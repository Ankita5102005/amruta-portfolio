"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useAnimationFrame } from "framer-motion";

// Placeholder copy — works for any array length, nothing hardcoded to 4.
const categories = [
  { id: "athleisure", label: "Athleisure" },
  { id: "high-fashion", label: "High Fashion" },
  { id: "streetwear", label: "Streetwear" },
  { id: "eveningwear", label: "Eveningwear" },
];

// degrees per millisecond — tune for an ambient drift
const SPEED = 0.006;
const MOBILE_BP = 768;

export default function CategoryWheel() {
  const count = categories.length;

  // rotation lives in a ref for the rAF loop (no stale closure) and mirrors
  // into state only to trigger re-renders that reposition the tags.
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);
  const pausedRef = useRef(false);

  // responsive sizing without a layout library
  const [isMobile, setIsMobile] = useState(false);
  useAnimationFrame((_t, delta) => {
    if (typeof window !== "undefined") {
      const m = window.innerWidth < MOBILE_BP;
      if (m !== isMobile) setIsMobile(m);
    }
    if (pausedRef.current) return;
    rotationRef.current = (rotationRef.current + delta * SPEED) % 360;
    setRotation(rotationRef.current);
  });

  const radius = isMobile ? 110 : 220;
  const tagW = isMobile ? 100 : 160;
  const tagH = isMobile ? 56 : 90;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-6 py-24">
      <div
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        className="relative"
        style={{ width: "min(70vw, 600px)", aspectRatio: "1 / 1" }}
      >
        {categories.map((cat, i) => {
          const angle = (360 / count) * i + rotation;
          const angleRad = angle * (Math.PI / 180);
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;

          return (
            <div
              key={cat.id}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
              }}
            >
              {/* inner wrapper counter-rotates so the label stays upright */}
              <motion.div
                style={{ transform: `rotate(${-rotation}deg)` }}
                whileHover={{ scale: 1.08 }}
              >
                <Link
                  href={`/portfolio/${cat.id}`}
                  className="label-caps flex items-center justify-center rounded-sm border border-line bg-paper/70 text-center text-ink backdrop-blur-sm transition-colors hover:border-clay hover:text-clay"
                  style={{ width: tagW, height: tagH }}
                >
                  {cat.label}
                </Link>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
