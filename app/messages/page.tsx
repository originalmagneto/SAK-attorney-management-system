'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Send,
  Paperclip,
  User,
  MoreVertical,
  Clock,
} from 'lucide-react';

const conversations = [
  {
    id: 1,
    name: 'John Smith',
    lastMessage: 'Thank you for the update on the case.',
    time: '10:30 AM',
    unread: true,
  },
  {
    id: 2,
    name: 'Tech Corp Team',
    lastMessage: 'Contract review completed.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 3,
    name: 'Sarah Brown',
    lastMessage: 'When can we schedule the next meeting?',
    time: 'Yesterday',
    unread: true,
  },
];

const messages = [
  {
    id: 1,
    sender: 'John Smith',
    content: 'Hello, I wanted to check on the status of my case.',
    time: '10:15 AM',
    type: 'received',
  },
  {
    id: 2,
    sender: 'Me',
    content:
      'Hi John, we\'ve made significant progress. The court hearing is scheduled for next week.',
    time: '10:20 AM',
    type: 'sent',
  },
  {
    id: 3,
    sender: 'John Smith',
    content: 'Thank you for the update on the case.',
    time: '10:30 AM',
    type: 'received',
  },
];

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-80 border-r">
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`p-3 cursor-pointer hover:bg-accent/50 ${
                  conversation.id === 1 ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {conversation.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread && (
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-medium">John Smith</h2>
                <p className="text-sm text-muted-foreground">
                  Case: Smith vs. Johnson
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === 'sent' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] ${
                  message.type === 'sent'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent'
                } rounded-lg p-3`}
              >
                <p>{message.content}</p>
                <div
                  className={`flex items-center gap-1 mt-1 text-xs ${
                    message.type === 'sent'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Clock className="h-3 w-3" />
                  {message.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-4">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}