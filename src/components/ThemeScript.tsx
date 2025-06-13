'use client';

import { useEffect } from 'react';

export default function ThemeScript() {
  useEffect(() => {
    // Small delay to ensure hydration is complete
    const timer = setTimeout(() => {
      try {
        const theme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = theme === 'dark' || (!theme && prefersDark);
        
        console.log('ThemeScript: Applying theme', { theme, prefersDark, shouldBeDark });
        
        if (shouldBeDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (error) {
        console.log('Theme application error:', error);
      }
    }, 100); // Small delay to avoid hydration conflicts

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const shouldBeDark = e.newValue === 'dark';
        if (shouldBeDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return null; // This component doesn't render anything
}