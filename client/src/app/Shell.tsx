import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileMenu } from './MobileMenu';

export const Shell: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        <Outlet />
      </main>
      <Footer />
      <MobileMenu />
    </div>
  );
};
