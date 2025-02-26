import { ClientFolder, Document } from '@/types/documents';

// Common document types for generating sample data
const documentTypes = {
  legal: ['Contract', 'Agreement', 'Amendment', 'Motion', 'Brief', 'Complaint', 'Response', 'Stipulation'],
  ip: ['Patent Application', 'Trademark Filing', 'IP Strategy', 'License Agreement', 'IP Analysis'],
  corporate: ['Board Resolution', 'Shareholder Agreement', 'SEC Filing', 'Due Diligence Report'],
  regulatory: ['Compliance Report', 'Regulatory Filing', 'Audit Report', 'Risk Assessment'],
  evidence: ['Expert Report', 'Witness Statement', 'Evidence Log', 'Investigation Report'],
  correspondence: ['Letter', 'Memo', 'Email Summary', 'Meeting Minutes']
};

// Helper function to generate random documents
function generateDocuments(count: number, baseNames: string[], prefix = ''): Document[] {
  return Array.from({ length: count }, (_, i) => {
    const type = Math.random() > 0.5 ? 'pdf' : Math.random() > 0.5 ? 'docx' : 'xlsx';
    const baseName = baseNames[Math.floor(Math.random() * baseNames.length)];
    const name = `${prefix}${baseName}_${Math.floor(Math.random() * 1000)}.${type}`;
    const status = ['draft', 'review', 'final', 'archived'][Math.floor(Math.random() * 3)] as Document['status']; // Only pick from valid status types
    return {
      id: `doc-${Date.now()}-${i}`,
      name,
      type,
      size: Math.floor(Math.random() * 10000000) + 500000,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
      modifiedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      modifiedBy: ['Sarah Johnson', 'Michael Chang', 'Jennifer Lee', 'David Chen'][Math.floor(Math.random() * 4)],
      status,
      version: Math.floor(Math.random() * 3) + 1,
      tags: [
        baseNames[Math.floor(Math.random() * baseNames.length)].toLowerCase(),
        ['urgent', 'confidential', 'internal', 'external'][Math.floor(Math.random() * 4)]
      ]
    };
  });
}

