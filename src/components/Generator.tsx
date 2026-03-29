import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Wand2, Download, Heart, Loader2, Sparkles, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { generateColoringPage } from '../lib/gemini';
import { useAppStore } from '../store';
import { cn } from '../lib/utils';

const CATEGORIES = [
  'Fashion & Glam', 'Luxury Lifestyle', 'Beauty & Self-Care', 
  'Boss Women', 'Cute & Kawaii', 'Kids Coloring Pages', 
  'Affirmation Pages', 'Seasonal', 'Mandalas & Patterns'
];

const THICKNESS_OPTIONS = ['Thin & Delicate', 'Medium (Standard)', 'Bold & Thick'];
const DETAIL_OPTIONS = ['Simple & Relaxing', 'Detailed', 'Intricate & Complex'];
const BACKGROUND_OPTIONS = ['Plain White', 'Minimal Scene', 'Patterned/Floral'];

export function Generator() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const addPage = useAppStore(state => state.addPage);

  const [prompt, setPrompt] = useState(searchParams.get('prompt') || '');
  const [category, setCategory] = useState(searchParams.get('category') || CATEGORIES[0]);
  const [thickness, setThickness] = useState(THICKNESS_OPTIONS[1]);
  const [detail, setDetail] = useState(DETAIL_OPTIONS[1]);
  const [background, setBackground] = useState(BACKGROUND_OPTIONS[0]);
  const [affirmation, setAffirmation] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description for your coloring page.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateColoringPage(
        prompt, category, thickness, detail, background, affirmation
      );
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError("Failed to generate image. Please try again with a different prompt.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (generatedImage) {
      const newPage = {
        id: Date.now().toString(),
        url: generatedImage,
        prompt,
        category,
        createdAt: Date.now(),
        isFavorite: false,
      };
      addPage(newPage);
      navigate('/collection');
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 mb-2">Design Studio</h1>
        <p className="text-neutral-600">Craft your perfect coloring experience</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
            
            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">What would you like to color?</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A luxury fashion girl walking down a Parisian street with shopping bags..."
                className="w-full h-28 px-4 py-3 rounded-2xl border border-neutral-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blush-300 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">Style Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blush-300 transition-all appearance-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Affirmation Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">Add Custom Text or Affirmation (Optional)</label>
              <input
                type="text"
                value={affirmation}
                onChange={(e) => setAffirmation(e.target.value)}
                placeholder="e.g., I am capable of amazing things"
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blush-300 transition-all"
              />
              <p className="text-xs text-neutral-500 italic">This text will be artistically integrated into your design.</p>
            </div>

            {/* Advanced Options Toggle */}
            <div className="pt-4 border-t border-neutral-200/60">
              <div className="flex items-center gap-2 mb-4 text-neutral-800 font-medium">
                <SlidersHorizontal size={18} />
                <h3>Refinement Options</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">Line Weight</label>
                    <select value={thickness} onChange={(e) => setThickness(e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 bg-white/50">
                      {THICKNESS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">Detail Level</label>
                    <select value={detail} onChange={(e) => setDetail(e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 bg-white/50">
                      {DETAIL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">Background</label>
                  <select value={background} onChange={(e) => setBackground(e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 bg-white/50">
                    {BACKGROUND_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-4 rounded-2xl bg-neutral-900 text-white font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-neutral-900/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Crafting your design...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Generate Masterpiece
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-7">
          <div className="glass rounded-3xl p-4 md:p-8 h-full min-h-[500px] flex flex-col items-center justify-center relative border border-white/60">
            {isGenerating ? (
              <div className="flex flex-col items-center text-neutral-400 space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-blush-100 rounded-full animate-pulse"></div>
                  <div className="w-20 h-20 border-4 border-gold-400 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="font-serif italic text-lg text-neutral-500">Sketching details...</p>
              </div>
            ) : generatedImage ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex flex-col items-center"
              >
                <div className="relative w-full max-w-md aspect-[3/4] bg-white rounded-xl shadow-2xl overflow-hidden border-8 border-white">
                  <img src={generatedImage} alt="Generated coloring page" className="w-full h-full object-contain" />
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={handleSave}
                    className="px-6 py-3 rounded-full bg-blush-500 text-white font-medium flex items-center gap-2 hover:bg-blush-600 transition-colors shadow-lg shadow-blush-500/20"
                  >
                    <Heart size={18} /> Save to Collection
                  </button>
                  <a 
                    href={generatedImage}
                    download={`luxecolor-${Date.now()}.png`}
                    className="px-6 py-3 rounded-full bg-white text-neutral-700 font-medium flex items-center gap-2 hover:bg-neutral-50 transition-colors border border-neutral-200 shadow-sm"
                  >
                    <Download size={18} /> Download PNG
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center text-neutral-400 space-y-4 text-center max-w-sm">
                <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mb-2">
                  <ImageIcon size={40} className="text-neutral-300" />
                </div>
                <h3 className="text-xl font-serif text-neutral-700">Your Canvas Awaits</h3>
                <p className="text-sm">Describe your vision on the left, and watch it transform into a beautiful coloring page.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
