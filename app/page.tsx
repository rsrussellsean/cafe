import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Menu from "@/components/Menu";
import OrderOnline from "@/components/OrderOnline";
import Testimonials from "@/components/Testimonials";
import Locations from "@/components/Locations";
import ContactForm from "@/components/ContactForm";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="grain">
      <Nav />
      <Hero />
      <Marquee />
      <Menu />
      <OrderOnline />
      <Testimonials />
      <Locations />
      <ContactForm />
      <FAQ />
      <Footer />
    </main>
  );
}
