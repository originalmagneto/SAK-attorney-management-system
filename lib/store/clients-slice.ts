/**
 * Clients State Slice
 * Manages client data, relationships, and operations
 */

import { StateCreator } from 'zustand';
import { AppStore } from './index';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  avatar?: string;
  status: 'active' | 'inactive' | 'prospect' | 'former';
  type: 'individual' | 'business' | 'organization';
  tags: string[];
  notes?: string;
  
  // Contact information
  contacts: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone?: string;
    isPrimary: boolean;
  }[];
  
  // Financial data
  billing: {
    hourlyRate?: number;
    retainerAmount?: number;
    totalBilled: number;
    totalPaid: number;
    outstandingBalance: number;
    paymentTerms: string;
    preferredPaymentMethod: string;
  };
  
  // Relationship data
  relationships: {
    assignedAttorney: string;
    referredBy?: string;
    relationshipManager?: string;
  };
  
  // Metadata
  metadata: {
    source: string;
    industry?: string;
    size?: string;
    website?: string;
    socialMedia?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
    };
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientsState {
  items: Client[];
  isLoading: boolean;
  error: string | null;
  
  // Filters and search
  filters: {
    status: string[];
    type: string[];
    assignedAttorney: string[];
    tags: string[];
    industry: string[];
  };
  
  // Sorting
  sortBy: 'name' | 'company' | 'status' | 'createdAt' | 'updatedAt' | 'totalBilled';
  sortOrder: 'asc' | 'desc';
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  
  // Selected items
  selectedIds: string[];
}

