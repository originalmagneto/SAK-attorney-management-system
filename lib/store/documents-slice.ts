/**
 * Documents State Slice
 * Manages document storage, versioning, and operations
 */

import { StateCreator } from 'zustand';
import { AppStore } from './index';

export interface Document {
  id: string;
  name: string;
  description?: string;
  type: 'contract' | 'brief' | 'motion' | 'pleading' | 'correspondence' | 'evidence' | 'research' | 'template' | 'other';
  category: string;
  tags: string[];
  
  // File information
  file: {
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnailUrl?: string;
    checksum: string;
  };
  
  // Version control
  version: {
    number: string;
    isLatest: boolean;
    previousVersionId?: string;
    changeLog?: string;
  };
  
  // Access control
  permissions: {
    owner: string;
    editors: string[];
    viewers: string[];
    isPublic: boolean;
    accessLevel: 'private' | 'internal' | 'client' | 'public';
  };
  
  // Relationships
  relationships: {
    caseId?: string;
    clientId?: string;
    parentDocumentId?: string;
    relatedDocuments: string[];
  };
  
  // Status and workflow
  status: 'draft' | 'review' | 'approved' | 'signed' | 'archived' | 'deleted';
  workflow: {
    currentStep?: string;
    assignedTo?: string;
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  };
  
  // Metadata
  metadata: {
    author: string;
    lastModifiedBy: string;
    reviewers: {
      userId: string;
      status: 'pending' | 'approved' | 'rejected';
      comments?: string;
      reviewedAt?: Date;
    }[];
    signatures: {
      userId: string;
      signedAt: Date;
      ipAddress: string;
      method: 'electronic' | 'digital' | 'wet';
    }[];
    encryption?: {
      isEncrypted: boolean;
      algorithm?: string;
      keyId?: string;
    };
  };
  
