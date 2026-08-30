export default function Footer() {
  return (
    <footer className="px-6 md:px-10 py-8 border-t border-line flex items-center justify-between label-caps text-ink/50">
      <span>© {new Date().getFullYear()} Studio Name</span>
      <span>Built by hand, in the studio</span>
    </footer>
  );
}
