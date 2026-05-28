import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogIn, User, Sun, Moon, Calendar, Image as ImageIcon, Sparkles } from 'lucide-react';
import { AdminUser } from '../types';

interface NavbarProps {
  onNavClick: (section: string) => void;
  adminUser: AdminUser | null;
  onLogout: () => void;
  activeSection: string;
  onOpenAdmin: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({
  onNavClick,
  adminUser,
  onLogout,
  activeSection,
  onOpenAdmin,
  isDark,
  onToggleTheme
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Sanctuaries', value: 'rooms' },
    { label: 'Experiences', value: 'experiences' },
    { label: 'Aesthetics Gallery', value: 'gallery' },
    { label: 'Our Story', value: 'story' },
  ];

  const handleLinkClick = (value: string) => {
    onNavClick(value);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled
            ? isDark
              ? 'bg-luxury-green-950/95 backdrop-blur-md border-luxury-gold-500/20 py-3 shadow-lg shadow-black/30'
              : 'bg-white/95 backdrop-blur-md border-luxury-gold-500/10 py-3 shadow-lg shadow-luxury-green-950/5'
            : 'bg-transparent border-transparent py-5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo Brand */}
          <button
            id="brand-logo"
            onClick={() => handleLinkClick('hero')}
            className="flex flex-col items-start text-left cursor-pointer group"
          >
            <span className={`font-serif-luxury text-2xl tracking-[0.15em] font-semibold transition-colors duration-300 ${
              isScrolled
                ? isDark ? 'text-white' : 'text-luxury-green-950'
                : 'text-white'
            }`}>
              AARYAM
            </span>
            <span className={`text-[9px] tracking-[0.4em] font-medium uppercase transition-colors duration-300 ${
              isScrolled
                ? isDark ? 'text-luxury-gold-500' : 'text-luxury-gold-700'
                : 'text-luxury-gold-200'
            }`}>
              Hotel & Resorts
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.value;
              return (
                <button
                  key={link.value}
                  id={`nav-link-${link.value}`}
                  onClick={() => handleLinkClick(link.value)}
                  className={`relative text-xs tracking-widest uppercase font-medium transition-all duration-300 hover:opacity-100 py-1 ${
                    isActive
                      ? isScrolled && !isDark ? 'text-luxury-gold-700 font-semibold' : 'text-luxury-gold-500 font-semibold'
                      : isScrolled
                        ? isDark ? 'text-white/80 hover:text-white' : 'text-luxury-green-950/80 hover:text-luxury-green-950'
                        : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-luxury-gold-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Controls & Call Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              id="theme-toggler"
              onClick={onToggleTheme}
              className={`p-2 rounded-full cursor-pointer transition-all duration-300 ${
                isScrolled
                  ? isDark
                    ? 'hover:bg-white/10 text-luxury-gold-500'
                    : 'hover:bg-luxury-green-950/5 text-luxury-gold-600'
                  : 'hover:bg-white/10 text-luxury-gold-200'
              }`}
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Admin Dashboard Entry */}
            {adminUser ? (
              <div className="flex items-center space-x-3">
                <button
                  id="admin-dashboard-btn"
                  onClick={onOpenAdmin}
                  className="flex items-center space-x-1.5 text-xs text-luxury-gold-500 uppercase tracking-wider font-semibold hover:opacity-80"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ambassador Panel</span>
                </button>
                <button
                  id="admin-logout-btn"
                  onClick={onLogout}
                  className={`text-[10px] uppercase font-medium tracking-widest px-3 py-1.5 border border-red-500/40 rounded text-red-400 hover:bg-red-500/10 transition-all duration-300`}
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                id="login-trigger-btn"
                onClick={onOpenAdmin}
                className={`p-2 rounded-full cursor-pointer transition-all duration-300 ${
                  isScrolled
                    ? isDark
                      ? 'hover:bg-white/10 text-white/70 hover:text-white'
                      : 'hover:bg-luxury-green-950/5 text-luxury-green-950/70 hover:text-luxury-green-950'
                    : 'hover:bg-white/10 text-white/70 hover:text-white'
                }`}
                title="Staff Portal"
              >
                <LogIn className="w-4 h-4" />
              </button>
            )}

            {/* CTA Button */}
            <button
              id="cta-nav-booking"
              onClick={() => handleLinkClick('rooms')}
              className="luxury-gold-gradient text-white text-xs tracking-widest font-semibold uppercase px-5 py-2.5 rounded-sm hover:shadow-lg hover:shadow-luxury-gold-500/20 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              Reserve Stay
            </button>
          </div>

          {/* Handheld Mobile Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              id="mobile-theme-toggle"
              onClick={onToggleTheme}
              className={`p-1.5 rounded-full ${
                isScrolled
                  ? isDark ? 'text-luxury-gold-500' : 'text-luxury-gold-600'
                  : 'text-luxury-gold-200'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              id="mobile-menu-trigger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 focus:outline-none ${
                isScrolled
                  ? isDark ? 'text-white' : 'text-luxury-green-950'
                  : 'text-white'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Handheld Side Slide Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-panel"
            className={`fixed inset-0 z-45 md:hidden flex flex-col justify-between pt-24 pb-12 px-8 ${
              isDark ? 'bg-luxury-green-950 text-white' : 'bg-luxury-gold-50 text-luxury-green-950'
            }`}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.45 }}
          >
            {/* List Links */}
            <div className="flex flex-col space-y-6 pt-10">
              {navLinks.map((link, idx) => (
                <motion.button
                  key={link.value}
                  id={`mobile-link-${link.value}`}
                  onClick={() => handleLinkClick(link.value)}
                  className={`text-left font-serif-luxury text-2xl tracking-wide border-b ${
                    isDark ? 'border-white/10' : 'border-luxury-green-950/10'
                  } pb-3`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.button
                id="mobile-admin-access"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className={`text-left text-xs uppercase tracking-widest font-semibold flex items-center space-x-2 mt-4 ${
                  isDark ? 'text-luxury-gold-500' : 'text-luxury-gold-600'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <User className="w-4 h-4" />
                <span>{adminUser ? 'Ambassador Panel' : 'Staff Portal Access'}</span>
              </motion.button>
            </div>

            {/* Mobile Footer Area */}
            <motion.div
              className="flex flex-col items-center text-center space-y-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                id="mobile-cta-booking"
                onClick={() => handleLinkClick('rooms')}
                className="w-full luxury-gold-gradient text-white text-xs tracking-widest font-semibold uppercase py-3.5 rounded-sm hover:shadow-lg hover:shadow-luxury-gold-500/20 active:scale-95 transition-all duration-300"
              >
                Book Your Sanctuary
              </button>

              <div className="text-[10px] tracking-widest uppercase opacity-60">
                Aaryam — Wellness & Nature Sanctuary
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
