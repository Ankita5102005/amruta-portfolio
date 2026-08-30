"use client";

import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

export default function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (id: string) => void;
}) {
  return (
    <motion.button
      layoutId={`card-${project.id}`}
      onClick={() => onOpen(project.id)}
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
      }}
      className="group text-left w-full"
    >
      <motion.div
        layoutId={`image-${project.id}`}
        style={{ background: project.gradient }}
        className="aspect-[3/4] w-full overflow-hidden relative"
      >
        {/*
          Replace this gradient div with a real photo once you have one:
          <Image src={project.photo} alt={project.title} fill
                 className="object-cover" />
          Keep the layoutId on whichever element wraps the image.
        */}
        <motion.div
          className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-300"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </motion.div>

      <div className="flex items-baseline justify-between mt-4">
        <div>
          <p className="label-caps text-clay">{project.look}</p>
          <h3 className="font-display text-xl italic mt-1">{project.title}</h3>
        </div>
        <p className="label-caps text-ink/50">{project.year}</p>
      </div>
    </motion.button>
  );
}
