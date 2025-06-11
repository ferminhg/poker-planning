'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {isHomePage && <Navbar />}
      <div className={`flex-1 ${isHomePage ? '' : 'container mx-auto px-4 py-8'}`}>
        {children}
      </div>
      <Footer />
    </div>
  );
}