  // Search and indexing
  searchableContent?: string;
  extractedText?: string;
  
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface DocumentsState {
  items: Document[];
  isLoading: boolean;
  error: string | null;
  
  // Upload state
  uploads: {
    [key: string]: {
      progress: number;
      status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
      error?: string;
    };
  };
  
  // Filters and search
  filters: {
    type: string[];
    category: string[];
    status: string[];
    tags: string[];
    caseId: string[];
    clientId: string[];
    author: string[];
    dateRange: {
      start?: Date;
      end?: Date;
    };
  };
  
  // Sorting
  sortBy: 'name' | 'type' | 'status' | 'createdAt' | 'updatedAt' | 'size';
  sortOrder: 'asc' | 'desc';
  
  // View options
  viewMode: 'list' | 'grid' | 'table';
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  
  // Selected items
  selectedIds: string[];
  
  // Preview
  previewDocument: Document | null;
}

export interface DocumentsActions {
  // CRUD operations
  addDocument: (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  restoreDocument: (id: string) => void;
  duplicateDocument: (id: string) => void;
  
  // Bulk operations
  bulkUpdateDocuments: (ids: string[], updates: Partial<Document>) => void;
  bulkDeleteDocuments: (ids: string[]) => void;
  bulkMoveDocuments: (ids: string[], targetCaseId: string) => void;
  
  // Version control
  createVersion: (id: string, changeLog?: string) => void;
  revertToVersion: (id: string, versionId: string) => void;
  getVersionHistory: (id: string) => Document[];
  
  // Upload management
  startUpload: (uploadId: string) => void;
  updateUploadProgress: (uploadId: string, progress: number) => void;
  completeUpload: (uploadId: string, document: Document) => void;
  failUpload: (uploadId: string, error: string) => void;
  cancelUpload: (uploadId: string) => void;
  
  // Data management
  setDocuments: (documents: Document[]) => void;
  setDocumentsLoading: (loading: boolean) => void;
  setDocumentsError: (error: string | null) => void;
  
  // Filtering and search
  setFilters: (filters: Partial<DocumentsState['filters']>) => void;
  clearFilters: () => void;
  
  // Sorting
  setSorting: (sortBy: DocumentsState['sortBy'], sortOrder: DocumentsState['sortOrder']) => void;
  
  // View options
  setViewMode: (mode: DocumentsState['viewMode']) => void;
  
  // Pagination
  setPagination: (pagination: Partial<DocumentsState['pagination']>) => void;
  
  // Selection
  selectDocument: (id: string) => void;
  deselectDocument: (id: string) => void;
  selectAllDocuments: () => void;
  clearSelection: () => void;
  
  // Preview
  setPreviewDocument: (document: Document | null) => void;
  
  // Permissions
  updatePermissions: (id: string, permissions: Partial<Document['permissions']>) => void;
  shareDocument: (id: string, userIds: string[], accessLevel: 'viewer' | 'editor') => void;
  
  // Workflow
  updateWorkflow: (id: string, workflow: Partial<Document['workflow']>) => void;
  assignReviewer: (id: string, userId: string) => void;
  submitReview: (id: string, userId: string, status: 'approved' | 'rejected', comments?: string) => void;
  
  // Signatures
  addSignature: (id: string, userId: string, method: Document['metadata']['signatures'][0]['method']) => void;
}

export type DocumentsSlice = { documents: DocumentsState } & DocumentsActions;

const defaultFilters: DocumentsState['filters'] = {
  type: [],
  category: [],
  status: [],
  tags: [],
  caseId: [],
  clientId: [],
  author: [],
  dateRange: {},
};

const defaultPagination: DocumentsState['pagination'] = {
  page: 1,
  limit: 20,
  total: 0,
};

export const createDocumentsSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  DocumentsSlice
> = (set, get) => ({
  // Initial state
  documents: {
    items: [],
    isLoading: false,
    error: null,
    uploads: {},
    filters: defaultFilters,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    viewMode: 'list',
    pagination: defaultPagination,
    selectedIds: [],
    previewDocument: null,
  },
  
  // CRUD operations
  addDocument: (documentData) => {
    const newDocument: Document = {
      ...documentData,
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => {
      state.documents.items.unshift(newDocument);
      state.documents.pagination.total += 1;
    });
  },
  
  updateDocument: (id, updates) => {
    set((state) => {
      const index = state.documents.items.findIndex(d => d.id === id);
      if (index !== -1) {
        state.documents.items[index] = {
          ...state.documents.items[index],
          ...updates,
          updatedAt: new Date(),
        };
      }
    });
  },
  
  deleteDocument: (id) => {
    set((state) => {
      const index = state.documents.items.findIndex(d => d.id === id);
      if (index !== -1) {
        state.documents.items[index].status = 'deleted';
        state.documents.items[index].deletedAt = new Date();
        state.documents.items[index].updatedAt = new Date();
      }
      state.documents.selectedIds = state.documents.selectedIds.filter(selectedId => selectedId !== id);
    });
  },
  
  restoreDocument: (id) => {
    set((state) => {
      const index = state.documents.items.findIndex(d => d.id === id);
      if (index !== -1) {
        state.documents.items[index].status = 'draft';
        state.documents.items[index].deletedAt = undefined;
        state.documents.items[index].updatedAt = new Date();
      }
    });
  },
  
  duplicateDocument: (id) => {
    const { documents } = get();
    const originalDocument = documents.items.find(d => d.id === id);
    
    if (originalDocument) {
      const duplicatedDocument: Document = {
        ...originalDocument,
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${originalDocument.name} (Copy)`,
        status: 'draft',
        version: {
          number: '1.0',
          isLatest: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined,
      };
      
      set((state) => {
        state.documents.items.unshift(duplicatedDocument);
        state.documents.pagination.total += 1;
      });
    }
  },
  
  // Bulk operations
  bulkUpdateDocuments: (ids, updates) => {
    set((state) => {
      ids.forEach(id => {
        const index = state.documents.items.findIndex(d => d.id === id);
        if (index !== -1) {
          state.documents.items[index] = {
            ...state.documents.items[index],
            ...updates,
            updatedAt: new Date(),
          };
        }
      });
    });
  },
  
  bulkDeleteDocuments: (ids) => {
    set((state) => {
      ids.forEach(id => {
        const index = state.documents.items.findIndex(d => d.id === id);
        if (index !== -1) {
          state.documents.items[index].status = 'deleted';
          state.documents.items[index].deletedAt = new Date();
          state.documents.items[index].updatedAt = new Date();
        }
      });
      state.documents.selectedIds = state.documents.selectedIds.filter(selectedId => !ids.includes(selectedId));
    });
  },
  
  bulkMoveDocuments: (ids, targetCaseId) => {
    set((state) => {
      ids.forEach(id => {
        const index = state.documents.items.findIndex(d => d.id === id);
        if (index !== -1) {
          state.documents.items[index].relationships.caseId = targetCaseId;
          state.documents.items[index].updatedAt = new Date();
        }
      });
    });
  },
  
  // Version control
  createVersion: (id, changeLog) => {
    set((state) => {
      const index = state.documents.items.findIndex(d => d.id === id);
      if (index !== -1) {
        const document = state.documents.items[index];
        const currentVersion = parseFloat(document.version.number);
        const newVersion = (currentVersion + 0.1).toFixed(1);
        
        document.version = {
          number: newVersion,
          isLatest: true,
          previousVersionId: document.id,
          changeLog,
        };
        document.updatedAt = new Date();
      }
    });
  },
  
  revertToVersion: (id, versionId) => {
    // Implementation would involve fetching version data
    console.log(`Reverting document ${id} to version ${versionId}`);
  },
  
  getVersionHistory: (id) => {
    // Implementation would return version history
    return [];
  },
  
  // Upload management
  startUpload: (uploadId) => {
    set((state) => {
      state.documents.uploads[uploadId] = {
        progress: 0,
        status: 'uploading',
      };
    });
  },
  
  updateUploadProgress: (uploadId, progress) => {
    set((state) => {
      if (state.documents.uploads[uploadId]) {
        state.documents.uploads[uploadId].progress = progress;
      }
    });
  },
  
  completeUpload: (uploadId, document) => {
    set((state) => {
      state.documents.uploads[uploadId] = {
        progress: 100,
        status: 'completed',
      };
      state.documents.items.unshift(document);
      state.documents.pagination.total += 1;
    });
  },
  
  failUpload: (uploadId, error) => {
    set((state) => {
      state.documents.uploads[uploadId] = {
        progress: 0,
        status: 'failed',
        error,
      };
    });
  },
  
  cancelUpload: (uploadId) => {
    set((state) => {
      delete state.documents.uploads[uploadId];
    });
  },
  
  // Data management
  setDocuments: (documents) => {
    set((state) => {
      state.documents.items = documents;
      state.documents.pagination.total = documents.length;
    });
  },
  
  setDocumentsLoading: (loading) => {
    set((state) => {
      state.documents.isLoading = loading;
    });
  },
  
  setDocumentsError: (error) => {
    set((state) => {
      state.documents.error = error;
    });
  },
  
  // Filtering and search
  setFilters: (newFilters) => {
    set((state) => {
      state.documents.filters = { ...state.documents.filters, ...newFilters };
      state.documents.pagination.page = 1;
    });
  },
  
  clearFilters: () => {
    set((state) => {
      state.documents.filters = defaultFilters;
      state.documents.pagination.page = 1;
    });
  },
  
  // Sorting
  setSorting: (sortBy, sortOrder) => {
    set((state) => {
      state.documents.sortBy = sortBy;
      state.documents.sortOrder = sortOrder;
      
      // Sort the items
      state.documents.items.sort((a, b) => {
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
  
  // View options
  setViewMode: (mode) => {
    set((state) => {
      state.documents.viewMode = mode;
    });
  },
  
  // Pagination
  setPagination: (pagination) => {
    set((state) => {
      state.documents.pagination = { ...state.documents.pagination, ...pagination };
    });
  },
  
  // Selection
  selectDocument: (id) => {
    set((state) => {
      if (!state.documents.selectedIds.includes(id)) {
        state.documents.selectedIds.push(id);
      }
    });
  },
  
  deselectDocument: (id) => {
    set((state) => {
      state.documents.selectedIds = state.documents.selectedIds.filter(selectedId => selectedId !== id);
    });
  },
  
  selectAllDocuments: () => {
    set((state) => {
      state.documents.selectedIds = state.documents.items.map(d => d.id);
    });
  },
  
  clearSelection: () => {
    set((state) => {
      state.documents.selectedIds = [];
    });
  },
  
  // Preview
  setPreviewDocument: (document) => {
    set((state) => {
      state.documents.previewDocument = document;
    });
  },
  
  // Permissions
  updatePermissions: (id, permissions) => {
    set((state) => {
      const index = state.documents.items.findIndex(d => d.id === id);
      if (index !== -1) {
        state.documents.items[index].permissions = {
          ...state.documents.items[index].permissions,
          ...permissions,
        };
        state.documents.items[index].updatedAt = new Date();
      }
    });
  },
  
  shareDocument: (id, userIds, accessLevel) => {
    set((state) => {
      const index = state.documents.items.findIndex(d => d.id === id);
      if (index !== -1) {
        const document = state.documents.items[index];
        if (accessLevel === 'editor') {
          document.permissions.editors = [...new Set([...document.permissions.editors, ...userIds])];
        } else {
          document.permissions.viewers = [...new Set([...document.permissions.viewers, ...userIds])];
        }
        document.updatedAt = new Date();
      }
    });
  },
  
  // Workflow
  updateWorkflow: (id, workflow) => {
    set((state) => {
      const index = state.documents.items.findIndex(d => d.id === id);
      if (index !== -1) {
        state.documents.items[index].workflow = {
          ...state.documents.items[index].workflow,
          ...workflow,
        };
        state.documents.items[index].updatedAt = new Date();
      }
    });
  },
  
  assignReviewer: (id, userId) => {
    set((state) => {
      const index = state.documents.items.findIndex(d => d.id === id);
      if (index !== -1) {
        const document = state.documents.items[index];
        const existingReviewer = document.metadata.reviewers.find(r => r.userId === userId);
        
        if (!existingReviewer) {
          document.metadata.reviewers.push({
            userId,
            status: 'pending',
          });
          document.updatedAt = new Date();
        }
      }
    });
  },
  
  submitReview: (id, userId, status, comments) => {
    set((state) => {
      const index = state.documents.items.findIndex(d => d.id === id);
      if (index !== -1) {
        const document = state.documents.items[index];
        const reviewerIndex = document.metadata.reviewers.findIndex(r => r.userId === userId);
        
        if (reviewerIndex !== -1) {
          document.metadata.reviewers[reviewerIndex] = {
            ...document.metadata.reviewers[reviewerIndex],
            status,
            comments,
            reviewedAt: new Date(),
          };
          document.updatedAt = new Date();
        }
      }
    });
  },
  
  // Signatures
  addSignature: (id, userId, method) => {
    set((state) => {
      const index = state.documents.items.findIndex(d => d.id === id);
      if (index !== -1) {
        const document = state.documents.items[index];
        document.metadata.signatures.push({
          userId,
          signedAt: new Date(),
          ipAddress: '127.0.0.1', // Would be actual IP in real implementation
          method,
        });
        document.status = 'signed';
        document.updatedAt = new Date();
      }
    });
  },
});