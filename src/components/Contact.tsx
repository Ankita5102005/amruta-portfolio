"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section
      id="contact"
      className="px-6 md:px-10 py-24 md:py-32 border-t border-line"
    >
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="label-caps text-clay mb-6"
      >
        Get in Touch
      </motion.p>

      <motion.a
        href="mailto:studio@example.com"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="group inline-block font-display text-[9vw] sm:text-6xl italic leading-none"
      >
        studio@example.com
        <motion.span
          className="block h-px bg-ink mt-2 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        />
      </motion.a>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex gap-8 mt-12 label-caps"
      >
        <a href="#" className="hover:text-clay transition-colors">Instagram</a>
        <a href="#" className="hover:text-clay transition-colors">Pinterest</a>
        <a href="#" className="hover:text-clay transition-colors">LinkedIn</a>
      </motion.div>
    </section>
  );
}
