export type DocumentStatus = 'draft' | 'review' | 'final' | 'archived';
export type DocumentCategory = 'contract' | 'pleading' | 'correspondence' | 'evidence' | 'research' | 'internal' | 'corporate' | 'regulatory';
export type AccessLevel = 'public' | 'internal' | 'confidential' | 'privileged';
export type FolderType = 'case' | 'category';

export interface Document {
  id: string;
  name: string;
  type: string; // File extension or MIME type
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  createdBy: string;
  modifiedBy: string;
  clientId: string;
  clientName: string;
  caseId?: string;
  caseName?: string;
  category: DocumentCategory;
  status: DocumentStatus;
  accessLevel: AccessLevel;
  version: string;
  metadata: {
    description?: string;
    tags?: string[];
    court?: string;
    parties?: string[];
    dueDate?: Date;
    relatedDocuments?: string[];
    customFields?: Record<string, any>;
  };
}

export interface DocumentFolder {
  id: string;
  name: string;
  type: FolderType;
  clientId: string;
  parentId?: string;
  createdAt: Date;
  modifiedAt: Date;
  status?: string;
  metadata?: {
    description?: string;
    caseNumber?: string;
    startDate?: Date;
    endDate?: Date;
    customFields?: Record<string, any>;
  };
}

export interface ClientDocuments {
  id: string;
  name: string;
  avatar?: string;
  totalDocuments: number;
  recentlyModified: Date;
  folders: DocumentFolder[];
  metadata?: {
    description?: string;
    category?: string;
    status?: string;
    customFields?: Record<string, any>;
  };
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: string;
  createdAt: Date;
  createdBy: string;
  changes: string;
  fileUrl: string;
  size: number;
  metadata?: {
    comments?: string;
    reviewedBy?: string;
    approvedBy?: string;
    customFields?: Record<string, any>;
  };
}