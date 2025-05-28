/**
 * Cases State Slice
 * Manages case data, operations, and related functionality
 */

import { StateCreator } from 'zustand';
import { AppStore } from './index';

export interface Case {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'pending' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: string;
  clientId: string;
  assignedTo: string[];
  tags: string[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Financial data
  billing: {
    hourlyRate: number;
    totalHours: number;
    totalAmount: number;
    billableHours: number;
    expenses: number;
  };
  
  // Progress tracking
  progress: {
    percentage: number;
    milestones: {
      id: string;
      title: string;
      completed: boolean;
      dueDate?: Date;
      completedAt?: Date;
    }[];
  };
  
  // Metadata
  metadata: {
    courtLocation?: string;
    caseNumber?: string;
    opposingCounsel?: string;
    jurisdiction?: string;
    practiceArea?: string;
  };
}

export interface CasesState {
  items: Case[];
  isLoading: boolean;
  error: string | null;
  
  // Filters and search
  filters: {
    status: string[];
    priority: string[];
    assignedTo: string[];
    tags: string[];
    dateRange: {
      start?: Date;
      end?: Date;
    };
  };
  
  // Sorting
  sortBy: 'title' | 'status' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt';
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

export interface CasesActions {
  // CRUD operations
  addCase: (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCase: (id: string, updates: Partial<Case>) => void;
  deleteCase: (id: string) => void;
  duplicateCase: (id: string) => void;
  
  // Bulk operations
  bulkUpdateCases: (ids: string[], updates: Partial<Case>) => void;
  bulkDeleteCases: (ids: string[]) => void;
  
  // Data management
  setCases: (cases: Case[]) => void;
  setCasesLoading: (loading: boolean) => void;
  setCasesError: (error: string | null) => void;
  
  // Filtering and search
  setFilters: (filters: Partial<CasesState['filters']>) => void;
  clearFilters: () => void;
  
  // Sorting
  setSorting: (sortBy: CasesState['sortBy'], sortOrder: CasesState['sortOrder']) => void;
  
  // Pagination
  setPagination: (pagination: Partial<CasesState['pagination']>) => void;
  
  // Selection
  selectCase: (id: string) => void;
  deselectCase: (id: string) => void;
  selectAllCases: () => void;
  clearSelection: () => void;
  
  // Progress tracking
  updateCaseProgress: (id: string, progress: Partial<Case['progress']>) => void;
  completeMilestone: (caseId: string, milestoneId: string) => void;
  
  // Billing
  updateCaseBilling: (id: string, billing: Partial<Case['billing']>) => void;
  addTimeEntry: (caseId: string, hours: number, description: string) => void;
}

export type CasesSlice = { cases: CasesState } & CasesActions;

const defaultFilters: CasesState['filters'] = {
  status: [],
  priority: [],
  assignedTo: [],
  tags: [],
  dateRange: {},
};

const defaultPagination: CasesState['pagination'] = {
  page: 1,
  limit: 20,
  total: 0,
};

export const createCasesSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  CasesSlice
> = (set, get) => ({
  // Initial state
  cases: {
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
  addCase: (caseData) => {
    const newCase: Case = {
      ...caseData,
      id: `case-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => {
      state.cases.items.unshift(newCase);
      state.cases.pagination.total += 1;
    });
  },
  
  updateCase: (id, updates) => {
    set((state) => {
      const index = state.cases.items.findIndex(c => c.id === id);
      if (index !== -1) {
        state.cases.items[index] = {
          ...state.cases.items[index],
          ...updates,
          updatedAt: new Date(),
        };
      }
    });
  },
  
  deleteCase: (id) => {
    set((state) => {
      state.cases.items = state.cases.items.filter(c => c.id !== id);
      state.cases.selectedIds = state.cases.selectedIds.filter(selectedId => selectedId !== id);
      state.cases.pagination.total -= 1;
    });
  },
  
  duplicateCase: (id) => {
    const { cases } = get();
    const originalCase = cases.items.find(c => c.id === id);
    
    if (originalCase) {
      const duplicatedCase: Case = {
        ...originalCase,
        id: `case-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `${originalCase.title} (Copy)`,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        progress: {
          percentage: 0,
          milestones: originalCase.progress.milestones.map(m => ({
            ...m,
            completed: false,
            completedAt: undefined,
          })),
        },
        billing: {
          ...originalCase.billing,
          totalHours: 0,
          totalAmount: 0,
          billableHours: 0,
          expenses: 0,
        },
      };
      
      set((state) => {
        state.cases.items.unshift(duplicatedCase);
        state.cases.pagination.total += 1;
      });
    }
  },
  
  // Bulk operations
  bulkUpdateCases: (ids, updates) => {
    set((state) => {
      ids.forEach(id => {
        const index = state.cases.items.findIndex(c => c.id === id);
        if (index !== -1) {
          state.cases.items[index] = {
            ...state.cases.items[index],
            ...updates,
            updatedAt: new Date(),
          };
        }
      });
    });
  },
  
  bulkDeleteCases: (ids) => {
    set((state) => {
      state.cases.items = state.cases.items.filter(c => !ids.includes(c.id));
      state.cases.selectedIds = state.cases.selectedIds.filter(selectedId => !ids.includes(selectedId));
      state.cases.pagination.total -= ids.length;
    });
  },
  
  // Data management
  setCases: (cases) => {
    set((state) => {
      state.cases.items = cases;
      state.cases.pagination.total = cases.length;
    });
  },
  
  setCasesLoading: (loading) => {
    set((state) => {
      state.cases.isLoading = loading;
    });
  },
  
  setCasesError: (error) => {
    set((state) => {
      state.cases.error = error;
    });
  },
  
  // Filtering and search
  setFilters: (newFilters) => {
    set((state) => {
      state.cases.filters = { ...state.cases.filters, ...newFilters };
      state.cases.pagination.page = 1; // Reset to first page when filtering
    });
  },
  
  clearFilters: () => {
    set((state) => {
      state.cases.filters = defaultFilters;
      state.cases.pagination.page = 1;
    });
  },
  
  // Sorting
  setSorting: (sortBy, sortOrder) => {
    set((state) => {
      state.cases.sortBy = sortBy;
      state.cases.sortOrder = sortOrder;
      
      // Sort the items
      state.cases.items.sort((a, b) => {
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
      state.cases.pagination = { ...state.cases.pagination, ...pagination };
    });
  },
  
  // Selection
  selectCase: (id) => {
    set((state) => {
      if (!state.cases.selectedIds.includes(id)) {
        state.cases.selectedIds.push(id);
      }
    });
  },
  
  deselectCase: (id) => {
    set((state) => {
      state.cases.selectedIds = state.cases.selectedIds.filter(selectedId => selectedId !== id);
    });
  },
  
  selectAllCases: () => {
    set((state) => {
      state.cases.selectedIds = state.cases.items.map(c => c.id);
    });
  },
  
  clearSelection: () => {
    set((state) => {
      state.cases.selectedIds = [];
    });
  },
  
  // Progress tracking
  updateCaseProgress: (id, progress) => {
    set((state) => {
      const index = state.cases.items.findIndex(c => c.id === id);
      if (index !== -1) {
        state.cases.items[index].progress = {
          ...state.cases.items[index].progress,
          ...progress,
        };
        state.cases.items[index].updatedAt = new Date();
      }
    });
  },
  
  completeMilestone: (caseId, milestoneId) => {
    set((state) => {
      const caseIndex = state.cases.items.findIndex(c => c.id === caseId);
      if (caseIndex !== -1) {
        const milestoneIndex = state.cases.items[caseIndex].progress.milestones.findIndex(m => m.id === milestoneId);
        if (milestoneIndex !== -1) {
          state.cases.items[caseIndex].progress.milestones[milestoneIndex].completed = true;
          state.cases.items[caseIndex].progress.milestones[milestoneIndex].completedAt = new Date();
          
          // Update overall progress
          const milestones = state.cases.items[caseIndex].progress.milestones;
          const completedCount = milestones.filter(m => m.completed).length;
          state.cases.items[caseIndex].progress.percentage = Math.round((completedCount / milestones.length) * 100);
          
          state.cases.items[caseIndex].updatedAt = new Date();
        }
      }
    });
  },
  
  // Billing
  updateCaseBilling: (id, billing) => {
    set((state) => {
      const index = state.cases.items.findIndex(c => c.id === id);
      if (index !== -1) {
        state.cases.items[index].billing = {
          ...state.cases.items[index].billing,
          ...billing,
        };
        state.cases.items[index].updatedAt = new Date();
      }
    });
  },
  
  addTimeEntry: (caseId, hours, description) => {
    set((state) => {
      const index = state.cases.items.findIndex(c => c.id === caseId);
      if (index !== -1) {
        const case_ = state.cases.items[index];
        case_.billing.totalHours += hours;
        case_.billing.billableHours += hours; // Assuming all time is billable for now
        case_.billing.totalAmount = case_.billing.billableHours * case_.billing.hourlyRate;
        case_.updatedAt = new Date();
      }
    });
  },
});