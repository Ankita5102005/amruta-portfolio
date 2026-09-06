import Hero from "@/components/Hero";
import ScrollHero from "@/components/ScrollHero";
import CategoryWheel from "@/components/CategoryWheel";
import Marquee from "@/components/Marquee";
import CollectionGrid from "@/components/CollectionGrid";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <ScrollHero />
        <CategoryWheel />
        <Hero />
        <Marquee />
        <CollectionGrid />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
