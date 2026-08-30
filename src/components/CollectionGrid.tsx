"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function CollectionGrid() {
  const [openId, setOpenId] = useState<string | null>(null);
  const openProject = projects.find((p) => p.id === openId) ?? null;

  return (
    <section id="collections" className="px-6 md:px-10 py-24 md:py-32">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="label-caps text-clay mb-4"
      >
        Selected Work
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display text-4xl md:text-5xl italic mb-16 max-w-xl"
      >
        Six collections, one process.
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onOpen={setOpenId} />
        ))}
      </motion.div>

      {/* Detail overlay — expands from the clicked card via layoutId */}
      <AnimatePresence>
        {openProject && (
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenId(null)}
          >
            <motion.div
              className="bg-paper max-w-3xl w-full grid md:grid-cols-2 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                layoutId={`image-${openProject.id}`}
                style={{ background: openProject.gradient }}
                className="aspect-[3/4] md:aspect-auto md:h-full"
              />
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <p className="label-caps text-clay">{openProject.look}</p>
                <h3 className="font-display text-3xl italic mt-2">
                  {openProject.title}
                </h3>
                <p className="label-caps text-ink/50 mt-1">
                  {openProject.category} · {openProject.year}
                </p>
                <p className="mt-6 text-ink/70">{openProject.description}</p>
                <button
                  onClick={() => setOpenId(null)}
                  className="label-caps mt-10 self-start border-b border-ink/40 pb-1 hover:border-clay hover:text-clay transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
