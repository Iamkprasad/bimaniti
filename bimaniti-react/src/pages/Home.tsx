import { StackingSection } from '../components/StackingSection';
import { FeaturedPosts } from '../components/FeaturedPosts';
import { LatestNews } from '../components/LatestNews';
import { AboutSection } from '../components/AboutSection';
import { HeroSection } from '../components/HeroSection';

export const Home = () => {
  return (
    <>
      <HeroSection />
      <StackingSection />
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <FeaturedPosts />
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <LatestNews />
        </div>
      </section>
      <AboutSection />
    </>
  );
};