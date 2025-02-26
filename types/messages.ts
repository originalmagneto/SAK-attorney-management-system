export type MessageContextType = 'case' | 'client' | 'document' | 'event' | 'general';

export interface Participant {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface MessageThread {
  id: string;
  title: string;
  contextType: MessageContextType;
  contextId: string;
  contextTitle: string;
  parentThreadId?: string;
  participants: Participant[];
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  metadata: {
    caseNumber?: string;
    clientName?: string;
    documentTitle?: string;
    eventTitle?: string;
    status?: string;
    priority?: 'low' | 'medium' | 'high';
    labels?: string[];
  };
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  attachments?: {
    id: string;
    type: 'file' | 'image' | 'link';
    url: string;
    name: string;
    size?: number;
  }[];
  replyToId?: string;
  reactions?: {
    emoji: string;
    users: string[];
  }[];
  mentions?: string[];
  createdAt: Date;
  editedAt?: Date;
  metadata?: {
    caseUpdate?: {
      type: 'status' | 'deadline' | 'document' | 'note';
      details: any;
    };
    documentReference?: {
      id: string;
      title: string;
      version: string;
    };
    eventReference?: {
      id: string;
      title: string;
      date: Date;
    };
  };
}