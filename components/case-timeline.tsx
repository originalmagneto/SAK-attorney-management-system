import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, FileText, Gavel, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';

interface TimelineEvent {
  id: number;
  type: 'message' | 'document' | 'court' | 'meeting';
  title: string;
  description: string;
  date: string;
  gradient?: string;
  user?: {
    name: string;
    avatar: string;
  };
}

interface CaseTimelineProps {
  events: TimelineEvent[];
}

export function CaseTimeline({ events }: CaseTimelineProps) {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'court':
        return <Gavel className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventGradient = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'message':
        return 'from-blue-500 via-blue-400 to-blue-600';
      case 'document':
        return 'from-emerald-500 via-green-400 to-emerald-600';
      case 'court':
        return 'from-violet-500 via-purple-400 to-violet-600';
      case 'meeting':
        return 'from-amber-500 via-yellow-400 to-amber-600';
    }
  };

  const getEventBackground = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'message':
        return 'bg-blue-50 dark:bg-blue-950/30';
      case 'document':
        return 'bg-emerald-50 dark:bg-emerald-950/30';
      case 'court':
        return 'bg-violet-50 dark:bg-violet-950/30';
      case 'meeting':
        return 'bg-amber-50 dark:bg-amber-950/30';
    }
  };

  return (
    <div className="relative space-y-8">
      <AnimatePresence>
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.4,
              ease: [0.23, 1, 0.32, 1]
            }}
          >
            <div className="flex gap-4 items-start relative">
              {/* Timeline connector */}
              {index !== events.length - 1 && (
                <div 
                  className="absolute left-[1.65rem] top-10 w-0.5 h-full -z-10 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent"
                  style={{ background: 'linear-gradient(180deg, var(--primary) 0%, rgba(var(--primary), 0.2) 100%)' }}
                />
              )}
              
              {/* Event icon with pulsing effect */}
              <div className="relative flex-shrink-0">
                <motion.div
                  className={`rounded-full p-2 bg-gradient-to-br ${getEventGradient(event.type)} shadow-lg ring-2 ring-background`}
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="text-white">
                    {getEventIcon(event.type)}
                  </div>
                </motion.div>
                <div className="absolute inset-0 rounded-full animate-ping-slow bg-primary/20" />
              </div>

              {/* Event content */}
              <div className={`flex-1 ${getEventBackground(event.type)} rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold">{event.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  </div>
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(parseISO(event.date), 'MMM d, h:mm a')}
                  </time>
                </div>

                {event.user && (
                  <div className="mt-3 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={event.user.avatar} alt={event.user.name} />
                      <AvatarFallback>{event.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{event.user.name}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}