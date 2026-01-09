
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/planner', label: 'PLANNER' },
    { path: '/journal', label: 'JOURNAL' },
    { path: '/habit', label: 'HABIT' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-8 text-center">
        <Link to="/" className="text-4xl md:text-6xl font-bold tracking-widest text-[#5E4C06] hover:text-[#5FB37A] transition-colors duration-300">
          WALKER
        </Link>
      </header>

      <nav className="relative z-50 bg-[#A8FCB0] text-[#5E4C06]">
        {/* Mobile Hamburger */}
        <div 
          className="md:hidden flex justify-center py-3 cursor-pointer text-3xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          &#9776;
        </div>

        {/* Desktop and Mobile Menu */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center justify-around`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`w-full md:w-1/3 py-4 text-center text-lg md:text-xl font-semibold transition-all duration-300 ${
                location.pathname === link.path 
                ? 'bg-[#5E4C06] text-[#F4F0E4]' 
                : 'hover:bg-[#5E4C06] hover:text-[#F4F0E4]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8 mb-24">
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-[#5E4C06] text-[#F4F0E4] py-4 text-center z-40">
        <h2 className="text-sm md:text-base font-medium">Walker - Created by Lee Gallagher 2025</h2>
      </footer>
    </div>
  );
};

export default Layout;
