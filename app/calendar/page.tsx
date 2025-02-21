'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Clock, MapPin, Plus, Calendar as CalendarIcon, Users, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

type EventType = 'court' | 'meeting' | 'deadline' | 'consultation';

interface Participant {
  name: string;
  avatar?: string;
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
  notifications?: boolean;
}

const eventTypes = {
  court: { label: 'Court Hearing', color: 'text-red-500', bgColor: 'bg-red-100' },
  meeting: { label: 'Meeting', color: 'text-blue-500', bgColor: 'bg-blue-100' },
  deadline: { label: 'Deadline', color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  consultation: { label: 'Consultation', color: 'text-green-500', bgColor: 'bg-green-100' },
};

const events: CalendarEvent[] = [
  {
    id: 1,
    title: 'Smith vs. Johnson Hearing',
    date: '2024-03-28',
    time: '10:00 AM',
    type: 'court',
    location: 'District Court Room 302',
    participants: [
      { name: 'John Smith', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face' },
      { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face' },
    ],
    description: 'Initial hearing for the Smith vs. Johnson case',
    priority: 'high',
    notifications: true,
  },
  {
    id: 2,
    title: 'Client Consultation - Brown Family',
    date: '2024-03-28',
    time: '2:00 PM',
    type: 'consultation',
    location: 'Conference Room A',
    participants: [
      { name: 'James Brown', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face' },
    ],
    description: 'Estate planning consultation with the Brown family',
    priority: 'medium',
    notifications: true,
  },
];

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  return (
    <div className="p-8 max-w-[1920px] mx-auto">
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <Badge
                  className={`${eventTypes[selectedEvent.type].color} text-sm`}
                >
                  {eventTypes[selectedEvent.type].label}
                </Badge>
                <Badge
                  variant={selectedEvent.priority === 'high' ? 'destructive' : 'secondary'}
                >
                  {selectedEvent.priority} Priority
                </Badge>
              </div>

              <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
              <p className="text-muted-foreground mb-6">{selectedEvent.description}</p>

              <div className="grid gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{selectedEvent.date} at {selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>

              {selectedEvent.participants && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Participants</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedEvent.participants.map((participant, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                          <AvatarFallback>{participant.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{participant.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title">Event Title</label>
              <Input id="title" placeholder="Enter event title" />
            </div>
            <div className="grid gap-2">
              <label>Event Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(eventTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label>Date & Time</label>
              <div className="flex gap-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="description">Description</label>
              <Textarea id="description" placeholder="Enter event description" />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancel
            </Button>
            <Button>Create Event</Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Manage your schedule and deadlines
          </p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Select value={view} onValueChange={setView}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAddEventOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Timeline</h2>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="relative">
              <div className="absolute top-0 left-6 h-full w-px bg-border" />
              <div className="space-y-6">
                {events.map((event) => (
                  <div key={event.id} className="relative pl-8">
                    <div className="absolute left-0 w-3 h-3 rounded-full bg-primary top-2" />
                    <div className="flex items-center justify-between">
                      <Badge className={eventTypes[event.type].color}>
                        {eventTypes[event.type].label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{event.time}</span>
                    </div>
                    <h3 className="font-medium mt-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{event.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full"
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

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Weekly Overview</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 7 }).map((_, i) => {
                const day = new Date();
                day.setDate(day.getDate() + i);
                const dayEvents = events.filter(event => new Date(event.date).toDateString() === day.toDateString());
                const isToday = day.toDateString() === new Date().toDateString();
                
                return (
                  <motion.div 
                    key={i} 
                    className={`space-y-2 p-2 rounded-lg transition-all duration-200 ${isToday ? 'bg-primary/5 shadow-sm' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className={`text-2xl font-bold ${isToday ? 'text-primary' : ''}`}>
                        {day.getDate()}
                      </div>
                    </div>
                    <ScrollArea className="h-[120px] w-full">
                      {dayEvents.map((event) => (
                        <motion.div
                          key={event.id}
                          className={`p-2 mb-2 rounded-md text-xs cursor-pointer transform transition-all duration-200
                            ${event.priority === 'high' ? `${eventTypes[event.type].bgColor} ${eventTypes[event.type].color}` : 'bg-accent'}
                            hover:scale-[1.02] hover:shadow-md`}
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsEventDialogOpen(true);
                          }}
                          whileHover={{ y: -2 }}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-xs opacity-70 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </div>
                          {event.priority === 'high' && (
                            <Badge variant="destructive" className="mt-1 text-[10px] py-0">
                              High Priority
                            </Badge>
                          )}
                        </motion.div>
                      ))}
                    </ScrollArea>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Upcoming Events</h2>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`border-l-4 pl-4 py-4 hover:bg-accent/50 rounded-r-md transition-all duration-200 transform hover:scale-[1.02] cursor-pointer`}
                  style={{ borderLeftColor: `var(--${eventTypes[event.type].color})` }}
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsEventDialogOpen(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <Badge className={eventTypes[event.type].color}>
                      {eventTypes[event.type].label}
                    </Badge>
                    <Badge variant={event.priority === 'high' ? 'destructive' : 'secondary'}>
                      {event.priority}
                    </Badge>
                  </div>

                  <h3 className="font-medium mt-3 text-lg">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{event.description}</p>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{event.date} {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {event.participants && (
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {event.participants.map((participant, i) => (
                          <Avatar key={i} className="h-8 w-8 border-2 border-background">
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