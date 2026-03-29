import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ColoringPage {
  id: string;
  url: string;
  prompt: string;
  category: string;
  createdAt: number;
  folder?: string;
  isFavorite: boolean;
}

interface AppState {
  pages: ColoringPage[];
  folders: string[];
  addPage: (page: ColoringPage) => void;
  removePage: (id: string) => void;
  toggleFavorite: (id: string) => void;
  moveToFolder: (id: string, folder: string) => void;
  addFolder: (folder: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      pages: [],
      folders: ['Kids', 'Luxury', 'Affirmations', 'Favorites'],
      addPage: (page) => set((state) => ({ pages: [page, ...state.pages] })),
      removePage: (id) => set((state) => ({ pages: state.pages.filter((p) => p.id !== id) })),
      toggleFavorite: (id) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
          ),
        })),
      moveToFolder: (id, folder) =>
        set((state) => ({
          pages: state.pages.map((p) => (p.id === id ? { ...p, folder } : p)),
        })),
      addFolder: (folder) =>
        set((state) => ({
          folders: state.folders.includes(folder) ? state.folders : [...state.folders, folder],
        })),
    }),
    {
      name: 'luxecolor-storage',
    }
  )
);
