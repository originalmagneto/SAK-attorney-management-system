export interface BillingEntry {
  id: string;
  date: Date;
  attorney: string;
  client: string;
  caseNumber: string;
  caseTitle: string;
  description: string;
  timeSpent: number; // in hours
  rate: number;
  billable: boolean;
  status: 'draft' | 'billed' | 'paid' | 'disputed';
  category: 'research' | 'drafting' | 'meeting' | 'court' | 'travel' | 'communication' | 'review';
}

export const sampleBillingEntries: BillingEntry[] = [
  // Tech Corp Patent Case
  {
    id: 'bill-1',
    date: new Date('2024-04-15T10:30:00'),
    attorney: 'Sarah Johnson',
    client: 'Tech Corp',
    caseNumber: 'PCT-2024-456',
    caseTitle: 'Tech Corp Patent Case',
    description: 'Review and analysis of competitor\'s patent documentation',
    timeSpent: 2.5,
    rate: 350,
    billable: true,
    status: 'draft',
    category: 'research'
  },
  {
    id: 'bill-2',
    date: new Date('2024-04-15T14:00:00'),
    attorney: 'David Chen',
    client: 'Tech Corp',
    caseNumber: 'PCT-2024-456',
    caseTitle: 'Tech Corp Patent Case',
    description: 'Draft preliminary infringement analysis',
    timeSpent: 3.0,
    rate: 325,
    billable: true,
    status: 'draft',
    category: 'drafting'
  },

  // Smith Industries Employment Case
  {
    id: 'bill-3',
    date: new Date('2024-04-15T09:00:00'),
    attorney: 'Sarah Johnson',
    client: 'Smith Industries',
    caseNumber: 'CV-2024-123',
    caseTitle: 'Smith v. Johnson',
    description: 'Status conference attendance and preparation',
    timeSpent: 1.5,
    rate: 350,
    billable: true,
    status: 'billed',
    category: 'court'
  },
  {
    id: 'bill-4',
    date: new Date('2024-04-15T11:00:00'),
    attorney: 'Mark Wilson',
    client: 'Smith Industries',
    caseNumber: 'CV-2024-123',
    caseTitle: 'Smith v. Johnson',
    description: 'Client meeting to discuss settlement strategy',
    timeSpent: 1.0,
    rate: 300,
    billable: true,
    status: 'billed',
    category: 'meeting'
  },

  // Green Energy Compliance
  {
    id: 'bill-5',
    date: new Date('2024-04-15T13:00:00'),
    attorney: 'Emily Brown',
    client: 'Green Energy Ltd',
    caseNumber: 'ENV-2024-789',
    caseTitle: 'Environmental Compliance',
    description: 'Review of Q1 compliance documentation',
    timeSpent: 2.0,
    rate: 325,
    billable: true,
    status: 'paid',
    category: 'review'
  },

  // Global Logistics Contract
  {
    id: 'bill-6',
    date: new Date('2024-04-16T09:00:00'),
    attorney: 'Sarah Johnson',
    client: 'Global Logistics Inc',
    caseNumber: 'CV-2024-567',
    caseTitle: 'Contract Dispute',
    description: 'Mediation preparation and document review',
    timeSpent: 4.0,
    rate: 350,
    billable: true,
    status: 'draft',
    category: 'review'
  },

  // MedTech Regulatory
  {
    id: 'bill-7',
    date: new Date('2024-04-16T14:00:00'),
    attorney: 'Anna Kowalski',
    client: 'MedTech Innovations',
    caseNumber: 'REG-2024-321',
    caseTitle: 'Device Approval',
    description: 'Preparation of regulatory filing documents',
    timeSpent: 3.5,
    rate: 325,
    billable: true,
    status: 'billed',
    category: 'drafting'
  }
];

export const billingStats = {
  totalBillableHours: 17.5,
  totalBilled: 5950,
  outstandingAmount: 3675,
  averageHourlyRate: 329,
  topClients: [
    { name: 'Tech Corp', hours: 5.5, amount: 1837.50 },
    { name: 'Smith Industries', hours: 2.5, amount: 825 },
    { name: 'MedTech Innovations', hours: 3.5, amount: 1137.50 }
  ],
  utilization: 85, // percentage
  realization: 92, // percentage
  collectionRate: 88, // percentage
};