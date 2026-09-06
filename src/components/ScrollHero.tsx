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

const GIRL_GONE_AT = 0.225;
// Video plays whenever progress is inside (roughly) stages 2-4.
const VIDEO_RANGE: [number, number] = [0.22, 0.52];

// Per-image scroll ranges in full-progress space: [flipIn, flat, flat, flipOut].
// Windows abut with no overlap — one card flips in, sits flat and readable for
// most of its range, then flips out just as the next flips in. Image 1 starts
// already flat (no flip-in). Image 4 holds flat to the end (no flip-out).
const FLIPS: [number, number, number, number][] = [
  [0.5, 0.5, 0.615, 0.635], // image 1 — appears flat, holds, flips out
  [0.615, 0.635, 0.75, 0.77], // image 2
  [0.75, 0.77, 0.885, 0.905], // image 3
  [0.885, 0.905, 1.0, 1.0], // image 4 — flips in, holds flat to the end
];

function useFlip(progress: MotionValue<number>, i: number) {
  const [flipIn, flat1, flat2, flipOut] = FLIPS[i];
  const enterAngle = i === 0 ? 0 : -90; // image 1 is already flat at the start
  const rotateX = useTransform(
    progress,
    [flipIn, flat1, flat2, flipOut],
    [enterAngle, 0, 0, 90],
  );
  // Hard on/off: a card is only rendered inside its own window. Outside it,
  // opacity 0 — so a clamped card sitting edge-on can never dim the one
  // that's actually flat and on screen. Keyframes stay within [0, 1]; the
  // last card (flipOut == 1) just stays on once it has flipped in.
  const EPS = 0.001;
  const onAt = Math.max(0, flipIn - EPS);
  const offAt = Math.min(1, flipOut + EPS);
  const offOut = flipOut >= 1 ? 1 : 0;
  const opacity = useTransform(
    progress,
    [onAt, flipIn, Math.min(flipOut, offAt - EPS / 2), offAt],
    [0, 1, 1, offOut],
  );
  return { rotateX, opacity };
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
  // Stage 2 — girl snaps to black quickly at the end of the zoom.
  const girlOpacity = useTransform(scrollYProgress, [0.2, 0.225], [1, 0]);

  // Solid-black beat: a quick flash between the girl and the video — opaque
  // for only a sliver of scroll, then gone. Reverses cleanly.
  const blackBeatOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.225, 0.245, 0.27],
    [0, 1, 1, 0],
  );

  // Video fades up as the black beat clears, HOLDS flat through the resting
  // state, then fades out over exactly the same 0.42 -> 0.5 slice the words
  // separate, so it's gone the instant they've cleared the frame.
  const videoOpacity = useTransform(
    scrollYProgress,
    [0.24, 0.28, 0.42, 0.5],
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

  const flip0 = useFlip(scrollYProgress, 0);
  const flip1 = useFlip(scrollYProgress, 1);
  const flip2 = useFlip(scrollYProgress, 2);
  const flip3 = useFlip(scrollYProgress, 3);
  const flips = [flip0, flip1, flip2, flip3];

  return (
    <section ref={containerRef} className="relative h-[680vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Stage 5 — permanent background. Plain CSS background-image so nothing
            about it can animate: it just fades in once (opacity) and holds.
            Source is vertical (2048x3068); rotate the layer 90° to lie
            horizontally, box sized with width/height swapped. */}
        <motion.div
          style={{ opacity: bgOpacity }}
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute left-1/2 top-1/2 h-[100vw] w-[100vh] -translate-x-1/2 -translate-y-1/2 rotate-90 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/bg.jpeg)" }}
          />
        </motion.div>

        {/* Solid black beat — sits above bg, below girl/video. Opaque only
            for the stage-2 beat, then clears so bg/video show through. */}
        <motion.div
          style={{ opacity: blackBeatOpacity }}
          className="pointer-events-none absolute inset-0 bg-black"
        />

        {/* Stage 1 — girl. girl_extended.png has red bleed on all sides so it
            can cover the whole viewport with object-cover, no letterbox. */}
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
            src="/girl_extended.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_75%]"
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
          className="font-gunter uppercase text-center tracking-[0.04em] text-[13vw] sm:text-[9vw] leading-[0.9] text-ink absolute left-1/2 top-[calc(50%-6vw)] -translate-x-1/2 -translate-y-1/2 w-full px-6"
        >
          Designer&rsquo;s
        </motion.h2>

        {/* "CHAOS" flies off the bottom */}
        <motion.h2
          style={{ opacity: textOpacity, y: chaosY }}
          className="font-gunter uppercase text-center tracking-[0.04em] text-[13vw] sm:text-[9vw] leading-[0.9] text-ink absolute left-1/2 top-[calc(50%+6vw)] -translate-x-1/2 -translate-y-1/2 w-full px-6"
        >
          Chaos
        </motion.h2>

        {/* Stage 6 — flipping outfit stack, full-viewport, over the static bg.
            perspective on the parent makes rotateX read as a real 3D flip. */}
        <motion.div
          style={{ perspective: 1200, opacity: stackVisible }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2"
        >
          {flips.map((f, i) => (
            <motion.div
              key={i}
              style={{
                rotateX: f.rotateX,
                opacity: f.opacity,
                transformStyle: "preserve-3d",
                transformPerspective: 1200,
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
