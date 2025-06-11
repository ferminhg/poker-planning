import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Features />
      <HowItWorks />
    </Layout>
  );
}
