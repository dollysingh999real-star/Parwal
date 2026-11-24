import { useCallback, useMemo, useState } from 'react';
import AboutSection from './components/AboutSection';
import ContactFooterSection from './components/ContactFooterSection';
import HeroSection from './components/HeroSection';
import IntroOverlay from './components/IntroOverlay';
import MarqueeTicker from './components/MarqueeTicker';
import PartnersSection from './components/PartnersSection';
import ReadingProgressBar from './components/ReadingProgressBar';
import ServicesSection from './components/ServicesSection';
import StorySection from './components/StorySection';
import { SERVICES_LIST } from './data/firmData';

export default function App() {
  const [activeServiceId, setActiveServiceId] = useState<string>(SERVICES_LIST[0].id);

  const skipIntro = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('autostart') === '1';
  }, []);

  const [introDone, setIntroDone] = useState<boolean>(() => skipIntro);

  const handleIntroComplete = useCallback(() => {
    setIntroDone(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#020202] text-[#FFFFFF]">
      <ReadingProgressBar />
      <IntroOverlay skipIntro={skipIntro} onComplete={handleIntroComplete} />
      <main>
        <HeroSection introDone={introDone} />
        <MarqueeTicker />
        <AboutSection />
        <ServicesSection
          activeServiceId={activeServiceId}
          onSelectService={setActiveServiceId}
        />
        <PartnersSection />
        <StorySection />
        <ContactFooterSection onSelectServiceFromFooter={setActiveServiceId} />
      </main>
    </div>
  );
}
