export interface Client {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  totalCases: number;
  activeCases: number;
  billingStatus: 'current' | 'overdue' | 'pending';
  website?: string;
  contactInfo: {
    primaryContact: string;
    email: string;
    phone: string;
    address: string;
  };
  matters: string[];
}