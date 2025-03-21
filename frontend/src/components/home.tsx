import React from "react";
import { Helmet } from "react-helmet";
import Header from "./landing/Header";
import HeroSection from "./landing/HeroSection";
import FeaturesSection from "./landing/FeaturesSection";
import ContentSection from "./landing/ContentSection";
import Footer from "./landing/Footer";
import { BentoGridThirdDemo } from "./ui/Aceternity/bento-grid-demo";
import { GlowingEffectDemo } from "./ui/Aceternity/GlowingEffectDemo";
import Pricing from "./landing/Pricing";
import FAQSection from "./landing/FAQAccordion";
// import FAQSection from "./landing/FAQSection";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>VideoAI - AI-Powered Video Resizer & Format Converter</title>
        <meta
          name="description"
          content="Automatically resize and optimize your videos for every social media platform with our AI-powered tool."
        />
      </Helmet>

      {/* Navigation Header */}
      <Header
        logo="VideoAI"
        navLinks={[
          { label: "Home", href: "/" },
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "About", href: "#about" },
          { label: "Contact", href: "#contact" },
        ]}
        ctaText="Get Started"
        ctaHref="/dashboard"
      />

      {/* Hero Section */}
      <HeroSection
        title="Resize and Optimize Your Videos for Every Platform in One Click"
        subtitle="Our AI-powered tool automatically adjusts your videos for YouTube, Instagram, TikTok, and more - saving you hours of manual editing work."
        ctaText="Start Now"
        watchDemoText="Watch Demo"
      />

      {/* Features Section */}
      <GlowingEffectDemo/>
      <ContentSection />

      {/* Pricing Section - Could be added here */}
     <Pricing/>
      {/* FAQ Section */}
      <FAQSection/>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
