/**
 * Authentication State Slice
 * Manages user authentication, session, and profile data
 */

import { StateCreator } from 'zustand';
import { AppStore } from './index';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'OWNER' | 'PARTNER' | 'ASSOCIATE' | 'STAFF';
  avatar?: string;
  firmId?: string;
  permissions: string[];
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    language: string;
    timezone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiry: Date | null;
  refreshToken: string | null;
}

export interface AuthActions {
  // Authentication actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  
  // User actions
  updateUser: (updates: Partial<User>) => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  
  // State management
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Session management
  checkSession: () => boolean;
  extendSession: () => void;
}

export type AuthSlice = { auth: AuthState } & AuthActions;

const defaultUserPreferences: User['preferences'] = {
  emailNotifications: true,
  pushNotifications: true,
  weeklyReports: true,
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export const createAuthSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  AuthSlice
> = (set, get) => ({
  // Initial state
  auth: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    sessionExpiry: null,
    refreshToken: null,
  },
  
  // Authentication actions
  login: async (email: string, password: string) => {
    set((state) => {
      state.auth.isLoading = true;
      state.auth.error = null;
    });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app, this would come from API
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        role: 'PARTNER',
        avatar: '/images/avatars/avatar-1.png',
        firmId: 'firm-1',
        permissions: ['read:cases', 'write:cases', 'read:clients', 'write:clients'],
        preferences: defaultUserPreferences,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const sessionExpiry = new Date();
      sessionExpiry.setHours(sessionExpiry.getHours() + 8); // 8 hour session
      
      set((state) => {
        state.auth.user = mockUser;
        state.auth.isAuthenticated = true;
        state.auth.isLoading = false;
        state.auth.sessionExpiry = sessionExpiry;
        state.auth.refreshToken = 'mock-refresh-token';
      });
      
      // Store session in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-session', JSON.stringify({
          user: mockUser,
          sessionExpiry: sessionExpiry.toISOString(),
          refreshToken: 'mock-refresh-token',
        }));
      }
    } catch (error) {
      set((state) => {
        state.auth.isLoading = false;
        state.auth.error = error instanceof Error ? error.message : 'Login failed';
      });
      throw error;
    }
  },
  
  logout: () => {
    set((state) => {
      state.auth.user = null;
      state.auth.isAuthenticated = false;
      state.auth.sessionExpiry = null;
      state.auth.refreshToken = null;
      state.auth.error = null;
    });
    
    // Clear session from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-session');
    }
  },
  
  refreshSession: async () => {
    const { auth } = get();
    
    if (!auth.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      // Simulate API call to refresh session
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newExpiry = new Date();
      newExpiry.setHours(newExpiry.getHours() + 8);
      
      set((state) => {
        state.auth.sessionExpiry = newExpiry;
      });
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        const session = localStorage.getItem('auth-session');
        if (session) {
          const parsedSession = JSON.parse(session);
          parsedSession.sessionExpiry = newExpiry.toISOString();
          localStorage.setItem('auth-session', JSON.stringify(parsedSession));
        }
      }
    } catch (error) {
      // If refresh fails, logout user
      get().logout();
      throw error;
    }
  },
  
  // User actions
  updateUser: (updates) => {
    set((state) => {
      if (state.auth.user) {
        state.auth.user = { ...state.auth.user, ...updates, updatedAt: new Date() };
      }
    });
  },
  
  updateUserPreferences: (preferences) => {
    set((state) => {
      if (state.auth.user) {
        state.auth.user.preferences = { ...state.auth.user.preferences, ...preferences };
        state.auth.user.updatedAt = new Date();
      }
    });
  },
  
  // State management
  setUser: (user) => {
    set((state) => {
      state.auth.user = user;
      state.auth.isAuthenticated = !!user;
    });
  },
  
  setLoading: (loading) => {
    set((state) => {
      state.auth.isLoading = loading;
    });
  },
  
  setError: (error) => {
    set((state) => {
      state.auth.error = error;
    });
  },
  
  clearError: () => {
    set((state) => {
      state.auth.error = null;
    });
  },
  
  // Session management
  checkSession: () => {
    const { auth } = get();
    
    if (!auth.sessionExpiry) {
      return false;
    }
    
    const now = new Date();
    const expiry = new Date(auth.sessionExpiry);
    
    return now < expiry;
  },
  
  extendSession: () => {
    const newExpiry = new Date();
    newExpiry.setHours(newExpiry.getHours() + 8);
    
    set((state) => {
      state.auth.sessionExpiry = newExpiry;
    });
  },
});

// Session restoration utility
export const restoreSession = () => {
  if (typeof window === 'undefined') return;
  
  const sessionData = localStorage.getItem('auth-session');
  if (!sessionData) return;
  
  try {
    const { user, sessionExpiry, refreshToken } = JSON.parse(sessionData);
    const expiry = new Date(sessionExpiry);
    const now = new Date();
    
    // Check if session is still valid
    if (now < expiry) {
      const store = get();
      store.setUser(user);
      set((state) => {
        state.auth.sessionExpiry = expiry;
        state.auth.refreshToken = refreshToken;
      });
    } else {
      // Session expired, clear it
      localStorage.removeItem('auth-session');
    }
  } catch (error) {
    console.error('Failed to restore session:', error);
    localStorage.removeItem('auth-session');
  }
};