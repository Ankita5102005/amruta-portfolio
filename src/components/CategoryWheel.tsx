"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAnimationFrame } from "framer-motion";
import { categories } from "@/data/categories";

const RED = "#D02C1E";
const CREAM = "#f0ece3";
const SPEED = 0.006; // degrees per millisecond — slow ambient drift
const START_HOLD_MS = 2000; // land on categories[0], wait, then rotate
const MOBILE_BP = 768;

// normalize any angle to (-180, 180]
function norm(a: number) {
  const m = ((a % 360) + 360) % 360;
  return m > 180 ? m - 360 : m;
}

export default function CategoryWheel() {
  const count = categories.length;
  const angleStep = 360 / count; // 40° for 9 cards

  const rotationRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const pausedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BP);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useAnimationFrame((t) => {
    if (startRef.current === null) startRef.current = t;
    const elapsed = t - startRef.current;
    if (elapsed < START_HOLD_MS || pausedRef.current) return;
    rotationRef.current = (rotationRef.current + SPEED * 16.67) % 360;
    setRotation(rotationRef.current);
  });

  const radius = isMobile ? 300 : 500;
  const baseCard = isMobile ? 150 : 210;
  const perspective = isMobile ? 1200 : 1800;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-noir px-6 py-24">
      <div
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        style={{ perspective: `${perspective}px` }}
        className="relative"
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotation}deg)`,
            width: baseCard,
            height: baseCard,
          }}
          className="relative"
        >
          {categories.map((cat, i) => {
            const angle = i * angleStep;
            const eff = norm(angle + rotation); // -180..180, 0 = dead front
            const facing = Math.max(0, 1 - Math.abs(eff) / 90); // 1 front → 0 at 90°
            const isActive = Math.abs(eff) < angleStep / 2;

            // "light from behind": a soft white/silver halo whose spread and
            // opacity grow the more the card faces the viewer.
            const glow = 0.15 + 0.85 * facing;
            const haloSpread = 20 + 90 * facing;
            const haloBlur = 30 + 70 * facing;
            const borderCol = isActive
              ? "rgba(245,245,245,0.95)"
              : `rgba(220,220,225,${0.25 + 0.5 * facing})`;

            const href =
              cat.id === "editorial-design"
                ? "/portfolio/editorial-design"
                : `/portfolio/${cat.id}`;

            return (
              <div
                key={cat.id}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px) scale(${
                    isActive ? 1.35 : 0.9 + 0.25 * facing
                  })`,
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.4s ease, filter 0.4s ease",
                  filter: `brightness(${0.45 + 0.55 * facing})`,
                  width: baseCard,
                  height: baseCard,
                  zIndex: isActive ? 20 : 10 + Math.round(facing * 5),
                }}
                className="absolute left-0 top-0"
              >
                <Link href={href} className="block h-full w-full">
                  <div
                    style={{
                      borderColor: borderCol,
                      // layered halo — inner tight silver rim + wide soft bloom
                      boxShadow: `0 0 ${haloBlur * 0.4}px ${haloSpread * 0.25}px rgba(255,255,255,${
                        glow * 0.5
                      }), 0 0 ${haloBlur}px ${haloSpread}px rgba(210,215,225,${glow * 0.35})`,
                      background: cat.gradient,
                      transition: "box-shadow 0.4s ease, border-color 0.4s ease",
                    }}
                    className="relative h-full w-full border bg-cover bg-center"
                  >
                    {isActive ? (
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                        <span
                          className="font-display italic leading-[1.0] text-ink"
                          style={{
                            fontSize: "clamp(1.4rem, 4vw, 2.6rem)",
                            width: "200%",
                            textShadow: "0 2px 22px rgba(0,0,0,0.7)",
                          }}
                        >
                          {cat.title}
                        </span>
                        {cat.subtitle && (
                          <span
                            className="label-caps text-ink/75"
                            style={{
                              fontSize: "0.5rem",
                              textShadow: "0 1px 6px rgba(0,0,0,0.7)",
                            }}
                          >
                            {cat.subtitle}
                          </span>
                        )}
                        <span
                          className="pointer-events-auto mt-1 inline-block rounded-full border px-3.5 py-1 uppercase tracking-[0.2em] transition-colors duration-300"
                          style={{
                            fontSize: "0.5rem",
                            borderColor: RED,
                            color: RED,
                            background: "rgba(10,10,10,0.4)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = RED;
                            e.currentTarget.style.color = CREAM;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(10,10,10,0.4)";
                            e.currentTarget.style.color = RED;
                          }}
                        >
                          View Collection
                        </span>
                      </div>
                    ) : (
                      <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/70 to-transparent p-2 pt-8 text-center">
                        <span className="font-display text-xs italic leading-tight text-ink/90">
                          {cat.title}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
