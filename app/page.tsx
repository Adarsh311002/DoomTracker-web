import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { OpportunityCost } from "@/components/sections/OpportunityCost";
import { Features } from "@/components/sections/Features";
import { Goals } from "@/components/sections/Goals";
import { Trends } from "@/components/sections/Trends";
import { Architecture } from "@/components/sections/Architecture";
import { HonestLimits } from "@/components/sections/HonestLimits";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Problem />
        <HowItWorks />
        <OpportunityCost />
        <Features />
        <Goals />
        <Trends />
        <Architecture />
        <HonestLimits />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
