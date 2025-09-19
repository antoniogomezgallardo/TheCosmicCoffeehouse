import React, { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-16">
        {children}
      </main>
      <footer className="bg-cosmic-space bg-opacity-50 border-t border-cosmic-cyan mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-cosmic-cyan">
            <p className="text-cyber mb-2">The Cosmic Coffeehouse</p>
            <p className="text-sm opacity-75">
              Serving superpowers since 2390 • Made with quantum love
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;