// Simplified storage for serverless environment
import { cookies } from 'next/headers';
import bcryptjs from 'bcryptjs';

interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'OWNER' | 'PARTNER' | 'ASSOCIATE' | 'STAFF';
  firmId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Case {
  id: string;
  title: string;
  description?: string;
  status: string;
  firmId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Document {
  id: string;
  title: string;
  content: string;
  caseId: string;
  firmId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TimeEntry {
  id: string;
  description: string;
  duration: number;
  date: Date;
  caseId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Firm {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Store class to manage all data
export class Store {
  private static instance: Store;
  private users: User[] = [];
  private cases: Case[] = [];
  private documents: Document[] = [];
  private timeEntries: TimeEntry[] = [];
  private firms: Firm[] = [];

  private constructor() {
    // Initialize admin user with known good password hash for Admin123!
    const adminUser = {
      id: 'admin',
      email: 'admin@sak.com',
      name: 'System Admin',
      passwordHash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      role: 'OWNER' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    // Always start with admin user in the store
    this.users = [adminUser];
  }

  static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
      // Add a default admin user if no users exist
      if (Store.instance.users.length === 0) {
        const adminUser = {
          id: 'admin',
          email: 'admin@sak.com',
          name: 'System Admin',
          passwordHash: '$2a$10$zXi2ESVDxVvM2u4tk0BWZOGAZAAhZHoA4AzQrBg4fkYgHb2lj3NGG', // Password: Admin123!
          role: 'OWNER' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        Store.instance.addUser(adminUser);
      }
    }
    return Store.instance;
  }

  // User methods
  getUsers(): User[] {
    return this.users;
  }

  addUser(user: User): User {
    this.users.push(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sak_users', JSON.stringify(this.users));
    }
    return user;
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  // Case methods
  getCases(): Case[] {
    return this.cases;
  }

  addCase(caseData: Case): Case {
    this.cases.push(caseData);
    return caseData;
  }

  getCasesByFirm(firmId: string): Case[] {
    return this.cases.filter(c => c.firmId === firmId);
  }

  // Document methods
  getDocuments(): Document[] {
    return this.documents;
  }

  addDocument(document: Document): Document {
    this.documents.push(document);
    return document;
  }

  getDocumentsByCase(caseId: string): Document[] {
    return this.documents.filter(d => d.caseId === caseId);
  }

  // Time entry methods
  getTimeEntries(): TimeEntry[] {
    return this.timeEntries;
  }

  addTimeEntry(entry: TimeEntry): TimeEntry {
    this.timeEntries.push(entry);
    return entry;
  }

  getTimeEntriesByCase(caseId: string): TimeEntry[] {
    return this.timeEntries.filter(t => t.caseId === caseId);
  }

  // Firm methods
  getFirms(): Firm[] {
    return this.firms;
  }

  addFirm(firm: Firm): Firm {
    this.firms.push(firm);
    return firm;
  }

  getFirmById(id: string): Firm | undefined {
    return this.firms.find(f => f.id === id);
  }
}

// Export singleton instance
export const store = Store.getInstance();

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// UI Store interface
interface UIState {
  messagePanelSizes: number[];
  setMessagePanelSizes: (sizes: number[]) => void;
  lastVisitedClient?: string;
  setLastVisitedClient: (clientId: string) => void;
  lastViewedDocument?: string;
  setLastViewedDocument: (documentId: string) => void;
}

// UI Store
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      messagePanelSizes: [25, 75],
      setMessagePanelSizes: (sizes) => set({ messagePanelSizes: sizes }),
      lastVisitedClient: undefined,
      setLastVisitedClient: (clientId) => set({ lastVisitedClient: clientId }),
      lastViewedDocument: undefined,
      setLastViewedDocument: (documentId) => set({ lastViewedDocument: documentId }),
    }),
    {
      name: 'sak-ui-storage',
      skipHydration: true,
    }
  )
);