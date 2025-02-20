'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type EventType = 'court' | 'meeting' | 'deadline' | 'internal';

interface EventTypeConfig {
  color: string;
  label: string;
}

interface Participant {
  name: string;
  avatar: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: EventType;
  location: string;
  participants?: Participant[];
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const eventTypes: Record<EventType, EventTypeConfig> = {
  court: { color: 'bg-red-500', label: 'Court Hearing' },
  meeting: { color: 'bg-blue-500', label: 'Meeting' },
  deadline: { color: 'bg-amber-500', label: 'Deadline' },
  internal: { color: 'bg-green-500', label: 'Internal' },
};

const events: CalendarEvent[] = [
  {
    id: 1,
    title: 'Court Hearing - Smith vs. Johnson',
    date: '2024-03-28',
    time: '09:00',
    type: 'court',
    location: 'Regional Court Bratislava, Room 304',
    participants: [
      { name: 'John Smith', avatar: '/images/avatars/avatar-1.png' },
      { name: 'Sarah Johnson', avatar: '/images/avatars/avatar-2.png' },
    ],
    description: 'Initial hearing for contract dispute case',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Client Meeting - Tech Corp',
    date: '2024-03-28',
    time: '14:00',
    type: 'meeting',
    location: 'Office',
    participants: [
      { name: 'Tech Corp', avatar: '/images/avatars/avatar-3.png' }
    ],
    description: 'Quarterly legal review meeting',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Document Review Deadline',
    date: '2024-03-29',
    time: '17:00',
    type: 'deadline',
    location: 'Internal',
    description: 'Final review of Tech Corp contracts',
    priority: 'high'
  },
];

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState('month');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Manage your schedule and deadlines
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={view} onValueChange={setView}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
            modifiers={{
              booked: events.map(event => new Date(event.date)),
            }}
            modifiersStyles={{
              booked: {
                fontWeight: 'bold',
                backgroundColor: 'var(--primary)',
                color: 'white',
                borderRadius: '50%',
              }
            }}
          />
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`border-l-4 ${eventTypes[event.type].color}/20 pl-4 py-3 hover:bg-accent rounded-r-md transition-colors`}
                  style={{ borderLeftColor: `var(--${eventTypes[event.type].color})` }}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={eventTypes[event.type].color}>
                      {eventTypes[event.type].label}
                    </Badge>
                    <Badge variant={event.priority === 'high' ? 'destructive' : 'secondary'}>
                      {event.priority}
                    </Badge>
                  </div>

                  <h3 className="font-medium mt-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>

                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{event.date} {event.time}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>

                  {event.participants && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {event.participants.map((participant, i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                            <AvatarFallback>{participant.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}