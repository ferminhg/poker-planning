'use client';

import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function ClientThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder that matches the ThemeToggle dimensions
    return (
      <div className="p-3 rounded-lg border border-gray-300 bg-white flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-8 h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>
    );
  }

  return <ThemeToggle />;
}