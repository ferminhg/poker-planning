import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
      </div>
      <Footer />
    </>
  );
}
