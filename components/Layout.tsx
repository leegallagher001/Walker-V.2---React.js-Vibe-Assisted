
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { path: '/planner', label: 'PLANNER' },
    { path: '/journal', label: 'JOURNAL' },
    { path: '/habit', label: 'HABIT' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-8 text-center relative">
        <Link to="/" className="text-4xl md:text-6xl font-bold tracking-widest text-[#5E4C06] hover:text-[#5FB37A] transition-colors duration-300 uppercase">
          WALKER
        </Link>
        
        {user && (
          <div className="hidden md:flex absolute top-10 right-10 items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#5E4C06]/40">Active Explorer</p>
              <p className="text-sm font-bold text-[#5E4C06]">{user.name}</p>
            </div>
            <button 
              onClick={logout}
              className="w-10 h-10 rounded-full bg-[#5E4C06] text-[#F4F0E4] flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg group"
              title="Sign Out"
            >
              <span className="group-hover:hidden">👤</span>
              <span className="hidden group-hover:inline text-xs font-bold">BYE</span>
            </button>
          </div>
        )}
      </header>

      <nav className="relative z-50 bg-[#A8FCB0] text-[#5E4C06] border-y border-black/5">
        {/* Mobile Hamburger */}
        <div 
          className="md:hidden flex justify-between items-center px-6 py-3 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="text-2xl">&#9776;</span>
          {user && <span className="text-xs font-bold italic">{user.name}</span>}
        </div>

        {/* Desktop and Mobile Menu */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center justify-around`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`w-full md:w-1/3 py-4 text-center text-lg md:text-xl font-black transition-all duration-300 tracking-widest ${
                location.pathname === link.path 
                ? 'bg-[#5E4C06] text-[#F4F0E4]' 
                : 'hover:bg-[#5E4C06] hover:text-[#F4F0E4]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isMenuOpen && user && (
            <button 
              onClick={() => { logout(); setIsMenuOpen(false); }}
              className="w-full py-4 text-center text-lg font-black bg-red-700 text-white uppercase tracking-widest"
            >
              Sign Out
            </button>
          )}
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8 mb-32">
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-[#5E4C06] text-[#F4F0E4] py-6 text-center z-40 border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <h2 className="text-sm md:text-xl font-bold tracking-[0.3em] uppercase opacity-60">
          Created by Lee Gallagher &bull; 2025
        </h2>
      </footer>
    </div>
  );
};

export default Layout;
