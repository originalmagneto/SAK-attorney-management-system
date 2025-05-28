/**
 * Enhanced State Management with Zustand
 * Replaces the singleton pattern with a modern, type-safe store
 */

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Import slice types
import { AuthSlice, createAuthSlice } from './auth-slice';
import { UISlice, createUISlice } from './ui-slice';
import { CasesSlice, createCasesSlice } from './cases-slice';
import { ClientsSlice, createClientsSlice } from './clients-slice';
import { DocumentsSlice, createDocumentsSlice } from './documents-slice';
import { NotificationsSlice, createNotificationsSlice } from './notifications-slice';

// Combined store type
export type AppStore = AuthSlice & UISlice & CasesSlice & ClientsSlice & DocumentsSlice & NotificationsSlice;

// Create the store with middleware
export const useStore = create<AppStore>()()
  (devtools(
    persist(
      subscribeWithSelector(
        immer((...a) => ({
          // Combine all slices
          ...createAuthSlice(...a),
          ...createUISlice(...a),
          ...createCasesSlice(...a),
          ...createClientsSlice(...a),
          ...createDocumentsSlice(...a),
          ...createNotificationsSlice(...a),
        }))
      ),
      {
        name: 'sak-attorney-store',
        partialize: (state) => ({
          // Only persist certain parts of the state
          auth: {
            user: state.auth.user,
            isAuthenticated: state.auth.isAuthenticated,
          },
          ui: {
            theme: state.ui.theme,
            sidebarCollapsed: state.ui.sidebarCollapsed,
            preferences: state.ui.preferences,
          },
        }),
      }
    ),
    {
      name: 'SAK Attorney Store',
    }
  ));

// Selectors for better performance
export const useAuth = () => useAppStore((state) => state.auth);
export const useCases = () => useAppStore((state) => state.cases);
export const useClients = () => useAppStore((state) => state.clients);
export const useDocuments = () => useAppStore((state) => state.documents);
export const useUI = () => useAppStore((state) => state.ui);
export const useNotifications = () => useAppStore((state) => state.notifications);

// Action selectors
export const useAuthActions = () => useAppStore((state) => ({
  login: state.login,
  logout: state.logout,
  updateUser: state.updateUser,
}));

export const useCasesActions = () => useAppStore((state) => ({
  addCase: state.addCase,
  updateCase: state.updateCase,
  deleteCase: state.deleteCase,
  setCases: state.setCases,
  setLoading: state.setCasesLoading,
}));

export const useClientsActions = () => useAppStore((state) => ({
  addClient: state.addClient,
  updateClient: state.updateClient,
  deleteClient: state.deleteClient,
  setClients: state.setClients,
  setLoading: state.setClientsLoading,
}));

export const useDocumentsActions = () => useAppStore((state) => ({
  addDocument: state.addDocument,
  updateDocument: state.updateDocument,
  deleteDocument: state.deleteDocument,
  setDocuments: state.setDocuments,
  setLoading: state.setDocumentsLoading,
}));

export const useUIActions = () => useAppStore((state) => ({
  toggleSidebar: state.toggleSidebar,
  setSidebarCollapsed: state.setSidebarCollapsed,
  setTheme: state.setTheme,
  updatePreferences: state.updatePreferences,
  setLoading: state.setGlobalLoading,
  setError: state.setGlobalError,
}));

export const useNotificationsActions = () => useAppStore((state) => ({
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  markAsRead: state.markNotificationAsRead,
  clearAll: state.clearAllNotifications,
}));

// Computed selectors
export const useActiveCases = () => 
  useAppStore((state) => 
    state.cases.items.filter(c => c.status === 'active')
  );

export const useRecentClients = () => 
  useAppStore((state) => 
    state.clients.items
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
  );

export const useUnreadNotifications = () => 
  useAppStore((state) => 
    state.notifications.items.filter(n => !n.read)
  );

// Async action helpers
export const withLoading = async <T>(
  setLoading: (loading: boolean) => void,
  action: () => Promise<T>
): Promise<T> => {
  setLoading(true);
  try {
    const result = await action();
    return result;
  } finally {
    setLoading(false);
  }
};

export const withErrorHandling = async <T>(
  setError: (error: string | null) => void,
  action: () => Promise<T>
): Promise<T | null> => {
  setError(null);
  try {
    const result = await action();
    return result;
  } catch (error) {
    setError(error instanceof Error ? error.message : 'An error occurred');
    return null;
  }
};

// Store initialization
export const initializeStore = async () => {
  const store = useAppStore.getState();
  
  // Initialize with sample data if needed
  if (store.cases.items.length === 0) {
    // Load sample data
    const { sampleCases } = await import('../sample-data/cases');
    const { sampleClients } = await import('../sample-data/clients');
    const { sampleDocuments } = await import('../sample-data/documents');
    
    store.setCases(sampleCases);
    store.setClients(sampleClients);
    store.setDocuments(sampleDocuments);
  }
};

// Export types
export type { AuthSlice, CasesSlice, ClientsSlice, DocumentsSlice, UISlice, NotificationsSlice };