export const sampleClientFolders: ClientFolder[] = [
  {
    id: 'client-1',
    name: 'Apple Inc.',
    avatar: '/images/clients/apple.png',
    totalDocuments: 156,
    recentlyModified: '2024-04-15',
    folders: [
      {
        id: 'case-1',
        name: 'Patent Litigation vs. Samsung',
        type: 'case',
        status: 'active',
        documents: [
          ...generateDocuments(8, documentTypes.legal, 'Patent_'),
          ...generateDocuments(5, documentTypes.ip),
          ...generateDocuments(7, documentTypes.evidence)
        ],
        subFolders: [
          {
            id: 'evidence-1',
            name: 'Technical Evidence',
            type: 'category',
            documents: generateDocuments(10, documentTypes.evidence, 'TECH_')
          },
          {
            id: 'correspondence-1',
            name: 'Legal Correspondence',
            type: 'category',
            documents: generateDocuments(6, documentTypes.correspondence)
          }
        ]
      },
      {
        id: 'case-2',
        name: 'IP Portfolio Management',
        type: 'case',
        status: 'active',
        documents: generateDocuments(15, documentTypes.ip)
      }
    ]
  },
  {
    id: 'client-2',
    name: 'Microsoft Corporation',
    avatar: '/images/clients/microsoft.png',
    totalDocuments: 178,
    recentlyModified: '2024-04-14',
    folders: [
      {
        id: 'case-3',
        name: 'Antitrust Defense',
        type: 'case',
        status: 'active',
        documents: [
          ...generateDocuments(12, documentTypes.legal),
          ...generateDocuments(8, documentTypes.corporate),
          ...generateDocuments(5, documentTypes.regulatory)
        ]
      },
      {
        id: 'case-4',
        name: 'Cloud Services Compliance',
        type: 'case',
        status: 'active',
        documents: generateDocuments(20, documentTypes.regulatory)
      }
    ]
  },
  {
    id: 'client-3',
    name: 'NVIDIA Corporation',
    avatar: '/images/clients/nvidia.png',
    totalDocuments: 134,
    recentlyModified: '2024-04-13',
    folders: [
      {
        id: 'case-5',
        name: 'AI Patent Portfolio',
        type: 'case',
        status: 'active',
        documents: [
          ...generateDocuments(15, documentTypes.ip, 'AI_'),
          ...generateDocuments(10, documentTypes.regulatory)
        ]
      }
    ]
  },
  {
    id: 'client-4',
    name: 'Tesla, Inc.',
    avatar: '/images/clients/tesla.png',
    totalDocuments: 145,
    recentlyModified: '2024-04-12',
    folders: [
      {
        id: 'case-6',
        name: 'Autonomous Driving Patents',
        type: 'case',
        status: 'active',
        documents: generateDocuments(25, [...documentTypes.ip, ...documentTypes.regulatory])
      }
    ]
  },
  {
    id: 'client-5',
    name: 'Meta Platforms, Inc.',
    avatar: '/images/clients/meta.png',
    totalDocuments: 167,
    recentlyModified: '2024-04-11',
    folders: [
      {
        id: 'case-7',
        name: 'Privacy Compliance',
        type: 'case',
        status: 'active',
        documents: generateDocuments(30, documentTypes.regulatory)
      }
    ]
  },
  {
    id: 'client-6',
    name: 'Intel Corporation',
    avatar: '/images/clients/intel.png',
    totalDocuments: 142,
    recentlyModified: '2024-04-10',
    folders: [
      {
        id: 'case-8',
        name: 'Semiconductor IP Defense',
        type: 'case',
        status: 'active',
        documents: [
          ...generateDocuments(12, documentTypes.ip, 'SEMI_'),
          ...generateDocuments(8, documentTypes.legal),
        ]
      },
      {
        id: 'case-9',
        name: 'Manufacturing Compliance',
        type: 'case',
        status: 'active',
        documents: generateDocuments(15, documentTypes.regulatory)
      }
    ]
  },
  {
    id: 'client-7',
    name: 'Google LLC',
    avatar: '/images/clients/google.png',
    totalDocuments: 189,
    recentlyModified: '2024-04-09',
    folders: [
      {
        id: 'case-10',
        name: 'AI Ethics Compliance',
        type: 'case',
        status: 'active',
        documents: generateDocuments(25, documentTypes.regulatory)
      },
      {
        id: 'case-11',
        name: 'Search Technology Patents',
        type: 'case',
        status: 'active',
        documents: generateDocuments(20, documentTypes.ip)
      }
    ]
  },
  {
    id: 'client-8',
    name: 'Amazon.com, Inc.',
    avatar: '/images/clients/amazon.png',
    totalDocuments: 201,
    recentlyModified: '2024-04-08',
    folders: [
      {
        id: 'case-12',
        name: 'E-commerce Patents',
        type: 'case',
        status: 'active',
        documents: generateDocuments(18, documentTypes.ip)
      },
      {
        id: 'case-13',
        name: 'AWS Security Compliance',
        type: 'case',
        status: 'active',
        documents: generateDocuments(22, documentTypes.regulatory)
      }
    ]
  },
  {
    id: 'client-9',
    name: 'Adobe Inc.',
    avatar: '/images/clients/adobe.png',
    totalDocuments: 132,
    recentlyModified: '2024-04-07',
    folders: [
      {
        id: 'case-14',
        name: 'Creative Software IP',
        type: 'case',
        status: 'active',
        documents: generateDocuments(28, documentTypes.ip)
      }
    ]
  },
  {
    id: 'client-10',
    name: 'Qualcomm Inc.',
    avatar: '/images/clients/qualcomm.png',
    totalDocuments: 156,
    recentlyModified: '2024-04-06',
    folders: [
      {
        id: 'case-15',
        name: '5G Patent Portfolio',
        type: 'case',
        status: 'active',
        documents: [
          ...generateDocuments(15, documentTypes.ip, '5G_'),
          ...generateDocuments(10, documentTypes.legal)
        ]
      }
    ]
  },
  {
    id: 'client-11',
    name: 'IBM Corporation',
    avatar: '/images/clients/ibm.png',
    totalDocuments: 223,
    recentlyModified: '2024-04-05',
    folders: [
      {
        id: 'case-16',
        name: 'Quantum Computing IP',
        type: 'case',
        status: 'active',
        documents: generateDocuments(30, documentTypes.ip)
      },
      {
        id: 'case-17',
        name: 'Enterprise Software Licensing',
        type: 'case',
        status: 'active',
        documents: generateDocuments(25, [...documentTypes.legal, ...documentTypes.corporate])
      }
    ]
  },
  {
    id: 'client-12',
    name: 'Oracle Corporation',
    avatar: '/images/clients/oracle.png',
    totalDocuments: 167,
    recentlyModified: '2024-04-04',
    folders: [
      {
        id: 'case-18',
        name: 'Database Technology Patents',
        type: 'case',
        status: 'active',
        documents: generateDocuments(25, documentTypes.ip)
      }
    ]
  },
  {
    id: 'client-13',
    name: 'Salesforce, Inc.',
    avatar: '/images/clients/salesforce.png',
    totalDocuments: 145,
    recentlyModified: '2024-04-03',
    folders: [
      {
        id: 'case-19',
        name: 'CRM Software Patents',
        type: 'case',
        status: 'active',
        documents: generateDocuments(28, documentTypes.ip)
      }
    ]
  },
  {
    id: 'client-14',
    name: 'AMD',
    avatar: '/images/clients/amd.png',
    totalDocuments: 134,
    recentlyModified: '2024-04-02',
    folders: [
      {
        id: 'case-20',
        name: 'Processor Technology IP',
        type: 'case',
        status: 'active',
        documents: [
          ...generateDocuments(20, documentTypes.ip),
          ...generateDocuments(10, documentTypes.regulatory)
        ]
      }
    ]
  },
  {
    id: 'client-15',
    name: 'Cisco Systems',
    avatar: '/images/clients/cisco.png',
    totalDocuments: 178,
    recentlyModified: '2024-04-01',
    folders: [
      {
        id: 'case-21',
        name: 'Network Technology Patents',
        type: 'case',
        status: 'active',
        documents: generateDocuments(30, documentTypes.ip)
      }
    ]
  }
];

// Generate recent documents from across all clients
export const recentDocuments: Document[] = sampleClientFolders
  .flatMap(client => 
    client.folders.flatMap(folder => 
      folder.documents.map(doc => ({
        ...doc,
        client: client.name,
        case: folder.name
      }))
    )
  )
  .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime())
  .slice(0, 20);

// Generate starred documents
export const starredDocuments: Document[] = sampleClientFolders
  .flatMap(client => 
    client.folders.flatMap(folder => 
      folder.documents
        .filter(() => Math.random() > 0.8) // Randomly select ~20% of documents
        .map(doc => ({
          ...doc,
          client: client.name,
          case: folder.name
        }))
    )
  )
  .sort(() => Math.random() - 0.5)
  .slice(0, 15);