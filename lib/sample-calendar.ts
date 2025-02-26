import { CalendarEvent, EventType } from '@/types/calendar';

export const sampleEvents: CalendarEvent[] = [
  // Court Hearings
  {
    id: 'hearing-1',
    title: 'Smith v. Johnson - Status Conference',
    type: 'HEARING',
    start: new Date('2024-04-15T09:00:00'),
    end: new Date('2024-04-15T10:30:00'),
    metadata: {
      caseNumber: 'CV-2024-123',
      courthouse: 'District Court',
      courtroom: '302',
      judge: 'Hon. Michael Davis',
      description: 'Status conference for employment discrimination case',
      client: 'Smith Industries',
      priority: 'high',
      participants: ['Sarah Johnson', 'Mark Wilson'],
      requiredDocuments: ['Pre-hearing Brief', 'Latest Settlement Offer'],
    }
  },
  {
    id: 'hearing-2',
    title: 'Tech Corp Patent Hearing',
    type: 'HEARING',
    start: new Date('2024-04-16T14:00:00'),
    end: new Date('2024-04-16T16:00:00'),
    metadata: {
      caseNumber: 'PCT-2024-456',
      courthouse: 'Federal Court',
      courtroom: '405',
      judge: 'Hon. Sarah Williams',
      description: 'Patent infringement preliminary hearing',
      client: 'Tech Corp',
      priority: 'high',
      participants: ['Sarah Johnson', 'David Chen'],
      requiredDocuments: ['Patent Application', 'Expert Witness Report'],
    }
  },

  // Client Meetings
  {
    id: 'meeting-1',
    title: 'Client Meeting - Emily Brown (Green Energy)',
    type: 'MEETING',
    start: new Date('2024-04-15T11:00:00'),
    end: new Date('2024-04-15T12:00:00'),
    metadata: {
      location: 'Conference Room A',
      client: 'Green Energy Ltd',
      description: 'Review environmental compliance documentation',
      priority: 'medium',
      participants: ['Emily Brown', 'Michael Green', 'Sarah Johnson'],
      agenda: ['Review Q1 Compliance Report', 'Discuss New Regulations', 'Planning Next Steps'],
    }
  },

  // Depositions
  {
    id: 'depo-1',
    title: 'Expert Witness Deposition - Tech Corp Case',
    type: 'DEPOSITION',
    start: new Date('2024-04-17T10:00:00'),
    end: new Date('2024-04-17T14:00:00'),
    metadata: {
      caseNumber: 'PCT-2024-456',
      location: 'Law Office - Deposition Room',
      witness: 'Dr. Robert Anderson',
      client: 'Tech Corp',
      description: 'Expert witness deposition on technical aspects',
      priority: 'high',
      participants: ['Sarah Johnson', 'Court Reporter', 'Opposing Counsel'],
      requiredDocuments: ['Expert Report', 'Technical Specifications'],
    }
  },

  // Internal Meetings
  {
    id: 'internal-1',
    title: 'Weekly Strategy Meeting',
    type: 'INTERNAL',
    start: new Date('2024-04-15T15:00:00'),
    end: new Date('2024-04-15T16:00:00'),
    metadata: {
      location: 'Main Conference Room',
      description: 'Weekly case strategy and workload distribution meeting',
      priority: 'medium',
      participants: ['All Associates', 'Partners'],
      agenda: ['Case Updates', 'Resource Allocation', 'Upcoming Deadlines'],
    }
  },

  // Case Deadlines
  {
    id: 'deadline-1',
    title: 'Motion Filing Deadline - Smith Case',
    type: 'DEADLINE',
    start: new Date('2024-04-18'),
    allDay: true,
    metadata: {
      caseNumber: 'CV-2024-123',
      description: 'Summary judgment motion filing deadline',
      client: 'Smith Industries',
      priority: 'critical',
      assignedTo: 'Sarah Johnson',
      requiredDocuments: ['Motion Draft', 'Supporting Evidence'],
    }
  },

  // Statute of Limitations
  {
    id: 'sol-1',
    title: 'SOL Deadline - Brown Estate',
    type: 'SOL',
    start: new Date('2024-06-30'),
    allDay: true,
    metadata: {
      caseNumber: 'PR-2024-789',
      description: 'Statute of Limitations for probate claim',
      client: 'Brown Estate',
      priority: 'critical',
      assignedTo: 'Mark Wilson',
      jurisdiction: 'State Court',
      causeOfAction: 'Probate Claim',
    }
  },

  // Mediation
  {
    id: 'mediation-1',
    title: 'Mediation - Global Logistics Case',
    type: 'MEDIATION',
    start: new Date('2024-04-22T09:00:00'),
    end: new Date('2024-04-22T17:00:00'),
    metadata: {
      caseNumber: 'CV-2024-567',
      location: 'Mediation Center',
      mediator: 'Hon. James Roberts (Ret.)',
      client: 'Global Logistics Inc',
      description: 'Full-day mediation session for contract dispute',
      priority: 'high',
      participants: ['Sarah Johnson', 'Client Representatives', 'Opposing Counsel'],
      requiredDocuments: ['Mediation Brief', 'Settlement Authority'],
    }
  },

  // Client Training
  {
    id: 'training-1',
    title: 'Compliance Training - MedTech Staff',
    type: 'TRAINING',
    start: new Date('2024-04-24T13:00:00'),
    end: new Date('2024-04-24T15:00:00'),
    metadata: {
      location: 'Client Office',
      client: 'MedTech Innovations',
      description: 'Staff training on new medical device regulations',
      priority: 'medium',
      presenter: 'Sarah Johnson',
      participants: ['MedTech Legal Team', 'R&D Staff'],
      materials: ['Training Slides', 'Compliance Checklist'],
    }
  },

  // Board Meetings
  {
    id: 'board-1',
    title: 'Board Meeting - Tech Corp',
    type: 'BOARD_MEETING',
    start: new Date('2024-04-29T10:00:00'),
    end: new Date('2024-04-29T12:00:00'),
    metadata: {
      location: 'Client Headquarters',
      client: 'Tech Corp',
      description: 'Quarterly board meeting attendance',
      priority: 'high',
      participants: ['Board Members', 'Sarah Johnson'],
      requiredDocuments: ['Board Resolution Drafts', 'Legal Updates Report'],
    }
  }
];