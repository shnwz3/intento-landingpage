import { Features } from '../components/Features';
import { Hero } from '../components/Hero';
import { PricingPreview } from '../components/PricingPreview';
import { SecuritySection } from '../components/SecuritySection';
import { VideoDemo } from '../components/VideoDemo';

export function LandingPage() {
  return (
    <>
      <Hero />
      <div id="features">
        <Features />
      </div>
      <VideoDemo />
      <PricingPreview />
      <SecuritySection />
    </>
  );
}
