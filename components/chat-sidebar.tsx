'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, Image as ImageIcon, Smile, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  content: string;
  sender: {
    name: string;
    avatar: string;
  };
  timestamp: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const messages = [
  {
    id: 1,
    content: 'Hi, I have a question about the Smith case.',
    sender: {
      name: 'John Doe',
      avatar: '/images/avatars/avatar-2.png',
    },
    timestamp: '10:30 AM',
  },
  {
    id: 2,
    content: 'Sure, what would you like to know?',
    sender: {
      name: 'Jane Smith',
      avatar: '/images/avatars/avatar-1.png',
    },
    timestamp: '10:32 AM',
  },
];

export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const [newMessage, setNewMessage] = useState('');
  const [localMessages, setLocalMessages] = useState(messages);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      const message = {
        id: localMessages.length + 1,
        content: newMessage,
        sender: {
          name: 'Jane Smith',
          avatar: '/images/avatars/avatar-1.png',
        },
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setLocalMessages([...localMessages, message]);
      setNewMessage('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed right-0 top-0 h-screen w-80 bg-background border-l shadow-lg z-50"
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Chat</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {localMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start gap-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.sender.avatar} />
                      <AvatarFallback>
                        {message.sender.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {message.sender.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp}
                        </span>
                      </div>
                      <div className="mt-1 p-3 rounded-lg bg-accent">
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}