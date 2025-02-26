'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  FileText,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LayoutList,
} from 'lucide-react';
import { sampleEvents } from '@/lib/sample-calendar';
import { CalendarEvent, EventType } from '@/types/calendar';
import { format } from 'date-fns';

function getEventColor(type: EventType) {
  switch (type) {
    case 'HEARING':
      return 'bg-red-500';
    case 'MEETING':
      return 'bg-blue-500';
    case 'DEPOSITION':
      return 'bg-purple-500';
    case 'INTERNAL':
      return 'bg-gray-500';
    case 'DEADLINE':
      return 'bg-yellow-500';
    case 'SOL':
      return 'bg-red-600';
    case 'MEDIATION':
      return 'bg-green-500';
    case 'TRAINING':
      return 'bg-indigo-500';
    case 'BOARD_MEETING':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
}

function EventCard({ event }: { event: CalendarEvent }) {
  const startTime = format(new Date(event.start), 'h:mm a');
  const endTime = event.end ? format(new Date(event.end), 'h:mm a') : null;

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-start gap-4">
        <div className={`w-2 h-full rounded ${getEventColor(event.type)}`} />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{event.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Clock className="h-4 w-4" />
                {event.allDay ? (
                  <span>All Day</span>
                ) : (
                  <span>
                    {startTime}
                    {endTime && ` - ${endTime}`}
                  </span>
                )}
              </div>
            </div>
            <Badge variant="outline">{event.type}</Badge>
          </div>

          {(event.metadata.location || event.metadata.courthouse) && (
            <div className="flex items-center gap-2 text-sm mt-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {event.metadata.courthouse
                  ? `${event.metadata.courthouse} - Room ${event.metadata.courtroom}`
                  : event.metadata.location}
              </span>
            </div>
          )}

          {event.metadata.participants && event.metadata.participants.length > 0 && (
            <div className="flex items-center gap-2 text-sm mt-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{event.metadata.participants.slice(0, 2).join(', ')}</span>
              {event.metadata.participants.length > 2 && (
                <span className="text-muted-foreground">
                  +{event.metadata.participants.length - 2} more
                </span>
              )}
            </div>
          )}

          {event.metadata.requiredDocuments && event.metadata.requiredDocuments.length > 0 && (
            <div className="flex items-center gap-2 text-sm mt-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>{event.metadata.requiredDocuments.length} required documents</span>
            </div>
          )}

          {event.metadata.client && (
            <Badge className="mt-3" variant="secondary">
              {event.metadata.client}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('week');
  const [selectedEventType, setSelectedEventType] = useState<EventType | 'all'>('all');

  const filteredEvents = sampleEvents.filter(
    event =>
      selectedEventType === 'all' || event.type === selectedEventType
  );

  return (
    <div className="p-8">
      <div className="max-w-[1800px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Manage your schedule and deadlines
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                </DialogHeader>
                {/* Add event form will go here */}
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => {}}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => {}}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold px-4">
                {format(date, 'MMMM yyyy')}
              </h2>
            </div>
            <Tabs defaultValue="week" value={view} onValueChange={(v) => setView(v as 'month' | 'week' | 'day')}>
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
              </TabsList>
              <TabsContent value="month">
                {/* Month view content */}
              </TabsContent>
              <TabsContent value="week">
                {/* Week view content */}
              </TabsContent>
              <TabsContent value="day">
                {/* Day view content */}
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={selectedEventType}
              onValueChange={(value) => setSelectedEventType(value as EventType | 'all')}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="HEARING">Hearings</SelectItem>
                <SelectItem value="MEETING">Meetings</SelectItem>
                <SelectItem value="DEPOSITION">Depositions</SelectItem>
                <SelectItem value="INTERNAL">Internal</SelectItem>
                <SelectItem value="DEADLINE">Deadlines</SelectItem>
                <SelectItem value="SOL">SOL Deadlines</SelectItem>
                <SelectItem value="MEDIATION">Mediations</SelectItem>
                <SelectItem value="TRAINING">Training</SelectItem>
                <SelectItem value="BOARD_MEETING">Board Meetings</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4">
          {/* Calendar headers and grid will go here */}
        </div>

        {/* Events List */}
        <Card>
          <ScrollArea className="h-[600px]">
            <div className="p-6 space-y-4">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}