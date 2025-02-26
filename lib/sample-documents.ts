import { ClientFolder, Document, Folder } from '@/types/documents';

export const sampleClientFolders: ClientFolder[] = [
  {
    id: 'client-1',
    name: 'Tech Corp',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&auto=format&fit=crop',
    totalDocuments: 156,
    recentlyModified: '2024-04-15',
    folders: [
      {
        id: 'case-1',
        name: 'Patent Litigation',
        type: 'case',
        status: 'active',
        documents: [
          {
            id: 'doc-1',
            name: 'Initial Patent Analysis.pdf',
            type: 'pdf',
            size: 2500000,
            createdAt: '2024-03-15T10:00:00',
            modifiedAt: '2024-04-15T14:30:00',
            modifiedBy: 'Sarah Johnson',
            status: 'final',
            version: 2,
            tags: ['patent', 'analysis']
          },
          {
            id: 'doc-2',
            name: 'Expert Witness Statement.docx',
            type: 'docx',
            size: 1800000,
            createdAt: '2024-04-01T09:00:00',
            modifiedAt: '2024-04-14T16:45:00',
            modifiedBy: 'Mark Wilson',
            status: 'review',
            version: 1
          }
        ],
        subFolders: [
          {
            id: 'sub-1',
            name: 'Evidence',
            type: 'category',
            documents: [
              {
                id: 'doc-3',
                name: 'Technical Specifications.pdf',
                type: 'pdf',
                size: 3500000,
                createdAt: '2024-03-20T11:00:00',
                modifiedAt: '2024-04-10T15:30:00',
                modifiedBy: 'David Chen',
                status: 'final',
                version: 1,
                tags: ['evidence', 'technical']
              }
            ]
          },
          {
            id: 'sub-2',
            name: 'Court Filings',
            type: 'category',
            documents: [
              {
                id: 'doc-4',
                name: 'Motion for Summary Judgment.docx',
                type: 'docx',
                size: 2200000,
                createdAt: '2024-04-05T14:00:00',
                modifiedAt: '2024-04-15T11:30:00',
                modifiedBy: 'Sarah Johnson',
                status: 'draft',
                version: 3
              }
            ]
          }
        ]
      },
      {
        id: 'cat-1',
        name: 'Corporate',
        type: 'category',
        documents: [
          {
            id: 'doc-5',
            name: 'Board Meeting Minutes.docx',
            type: 'docx',
            size: 1500000,
            createdAt: '2024-04-10T15:00:00',
            modifiedAt: '2024-04-10T17:30:00',
            modifiedBy: 'Sarah Johnson',
            status: 'final',
            version: 1
          }
        ],
        subFolders: [
          {
            id: 'sub-3',
            name: 'Contracts',
            type: 'category',
            documents: [
              {
                id: 'doc-6',
                name: 'Master Services Agreement.docx',
                type: 'docx',
                size: 2800000,
                createdAt: '2024-03-01T09:00:00',
                modifiedAt: '2024-04-12T10:15:00',
                modifiedBy: 'Mark Wilson',
                status: 'final',
                version: 4,
                tags: ['contract', 'MSA']
              }
            ]
          },
          {
            id: 'sub-4',
            name: 'IP Portfolio',
            type: 'category',
            documents: [
              {
                id: 'doc-7',
                name: 'Patent Portfolio Overview.xlsx',
                type: 'xlsx',
                size: 1200000,
                createdAt: '2024-02-15T09:00:00',
                modifiedAt: '2024-04-01T14:20:00',
                modifiedBy: 'David Chen',
                status: 'final',
                version: 2,
                tags: ['IP', 'patents']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'client-2',
    name: 'Smith Industries',
    avatar: 'https://images.unsplash.com/photo-1523287562758-66c7fc58967f?q=80&w=256&h=256&auto=format&fit=crop',
    totalDocuments: 89,
    recentlyModified: '2024-04-14',
    folders: [
      {
        id: 'case-2',
        name: 'Employment Case',
        type: 'case',
        status: 'active',
        documents: [
          {
            id: 'doc-8',
            name: 'Employee Statement.pdf',
            type: 'pdf',
            size: 1900000,
            createdAt: '2024-04-01T13:00:00',
            modifiedAt: '2024-04-14T09:30:00',
            modifiedBy: 'Sarah Johnson',
            status: 'final',
            version: 2,
            tags: ['testimony', 'evidence']
          }
        ],
        subFolders: [
          {
            id: 'sub-5',
            name: 'HR Documents',
            type: 'category',
            documents: [
              {
                id: 'doc-9',
                name: 'Performance Reviews.xlsx',
                type: 'xlsx',
                size: 1200000,
                createdAt: '2024-03-15T10:00:00',
                modifiedAt: '2024-04-13T14:20:00',
                modifiedBy: 'Mark Wilson',
                status: 'final',
                version: 1,
                tags: ['HR', 'evidence']
              }
            ]
          },
          {
            id: 'sub-6',
            name: 'Settlement',
            type: 'category',
            documents: [
              {
                id: 'doc-10',
                name: 'Settlement Agreement Draft.docx',
                type: 'docx',
                size: 2100000,
                createdAt: '2024-04-10T16:00:00',
                modifiedAt: '2024-04-15T11:20:00',
                modifiedBy: 'Sarah Johnson',
                status: 'draft',
                version: 2,
                tags: ['settlement', 'draft']
              }
            ]
          }
        ]
      },
      {
        id: 'cat-2',
        name: 'Compliance',
        type: 'category',
        documents: [
          {
            id: 'doc-11',
            name: 'Annual Compliance Report.pdf',
            type: 'pdf',
            size: 3100000,
            createdAt: '2024-01-15T09:00:00',
            modifiedAt: '2024-04-01T10:30:00',
            modifiedBy: 'Mark Wilson',
            status: 'final',
            version: 1,
            tags: ['compliance', 'annual']
          }
        ],
        subFolders: [
          {
            id: 'sub-7',
            name: 'Policies',
            type: 'category',
            documents: [
              {
                id: 'doc-12',
                name: 'Employee Handbook 2024.pdf',
                type: 'pdf',
                size: 4200000,
                createdAt: '2024-01-01T09:00:00',
                modifiedAt: '2024-03-15T14:20:00',
                modifiedBy: 'Sarah Johnson',
                status: 'final',
                version: 3,
                tags: ['HR', 'policy']
              }
            ]
          }
        ]
      }
    ]
  }
];

export const recentDocuments: Document[] = [
  sampleClientFolders[0].folders[0].documents[0], // Initial Patent Analysis
  sampleClientFolders[1].folders[0].subFolders![1].documents[0], // Settlement Agreement
  sampleClientFolders[0].folders[0].subFolders![1].documents[0], // Motion for Summary Judgment
].map(doc => ({
  ...doc,
  client: doc.id.startsWith('doc-1') ? 'Tech Corp' : 'Smith Industries',
  case: doc.id.startsWith('doc-1') ? 'Patent Litigation' : 'Employment Case'
}));

export const starredDocuments: Document[] = [
  sampleClientFolders[0].folders[1].subFolders![0].documents[0], // Master Services Agreement
  sampleClientFolders[1].folders[1].documents[0], // Annual Compliance Report
].map(doc => ({
  ...doc,
  client: doc.id.startsWith('doc-6') ? 'Tech Corp' : 'Smith Industries',
  case: doc.id.startsWith('doc-6') ? 'Corporate' : 'Compliance'
}));