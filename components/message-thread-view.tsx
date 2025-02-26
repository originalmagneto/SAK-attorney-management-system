'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, MessageThread } from '@/types/messages';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Send,
  MoreVertical,
  Reply,
  Forward,
  Link as LinkIcon,
  FileText,
  Calendar,
  Users,
  MessageSquare,
  Briefcase,
  PlusCircle,
  Smile,
  Share2,
  Flag,
  Paperclip
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MessageThreadViewProps {
  thread: MessageThread;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string, replyToId?: string) => void;
  onCreateBranch: (messageId: string, title: string) => void;
  onReaction: (messageId: string, emoji: string) => void;
}

export function MessageThreadView({
  thread,
  messages,
  currentUserId,
  onSendMessage,
  onCreateBranch,
  onReaction
}: MessageThreadViewProps) {
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showContextBar, setShowContextBar] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage, replyTo?.id);
      setNewMessage('');
      setReplyTo(null);
    }
  };

  const contextIcon = {
    case: <Briefcase className="h-4 w-4" />,
    client: <Users className="h-4 w-4" />,
    document: <FileText className="h-4 w-4" />,
    event: <Calendar className="h-4 w-4" />,
    general: <MessageSquare className="h-4 w-4" />
  }[thread.contextType];

  return (
    <div className="flex h-full">
      {showContextBar && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="border-r p-4 space-y-4 overflow-y-auto"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {contextIcon}
              <h3 className="font-medium">{thread.contextTitle}</h3>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Context Details</h4>
              {thread.metadata.caseNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>Case #{thread.metadata.caseNumber}</span>
                </div>
              )}
              {thread.metadata.clientName && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{thread.metadata.clientName}</span>
                </div>
              )}
              {thread.metadata.documentTitle && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{thread.metadata.documentTitle}</span>
                </div>
              )}
              {thread.metadata.eventTitle && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{thread.metadata.eventTitle}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Participants</h4>
              <div className="flex flex-wrap gap-2">
                {thread.participants.map((participant) => (
                  <HoverCard key={participant.id}>
                    <HoverCardTrigger>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name[0]}</AvatarFallback>
                      </Avatar>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-60">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{participant.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{participant.name}</h4>
                          <p className="text-sm text-muted-foreground">{participant.role}</p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {thread.metadata.labels && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Labels</h4>
                <div className="flex flex-wrap gap-1">
                  {thread.metadata.labels.map((label) => (
                    <Badge key={label} variant="secondary">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowContextBar(prev => !prev)}
            >
              {contextIcon}
            </Button>
            <div>
              <h2 className="font-medium">{thread.title}</h2>
              <p className="text-sm text-muted-foreground">
                {thread.metadata.status && (
                  <Badge variant="outline" className="mr-2">
                    {thread.metadata.status}
                  </Badge>
                )}
                {thread.metadata.priority && (
                  <Badge
                    variant={
                      thread.metadata.priority === 'high'
                        ? 'destructive'
                        : thread.metadata.priority === 'medium'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {thread.metadata.priority}
                  </Badge>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Flag className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                <DropdownMenuItem>Pin Thread</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Archive Thread</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4"
        >
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.senderId === currentUserId;
              const sender = thread.participants.find(p => p.id === message.senderId);

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    isCurrentUser && "flex-row-reverse"
                  )}
                >
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={sender?.avatar} />
                    <AvatarFallback>{sender?.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className={cn("space-y-2", isCurrentUser && "items-end")}>
                    {message.replyToId && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Reply className="h-3 w-3" />
                        Replying to{' '}
                        {messages.find(m => m.id === message.replyToId)?.senderId === currentUserId
                          ? 'yourself'
                          : thread.participants.find(
                              p => p.id === messages.find(m => m.id === message.replyToId)?.senderId
                            )?.name}
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg p-3",
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {isCurrentUser ? 'You' : sender?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                      {message.metadata?.caseUpdate && (
                        <div className="mt-2 p-2 rounded bg-background/50">
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="h-4 w-4" />
                            <span className="font-medium">Case Update</span>
                          </div>
                          <p className="text-sm mt-1">
                            {message.metadata.caseUpdate.details}
                          </p>
                        </div>
                      )}

                      {message.metadata?.documentReference && (
                        <div className="mt-2 p-2 rounded bg-background/50">
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">
                              {message.metadata.documentReference.title}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              v{message.metadata.documentReference.version}
                            </Badge>
                          </div>
                        </div>
                      )}

                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Paperclip className="h-4 w-4" />
                              <a
                                href={attachment.url}
                                className="hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {attachment.name}
                              </a>
                              {attachment.size && (
                                <span className="text-xs text-muted-foreground">
                                  ({Math.round(attachment.size / 1024)}KB)
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {message.reactions && message.reactions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.reactions.map((reaction) => (
                            <Badge
                              key={reaction.emoji}
                              variant="secondary"
                              className="text-xs cursor-pointer hover:bg-accent"
                              onClick={() => onReaction(message.id, reaction.emoji)}
                            >
                              {reaction.emoji} {reaction.users.length}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setReplyTo(message)}
                          >
                            <Reply className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reply</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onCreateBranch(message.id, 'New Thread')}
                          >
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Create Thread</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Forward className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Forward</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Smile className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add Reaction</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <LinkIcon className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy Link</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {replyTo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t p-2 bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Reply className="h-4 w-4" />
                  <span>
                    Replying to{' '}
                    {replyTo.senderId === currentUserId
                      ? 'yourself'
                      : thread.participants.find(p => p.id === replyTo.senderId)?.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setReplyTo(null)}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 border-t mt-auto">
          <div className="flex gap-4">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="min-h-[80px]"
            />
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}