import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import AsSeenIn from "@/components/AsSeenIn";
import HowItWorks from "@/components/HowItWorks";
import Traditions from "@/components/Traditions";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <AsSeenIn />
        <HowItWorks />
        <Traditions />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
