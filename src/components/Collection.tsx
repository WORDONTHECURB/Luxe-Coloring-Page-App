import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, Heart, Download, Trash2, Plus, Search, Image as ImageIcon } from 'lucide-react';
import { useAppStore, ColoringPage } from '../store';
import { cn } from '../lib/utils';

export function Collection() {
  const { pages, folders, removePage, toggleFavorite, moveToFolder, addFolder } = useAppStore();
  const [activeFolder, setActiveFolder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const filteredPages = pages.filter(page => {
    const matchesFolder = activeFolder === 'All' 
      ? true 
      : activeFolder === 'Favorites' 
        ? page.isFavorite 
        : page.folder === activeFolder;
    
    const matchesSearch = page.prompt.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          page.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFolder && matchesSearch;
  });

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName('');
      setIsNewFolderModalOpen(false);
      setActiveFolder(newFolderName.trim());
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 mb-2">My Collection</h1>
          <p className="text-neutral-600">Your personal gallery of masterpieces</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text"
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-neutral-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blush-300 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar / Folders */}
        <div className="lg:w-64 shrink-0 space-y-6">
          <div className="glass rounded-3xl p-4 border border-white/60">
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3 px-3">Library</h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveFolder('All')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                  activeFolder === 'All' ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                <ImageIcon size={16} /> All Designs
                <span className="ml-auto text-xs opacity-60">{pages.length}</span>
              </button>
              <button
                onClick={() => setActiveFolder('Favorites')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                  activeFolder === 'Favorites' ? "bg-blush-500 text-white" : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                <Heart size={16} className={activeFolder === 'Favorites' ? "fill-white" : ""} /> Favorites
                <span className="ml-auto text-xs opacity-60">{pages.filter(p => p.isFavorite).length}</span>
              </button>
            </div>

            <div className="mt-6 mb-3 px-3 flex items-center justify-between">
              <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Folders</h3>
              <button 
                onClick={() => setIsNewFolderModalOpen(true)}
                className="text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-1">
              {folders.filter(f => f !== 'Favorites').map(folder => (
                <button
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                    activeFolder === folder ? "bg-teal-50 text-teal-700" : "text-neutral-600 hover:bg-neutral-100"
                  )}
                >
                  <Folder size={16} className={activeFolder === folder ? "fill-teal-100" : ""} /> {folder}
                  <span className="ml-auto text-xs opacity-60">{pages.filter(p => p.folder === folder).length}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1">
          {filteredPages.length === 0 ? (
            <div className="glass rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-white/60 min-h-[400px]">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <ImageIcon size={32} className="text-neutral-300" />
              </div>
              <h3 className="text-xl font-serif text-neutral-900 mb-2">No designs found</h3>
              <p className="text-neutral-500 max-w-sm">
                {searchQuery ? "Try adjusting your search terms." : "You haven't saved any designs to this folder yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredPages.map((page) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={page.id}
                    className="group glass rounded-2xl overflow-hidden border border-white/60 flex flex-col"
                  >
                    <div className="relative aspect-[3/4] bg-white p-4">
                      <img src={page.url} alt={page.prompt} className="w-full h-full object-contain" />
                      
                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                        <button 
                          onClick={() => toggleFavorite(page.id)}
                          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blush-500 hover:scale-110 transition-transform"
                        >
                          <Heart size={18} className={page.isFavorite ? "fill-blush-500" : ""} />
                        </button>
                        <a 
                          href={page.url}
                          download={`luxecolor-${page.id}.png`}
                          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-neutral-700 hover:scale-110 transition-transform"
                        >
                          <Download size={18} />
                        </a>
                        <button 
                          onClick={() => removePage(page.id)}
                          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-md bg-neutral-100 text-neutral-600">
                          {page.category}
                        </span>
                        {page.folder && (
                          <span className="text-xs font-medium px-2 py-1 rounded-md bg-teal-50 text-teal-700 flex items-center gap-1">
                            <Folder size={10} /> {page.folder}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-700 line-clamp-2 mb-4 flex-1">{page.prompt}</p>
                      
                      {/* Folder assignment dropdown */}
                      <select 
                        value={page.folder || ''}
                        onChange={(e) => moveToFolder(page.id, e.target.value)}
                        className="w-full text-xs px-2 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600 focus:ring-1 focus:ring-blush-300"
                      >
                        <option value="">Move to folder...</option>
                        {folders.filter(f => f !== 'Favorites').map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* New Folder Modal */}
      <AnimatePresence>
        {isNewFolderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
              onClick={() => setIsNewFolderModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl"
            >
              <h3 className="text-xl font-serif font-medium text-neutral-900 mb-4">Create New Folder</h3>
              <form onSubmit={handleAddFolder}>
                <input
                  type="text"
                  autoFocus
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blush-300 mb-6"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewFolderModalOpen(false)}
                    className="px-4 py-2 rounded-full text-neutral-600 hover:bg-neutral-100 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newFolderName.trim()}
                    className="px-6 py-2 rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
