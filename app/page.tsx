import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Story from "@/components/Story";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import Visit from "@/components/Visit";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="grain">
      <Nav />
      <Hero />
      <Marquee />
      <Story />
      <Menu />
      <Gallery />
      <Marquee reverse className="bg-cream-dim" />
      <Visit />
      <Footer />
    </main>
  );
}
