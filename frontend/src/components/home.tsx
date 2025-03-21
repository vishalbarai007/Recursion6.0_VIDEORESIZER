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
// import { BentoGridDemo } from "./ui/Aceternity/bento-grid-demo";

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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            {/* FAQ Item 1 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-semibold mb-2">
                How does the AI video resizing work?
              </h3>
              <p className="text-gray-600">
                Our AI analyzes your video content to identify the most
                important elements and subjects. It then intelligently crops and
                resizes your video to fit different aspect ratios while keeping
                the key content in frame. The AI is trained on thousands of
                videos to understand visual composition and subject tracking.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-semibold mb-2">
                What video formats are supported?
              </h3>
              <p className="text-gray-600">
                We support all major video formats including MP4, MOV, AVI, WMV,
                FLV, and more. Our system can convert between these formats
                while optimizing for quality and file size based on your target
                platform.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-semibold mb-2">
                How long does processing take?
              </h3>
              <p className="text-gray-600">
                Processing time depends on your video length, resolution, and
                our current server load. Most videos under 5 minutes are
                processed within 2-5 minutes. Longer videos or 4K+ content may
                take longer. Pro and Business plans receive priority processing.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-semibold mb-2">
                Can I customize how my video is cropped?
              </h3>
              <p className="text-gray-600">
                Yes! While our AI automatically suggests the best crop, you can
                always preview and adjust the framing before finalizing. The
                dashboard includes an interactive editor where you can fine-tune
                the positioning for each platform.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-semibold mb-2">
                Is there a limit to file size or video length?
              </h3>
              <p className="text-gray-600">
                Free accounts can upload videos up to 500MB and 10 minutes in
                length. Pro accounts extend this to 2GB and 30 minutes, while
                Business accounts can process videos up to 10GB and 2 hours in
                length.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
