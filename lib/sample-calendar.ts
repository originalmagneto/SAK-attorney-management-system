import { CalendarEvent, EventType } from '@/types/calendar';

function toDate(dateStr: string): Date {
  return new Date(dateStr);
}

export const sampleEvents: CalendarEvent[] = [
  // February 1, 2024 (Thursday)
  {
    id: 'feb-1-1',
    title: 'Team Status Meeting',
    type: 'INTERNAL',
    start: toDate('2024-02-01T09:00'),
    end: toDate('2024-02-01T10:00'),
    metadata: {
      location: 'Conference Room A',
      attendees: ['user-1', 'user-2', 'user-3']
    }
  },
  {
    id: 'feb-1-2',
    title: 'Johnson Case Review',
    type: 'MEETING',
    start: toDate('2024-02-01T11:00'),
    end: toDate('2024-02-01T12:00'),
    metadata: {
      caseId: 'case-123',
      location: 'Office 2B'
    }
  },
  {
    id: 'feb-1-3',
    title: 'Client Consultation - Johnson Case',
    type: 'MEETING',
    start: toDate('2024-02-01T13:30'),
    end: toDate('2024-02-01T14:30'),
    metadata: {
      client: 'Johnson Family',
      location: 'Meeting Room 2',
      participants: ['Sarah Johnson', 'Mark Johnson']
    }
  },
  {
    id: 'feb-1-4',
    title: 'Document Filing Deadline - Davis Case',
    type: 'DEADLINE',
    start: toDate("2024-02-01T17:00"),
    metadata: {
      priority: 'high',
      client: 'Davis Industries'
    }
  },

  // February 2, 2024 (Friday)
  {
    id: 'feb-2-1',
    title: 'Brown vs State Hearing',
    type: 'HEARING',
    start: toDate("2024-02-02T09:30"),
    end: toDate("2024-02-02T11:30"),
    metadata: {
      courthouse: 'Central District Court',
      courtroom: '3A',
      client: 'James Brown',
      priority: 'high'
    }
  },
  {
    id: 'feb-2-2',
    title: 'Deposition - Thompson Case',
    type: 'DEPOSITION',
    start: toDate("2024-02-02T13:00"),
    end: toDate("2024-02-02T15:00"),
    metadata: {
      location: 'Law Offices',
      client: 'Thompson LLC',
      participants: ['Expert Witness', 'Opposing Counsel']
    }
  },
  {
    id: 'feb-2-3',
    title: 'Case Strategy Review',
    type: 'INTERNAL',
    start: toDate("2024-02-02T15:30"),
    end: toDate("2024-02-02T16:30"),
    metadata: {
      location: 'Conference Room B',
      participants: ['Senior Partners']
    }
  },

  // February 5, 2024 (Monday)
  {
    id: 'feb-5-1',
    title: 'Weekly Planning Meeting',
    type: 'INTERNAL',
    start: toDate("2024-02-05T09:00"),
    end: toDate("2024-02-05T10:00"),
    metadata: {
      location: 'Main Conference Room',
      participants: ['All Staff']
    }
  },
  {
    id: 'feb-5-2',
    title: 'Wilson Estate Planning',
    type: 'MEETING',
    start: toDate("2024-02-05T10:30"),
    end: toDate("2024-02-05T12:00"),
    metadata: {
      client: 'Wilson Family',
      location: 'Meeting Room 1'
    }
  },
  {
    id: 'feb-5-3',
    title: 'Mediation - Roberts Dispute',
    type: 'MEDIATION',
    start: toDate("2024-02-05T13:30"),
    end: toDate("2024-02-05T16:30"),
    metadata: {
      location: 'Mediation Center',
      client: 'Roberts Manufacturing',
      priority: 'high'
    }
  },

  // February 6, 2024 (Tuesday)
  {
    id: 'feb-6-1',
    title: 'SOL Deadline - Martinez Case',
    type: 'SOL',
    start: toDate("2024-02-06T09:00"),
    metadata: {
      client: 'Martinez',
      priority: 'critical'
    }
  },
  {
    id: 'feb-6-2',
    title: 'Client Meeting - Tech Corp',
    type: 'MEETING',
    start: toDate("2024-02-06T10:00"),
    end: toDate("2024-02-06T11:30"),
    metadata: {
      client: 'Tech Corp',
      location: 'Virtual Meeting'
    }
  },
  {
    id: 'feb-6-3',
    title: 'Legal Training Session',
    type: 'TRAINING',
    start: toDate("2024-02-06T13:00"),
    end: toDate("2024-02-06T15:00"),
    metadata: {
      location: 'Training Room',
      participants: ['Junior Associates']
    }
  },
  {
    id: 'feb-6-4',
    title: 'Document Review - Anderson Case',
    type: 'INTERNAL',
    start: toDate("2024-02-06T15:30"),
    end: toDate("2024-02-06T17:00"),
    metadata: {
      client: 'Anderson Inc',
      requiredDocuments: ['Case Files', 'Evidence Documents']
    }
  },

  // Continue with more February dates...
  // February 7, 2024 (Wednesday)
  {
    id: 'feb-7-1',
    title: 'Board Meeting',
    type: 'BOARD_MEETING',
    start: toDate("2024-02-07T09:00"),
    end: toDate("2024-02-07T11:00"),
    metadata: {
      location: 'Executive Boardroom',
      priority: 'high'
    }
  },
  {
    id: 'feb-7-2',
    title: 'Client Consultation - Harris',
    type: 'MEETING',
    start: toDate("2024-02-07T11:30"),
    end: toDate("2024-02-07T12:30"),
    metadata: {
      client: 'Harris Family',
      location: 'Meeting Room 3'
    }
  },
  {
    id: 'feb-7-3',
    title: 'Court Filing Deadline',
    type: 'DEADLINE',
    start: toDate("2024-02-07T16:00"),
    metadata: {
      priority: 'high',
      client: 'Multiple Cases'
    }
  },

  // February 8, 2024 (Thursday)
  {
    id: 'feb-8-1',
    title: 'Phillips vs State Hearing',
    type: 'HEARING',
    start: toDate("2024-02-08T10:00"),
    end: toDate("2024-02-08T12:00"),
    metadata: {
      courthouse: 'District Court',
      courtroom: '5B',
      client: 'Phillips',
      priority: 'high'
    }
  },
  {
    id: 'feb-8-2',
    title: 'Team Lunch',
    type: 'INTERNAL',
    start: toDate("2024-02-08T12:30"),
    end: toDate("2024-02-08T13:30"),
    metadata: {
      location: 'Restaurant'
    }
  },
  {
    id: 'feb-8-3',
    title: 'Client Strategy Meeting',
    type: 'MEETING',
    start: toDate("2024-02-08T14:00"),
    end: toDate("2024-02-08T15:30"),
    metadata: {
      client: 'Global Industries',
      location: 'Conference Room A'
    }
  },

  // February 9, 2024 (Friday)
  {
    id: 'feb-9-1',
    title: 'Expert Witness Deposition',
    type: 'DEPOSITION',
    start: toDate("2024-02-09T09:30"),
    end: toDate("2024-02-09T12:30"),
    metadata: {
      location: 'Law Offices',
      client: 'Turner Case',
      participants: ['Dr. Smith', 'Opposing Counsel']
    }
  },
  {
    id: 'feb-9-2',
    title: 'Case Review Meeting',
    type: 'INTERNAL',
    start: toDate("2024-02-09T14:00"),
    end: toDate("2024-02-09T15:30"),
    metadata: {
      location: 'Meeting Room 1',
      participants: ['Legal Team']
    }
  },
  {
    id: 'feb-9-3',
    title: 'Client Call - International Corp',
    type: 'MEETING',
    start: toDate("2024-02-09T16:00"),
    end: toDate("2024-02-09T17:00"),
    metadata: {
      client: 'International Corp',
      location: 'Virtual Meeting'
    }
  },

  // February 12, 2024 (Monday)
  {
    id: 'feb-12-1',
    title: 'Weekly Team Meeting',
    type: 'INTERNAL',
    start: toDate("2024-02-12T09:00"),
    end: toDate("2024-02-12T10:30"),
    metadata: {
      location: 'Main Conference Room',
      participants: ['All Staff'],
      priority: 'medium'
    }
  },
  {
    id: 'feb-12-2',
    title: 'Client Intake - New Corporate Matter',
    type: 'MEETING',
    start: toDate("2024-02-12T11:00"),
    end: toDate("2024-02-12T12:30"),
    metadata: {
      client: 'XYZ Corporation',
      location: 'Meeting Room 2'
    }
  },
  {
    id: 'feb-12-3',
    title: 'Settlement Conference',
    type: 'MEDIATION',
    start: toDate("2024-02-12T14:00"),
    end: toDate("2024-02-12T17:00"),
    metadata: {
      location: 'Mediation Center',
      client: 'Smith vs Johnson',
      priority: 'high'
    }
  },

  // February 13, 2024 (Tuesday)
  {
    id: 'feb-13-1',
    title: 'Motion Hearing - Davis Case',
    type: 'HEARING',
    start: toDate("2024-02-13T09:30"),
    end: toDate("2024-02-13T11:30"),
    metadata: {
      courthouse: 'Superior Court',
      courtroom: '4C',
      client: 'Davis Industries',
      priority: 'high'
    }
  },
  {
    id: 'feb-13-2',
    title: 'Document Review Session',
    type: 'INTERNAL',
    start: toDate("2024-02-13T13:00"),
    end: toDate("2024-02-13T15:00"),
    metadata: {
      location: 'Review Room',
      participants: ['Junior Associates'],
      requiredDocuments: ['Discovery Documents']
    }
  },
  {
    id: 'feb-13-3',
    title: 'Client Update Meeting',
    type: 'MEETING',
    start: toDate("2024-02-13T15:30"),
    end: toDate("2024-02-13T16:30"),
    metadata: {
      client: 'Roberts Manufacturing',
      location: 'Virtual Meeting'
    }
  },

  // February 14, 2024 (Wednesday)
  {
    id: 'feb-14-1',
    title: 'Deposition - Expert Witness',
    type: 'DEPOSITION',
    start: toDate("2024-02-14T09:00"),
    end: toDate("2024-02-14T12:00"),
    metadata: {
      location: 'Law Offices',
      client: 'Thompson LLC',
      participants: ['Dr. Wilson', 'Opposing Counsel']
    }
  },
  {
    id: 'feb-14-2',
    title: 'Practice Group Meeting',
    type: 'INTERNAL',
    start: toDate("2024-02-14T13:30"),
    end: toDate("2024-02-14T14:30"),
    metadata: {
      location: 'Conference Room B',
      participants: ['Litigation Team']
    }
  },
  {
    id: 'feb-14-3',
    title: 'Brief Filing Deadline',
    type: 'DEADLINE',
    start: toDate("2024-02-14T17:00"),
    metadata: {
      priority: 'high',
      client: 'Phillips Case'
    }
  },

  // February 15, 2024 (Thursday)
  {
    id: 'feb-15-1',
    title: 'Case Management Conference',
    type: 'HEARING',
    start: toDate("2024-02-15T10:00"),
    end: toDate("2024-02-15T11:00"),
    metadata: {
      courthouse: 'District Court',
      courtroom: '2A',
      client: 'Multiple Cases'
    }
  },
  {
    id: 'feb-15-2',
    title: 'Client Strategy Session',
    type: 'MEETING',
    start: toDate("2024-02-15T13:00"),
    end: toDate("2024-02-15T14:30"),
    metadata: {
      client: 'Tech Corp',
      location: 'Meeting Room 1'
    }
  },
  {
    id: 'feb-15-3',
    title: 'SOL Review - Upcoming Cases',
    type: 'INTERNAL',
    start: toDate("2024-02-15T15:00"),
    end: toDate("2024-02-15T16:30"),
    metadata: {
      location: 'Conference Room A',
      priority: 'high'
    }
  },

  // February 16, 2024 (Friday)
  {
    id: 'feb-16-1',
    title: 'Settlement Negotiation',
    type: 'MEDIATION',
    start: toDate("2024-02-16T09:30"),
    end: toDate("2024-02-16T12:30"),
    metadata: {
      location: 'Mediation Center',
      client: 'Harris vs Global Corp',
      priority: 'high'
    }
  },
  {
    id: 'feb-16-2',
    title: 'Team Training Session',
    type: 'TRAINING',
    start: toDate("2024-02-16T14:00"),
    end: toDate("2024-02-16T16:00"),
    metadata: {
      location: 'Training Room',
      participants: ['All Associates']
    }
  },
  {
    id: 'feb-16-3',
    title: 'Weekly Case Review',
    type: 'INTERNAL',
    start: toDate("2024-02-16T16:30"),
    end: toDate("2024-02-16T17:30"),
    metadata: {
      location: 'Conference Room B',
      participants: ['Senior Partners']
    }
  },

  // Continue with more February dates...
  {
    id: '1',
    title: 'Expert Witness Deposition',
    type: 'DEPOSITION',
    start: toDate("2025-02-10T09:00"),
    end: toDate("2025-02-10T12:00"),
    metadata: {
      location: 'Smith & Associates Law Office',
      participants: ['Dr. James Wilson', 'Sarah Parker', 'Defense Counsel'],
      requiredDocuments: ['Expert Report', 'Case Files'],
      priority: 'high',
      client: 'Johnson Manufacturing Co.'
    }
  },
  {
    id: '2',
    title: 'Status Conference',
    type: 'HEARING',
    start: toDate("2025-02-15T10:30"),
    end: toDate("2025-02-15T11:30"),
    metadata: {
      courthouse: 'District Court',
      courtroom: '3A',
      participants: ['Judge Thompson', 'All Counsel'],
      priority: 'medium',
      client: 'Smith vs. Johnson'
    }
  },
  {
    id: '3',
    title: 'Client Strategy Meeting',
    type: 'MEETING',
    start: toDate("2025-02-20T14:00"),
    end: toDate("2025-02-20T15:30"),
    metadata: {
      location: 'Conference Room 2',
      participants: ['Client Executive Team', 'Legal Team'],
      requiredDocuments: ['Case Summary', 'Strategy Document'],
      priority: 'medium',
      client: 'Tech Solutions Inc.'
    }
  },
  {
    id: '4',
    title: 'Document Production Deadline',
    type: 'DEADLINE',
    start: toDate("2025-02-28T17:00"),
    end: toDate("2025-02-28T17:00"),
    metadata: {
      requiredDocuments: ['Discovery Documents', 'Privilege Log'],
      priority: 'high',
      client: 'Smith vs. Johnson'
    }
  },
  {
    id: '5',
    title: 'Mediation Session',
    type: 'MEDIATION',
    start: toDate("2025-03-05T09:00"),
    end: toDate("2025-03-05T16:00"),
    metadata: {
      location: 'ADR Center',
      participants: ['Mediator John Davis', 'All Parties', 'Counsel'],
      requiredDocuments: ['Settlement Proposal', 'Case Summary'],
      priority: 'high',
      client: 'Smith vs. Johnson'
    }
  },
  {
    id: '6',
    title: 'SOL Deadline - Product Liability',
    type: 'SOL',
    start: toDate("2025-03-10T00:00"),
    end: toDate("2025-03-10T00:00"),
    metadata: {
      priority: 'critical',
      client: 'Martinez Case',
      requiredDocuments: ['Complaint Draft', 'Evidence Summary']
    }
  },
  {
    id: '7',
    title: 'Board Meeting',
    type: 'BOARD_MEETING',
    start: toDate("2025-03-15T10:00"),
    end: toDate("2025-03-15T12:00"),
    metadata: {
      location: 'Executive Boardroom',
      participants: ['Board Members', 'Legal Team'],
      requiredDocuments: ['Legal Update Presentation'],
      priority: 'medium'
    }
  },
  {
    id: '8',
    title: 'Witness Preparation',
    type: 'INTERNAL',
    start: toDate("2025-03-20T13:00"),
    end: toDate("2025-03-20T16:00"),
    metadata: {
      location: 'Conference Room 3',
      participants: ['Key Witness', 'Trial Team'],
      requiredDocuments: ['Witness Outline', 'Key Documents'],
      priority: 'high',
      client: 'Smith vs. Johnson'
    }
  },
  {
    id: '9',
    title: 'Motion Hearing',
    type: 'HEARING',
    start: toDate("2025-03-25T09:30"),
    end: toDate("2025-03-25T11:30"),
    metadata: {
      courthouse: 'Federal Court',
      courtroom: '5B',
      participants: ['Judge Martinez', 'All Counsel'],
      requiredDocuments: ['Motion Papers', 'Supporting Exhibits'],
      priority: 'high',
      client: 'Tech Solutions Inc.'
    }
  },
  {
    id: '10',
    title: 'Trial Team Training',
    type: 'TRAINING',
    start: toDate("2025-03-28T10:00"),
    end: toDate("2025-03-28T16:00"),
    metadata: {
      location: 'Training Center',
      participants: ['Trial Team', 'External Consultant'],
      requiredDocuments: ['Training Materials'],
      priority: 'medium'
    }
  }
];