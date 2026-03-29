import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Palette, FolderHeart, Music, Music2, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function Layout() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // We'll use a soft, royalty-free ambient track placeholder
    audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Sparkles },
    { name: 'Generator', path: '/generator', icon: Palette },
    { name: 'My Collection', path: '/collection', icon: FolderHeart },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-neutral-50">
      {/* Decorative background blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blush-200/40 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-200/30 blur-[100px] pointer-events-none" />

      <header className="sticky top-0 z-50 w-full glass border-b border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-white shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform">
                <Sparkles size={20} />
              </div>
              <span className="font-serif text-2xl font-semibold text-neutral-900 tracking-tight">
                Luxe<span className="text-gradient-gold">Color</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors hover:text-gold-600",
                      isActive ? "text-gold-600" : "text-neutral-600"
                    )}
                  >
                    <link.icon size={16} className={cn(isActive && "text-gold-500")} />
                    {link.name}
                  </Link>
                );
              })}
              
              <button
                onClick={toggleMusic}
                className="ml-4 p-2 rounded-full hover:bg-blush-50 text-neutral-500 hover:text-gold-600 transition-colors"
                title="Toggle Background Music"
              >
                {isMusicPlaying ? <Music size={20} className="animate-pulse text-gold-500" /> : <Music2 size={20} />}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 md:hidden">
              <button
                onClick={toggleMusic}
                className="p-2 rounded-full text-neutral-500"
              >
                {isMusicPlaying ? <Music size={20} className="text-gold-500" /> : <Music2 size={20} />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-neutral-600"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 w-full glass z-40 border-b border-white/50"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                      isActive ? "bg-blush-50 text-gold-600" : "text-neutral-600 hover:bg-neutral-50"
                    )}
                  >
                    <link.icon size={20} className={cn(isActive && "text-gold-500")} />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
