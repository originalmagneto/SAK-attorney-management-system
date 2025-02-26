'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileText,
  MessageSquare,
  Calendar,
  Gavel,
  Clock,
  ChevronRight,
  CalendarDays,
  CircleDot,
  FileCheck,
  Mail,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  MapPin,  // Add this import
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TimelineEvent {
  id: string;
  type: 'court' | 'document' | 'message' | 'deadline' | 'milestone';
  title: string;
  description: string;
  date: string;
  category?: string;
  status?: 'completed' | 'pending' | 'overdue';
  user?: {
    name: string;
    avatar: string;
  };
  metadata?: {
    location?: string;
    documentType?: string;
    priority?: 'high' | 'medium' | 'low';
    link?: string;
  };
}

const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'court',
    title: 'Initial Hearing',
    description: 'Initial hearing scheduled with Judge Davis',
    date: '2024-04-15 09:00',
    status: 'pending',
    metadata: {
      location: 'Courtroom 302',
      priority: 'high',
    }
  },
  {
    id: '2',
    type: 'document',
    title: 'Motion for Summary Judgment Filed',
    description: 'Filed motion for summary judgment with supporting exhibits',
    date: '2024-03-28 14:30',
    status: 'completed',
    user: {
      name: 'Jane Smith',
      avatar: '/images/avatars/avatar-1.png'
    },
    metadata: {
      documentType: 'Legal Motion',
      link: '#'
    }
  },
  {
    id: '3',
    type: 'milestone',
    title: 'Discovery Phase Complete',
    description: 'All required documents and depositions completed',
    date: '2024-03-25 16:00',
    status: 'completed'
  },
  {
    id: '4',
    type: 'message',
    title: 'Client Consultation',
    description: 'Reviewed case strategy and upcoming deadlines',
    date: '2024-03-20 11:00',
    user: {
      name: 'John Doe',
      avatar: '/images/avatars/avatar-2.png'
    }
  },
  {
    id: '5',
    type: 'deadline',
    title: 'Response to Motion Due',
    description: 'Deadline for opposing counsel to respond',
    date: '2024-04-28 17:00',
    status: 'pending',
    metadata: {
      priority: 'medium'
    }
  }
];

const eventTypeIcons = {
  court: Gavel,
  document: FileText,
  message: MessageSquare,
  deadline: Clock,
  milestone: CheckCircle2
};

const eventTypeColors = {
  court: 'bg-blue-500',
  document: 'bg-emerald-500',
  message: 'bg-violet-500',
  deadline: 'bg-yellow-500',
  milestone: 'bg-primary'
};

interface CaseTimelineProps {
  events?: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
}

export function CaseTimeline({ events = timelineEvents, onEventClick }: CaseTimelineProps) {
  const [filter, setFilter] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const filteredEvents = events.filter(event => {
    if (filter !== 'all' && event.type !== filter) return false;
    if (selectedYear !== 'all' && !event.date.startsWith(selectedYear)) return false;
    if (selectedMonth !== 'all') {
      const eventMonth = new Date(event.date).getMonth() + 1;
      if (eventMonth.toString() !== selectedMonth) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="court">Court Events</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="message">Messages</SelectItem>
              <SelectItem value="deadline">Deadlines</SelectItem>
              <SelectItem value="milestone">Milestones</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <SelectItem key={month} value={month.toString()}>
                  {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-6">
        <ScrollArea className="h-[600px] pr-6">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-8 w-px bg-border" />

            <div className="space-y-8">
              {filteredEvents.map((event, index) => {
                const Icon = eventTypeIcons[event.type];
                const dotColor = eventTypeColors[event.type];

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-16"
                  >
                    {/* Event dot */}
                    <div className={`absolute left-6 w-4 h-4 rounded-full ${dotColor} transform -translate-x-1/2 flex items-center justify-center`}>
                      <Icon className="h-3 w-3 text-white" />
                    </div>

                    <div className="relative">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div 
                            className="p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() => onEventClick?.(event)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{event.title}</h3>
                                  {event.status && (
                                    <Badge variant={
                                      event.status === 'completed' ? 'default' :
                                      event.status === 'pending' ? 'secondary' :
                                      'destructive'
                                    }>
                                      {event.status}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {event.description}
                                </p>
                              </div>
                              <time className="text-sm text-muted-foreground">
                                {new Date(event.date).toLocaleString('default', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </time>
                            </div>

                            {event.user && (
                              <div className="flex items-center gap-2 mt-3">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={event.user.avatar} />
                                  <AvatarFallback>{event.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{event.user.name}</span>
                              </div>
                            )}

                            {event.metadata?.priority && (
                              <div className="flex items-center gap-2 mt-2">
                                <AlertTriangle className={`h-4 w-4 ${
                                  event.metadata.priority === 'high' ? 'text-red-500' :
                                  event.metadata.priority === 'medium' ? 'text-yellow-500' :
                                  'text-blue-500'
                                }`} />
                                <span className="text-sm capitalize">{event.metadata.priority} priority</span>
                              </div>
                            )}
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">Event Details</h4>
                            {event.metadata?.location && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{event.metadata.location}</span>
                              </div>
                            )}
                            {event.metadata?.documentType && (
                              <div className="flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span>{event.metadata.documentType}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                              <span>{new Date(event.date).toLocaleString()}</span>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}