"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAnimationFrame } from "framer-motion";
import { categories } from "@/data/categories";

const RED = "#D02C1E";
const RED_LIGHT = "#e8695d"; // light-red fill for the View Collection pill
const CREAM = "#f0ece3";
const CARD_BG = "#2a2a2a"; // lighter than the noir section bg, visible border-less fill
const CARD_BORDER = "rgba(240, 236, 227, 0.18)"; // simple cream-tinted border, no glow
const SPEED = 0.0084; // degrees per millisecond — ambient drift (was 0.006)
const START_HOLD_MS = 2000; // land on categories[0], wait, then rotate
const MOBILE_BP = 768;

export default function CategoryWheel() {
  const count = categories.length;
  const angleStep = 360 / count;

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

  // 2.5D carousel: cards stay perfectly upright and flat (no 3D tilt). They
  // arc left/right around the centre and recede in scale/blur — the "behind"
  // cards read as smaller, dimmer copies further back, always straight.
  const spread = isMobile ? 180 : 360; // px between adjacent card centres
  const baseCard = isMobile ? 220 : 320;

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24"
      style={{ background: "#d9d9d9" }}
    >
      <div
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        className="relative h-[68vh] w-full max-w-6xl"
      >
        {categories.map((cat, i) => {
          // signed slot offset from the centre, wrapping so it's the shortest way
          let slot = i - rotation / angleStep;
          if (slot > count / 2) slot -= count;
          if (slot < -count / 2) slot += count;

          const dist = Math.abs(slot);
          const isActive = dist < 0.5;
          const hidden = dist > 3.2; // only the nearest few render

          // straight cards: x arcs out, scale/opacity recede, no rotation
          const x = slot * spread;
          const scale = isActive ? 1.25 : Math.max(0.45, 1 - dist * 0.22);
          const opacity = hidden ? 0 : Math.max(0, 1 - dist * 0.3);
          const blur = dist < 0.6 ? 0 : Math.min(4, (dist - 0.6) * 2);

          const href =
            cat.externalHref ??
            (cat.id === "editorial-design"
              ? "/portfolio/editorial-design"
              : `/portfolio/${cat.id}`);
          const linkProps = cat.externalHref
            ? { target: "_blank", rel: "noreferrer" }
            : {};

          return (
            <div
              key={cat.id}
              style={{
                transform: `translate(-50%, -50%) translateX(${x}px) scale(${scale})`,
                opacity,
                filter: `blur(${blur}px)`,
                width: baseCard,
                marginLeft: -baseCard / 2,
                marginTop: -baseCard / 2,
                zIndex: 100 - Math.round(dist * 10),
                pointerEvents: hidden ? "none" : "auto",
                transition: "transform 0.5s ease, opacity 0.5s ease, filter 0.5s ease",
              }}
              className="absolute left-1/2 top-1/2 flex flex-col items-center gap-3"
            >
              <Link href={href} {...linkProps} className="block w-full" style={{ height: baseCard }}>
                <div
                  style={{
                    background: cat.cover ? CARD_BG : cat.gradient,
                    borderColor: CARD_BORDER,
                  }}
                  className="relative h-full w-full overflow-hidden border"
                >
                  {cat.cover && (
                    <Image
                      src={cat.cover}
                      alt=""
                      fill
                      sizes={`${baseCard}px`}
                      className="object-cover"
                    />
                  )}
                  {!cat.cover &&
                    (isActive ? (
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                        <span
                          className="font-display italic leading-[1.0] text-ink"
                          style={{
                            fontSize: "clamp(1.5rem, 4.2vw, 2.8rem)",
                            width: "190%",
                            textShadow: "0 2px 22px rgba(0,0,0,0.7)",
                          }}
                        >
                          {cat.title}
                        </span>
                        {cat.subtitle && (
                          <span
                            className="label-caps text-ink/75"
                            style={{
                              fontSize: "0.55rem",
                              textShadow: "0 1px 6px rgba(0,0,0,0.7)",
                            }}
                          >
                            {cat.subtitle}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/70 to-transparent p-2 pt-8 text-center">
                        <span className="font-display text-xs italic leading-tight text-ink/90">
                          {cat.title}
                        </span>
                      </div>
                    ))}
                </div>
              </Link>

              {/* View Collection — below the square, not overlaid on it */}
              {isActive && (
                <Link
                  href={href}
                  {...linkProps}
                  className="inline-block rounded-full px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-300"
                  style={{ background: RED_LIGHT, color: "#1a0a08" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = RED;
                    e.currentTarget.style.color = CREAM;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = RED_LIGHT;
                    e.currentTarget.style.color = "#1a0a08";
                  }}
                >
                  View Collection
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