export interface ClientsActions {
  // CRUD operations
  addClient: (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  duplicateClient: (id: string) => void;
  
  // Bulk operations
  bulkUpdateClients: (ids: string[], updates: Partial<Client>) => void;
  bulkDeleteClients: (ids: string[]) => void;
  
  // Data management
  setClients: (clients: Client[]) => void;
  setClientsLoading: (loading: boolean) => void;
  setClientsError: (error: string | null) => void;
  
  // Filtering and search
  setFilters: (filters: Partial<ClientsState['filters']>) => void;
  clearFilters: () => void;
  
  // Sorting
  setSorting: (sortBy: ClientsState['sortBy'], sortOrder: ClientsState['sortOrder']) => void;
  
  // Pagination
  setPagination: (pagination: Partial<ClientsState['pagination']>) => void;
  
  // Selection
  selectClient: (id: string) => void;
  deselectClient: (id: string) => void;
  selectAllClients: () => void;
  clearSelection: () => void;
  
  // Contact management
  addContact: (clientId: string, contact: Omit<Client['contacts'][0], 'id'>) => void;
  updateContact: (clientId: string, contactId: string, updates: Partial<Client['contacts'][0]>) => void;
  removeContact: (clientId: string, contactId: string) => void;
  
  // Billing operations
  updateClientBilling: (id: string, billing: Partial<Client['billing']>) => void;
  recordPayment: (clientId: string, amount: number, description: string) => void;
}

export type ClientsSlice = { clients: ClientsState } & ClientsActions;

const defaultFilters: ClientsState['filters'] = {
  status: [],
  type: [],
  assignedAttorney: [],
  tags: [],
  industry: [],
};

const defaultPagination: ClientsState['pagination'] = {
  page: 1,
  limit: 20,
  total: 0,
};

export const createClientsSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  ClientsSlice
> = (set, get) => ({
  // Initial state
  clients: {
    items: [],
    isLoading: false,
    error: null,
    filters: defaultFilters,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    pagination: defaultPagination,
    selectedIds: [],
  },
  
  // CRUD operations
  addClient: (clientData) => {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => {
      state.clients.items.unshift(newClient);
      state.clients.pagination.total += 1;
    });
  },
  
  updateClient: (id, updates) => {
    set((state) => {
      const index = state.clients.items.findIndex(c => c.id === id);
      if (index !== -1) {
        state.clients.items[index] = {
          ...state.clients.items[index],
          ...updates,
          updatedAt: new Date(),
        };
      }
    });
  },
  
  deleteClient: (id) => {
    set((state) => {
      state.clients.items = state.clients.items.filter(c => c.id !== id);
      state.clients.selectedIds = state.clients.selectedIds.filter(selectedId => selectedId !== id);
      state.clients.pagination.total -= 1;
    });
  },
  
  duplicateClient: (id) => {
    const { clients } = get();
    const originalClient = clients.items.find(c => c.id === id);
    
    if (originalClient) {
      const duplicatedClient: Client = {
        ...originalClient,
        id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${originalClient.name} (Copy)`,
        email: '', // Clear email to avoid duplicates
        status: 'prospect',
        createdAt: new Date(),
        updatedAt: new Date(),
        billing: {
          ...originalClient.billing,
          totalBilled: 0,
          totalPaid: 0,
          outstandingBalance: 0,
        },
      };
      
      set((state) => {
        state.clients.items.unshift(duplicatedClient);
        state.clients.pagination.total += 1;
      });
    }
  },
  
  // Bulk operations
  bulkUpdateClients: (ids, updates) => {
    set((state) => {
      ids.forEach(id => {
        const index = state.clients.items.findIndex(c => c.id === id);
        if (index !== -1) {
          state.clients.items[index] = {
            ...state.clients.items[index],
            ...updates,
            updatedAt: new Date(),
          };
        }
      });
    });
  },
  
  bulkDeleteClients: (ids) => {
    set((state) => {
      state.clients.items = state.clients.items.filter(c => !ids.includes(c.id));
      state.clients.selectedIds = state.clients.selectedIds.filter(selectedId => !ids.includes(selectedId));
      state.clients.pagination.total -= ids.length;
    });
  },
  
  // Data management
  setClients: (clients) => {
    set((state) => {
      state.clients.items = clients;
      state.clients.pagination.total = clients.length;
    });
  },
  
  setClientsLoading: (loading) => {
    set((state) => {
      state.clients.isLoading = loading;
    });
  },
  
  setClientsError: (error) => {
    set((state) => {
      state.clients.error = error;
    });
  },
  
  // Filtering and search
  setFilters: (newFilters) => {
    set((state) => {
      state.clients.filters = { ...state.clients.filters, ...newFilters };
      state.clients.pagination.page = 1;
    });
  },
  
  clearFilters: () => {
    set((state) => {
      state.clients.filters = defaultFilters;
      state.clients.pagination.page = 1;
    });
  },
  
  // Sorting
  setSorting: (sortBy, sortOrder) => {
    set((state) => {
      state.clients.sortBy = sortBy;
      state.clients.sortOrder = sortOrder;
      
      // Sort the items
      state.clients.items.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        // Handle date sorting
        if (aValue instanceof Date && bValue instanceof Date) {
          aValue = aValue.getTime();
          bValue = bValue.getTime();
        }
        
        // Handle string sorting
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    });
  },
  
  // Pagination
  setPagination: (pagination) => {
    set((state) => {
      state.clients.pagination = { ...state.clients.pagination, ...pagination };
    });
  },
  
  // Selection
  selectClient: (id) => {
    set((state) => {
      if (!state.clients.selectedIds.includes(id)) {
        state.clients.selectedIds.push(id);
      }
    });
  },
  
  deselectClient: (id) => {
    set((state) => {
      state.clients.selectedIds = state.clients.selectedIds.filter(selectedId => selectedId !== id);
    });
  },
  
  selectAllClients: () => {
    set((state) => {
      state.clients.selectedIds = state.clients.items.map(c => c.id);
    });
  },
  
  clearSelection: () => {
    set((state) => {
      state.clients.selectedIds = [];
    });
  },
  
  // Contact management
  addContact: (clientId, contactData) => {
    const newContact = {
      ...contactData,
      id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    set((state) => {
      const index = state.clients.items.findIndex(c => c.id === clientId);
      if (index !== -1) {
        state.clients.items[index].contacts.push(newContact);
        state.clients.items[index].updatedAt = new Date();
      }
    });
  },
  
  updateContact: (clientId, contactId, updates) => {
    set((state) => {
      const clientIndex = state.clients.items.findIndex(c => c.id === clientId);
      if (clientIndex !== -1) {
        const contactIndex = state.clients.items[clientIndex].contacts.findIndex(c => c.id === contactId);
        if (contactIndex !== -1) {
          state.clients.items[clientIndex].contacts[contactIndex] = {
            ...state.clients.items[clientIndex].contacts[contactIndex],
            ...updates,
          };
          state.clients.items[clientIndex].updatedAt = new Date();
        }
      }
    });
  },
  
  removeContact: (clientId, contactId) => {
    set((state) => {
      const index = state.clients.items.findIndex(c => c.id === clientId);
      if (index !== -1) {
        state.clients.items[index].contacts = state.clients.items[index].contacts.filter(c => c.id !== contactId);
        state.clients.items[index].updatedAt = new Date();
      }
    });
  },
  
  // Billing operations
  updateClientBilling: (id, billing) => {
    set((state) => {
      const index = state.clients.items.findIndex(c => c.id === id);
      if (index !== -1) {
        state.clients.items[index].billing = {
          ...state.clients.items[index].billing,
          ...billing,
        };
        state.clients.items[index].updatedAt = new Date();
      }
    });
  },
  
  recordPayment: (clientId, amount, description) => {
    set((state) => {
      const index = state.clients.items.findIndex(c => c.id === clientId);
      if (index !== -1) {
        const client = state.clients.items[index];
        client.billing.totalPaid += amount;
        client.billing.outstandingBalance = client.billing.totalBilled - client.billing.totalPaid;
        client.updatedAt = new Date();
      }
    });
  },
});