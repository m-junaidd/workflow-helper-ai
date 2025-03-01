
import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="py-6 px-4 border-t border-gray-100">
        <div className="container mx-auto">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} AI Tool Finder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
