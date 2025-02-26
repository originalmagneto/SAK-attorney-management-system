import { Client } from '@/types/clients';

export const sampleClients: Client[] = [
  // Technology Companies
  {
    id: 'client-1',
    name: 'Apple Inc.',
    logo: 'https://example.com/logos/apple.png',
    industry: 'Technology',
    totalCases: 12,
    activeCases: 5,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Katherine Adams',
      email: 'legal@apple.example.com',
      phone: '+1 (408) 555-0123',
      address: '1 Apple Park Way, Cupertino, CA 95014'
    },
    matters: ['Patent Litigation', 'IP Portfolio Management', 'Regulatory Compliance']
  },
  {
    id: 'client-2',
    name: 'Microsoft Corporation',
    logo: 'https://example.com/logos/microsoft.png',
    industry: 'Technology',
    totalCases: 15,
    activeCases: 7,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Brad Smith',
      email: 'legal@microsoft.example.com',
      phone: '+1 (425) 555-0123',
      address: 'One Microsoft Way, Redmond, WA 98052'
    },
    matters: ['Antitrust Defense', 'Software Licensing', 'Corporate Governance']
  },
  {
    id: 'client-3',
    name: 'NVIDIA Corporation',
    logo: 'https://example.com/logos/nvidia.png',
    industry: 'Technology',
    totalCases: 8,
    activeCases: 4,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Timothy Teter',
      email: 'legal@nvidia.example.com',
      phone: '+1 (408) 555-0124',
      address: '2788 San Tomas Expressway, Santa Clara, CA 95051'
    },
    matters: ['AI Patents', 'Semiconductor IP', 'Technology Licensing']
  },
  {
    id: 'client-4',
    name: 'Tesla, Inc.',
    logo: 'https://example.com/logos/tesla.png',
    industry: 'Automotive & Technology',
    totalCases: 10,
    activeCases: 6,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Alan Prescott',
      email: 'legal@tesla.example.com',
      phone: '+1 (510) 555-0125',
      address: '3500 Deer Creek Road, Palo Alto, CA 94304'
    },
    matters: ['Product Liability', 'Employment Law', 'Regulatory Compliance']
  },
  {
    id: 'client-5',
    name: 'Meta Platforms, Inc.',
    logo: 'https://example.com/logos/meta.png',
    industry: 'Technology',
    totalCases: 18,
    activeCases: 9,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Jennifer Newstead',
      email: 'legal@meta.example.com',
      phone: '+1 (650) 555-0126',
      address: '1 Hacker Way, Menlo Park, CA 94025'
    },
    matters: ['Privacy Law', 'Content Moderation', 'International Regulation']
  },
  // Financial Services Companies
  {
    id: 'client-6',
    name: 'Goldman Sachs Group',
    logo: 'https://example.com/logos/goldmansachs.png',
    industry: 'Financial Services',
    totalCases: 14,
    activeCases: 5,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Karen Seymour',
      email: 'legal@gs.example.com',
      phone: '+1 (212) 555-0127',
      address: '200 West Street, New York, NY 10282'
    },
    matters: ['Securities Regulation', 'M&A', 'Corporate Compliance']
  },
  {
    id: 'client-7',
    name: 'JPMorgan Chase & Co.',
    logo: 'https://example.com/logos/jpmorgan.png',
    industry: 'Financial Services',
    totalCases: 16,
    activeCases: 8,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Stacey Friedman',
      email: 'legal@jpmorgan.example.com',
      phone: '+1 (212) 555-0128',
      address: '383 Madison Avenue, New York, NY 10179'
    },
    matters: ['Banking Regulation', 'Securities Law', 'International Finance']
  },
  // Healthcare Companies
  {
    id: 'client-8',
    name: 'Johnson & Johnson',
    logo: 'https://example.com/logos/jnj.png',
    industry: 'Healthcare',
    totalCases: 20,
    activeCases: 12,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Elizabeth Forminard',
      email: 'legal@jnj.example.com',
      phone: '+1 (732) 555-0129',
      address: 'One Johnson & Johnson Plaza, New Brunswick, NJ 08933'
    },
    matters: ['Product Liability', 'Healthcare Compliance', 'Patent Protection']
  },
  {
    id: 'client-9',
    name: 'Pfizer Inc.',
    logo: 'https://example.com/logos/pfizer.png',
    industry: 'Healthcare',
    totalCases: 15,
    activeCases: 7,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Douglas Lankler',
      email: 'legal@pfizer.example.com',
      phone: '+1 (212) 555-0130',
      address: '235 East 42nd Street, New York, NY 10017'
    },
    matters: ['Pharmaceutical Patents', 'Clinical Trials', 'FDA Compliance']
  },
  // Energy Companies
  {
    id: 'client-10',
    name: 'ExxonMobil Corporation',
    logo: 'https://example.com/logos/exxonmobil.png',
    industry: 'Energy',
    totalCases: 12,
    activeCases: 6,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Randall Ebner',
      email: 'legal@exxonmobil.example.com',
      phone: '+1 (972) 555-0131',
      address: '5959 Las Colinas Boulevard, Irving, TX 75039'
    },
    matters: ['Environmental Law', 'Energy Regulation', 'International Trade']
  },
  // Retail Companies
  {
    id: 'client-11',
    name: 'Walmart Inc.',
    logo: 'https://example.com/logos/walmart.png',
    industry: 'Retail',
    totalCases: 25,
    activeCases: 10,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Rachel Brand',
      email: 'legal@walmart.example.com',
      phone: '+1 (479) 555-0132',
      address: '702 SW 8th Street, Bentonville, AR 72716'
    },
    matters: ['Employment Law', 'Consumer Protection', 'Real Estate']
  },
  // Entertainment Companies
  {
    id: 'client-12',
    name: 'Disney Enterprises',
    logo: 'https://example.com/logos/disney.png',
    industry: 'Entertainment',
    totalCases: 18,
    activeCases: 8,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Horacio Gutierrez',
      email: 'legal@disney.example.com',
      phone: '+1 (818) 555-0133',
      address: '500 South Buena Vista Street, Burbank, CA 91521'
    },
    matters: ['IP Protection', 'Media Licensing', 'Entertainment Law']
  },
  // Individual Clients
  {
    id: 'client-13',
    name: 'John Smith',
    industry: 'Individual',
    totalCases: 2,
    activeCases: 1,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 555-0134',
      address: '123 Main Street, Anytown, USA 12345'
    },
    matters: ['Personal Injury', 'Estate Planning']
  },
  {
    id: 'client-14',
    name: 'Sarah Johnson',
    industry: 'Individual',
    totalCases: 1,
    activeCases: 1,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 555-0135',
      address: '456 Oak Avenue, Somewhere, USA 67890'
    },
    matters: ['Family Law', 'Real Estate']
  },
  // Add more clients here...
  // Technology Companies (continued)
  {
    id: 'client-15',
    name: 'Intel Corporation',
    logo: 'https://example.com/logos/intel.png',
    industry: 'Technology',
    totalCases: 10,
    activeCases: 4,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Steven Rodgers',
      email: 'legal@intel.example.com',
      phone: '+1 (408) 555-0136',
      address: '2200 Mission College Blvd, Santa Clara, CA 95054'
    },
    matters: ['Patent Litigation', 'Technology Licensing', 'Corporate Compliance']
  },
  // More corporations and individuals...
  {
    id: 'client-16',
    name: 'Amazon.com, Inc.',
    logo: 'https://example.com/logos/amazon.png',
    industry: 'Technology & Retail',
    totalCases: 22,
    activeCases: 11,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'David Zapolsky',
      email: 'legal@amazon.example.com',
      phone: '+1 (206) 555-0137',
      address: '410 Terry Ave N, Seattle, WA 98109'
    },
    matters: ['E-commerce Law', 'Employment', 'Antitrust']
  },
  {
    id: 'client-17',
    name: 'General Motors',
    logo: 'https://example.com/logos/gm.png',
    industry: 'Automotive',
    totalCases: 16,
    activeCases: 7,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Craig Glidden',
      email: 'legal@gm.example.com',
      phone: '+1 (313) 555-0138',
      address: '300 Renaissance Center, Detroit, MI 48243'
    },
    matters: ['Product Liability', 'Labor Law', 'Environmental Compliance']
  },
  {
    id: 'client-18',
    name: 'Coca-Cola Company',
    logo: 'https://example.com/logos/coca-cola.png',
    industry: 'Consumer Goods',
    totalCases: 14,
    activeCases: 5,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Bradley Gayton',
      email: 'legal@coca-cola.example.com',
      phone: '+1 (404) 555-0139',
      address: '1 Coca Cola Plz NW, Atlanta, GA 30313'
    },
    matters: ['Trademark Protection', 'International Trade', 'Advertising Law']
  },
  {
    id: 'client-19',
    name: 'Netflix, Inc.',
    logo: 'https://example.com/logos/netflix.png',
    industry: 'Entertainment & Technology',
    totalCases: 12,
    activeCases: 6,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'David Hyman',
      email: 'legal@netflix.example.com',
      phone: '+1 (408) 555-0140',
      address: '100 Winchester Circle, Los Gatos, CA 95032'
    },
    matters: ['Content Licensing', 'Streaming Rights', 'International Expansion']
  },
  {
    id: 'client-20',
    name: 'Boeing Company',
    logo: 'https://example.com/logos/boeing.png',
    industry: 'Aerospace & Defense',
    totalCases: 18,
    activeCases: 9,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Brett Gerry',
      email: 'legal@boeing.example.com',
      phone: '+1 (312) 555-0141',
      address: '100 N Riverside Plaza, Chicago, IL 60606'
    },
    matters: ['Aviation Law', 'Government Contracts', 'Export Compliance']
  },
  // More Individual Clients
  {
    id: 'client-21',
    name: 'Robert Williams',
    industry: 'Individual',
    totalCases: 2,
    activeCases: 1,
    billingStatus: 'current',
    contactInfo: {
      primaryContact: 'Robert Williams',
      email: 'robert.williams@example.com',
      phone: '+1 (555) 555-0142',
      address: '789 Pine Street, Elsewhere, USA 34567'
    },
    matters: ['Estate Planning', 'Tax Law']
  },
];