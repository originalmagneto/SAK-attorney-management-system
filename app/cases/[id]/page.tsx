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
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AIDocumentAnalyzer } from '@/components/ai-document-analyzer';
import {
  Sparkles,
  DollarSign,
  Scale,
  Link2,
  ChevronLeft,
  Upload,
  BarChart,
  MessageSquare,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

// Example case data
const caseData = {
  id: 'CASE-2024-001',
  title: 'Smith vs. Johnson',
  type: 'Civil Litigation',
  status: 'Active',
  description: 'Personal injury case involving a motor vehicle accident',
  client: {
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345'
  },
  assignedTo: ['Jane Doe', 'Mike Wilson'],
  openDate: '2024-01-15',
  nextHearing: '2024-04-15',
  court: 'District Court Bratislava I',
  judge: 'Hon. Judge Davis',
  progress: 65,
  billingInfo: {
    type: 'Hourly',
    rate: 250,
    totalBilled: 15750,
    retainer: 5000,
    outstanding: 2500
  },
  aiInsights: {
    sentiment: 'positive',
    predictedOutcome: '75% favorable',
    riskFactors: ['Witness credibility', 'Documentation gaps'],
    similarCases: 3,
    suggestedActions: [
      'Schedule expert witness deposition',
      'File motion for additional discovery',
      'Review similar case precedents'
    ]
  },
  stats: {
    documentsCount: 45,
    hoursLogged: 63,
    deadlinesMet: '92%',
    upcomingDeadlines: 3
  }
};

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [localMessages, setLocalMessages] = useState(messages);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

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
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Cases
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{caseData.title}</h1>
            <Badge variant="outline">{caseData.type}</Badge>
            <Badge
              variant={
                caseData.status === 'Active' ? 'default' :
                caseData.status === 'Pending' ? 'secondary' :
                'outline'
              }
            >
              {caseData.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Case #{caseData.id} • Opened {caseData.openDate}
          </p>
        </div>

        <div className="flex gap-3">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Documents
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Case Documents</DialogTitle>
                <DialogDescription>
                  Upload documents for AI analysis and organization
                </DialogDescription>
              </DialogHeader>
              <AIDocumentAnalyzer
                caseId={params.id}
                documents={[]}
                onAnalysisComplete={() => setIsUploadDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Button className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Client Portal
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[1fr,300px]">
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                  icon={FileText}
                  label="Documents"
                  value={caseData.stats.documentsCount}
                  subtext="Total files"
                />
                <StatsCard
                  icon={Clock}
                  label="Hours Logged"
                  value={caseData.stats.hoursLogged}
                  subtext="Billable hours"
                />
                <StatsCard
                  icon={Calendar}
                  label="Deadlines"
                  value={caseData.stats.deadlinesMet}
                  subtext={`${caseData.stats.upcomingDeadlines} upcoming`}
                />
                <StatsCard
                  icon={Scale}
                  label="Progress"
                  value={`${caseData.progress}%`}
                  subtext="Case completion"
                />
              </div>

              {/* AI Insights */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI Case Insights
                  </h3>
                  <Badge variant="outline">
                    {caseData.aiInsights.predictedOutcome}
                  </Badge>
                </div>

                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-3">Risk Factors</h4>
                    <div className="space-y-2">
                      {caseData.aiInsights.riskFactors.map((risk, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                          {risk}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Suggested Actions</h4>
                    <div className="space-y-2">
                      {caseData.aiInsights.suggestedActions.map((action, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Case Details */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Case Details</h3>
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Court</h4>
                      <p>{caseData.court}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Judge</h4>
                      <p>{caseData.judge}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Next Hearing</h4>
                      <p>{caseData.nextHearing}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Assigned Attorneys</h4>
                      <div className="flex gap-2 mt-1">
                        {caseData.assignedTo.map((attorney, i) => (
                          <Badge key={i} variant="secondary">{attorney}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {caseData.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <AIDocumentAnalyzer
                caseId={params.id}
                documents={[]}
                onAnalysisComplete={() => {}}
              />
            </TabsContent>

            <TabsContent value="timeline">
              <CaseTimeline />
            </TabsContent>

            <TabsContent value="billing">
              <Card className="p-6">
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Billing Summary</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Type</span>
                          <Badge>{caseData.billingInfo.type}</Badge>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Rate</span>
                          <span>${caseData.billingInfo.rate}/hour</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Total Billed</span>
                          <span>${caseData.billingInfo.totalBilled}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Retainer</span>
                          <span>${caseData.billingInfo.retainer}</span>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between font-medium">
                          <span>Outstanding</span>
                          <span className="text-red-500">${caseData.billingInfo.outstanding}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Time Entries</h3>
                    <ScrollArea className="h-[300px]">
                      {/* Time entries would go here */}
                    </ScrollArea>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Information
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                <p>{caseData.client.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                <p>{caseData.client.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                <p>{caseData.client.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                <p className="text-sm">{caseData.client.address}</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Hearing
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <MessageSquare className="h-4 w-4" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Link2 className="h-4 w-4" />
                Link Related Case
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon: Icon, label, value, subtext }: any) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
          <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
        </div>
      </div>
    </Card>
  );
}