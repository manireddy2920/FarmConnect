import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/consumer/HeroSection';
import FeaturesSection from '@/components/consumer/FeaturesSection';
import HowItWorks from '@/components/consumer/HowItWorks';
import FarmerStories from '@/components/consumer/FarmerStories';
import StatsSection from '@/components/consumer/StatsSection';
import CTASection from '@/components/consumer/CTASection';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <FarmerStories />
      <CTASection />
      <Footer />
    </div>
  );
}
