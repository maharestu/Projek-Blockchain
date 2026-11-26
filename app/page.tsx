import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import AboutSection from '@/components/landing/AboutSection';
import ScholarshipSection from '@/components/landing/ScholarshipSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import RolesSection from '@/components/landing/RolesSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import FAQSection from '@/components/landing/FAQSection';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ScholarshipSection />
      <HowItWorksSection />
      <RolesSection />
      <BenefitsSection />
      <FAQSection />
    </div>
  );
}
