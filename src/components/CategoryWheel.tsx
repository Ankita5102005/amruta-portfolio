"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useAnimationFrame } from "framer-motion";
import { categories } from "@/data/categories";

const RED = "#D02C1E";
const RED_DIM = "rgba(208, 44, 30, 0.4)";
const SPEED = 0.000216; // progress (in card-units) per millisecond — slow glide
const MOBILE_BP = 768;

export default function CategoryWheel() {
  const count = categories.length;

  // continuous position along the ring, in card-units (not degrees).
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const pausedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BP);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useAnimationFrame((_t, delta) => {
    if (pausedRef.current) return;
    progressRef.current = (progressRef.current + delta * SPEED) % count;
    setProgress(progressRef.current);
  });

  // coverflow arc geometry, tuned for the larger square
  const stepX = isMobile ? 230 : 420;
  const stepZ = isMobile ? 130 : 220;
  const cardPx = isMobile ? 250 : 400;
  const maxVisible = isMobile ? 1 : 2;

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #2a0a08 0%, #0a0a0a 70%)",
      }}
    >
      <div
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        style={{ perspective: "1400px" }}
        className="relative h-[500px] w-full max-w-6xl"
      >
        <div
          style={{ transformStyle: "preserve-3d" }}
          className="absolute left-1/2 top-1/2"
        >
          {categories.map((cat, i) => {
            // continuous signed offset from the current centre, wrapping
            let offset = i - progress;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;

            const dist = Math.abs(offset);
            const hidden = dist > maxVisible + 1;
            // clamp how far side cards fan out so they don't fly off-screen
            const shown = Math.sign(offset) * Math.min(dist, maxVisible + 0.5);
            const centredness = Math.max(0, 1 - dist); // 1 at centre → 0 by ±1

            const href =
              cat.id === "editorial-design"
                ? "/portfolio/editorial-design"
                : `/portfolio/${cat.id}`;

            const isActive = centredness > 0.5;

            return (
              <motion.div
                key={cat.id}
                style={{
                  x: shown * stepX,
                  z: -Math.abs(shown) * stepZ,
                  rotateY: shown * -25,
                  opacity: hidden ? 0 : 0.55 + 0.45 * centredness,
                  filter: `brightness(${0.65 + 0.35 * centredness})`,
                  width: cardPx,
                  marginLeft: -cardPx / 2,
                  marginTop: -cardPx / 2,
                  transformStyle: "preserve-3d",
                  pointerEvents: hidden ? "none" : "auto",
                  zIndex: 10 - Math.round(dist),
                }}
                className="absolute left-0 top-0"
                whileHover={isActive ? { scale: 1.04 } : undefined}
              >
                <Link href={href} className="block">
                  {/* card frame + image */}
                  <div
                    style={{
                      borderColor: isActive ? RED : RED_DIM,
                      boxShadow: isActive
                        ? "0 0 40px rgba(208, 44, 30, 0.25)"
                        : "none",
                      transition:
                        "border-color 0.3s ease, box-shadow 0.3s ease",
                      overflow: "visible", // let the big title spill past edges
                    }}
                    className="relative border"
                  >
                    <div
                      style={{ background: cat.gradient }}
                      className="relative h-0 w-full bg-cover bg-center pb-[100%]"
                    >
                      {isActive ? (
                        /* ACTIVE — oversized title spilling over the edges */
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                          <span
                            className="font-display italic leading-[1.0] text-ink"
                            style={{
                              fontSize: "clamp(2.75rem, 7.5vw, 4.75rem)",
                              width: "128%", // spill past the card's left/right edges
                              textShadow: "0 2px 24px rgba(0,0,0,0.6)",
                            }}
                          >
                            {cat.title}
                          </span>
                          {cat.subtitle && (
                            <span
                              className="label-caps text-ink/70"
                              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
                            >
                              {cat.subtitle}
                            </span>
                          )}
                          <span
                            className="pointer-events-auto mt-1 inline-block rounded-full border px-5 py-2 text-[0.65rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300"
                            style={{
                              borderColor: RED,
                              color: RED,
                              background: "rgba(10,10,10,0.35)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = RED;
                              e.currentTarget.style.color = "#f0ece3";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(10,10,10,0.35)";
                              e.currentTarget.style.color = RED;
                            }}
                          >
                            View Collection
                          </span>
                        </div>
                      ) : (
                        /* SIDE — smaller, contained label at the bottom */
                        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1.5 bg-gradient-to-t from-black/75 to-transparent p-4 pt-10 text-center">
                          <span className="font-display text-lg italic leading-tight text-ink">
                            {cat.title}
                          </span>
                          {cat.subtitle && (
                            <span className="label-caps text-ink/60">
                              {cat.subtitle}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
