export type DocumentStatus = 'draft' | 'review' | 'final' | 'archived';
export type DocumentCategory = 'contract' | 'pleading' | 'correspondence' | 'evidence' | 'research' | 'internal' | 'corporate' | 'regulatory';
export type AccessLevel = 'public' | 'internal' | 'confidential' | 'privileged';
export type FolderType = 'case' | 'category';

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'jpg' | 'txt';
  size: number;
  createdAt: string;
  modifiedAt: string;
  modifiedBy: string;
  status: 'draft' | 'final' | 'review' | 'archived';
  version: number;
  tags?: string[];
}

export interface Folder {
  id: string;
  name: string;
  type: 'case' | 'category';
  status?: string;
  documents: Document[];
  subFolders?: Folder[];
}

export interface ClientFolder {
  id: string;
  name: string;
  avatar?: string;
  totalDocuments: number;
  recentlyModified: string;
  folders: Folder[];
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