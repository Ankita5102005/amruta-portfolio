"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

// Scroll-driven hero (inspiration: sandracreates.com).
// One `scrollYProgress` drives every layer:
//   0      -> whole girl illustration, uncropped
//   0-0.4  -> zoom into her face
//   ~0.4   -> cut to black
//   0.42+  -> cobweb + "DESIGNER'S / CHAOS" fade in
//   0.52+  -> the two words fly straight off the top / bottom of the frame
//             (no opacity change — they stay solid until physically gone)
//   0.58+  -> 4 garment cutouts flip through, card-style, one axis, no fade.
//             Most of the scroll is spent holding each image flat & readable;
//             the flip itself is a short slice at the end of each image's range.
// Everything scrubs forward and backward with the scroll.
const CROSSFADE = 0.42;

// Per-image scroll ranges in full-progress space.
// [enter start, flat (held from here), flip start, flip end/exit]
// The flip only happens over [flip start -> flip end]; everything before
// that is the image sitting still. Next image's enter overlaps the previous
// image's flip so there's never a frame with nothing flat on screen.
const FLIPS: [number, number, number, number][] = [
  [0.56, 0.575, 0.655, 0.665], // image 1
  [0.655, 0.67, 0.75, 0.76], // image 2
  [0.75, 0.765, 0.845, 0.855], // image 3
  [0.845, 0.86, 0.99, 1.0], // image 4 (holds to the end)
];

function useFlip(progress: MotionValue<number>, i: number) {
  const [enter, flat, flipStart, flipEnd] = FLIPS[i];
  // -90 (edge-on, entering) -> 0 (flat, held) -> 0 -> 90 (edge-on, leaving).
  // Opacity is a constant 1 — the image vanishing at 90deg is pure geometry.
  const rotateX = useTransform(
    progress,
    [enter, flat, flipStart, flipEnd],
    [-90, 0, 0, 90],
  );
  return rotateX;
}

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [girlGone, setGirlGone] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setGirlGone(v > CROSSFADE + 0.03);
  });

  // Girl — starts at scale 1, zooms in. clamp:true (default) caps the ends.
  const girlScale = useTransform(scrollYProgress, [0, 0.4], [1, 3.4]);
  const girlOpacity = useTransform(scrollYProgress, [0.3, 0.4], [1, 0]);

  // Black holds solid from the wipe onward.
  const blackOpacity = useTransform(scrollYProgress, [0.26, 0.38], [0, 1]);

  // Cobweb fades up out of the black, settles by 0.5, then fades back to
  // solid black as the text exits — flips begin on clean black.
  const cobwebOpacity = useTransform(
    scrollYProgress,
    [0.42, 0.5, 0.52, 0.57],
    [0, 1, 1, 0],
  );
  const cobwebScale = useTransform(scrollYProgress, [0.42, 0.5], [1.1, 1]);

  // "DESIGNER'S CHAOS" fades in (opacity only here), settles, then the two
  // words fly clean off the frame — up and down — at a constant opacity 1.
  const textOpacity = useTransform(scrollYProgress, [0.42, 0.48], [0, 1]);
  const designerY = useTransform(
    scrollYProgress,
    [0.44, 0.48, 0.5, 0.57],
    [40, 0, 0, -900], // px: settle, hold, then well past the top edge
  );
  const chaosY = useTransform(
    scrollYProgress,
    [0.44, 0.48, 0.5, 0.57],
    [40, 0, 0, 900], // px: settle, hold, then well past the bottom edge
  );

  const rotate0 = useFlip(scrollYProgress, 0);
  const rotate1 = useFlip(scrollYProgress, 1);
  const rotate2 = useFlip(scrollYProgress, 2);
  const rotate3 = useFlip(scrollYProgress, 3);
  const rotations = [rotate0, rotate1, rotate2, rotate3];

  return (
    <section ref={containerRef} className="relative h-[560vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Girl layer — object-contain so progress 0 shows the entire image */}
        <motion.div
          style={{
            scale: girlScale,
            opacity: girlOpacity,
            transformOrigin: "50% 32%",
            visibility: girlGone ? "hidden" : "visible",
            pointerEvents: "none",
          }}
          className="absolute inset-0"
        >
          <Image
            src="/girl.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-contain"
          />
        </motion.div>

        {/* Black wipe */}
        <motion.div
          style={{ opacity: blackOpacity }}
          className="pointer-events-none absolute inset-0 bg-black"
        />

        {/* Cobweb — vertical photo rotated 90° to lie horizontally */}
        <motion.div
          style={{ opacity: cobwebOpacity }}
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <motion.div
            style={{ scale: cobwebScale }}
            className="absolute left-1/2 top-1/2 h-[100vw] w-[100vh] -translate-x-1/2 -translate-y-1/2 rotate-90"
          >
            <Image
              src="/cobweb.jpeg"
              alt=""
              fill
              sizes="100vh"
              className="object-cover"
            />
          </motion.div>
        </motion.div>

        {/* "DESIGNER'S" — flies off the top. Starts snug above center. */}
        <motion.h2
          style={{ opacity: textOpacity, y: designerY }}
          className="font-gunter uppercase text-center tracking-[0.04em] text-[13vw] sm:text-[9vw] leading-[0.9] text-paper absolute left-1/2 top-[calc(50%-6vw)] -translate-x-1/2 -translate-y-1/2 w-full px-6"
        >
          Designer&rsquo;s
        </motion.h2>

        {/* "CHAOS" — flies off the bottom. Starts snug below center. */}
        <motion.h2
          style={{ opacity: textOpacity, y: chaosY }}
          className="font-gunter uppercase text-center tracking-[0.04em] text-[13vw] sm:text-[9vw] leading-[0.9] text-paper absolute left-1/2 top-[calc(50%+6vw)] -translate-x-1/2 -translate-y-1/2 w-full px-6"
        >
          Chaos
        </motion.h2>

        {/* Flipping garment stack — dead center, where the text was.
            perspective on the parent makes rotateX read as a real 3D flip. */}
        <div
          style={{ perspective: 1200 }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2"
        >
          {rotations.map((rotateX, i) => (
            <motion.div
              key={i}
              style={{
                rotateX,
                opacity: 1,
                transformStyle: "preserve-3d",
                transformPerspective: 1200,
                backfaceVisibility: "hidden",
              }}
              className="absolute inset-0"
            >
              <Image
                src={`/${i + 1}.png`}
                alt=""
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
