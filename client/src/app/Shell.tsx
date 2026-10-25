import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const Shell: React.FC = () => {
  const { pathname } = useLocation();

  // Scroll to top on every page change so people never land mid-page.
  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">
      <Header />
      {/* Full-width content. Top/bottom padding clears the fixed header + footer. */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 pt-6 pb-[calc(var(--bar-h)+32px)]">
        <div key={pathname} className="animate-slide-up">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};
