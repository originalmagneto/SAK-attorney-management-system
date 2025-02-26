'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Brain,
  SendHorizontal,
  FileText,
  Calendar,
  Link as LinkIcon,
  MessageSquare,
  ChevronDown,
  Users,
} from 'lucide-react';

interface Message {
  id: number;
  content: string;
  sender: {
    name: string;
    avatar: string;
    role?: string;
  };
  timestamp: string;
  attachments?: Array<{
    type: string;
    name: string;
    url: string;
  }>;
  aiContext?: {
    type: 'document' | 'deadline' | 'citation' | 'suggestion';
    content: string;
    relatedItems?: string[];
  };
}

interface CaseChatProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function CaseChat({ messages, onSendMessage }: CaseChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    onSendMessage(newMessage);
    setNewMessage('');

    // Simulate AI assistant response
    setIsAITyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAITyping(false);

    // Generate new suggestions based on the conversation
    generateAISuggestions();
  };

  const generateAISuggestions = () => {
    // Simulate AI generating contextual suggestions
    const suggestions = [
      'Schedule a follow-up meeting to discuss the settlement terms',
      'Review the recently uploaded evidence documents',
      'Draft a response to the opposing counsel\'s latest motion',
    ];
    setAiSuggestions(suggestions);
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 h-[500px] pr-4" ref={scrollRef}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <img src={message.sender.avatar} alt={message.sender.name} />
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{message.sender.name}</span>
                    {message.sender.role && (
                      <Badge variant="outline" className="text-xs">
                        {message.sender.role}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp}
                    </span>
                  </div>
                  <Card className="mt-2 p-3 bg-accent/50">
                    <p className="text-sm">{message.content}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        {message.attachments.map((attachment, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm p-2 rounded-md bg-background"
                          >
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="flex-1">{attachment.name}</span>
                            <Button variant="ghost" size="sm">
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {message.aiContext && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-start gap-2">
                          <Brain className="h-4 w-4 text-primary mt-1" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">AI Context</p>
                            <p className="text-sm text-muted-foreground">
                              {message.aiContext.content}
                            </p>
                            {message.aiContext.relatedItems && (
                              <div className="mt-2 flex gap-2">
                                {message.aiContext.relatedItems.map((item, i) => (
                                  <Badge key={i} variant="outline">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </motion.div>
          ))}

          {isAITyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 p-2"
            >
              <Avatar className="w-8 h-8">
                <Brain className="h-5 w-5" />
              </Avatar>
              <Card className="p-3 bg-accent/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {aiSuggestions.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Suggested Actions</span>
          </div>
          <ScrollArea className="w-full">
            <div className="flex gap-2">
              {aiSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={() => setNewMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <div className="flex gap-2 items-center">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} className="gap-2">
          <SendHorizontal className="h-4 w-4" />
          Send
        </Button>
      </div>
    </div>
  );
}