"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

// Scroll-driven hero (inspiration: sandracreates.com). One pinned container,
// one `scrollYProgress`. Six stages:
//
//   progress       stage
//   0    - 0.20     1  girl.png zooms from full illustration into her face
//   0.20 - 0.26     2  girl fades to a solid-black beat
//   0.24 - 0.30     -  video fades up out of the black
//   0.30 - 0.52     3  RESTING STATE: video loops, "DESIGNER'S / CHAOS" held
//                      close together on top. Nothing moves if the user stops
//                      scrolling — video sustains itself via native `loop`.
//   0.52 - 0.60     4  video fades out + the two words separate & exit,
//                      both tied to this one slice, simultaneously
//   0.58 +          5  bg.jpeg is the visible background — never fades again
//   0.60 - 1.0      6  4 outfit images hard-flip through on rotateX (no fade)
//
// Everything scrubs forward and backward with the scroll.

const GIRL_GONE_AT = 0.26;
// Video plays whenever progress is inside (roughly) stages 2-4.
const VIDEO_RANGE: [number, number] = [0.22, 0.52];

// Per-image scroll ranges in full-progress space.
// [enter start, flat (held from here), flip start, flip end/exit]
// Image 1 has no "flip in" — it just appears flat (starts at rotateX 0),
// holds, then flips away like the rest.
const FLIPS: [number, number, number, number][] = [
  [0.5, 0.5, 0.6, 0.61], // image 1 — appears flat, no entry flip
  [0.6, 0.615, 0.71, 0.72], // image 2
  [0.72, 0.735, 0.83, 0.84], // image 3
  [0.84, 0.855, 0.99, 1.0], // image 4 (holds to the end)
];

