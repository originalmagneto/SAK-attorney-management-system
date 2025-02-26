import { MessageThread, Message } from '@/types/messages';

const currentUser = {
  id: 'user-2',
  name: 'Sarah Johnson',
  role: 'Attorney',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop'
};

const userAvatars = {
  'user-1': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&auto=format&fit=crop', // Professional businessman
  'user-3': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&auto=format&fit=crop', // Professional businesswoman
  'user-4': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&auto=format&fit=crop', // Professional man
  'user-5': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&auto=format&fit=crop', // Professional woman
  'user-6': 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=256&h=256&auto=format&fit=crop', // Professional man 2
};

export const sampleThreads: MessageThread[] = [
  {
    id: 'thread-1',
    title: 'Smith vs. Johnson - Settlement Discussion',
    contextType: 'case',
    contextId: 'case-123',
    contextTitle: 'Smith vs. Johnson',
    participants: [
      {
        id: 'user-1',
        name: 'John Smith',
        role: 'Client',
        avatar: userAvatars['user-1']
      },
      currentUser
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    lastMessageAt: new Date('2024-01-20'),
    metadata: {
      caseNumber: 'CASE-2024-001',
      clientName: 'John Smith',
      status: 'In Progress',
      priority: 'high',
      labels: ['Settlement', 'Urgent']
    }
  },
  {
    id: 'thread-2',
    title: 'Contract Review - Tech Corp Agreement',
    contextType: 'document',
    contextId: 'doc-456',
    contextTitle: 'Service Agreement v2',
    participants: [
      {
        id: 'user-3',
        name: 'Tech Corp Legal',
        role: 'Client',
        avatar: userAvatars['user-3']
      },
      currentUser,
      {
        id: 'user-4',
        name: 'David Kim',
        role: 'Contract Specialist',
        avatar: userAvatars['user-4']
      }
    ],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-19'),
    lastMessageAt: new Date('2024-01-19'),
    metadata: {
      documentTitle: 'Service Agreement v2.0',
      status: 'Under Review',
      priority: 'medium',
      labels: ['Contract', 'Review', 'Tech']
    }
  },
  {
    id: 'thread-3',
    title: 'Upcoming Court Hearing - Feb 15',
    contextType: 'event',
    contextId: 'event-789',
    contextTitle: 'Brown Case Hearing',
    participants: [
      {
        id: 'user-5',
        name: 'Sarah Brown',
        role: 'Client',
        avatar: userAvatars['user-5']
      },
      currentUser,
      {
        id: 'user-6',
        name: 'Michael Lee',
        role: 'Associate Attorney',
        avatar: userAvatars['user-6']
      }
    ],
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-20'),
    lastMessageAt: new Date('2024-01-20'),
    metadata: {
      eventTitle: 'Court Hearing',
      status: 'Scheduled',
      priority: 'high',
      labels: ['Court', 'Hearing', 'Important']
    }
  },
  {
    id: 'thread-4',
    title: 'Document Review: Expert Witness Statement',
    contextType: 'document',
    contextId: 'doc-789',
    contextTitle: 'Expert Witness Statement',
    parentThreadId: 'thread-3',
    participants: [
      currentUser,
      {
        id: 'user-6',
        name: 'Michael Lee',
        role: 'Associate Attorney',
        avatar: userAvatars['user-6']
      }
    ],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    lastMessageAt: new Date('2024-01-20'),
    metadata: {
      documentTitle: 'Expert Witness Statement - Dr. Roberts',
      status: 'In Review',
      priority: 'medium',
      labels: ['Expert', 'Document', 'Review']
    }
  }
];

export const sampleMessages: Record<string, Message[]> = {
  'thread-1': [
    {
      id: 'msg-1',
      threadId: 'thread-1',
      senderId: 'user-1',
      content: 'Hello Sarah, I received the settlement offer from Johnson\'s team. They\'re offering $750,000. What are your thoughts on this?',
      createdAt: new Date('2024-01-20T10:15:00'),
      metadata: {
        caseUpdate: {
          type: 'note',
          details: 'Settlement offer received: $750,000'
        }
      }
    },
    {
      id: 'msg-2',
      threadId: 'thread-1',
      senderId: 'user-2',
      content: 'Hi John, I\'ve reviewed the offer. Given the strength of our case and previous similar settlements, I believe we can negotiate for a better amount. Let\'s schedule a call to discuss our counter-offer strategy.',
      createdAt: new Date('2024-01-20T10:30:00'),
      reactions: [
        {
          emoji: '👍',
          users: ['user-1']
        }
      ]
    },
    {
      id: 'msg-3',
      threadId: 'thread-1',
      senderId: 'user-1',
      content: 'That sounds good. When are you available for a call?',
      createdAt: new Date('2024-01-20T10:35:00')
    }
  ],
  'thread-2': [
    {
      id: 'msg-4',
      threadId: 'thread-2',
      senderId: 'user-3',
      content: 'Team, we\'ve updated Section 3.2 of the agreement to address the liability concerns. Can you review the changes?',
      createdAt: new Date('2024-01-19T14:30:00'),
      metadata: {
        documentReference: {
          id: 'doc-456',
          title: 'Service Agreement v2',
          version: '2.1'
        }
      },
      attachments: [
        {
          id: 'att-1',
          type: 'file',
          url: '/documents/service-agreement-v2.1.pdf',
          name: 'Service Agreement v2.1.pdf',
          size: 2456789
        }
      ]
    },
    {
      id: 'msg-5',
      threadId: 'thread-2',
      senderId: 'user-4',
      content: 'I\'ve started reviewing the changes. The liability cap in section 3.2.1 might need some adjustments.',
      createdAt: new Date('2024-01-19T15:00:00'),
      replyToId: 'msg-4'
    },
    {
      id: 'msg-6',
      threadId: 'thread-2',
      senderId: 'user-2',
      content: 'Agreed with David. Also, we should clarify the indemnification clause. I\'ll add detailed comments in the document.',
      createdAt: new Date('2024-01-19T15:15:00'),
      replyToId: 'msg-4'
    }
  ],
  'thread-3': [
    {
      id: 'msg-7',
      threadId: 'thread-3',
      senderId: 'user-2',
      content: 'Team, I\'ve prepared the initial draft of our court presentation for the February 15th hearing. Please review and provide your input.',
      createdAt: new Date('2024-01-20T09:00:00'),
      attachments: [
        {
          id: 'att-2',
          type: 'file',
          url: '/documents/court-presentation-draft.pptx',
          name: 'Court Presentation - Draft 1.pptx',
          size: 3567890
        }
      ]
    },
    {
      id: 'msg-8',
      threadId: 'thread-3',
      senderId: 'user-6',
      content: 'I\'ve reviewed the presentation. We should add more details about the expert witness testimony in slide 7. I\'ll create a separate thread to discuss the expert witness statement.',
      createdAt: new Date('2024-01-20T11:30:00'),
      replyToId: 'msg-7'
    }
  ],
  'thread-4': [
    {
      id: 'msg-9',
      threadId: 'thread-4',
      senderId: 'user-6',
      content: 'I\'ve highlighted some potential issues in Dr. Roberts\' statement that we should address before the hearing.',
      createdAt: new Date('2024-01-20T11:45:00'),
      attachments: [
        {
          id: 'att-3',
          type: 'file',
          url: '/documents/expert-statement-comments.pdf',
          name: 'Expert Statement - Comments.pdf',
          size: 1234567
        }
      ]
    },
    {
      id: 'msg-10',
      threadId: 'thread-4',
      senderId: 'user-2',
      content: 'Good catch. Let\'s schedule a call with Dr. Roberts to clarify these points.',
      createdAt: new Date('2024-01-20T12:00:00'),
      metadata: {
        eventReference: {
          id: 'event-790',
          title: 'Call with Dr. Roberts',
          date: new Date('2024-01-22T15:00:00')
        }
      }
    }
  ]
};