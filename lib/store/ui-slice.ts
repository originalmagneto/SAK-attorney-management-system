/**
 * UI State Slice
 * Manages global UI state including theme, sidebar, loading states, and user preferences
 */

import { StateCreator } from 'zustand';
import { AppStore } from './index';

export interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Layout
  sidebarCollapsed: boolean;
  chatSidebarOpen: boolean;
  
  // Loading states
  globalLoading: boolean;
  globalError: string | null;
  
  // User preferences
  preferences: {
    animations: boolean;
    soundEffects: boolean;
    notifications: boolean;
    autoSave: boolean;
    compactMode: boolean;
    language: string;
    timezone: string;
  };
  
  // Modal states
  modals: {
    newCase: boolean;
    newClient: boolean;
    settings: boolean;
    commandPalette: boolean;
  };
  
  // Search state
  search: {
    query: string;
    filters: Record<string, any>;
    results: any[];
    isSearching: boolean;
  };
}

export interface UIActions {
  // Theme actions
  setTheme: (theme: UIState['theme']) => void;
  
  // Layout actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleChatSidebar: () => void;
  setChatSidebarOpen: (open: boolean) => void;
  
  // Loading actions
  setGlobalLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;
  
  // Preferences actions
  updatePreferences: (preferences: Partial<UIState['preferences']>) => void;
  resetPreferences: () => void;
  
  // Modal actions
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  closeAllModals: () => void;
  
  // Search actions
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: Record<string, any>) => void;
  setSearchResults: (results: any[]) => void;
  setSearching: (isSearching: boolean) => void;
  clearSearch: () => void;
}

export type UISlice = UIState & UIActions;

const defaultPreferences: UIState['preferences'] = {
  animations: true,
  soundEffects: false,
  notifications: true,
  autoSave: true,
  compactMode: false,
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

const defaultModals: UIState['modals'] = {
  newCase: false,
  newClient: false,
  settings: false,
  commandPalette: false,
};

const defaultSearch: UIState['search'] = {
  query: '',
  filters: {},
  results: [],
  isSearching: false,
};

export const createUISlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  UISlice
> = (set, get) => ({
  // Initial state
  theme: 'system',
  sidebarCollapsed: false,
  chatSidebarOpen: false,
  globalLoading: false,
  globalError: null,
  preferences: defaultPreferences,
  modals: defaultModals,
  search: defaultSearch,
  
  // Theme actions
  setTheme: (theme) => {
    set((state) => {
      state.ui.theme = theme;
    });
    
    // Apply theme to document
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    }
  },
  
  // Layout actions
  toggleSidebar: () => {
    set((state) => {
      state.ui.sidebarCollapsed = !state.ui.sidebarCollapsed;
    });
  },
  
  setSidebarCollapsed: (collapsed) => {
    set((state) => {
      state.ui.sidebarCollapsed = collapsed;
    });
  },
  
  toggleChatSidebar: () => {
    set((state) => {
      state.ui.chatSidebarOpen = !state.ui.chatSidebarOpen;
    });
  },
  
  setChatSidebarOpen: (open) => {
    set((state) => {
      state.ui.chatSidebarOpen = open;
    });
  },
  
  // Loading actions
  setGlobalLoading: (loading) => {
    set((state) => {
      state.ui.globalLoading = loading;
    });
  },
  
  setGlobalError: (error) => {
    set((state) => {
      state.ui.globalError = error;
    });
  },
  
  // Preferences actions
  updatePreferences: (newPreferences) => {
    set((state) => {
      state.ui.preferences = { ...state.ui.preferences, ...newPreferences };
    });
  },
  
  resetPreferences: () => {
    set((state) => {
      state.ui.preferences = defaultPreferences;
    });
  },
  
  // Modal actions
  openModal: (modal) => {
    set((state) => {
      state.ui.modals[modal] = true;
    });
  },
  
  closeModal: (modal) => {
    set((state) => {
      state.ui.modals[modal] = false;
    });
  },
  
  closeAllModals: () => {
    set((state) => {
      state.ui.modals = { ...defaultModals };
    });
  },
  
  // Search actions
  setSearchQuery: (query) => {
    set((state) => {
      state.ui.search.query = query;
    });
  },
  
  setSearchFilters: (filters) => {
    set((state) => {
      state.ui.search.filters = filters;
    });
  },
  
  setSearchResults: (results) => {
    set((state) => {
      state.ui.search.results = results;
    });
  },
  
  setSearching: (isSearching) => {
    set((state) => {
      state.ui.search.isSearching = isSearching;
    });
  },
  
  clearSearch: () => {
    set((state) => {
      state.ui.search = { ...defaultSearch };
    });
  },
});