"use client";

import { motion } from "framer-motion";

const links = [
  { href: "#collections", label: "Collections" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 bg-paper/80 backdrop-blur-sm border-b border-line"
    >
      <a href="#top" className="font-display text-lg tracking-tight">
        Studio Name
      </a>
      <ul className="hidden sm:flex gap-8 label-caps">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="relative text-ink/80 hover:text-ink transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-clay after:transition-all hover:after:w-full"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
