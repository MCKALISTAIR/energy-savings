import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import BenefitsSection from '@/components/landing/BenefitsSection';
import StatsSection from '@/components/landing/StatsSection';
import CTASection from '@/components/landing/CTASection';
import { useIsMobile } from '@/hooks/use-mobile';

const Landing: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen" role="main">
      <HeroSection />
      <FeaturesGrid />
      {isMobile ? (
        <>
          <StatsSection />
          <BenefitsSection />
        </>
      ) : (
        <>
          <BenefitsSection />
          <StatsSection />
        </>
      )}
      <CTASection />
    </div>
  );
};

export default Landing;