import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Crown, Heart, Star, Palette, Baby, Flower2 } from 'lucide-react';

const CATEGORIES = [
  { name: 'Fashion & Glam', icon: Crown, color: 'bg-rose-100 text-rose-600' },
  { name: 'Luxury Lifestyle', icon: Star, color: 'bg-amber-100 text-amber-600' },
  { name: 'Beauty & Self-Care', icon: Heart, color: 'bg-pink-100 text-pink-600' },
  { name: 'Boss Women', icon: Sparkles, color: 'bg-teal-100 text-teal-600' },
  { name: 'Cute & Kawaii', icon: Baby, color: 'bg-purple-100 text-purple-600' },
  { name: 'Mandalas & Patterns', icon: Flower2, color: 'bg-indigo-100 text-indigo-600' },
];

export function Home() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blush-100 text-blush-600 text-sm font-medium mb-6 border border-blush-200">
              ✨ Premium AI Coloring Pages
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-medium text-neutral-900 mb-6 leading-tight">
              Create Your Own <br />
              <span className="text-gradient-gold italic">Luxury Coloring</span> Experience
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 mb-10 max-w-2xl mx-auto font-light">
              Design elegant, high-end coloring pages in seconds. From fashion illustrations to intricate mandalas, bring your imagination to life with crisp, beautiful line art.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/generator"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-medium text-white transition-all duration-300 bg-neutral-900 rounded-full hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/20 overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                <span className="relative flex items-center gap-2">
                  Start Creating <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                to="/collection"
                className="inline-flex items-center justify-center px-8 py-4 font-medium text-neutral-700 transition-all duration-300 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 hover:border-neutral-300 shadow-sm"
              >
                View Collection
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-medium text-neutral-900 mb-4">Explore Styles</h2>
          <p className="text-neutral-600">Choose from our curated premium aesthetics</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/generator?category=${encodeURIComponent(cat.name)}`}
                className="group block p-6 glass rounded-3xl hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-blush-200/20 border border-white/60"
              >
                <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon size={24} />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-neutral-500">Generate pages →</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured/Inspiration Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-white/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-200/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 border border-gold-100 text-gold-700 text-sm font-medium">
                <Star size={14} /> Daily Inspiration
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900">
                The Parisienne Collection
              </h2>
              <p className="text-neutral-600 text-lg">
                Transport yourself to the streets of Paris with our new featured style. Elegant cafes, haute couture, and romantic architecture waiting for your colors.
              </p>
              <Link
                to="/generator?prompt=Parisian%20cafe%20scene%20with%20elegant%20woman%20drinking%20coffee&category=Luxury%20Lifestyle"
                className="inline-flex items-center gap-2 text-gold-600 font-medium hover:text-gold-700 transition-colors"
              >
                Try this prompt <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border-4 border-white shadow-2xl shadow-neutral-200/50 bg-white p-2">
                <div className="w-full h-full border border-neutral-200 rounded-xl bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-80 mix-blend-multiply"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
