export type EventType = 
  | 'HEARING'
  | 'MEETING'
  | 'DEPOSITION'
  | 'INTERNAL'
  | 'DEADLINE'
  | 'SOL'
  | 'MEDIATION'
  | 'TRAINING'
  | 'BOARD_MEETING';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  start: Date;
  end?: Date;
  allDay?: boolean;
  metadata: {
    caseNumber?: string;
    courthouse?: string;
    courtroom?: string;
    judge?: string;
    description: string;
    client?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    location?: string;
    participants: string[];
    requiredDocuments?: string[];
    agenda?: string[];
    mediator?: string;
    witness?: string;
    assignedTo?: string;
    jurisdiction?: string;
    causeOfAction?: string;
    presenter?: string;
    materials?: string[];
  };
}