function useFlip(progress: MotionValue<number>, i: number) {
  const [enter, flat, flipStart, flipEnd] = FLIPS[i];
  // Image 0 starts flat (0); the rest flip in from edge-on (-90).
  const enterAngle = i === 0 ? 0 : -90;
  // ... -> 0 (flat, held) -> 0 -> 90 (edge-on, leaving).
  // Opacity is a constant 1 — the image vanishing at 90deg is pure geometry.
  return useTransform(
    progress,
    [enter, flat, flipStart, flipEnd],
    [enterAngle, 0, 0, 90],
  );
}

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [girlGone, setGirlGone] = useState(false);
  const [videoActive, setVideoActive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setGirlGone(v > GIRL_GONE_AT + 0.02);
    setVideoActive(v > VIDEO_RANGE[0] && v < VIDEO_RANGE[1]);
  });

  // Stage 3 is a "resting state": the video's native `loop` sustains playback
  // with no scroll input. We only start/stop it as the range is entered/left —
  // scrolling back up into the range re-triggers play(), so it recovers.
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (videoActive) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [videoActive]);

  // Stage 1 — girl zooms into her face.
  const girlScale = useTransform(scrollYProgress, [0, 0.2], [1, 3.4]);
  // Stage 2 — girl crossfades to solid black (the black div below is opaque).
  const girlOpacity = useTransform(scrollYProgress, [0.2, 0.26], [1, 0]);

  // Video fades up out of the black, HOLDS flat through the resting state,
  // then fades out over exactly the same 0.42 -> 0.5 slice the words separate,
  // so it's fully gone the instant they've cleared the frame.
  const videoOpacity = useTransform(
    scrollYProgress,
    [0.24, 0.3, 0.42, 0.5],
    [0, 1, 1, 0],
  );

  // Solid-black beat: opaque only for stage 2, then transparent so the video
  // (and later bg) show through. Reverses cleanly.
  const blackBeatOpacity = useTransform(
    scrollYProgress,
    [0.19, 0.22, 0.29, 0.31],
    [0, 1, 1, 0],
  );

  // Stage 5 — bg.jpeg fades in as the video fades out / words leave, fully
  // there by 0.5, then holds forever. No transform past that point.
  const bgOpacity = useTransform(scrollYProgress, [0.42, 0.5], [0, 1]);

  // The flip stack is hidden until the words have cleared (~0.48).
  const stackVisible = useTransform(scrollYProgress, [0.46, 0.49], [0, 1]);

  // Text: fades in over the video, held close together through the resting
  // state, then separates and exits over a short slice (0.42 -> 0.5) — full
  // opacity the whole time it moves (only the video under it fades).
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.35], [0, 1]);
  const designerY = useTransform(
    scrollYProgress,
    [0.31, 0.35, 0.42, 0.5],
    [40, 0, 0, -900], // settle, hold through resting state, then off the top
  );
  const chaosY = useTransform(
    scrollYProgress,
    [0.31, 0.35, 0.42, 0.5],
    [40, 0, 0, 900], // settle, hold, then off the bottom
  );

  const rotate0 = useFlip(scrollYProgress, 0);
  const rotate1 = useFlip(scrollYProgress, 1);
  const rotate2 = useFlip(scrollYProgress, 2);
  const rotate3 = useFlip(scrollYProgress, 3);
  const rotations = [rotate0, rotate1, rotate2, rotate3];

  return (
    <section ref={containerRef} className="relative h-[680vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Stage 5 — permanent background. Lowest layer, fades in once.
            Source is 2048x3068 (vertical), rotated 90° to fill the viewport
            horizontally — box sized with width/height swapped. */}
        <motion.div
          style={{ opacity: bgOpacity }}
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute left-1/2 top-1/2 h-[100vw] w-[100vh] -translate-x-1/2 -translate-y-1/2 rotate-90">
            <Image
              src="/bg.jpeg"
              alt=""
              fill
              sizes="100vh"
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Solid black beat — sits above bg, below girl/video. Opaque only
            for the stage-2 beat, then clears so bg/video show through. */}
        <motion.div
          style={{ opacity: blackBeatOpacity }}
          className="pointer-events-none absolute inset-0 bg-black"
        />

        {/* Stage 1 — girl. object-contain so progress 0 shows the whole image. */}
        <motion.div
          style={{
            scale: girlScale,
            opacity: girlOpacity,
            transformOrigin: "50% 32%",
            visibility: girlGone ? "hidden" : "visible",
            pointerEvents: "none",
          }}
          className="absolute inset-0 bg-black"
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

        {/* Stage 2/3 — video. Source is 720x1080 (vertical), rotated 90° to
            fill the viewport horizontally. Muted + loop + playsInline so it
            autoplays and sustains itself with no scroll input. */}
        <motion.div
          style={{ opacity: videoOpacity }}
          className="pointer-events-none absolute inset-0 overflow-hidden bg-black"
        >
          <video
            ref={videoRef}
            src="/video.mp4"
            muted
            loop
            playsInline
            preload="auto"
            className="absolute left-1/2 top-1/2 h-[100vw] w-[100vh] max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90 object-cover"
          />
        </motion.div>

        {/* Stage 3/4 — "DESIGNER'S" flies off the top */}
        <motion.h2
          style={{ opacity: textOpacity, y: designerY }}
          className="font-gunter uppercase text-center tracking-[0.04em] text-[13vw] sm:text-[9vw] leading-[0.9] text-paper absolute left-1/2 top-[calc(50%-6vw)] -translate-x-1/2 -translate-y-1/2 w-full px-6"
        >
          Designer&rsquo;s
        </motion.h2>

        {/* "CHAOS" flies off the bottom */}
        <motion.h2
          style={{ opacity: textOpacity, y: chaosY }}
          className="font-gunter uppercase text-center tracking-[0.04em] text-[13vw] sm:text-[9vw] leading-[0.9] text-paper absolute left-1/2 top-[calc(50%+6vw)] -translate-x-1/2 -translate-y-1/2 w-full px-6"
        >
          Chaos
        </motion.h2>

        {/* Stage 6 — flipping outfit stack, full-viewport, over the static bg.
            perspective on the parent makes rotateX read as a real 3D flip. */}
        <motion.div
          style={{ perspective: 1200, opacity: stackVisible }}
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
        </motion.div>
      </div>
    </section>
  );
}
