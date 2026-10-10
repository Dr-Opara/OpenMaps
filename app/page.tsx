import { Environments } from "@/components/Environments";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Modes } from "@/components/Modes";
import { Waitlist } from "@/components/Waitlist";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Experience />
        <Environments />
        <Modes />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
