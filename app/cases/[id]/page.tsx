'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CaseTimeline } from '@/components/case-timeline';
import { CaseChat } from '@/components/case-chat';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import {
  FileText, Users, Clock, Calendar, MoreVertical,
  MessagesSquare, ArrowRight, Bell
} from 'lucide-react';
import { DocumentVersionControl } from '@/components/document-version-control';
import { TaskBoard } from '@/components/task-board';

const timelineEvents = [
  {
    id: 1,
    type: 'court' as const,
    title: 'Initial Hearing Scheduled',
    description: 'Court hearing scheduled at Regional Court Bratislava',
    date: '2024-03-28 09:00',
    icon: 'gavel',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    type: 'document' as const,
    title: 'Contract Review Completed',
    description: 'Final review of licensing agreement',
    date: '2024-03-27 14:30',
    user: {
      name: 'Jane Smith',
      avatar: '/images/avatars/avatar-1.png',
    },
  },
  {
    id: 3,
    type: 'message' as const,
    title: 'Client Communication',
    description: 'Discussed contract terms with client',
    date: '2024-03-27 11:00',
    user: {
      name: 'John Doe',
      avatar: '/images/avatars/avatar-2.png',
    },
  },
];

const messages = [
  {
    id: 1,
    content: "I've reviewed the latest contract draft. There are a few points we need to discuss.",
    sender: {
      name: 'John Doe',
      avatar: '/images/avatars/avatar-2.png',
    },
    timestamp: '10:30 AM',
  },
  {
    id: 2,
    content: 'Could you highlight the specific sections that need attention?',
    sender: {
      name: 'Jane Smith',
      avatar: '/images/avatars/avatar-1.png',
    },
    timestamp: '10:32 AM',
  },
];

export default function CaseDetailPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [localMessages, setLocalMessages] = useState(messages);

  // Add mouse move effect for cards
  useEffect(() => {
    const cards = document.getElementsByClassName('gradient-card');
    
    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const card = mouseEvent.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    Array.from(cards).forEach(card => {
      card.addEventListener('mousemove', handleMouseMove);
    });

    return () => {
      Array.from(cards).forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove);
      });
    };
  }, []);

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: localMessages.length + 1,
      content,
      sender: {
        name: 'Jane Smith',
        avatar: '/images/avatars/avatar-1.png',
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setLocalMessages([...localMessages, newMessage]);
  };

  return (
    <div className="p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent animated-gradient">
              Smith vs. Johnson
            </h1>
            <Badge className="animated-gradient text-white">Active</Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Case #2024-001 • Contract Dispute
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 hover-card glass-effect">
            <Bell className="h-4 w-4" />
            Subscribe
          </Button>
          <Button variant="outline" size="icon" className="hover-card glass-effect">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {[
          { icon: Clock, title: 'Time Logged', value: '24.5h' },
          { icon: Calendar, title: 'Next Hearing', value: 'Mar 28' },
          { icon: FileText, title: 'Documents', value: '12' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="gradient-card hover-card glass-effect">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 animated-gradient">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <h2 className="text-2xl font-bold">{stat.value}</h2>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px] glass-effect">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="chat">Discussion</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="gradient-card hover-card glass-effect">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Case Timeline</h3>
                  <CaseTimeline events={timelineEvents} />
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="gradient-card hover-card glass-effect">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Case Discussion</h3>
                  <CaseChat messages={localMessages} onSendMessage={handleSendMessage} />
                </div>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="gradient-card hover-card glass-effect p-6">
            <CaseTimeline events={timelineEvents} />
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="gradient-card hover-card glass-effect p-6">
            <CaseChat messages={localMessages} onSendMessage={handleSendMessage} />
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="gradient-card hover-card glass-effect p-6">
            <h3 className="font-semibold mb-4">Case Documents</h3>
            <DocumentVersionControl documentId={1} currentVersion="v2.0" />
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card className="gradient-card hover-card glass-effect p-6">
            <TaskBoard />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}