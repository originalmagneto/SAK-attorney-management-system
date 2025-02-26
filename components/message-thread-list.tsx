'use client';

import { useState } from 'react';
import { MessageThread, MessageContextType } from '@/types/messages';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  User,
  Briefcase,
  Users,
  FileText,
  Calendar,
  Clock,
  MessageCircle,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageThreadListProps {
  threads: MessageThread[];
  selectedThreadId?: string;
  onThreadSelect: (thread: MessageThread) => void;
}

const contextIcons: Record<MessageContextType, React.ReactNode> = {
  case: <Briefcase className="h-4 w-4" />,
  client: <Users className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />,
  event: <Calendar className="h-4 w-4" />,
  general: <MessageCircle className="h-4 w-4" />
};

export function MessageThreadList({
  threads,
  selectedThreadId,
  onThreadSelect
}: MessageThreadListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContext, setSelectedContext] = useState<MessageContextType | 'all'>('all');

  const filteredThreads = threads.filter(thread => {
    const matchesSearch = 
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.contextTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContext = selectedContext === 'all' || thread.contextType === selectedContext;
    return matchesSearch && matchesContext;
  });

  const groupedThreads = filteredThreads.reduce<Record<string, MessageThread[]>>((acc, thread) => {
    const key = thread.parentThreadId || thread.id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(thread);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" onValueChange={(value) => setSelectedContext(value as MessageContextType | 'all')}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="case" className="flex-1">Cases</TabsTrigger>
            <TabsTrigger value="client" className="flex-1">Clients</TabsTrigger>
            <TabsTrigger value="document" className="flex-1">Docs</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {Object.values(groupedThreads).map((threadGroup) => (
            <div key={threadGroup[0].id} className="space-y-2">
              {threadGroup.map((thread, index) => (
                <Card
                  key={thread.id}
                  className={cn(
                    "p-3 cursor-pointer transition-colors",
                    selectedThreadId === thread.id
                      ? "bg-accent"
                      : "hover:bg-accent/50",
                    index !== 0 && "ml-4 border-l-2"
                  )}
                  onClick={() => onThreadSelect(thread)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {thread.participants[0]?.avatar ? (
                        <img
                          src={thread.participants[0].avatar}
                          alt={thread.participants[0].name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5 text-primary" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">
                          {thread.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          {contextIcons[thread.contextType]}
                          <Badge variant="secondary" className="text-xs">
                            {thread.contextTitle}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(thread.lastMessageAt).toLocaleString()}
                        </span>
                        {thread.metadata.priority && (
                          <Badge
                            variant={
                              thread.metadata.priority === 'high'
                                ? 'destructive'
                                : thread.metadata.priority === 'medium'
                                ? 'default'
                                : 'secondary'
                            }
                            className="text-xs"
                          >
                            {thread.metadata.priority}
                          </Badge>
                        )}
                      </div>

                      {thread.metadata.labels && thread.metadata.labels.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <div className="flex gap-1">
                            {thread.metadata.labels.map((label) => (
                              <Badge
                                key={label}
                                variant="outline"
                                className="text-xs"
                              >
                                {label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}