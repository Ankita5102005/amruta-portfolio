"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

// Scroll-driven hero (inspiration: sandracreates.com). One pinned container,
// one `scrollYProgress`. Stages:
//
//   progress       stage
//   0    - 0.28     1  girl.png zooms from full illustration into her face
//   0.28 - 0.35     2  girl fades to a solid-black beat
//   0.33 - 0.42     -  video fades up out of the black
//   0.42 - 0.78     3  RESTING STATE: video loops, "DESIGNER'S / CHAOS" held
//                      close together on top. Nothing moves if the user stops
//                      scrolling — video sustains itself via native `loop`.
//   0.78 - 0.95     4  video fades out + the two words separate & exit,
//                      both tied to this one slice, simultaneously
//
// After this section the page scrolls straight into the category carousel.
// Everything scrubs forward and backward with the scroll.

const GIRL_GONE_AT = 0.33;
// Video plays whenever progress is inside (roughly) stages 2-4.
const VIDEO_RANGE: [number, number] = [0.3, 0.96];

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

  // Stage 1 — girl zooms into her face. Slight initial zoom so she reads
  // bigger from the first frame.
  const girlScale = useTransform(scrollYProgress, [0, 0.28], [1.1, 3.4]);
  // Stage 2 — girl snaps to black quickly at the end of the zoom.
  const girlOpacity = useTransform(scrollYProgress, [0.28, 0.33], [1, 0]);

  // Solid-black beat: a quick flash between the girl and the video.
  const blackBeatOpacity = useTransform(
    scrollYProgress,
    [0.28, 0.33, 0.36, 0.4],
    [0, 1, 1, 0],
  );

  // Video fades up as the black beat clears, HOLDS flat through the resting
  // state, then fades out over the same slice the words separate.
  const videoOpacity = useTransform(
    scrollYProgress,
    [0.33, 0.42, 0.78, 0.92],
    [0, 1, 1, 0],
  );

  // Text: fades in over the video, held close together through the resting
  // state, then separates and exits — full opacity the whole time it moves
  // (only the video under it fades).
  const textOpacity = useTransform(scrollYProgress, [0.44, 0.5], [0, 1]);
  const designerY = useTransform(
    scrollYProgress,
    [0.46, 0.5, 0.78, 0.92],
    [40, 0, 0, -900], // settle, hold through resting state, then off the top
  );
  const chaosY = useTransform(
    scrollYProgress,
    [0.46, 0.5, 0.78, 0.92],
    [40, 0, 0, 900], // settle, hold, then off the bottom
  );

  return (
    <section ref={containerRef} className="relative h-[520vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Stage 1 — girl. girl_extended.png has red bleed on all sides so it
            can cover the whole viewport with object-cover, no letterbox. */}
        <motion.div
          style={{
            opacity: girlOpacity,
            visibility: girlGone ? "hidden" : "visible",
            pointerEvents: "none",
          }}
          className="absolute inset-0 overflow-hidden bg-black"
        >
          {/* scale the image itself from its own centre so the zoom has no
              horizontal drift; object-position only frames it left of centre */}
          <motion.div
            style={{ scale: girlScale, transformOrigin: "center 34%" }}
            className="absolute inset-0"
          >
            <Image
              src="/girl_extended.png"
              alt=""
              fill
              priority
              sizes="100vw"
              // mobile: centred & higher so the whole face shows on a narrow
              // portrait screen; desktop: framed slightly left
              className="object-cover object-[50%_38%] md:object-[58%_75%]"
            />
          </motion.div>
        </motion.div>

        {/* Solid black beat — sits above girl, below video. Opaque only for
            the stage-2 beat, then clears so the video shows through. */}
        <motion.div
          style={{ opacity: blackBeatOpacity }}
          className="pointer-events-none absolute inset-0 bg-black"
        />

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
          className="select-none font-gunter uppercase text-center tracking-[0.04em] text-[13vw] sm:text-[9vw] leading-[0.9] text-ink absolute left-1/2 top-[calc(50%-6vw)] -translate-x-1/2 -translate-y-1/2 w-full px-6"
        >
          Designer&rsquo;s
        </motion.h2>

        {/* "CHAOS" flies off the bottom */}
        <motion.h2
          style={{ opacity: textOpacity, y: chaosY }}
          className="select-none font-gunter uppercase text-center tracking-[0.04em] text-[13vw] sm:text-[9vw] leading-[0.9] text-ink absolute left-1/2 top-[calc(50%+6vw)] -translate-x-1/2 -translate-y-1/2 w-full px-6"
        >
          Chaos
        </motion.h2>
      </div>
    </section>
  );
}
