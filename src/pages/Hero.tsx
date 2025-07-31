//@ts-nocheck

import HeroCarousel from "@/components/HeroCarousel";
import FeatureCards from "@/components/FeatureCards";
import ProductCarousel from "@/components/ProducCarousel";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { TagProductSection } from "@/components/FeatureProducts";

const Hero = () => {
  return (
    <>
      <Helmet>
        <title>
          Chennai Sparkle Crackers | Buy Quality Crackers Online from Sivakasi
        </title>
        <meta
          name="description"
          content="Buy quality fireworks and crackers online at the lowest price from Chennai Sparkle Crackers, Sivakasi — the Crackers City of India."
        />
        <meta
          name="keywords"
          content="buy crackers online, sivakasi crackers, fireworks, Chennai Sparkle Crackers, crackers city, quality crackers, cheap crackers, diwali crackers, discount crackers"
        />
        <meta
          property="og:title"
          content="Chennai Sparkle Crackers - Quality Crackers from Sivakasi"
        />
        <meta
          property="og:description"
          content="Get the best deals on crackers directly from Sivakasi – India's Crackers City. Safe, certified, and budget-friendly fireworks."
        />
        <meta property="og:image" content="/meta/home-banner.jpg" />
        <meta property="og:url" content="https://ChennaiSparkleCrackers.com/" />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <section className="flex-1">
          <HeroCarousel />
        </section>
        <section className="relative mt-12">
          <FeatureCards />
        </section>
        <section className="px-2 sm:px-4 md:px-6 lg:px-10 space-y-8">
          <TagProductSection tag="New Arrival" title="✨ New Arrivals" />
          <TagProductSection
            tag="Childrens Items"
            title="🧒 Children’s Picks"
          />
          <TagProductSection tag="Best Selling" title="🔥 Best Sellers" />
        </section>
        <section>
          <ProductCarousel />
        </section>
        <section>
          <Footer />
        </section>
      </div>
    </>
  );
};

export default Hero;
