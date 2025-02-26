'use client';
import { useState, useMemo } from 'react';
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
  AlertTriangle,
} from 'lucide-react';
import { sampleEvents } from '@/lib/sample-calendar';
import { CalendarEvent, EventType } from '@/types/calendar';
import { format, isSameDay, isToday, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addDays, isSameMonth } from 'date-fns';
import { cn } from '@/lib/utils';

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

function CalendarDayCell({ date, events }: { date: Date; events: CalendarEvent[] }) {
  const dayEvents = events.filter(event => isSameDay(new Date(event.start), date));
  
  return (
    <div className={cn(
      "min-h-[120px] p-2 border border-border rounded-lg",
      !isSameMonth(date, new Date()) && "bg-muted/50",
      isToday(date) && "border-primary"
    )}>
      <div className="font-medium text-sm mb-1">
        {format(date, 'd')}
      </div>
      <div className="space-y-1">
        {dayEvents.map(event => (
          <div
            key={event.id}
            className={cn(
              "text-xs p-1 rounded truncate hover:shadow-md transition-shadow cursor-pointer",
              getEventColor(event.type),
              "text-white"
            )}
          >
            <div className="font-medium">{event.title}</div>
            {!event.allDay && (
              <div className="text-[10px] opacity-90">
                {format(new Date(event.start), 'h:mm a')}
              </div>
            )}
          </div>
        ))}
        {dayEvents.length > 3 && (
          <div className="text-xs text-muted-foreground text-center">
            +{dayEvents.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEventType, setSelectedEventType] = useState<EventType | 'all'>('all');

  const filteredEvents = useMemo(() => 
    sampleEvents.filter(event =>
      selectedEventType === 'all' || event.type === selectedEventType
    ),
    [selectedEventType]
  );

  // Generate days for month view
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));
    return eachDayOfInterval({ start, end });
  }, [date]);

  const goToPreviousMonth = () => {
    setDate(d => addDays(d, -30));
  };

  const goToNextMonth = () => {
    setDate(d => addDays(d, 30));
  };

  const priorityEvents = useMemo(() => 
    filteredEvents.filter(event => 
      event.metadata.priority === 'critical' || 
      event.type === 'SOL' || 
      event.type === 'DEADLINE'
    ),
    [filteredEvents]
  );

  return (
    <div className="p-8">
      <div className="max-w-[1800px] mx-auto space-y-8">
        {/* Header section - keep existing code */}
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

        {/* Priority Events Banner */}
        {priorityEvents.length > 0 && (
          <Card className="p-4 border-red-500 bg-red-50 dark:bg-red-950/20">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-semibold">Priority Events & Deadlines</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {priorityEvents.map(event => (
                <div
                  key={event.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    getEventColor(event.type)
                  )} />
                  <span className="font-medium">{event.title}</span>
                  <span className="text-muted-foreground">
                    {format(new Date(event.start), 'MMM d, h:mm a')}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Calendar Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold px-4">
                {format(date, 'MMMM yyyy')}
              </h2>
            </div>
            <Tabs defaultValue="month" value={view} onValueChange={(v) => setView(v as 'month' | 'week' | 'day')}>
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
              </TabsList>
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

        {/* Calendar Grid - Month View */}
        <div className="rounded-lg border bg-card">
          {/* Calendar Headers */}
          <div className="grid grid-cols-7 gap-px border-b bg-muted">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-px bg-muted p-px">
            {monthDays.map((day) => (
              <CalendarDayCell
                key={day.toISOString()}
                date={day}
                events={filteredEvents}
              />
            ))}
          </div>
        </div>

        {/* Events List */}
        <Card>
          <ScrollArea className="h-[400px]">
            <div className="p-6 space-y-4">
              {filteredEvents
                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                .map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}