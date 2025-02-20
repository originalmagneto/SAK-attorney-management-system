'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const events = [
  {
    id: 1,
    title: 'Court Hearing - Smith vs. Johnson',
    date: '2024-03-28',
    time: '09:00',
    type: 'court',
    location: 'Regional Court Bratislava, Room 304',
  },
  {
    id: 2,
    title: 'Client Meeting - Tech Corp',
    date: '2024-03-28',
    time: '14:00',
    type: 'meeting',
    location: 'Office',
  },
  {
    id: 3,
    title: 'Document Review Deadline',
    date: '2024-03-29',
    time: '17:00',
    type: 'deadline',
    location: 'Internal',
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

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border-l-4 border-primary pl-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {event.date} {event.time}
                    </span>
                  </div>
                  <h3 className="font-medium mt-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}