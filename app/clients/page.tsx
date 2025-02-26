'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientDetailsDialog } from '@/components/client-details-dialog';
import { ClientStatsOverview } from '@/components/client-stats-overview';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  Building,
  Users,
  Clock,
  Banknote,
  FileText,
  Calendar,
  MapPin,
  Globe,
  AlignLeft,
  ChevronRight,
  LayoutGrid,
  LayoutList,
  MoreVertical,
} from 'lucide-react';
import { AIOnboardingWizard } from '@/components/ai-onboarding-wizard';
import { cn } from '@/lib/utils';

const mockStats = {
  totalClients: 156,
  activeClients: 89,
  totalRevenue: '€1.2M',
  avgCaseValue: '€45,000',
  activeMatters: 124,
  clientSatisfaction: 94,
  totalDocuments: 1205,
  avgResponseTime: '2.5h'
};

// Example data
const clients = [
  {
    id: 1,
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&auto=format&fit=crop',
    company: 'Tech Corp',
    email: 'john.smith@techcorp.com',
    phone: '+421 900 123 456',
    type: 'Corporate',
    status: 'Active',
    location: 'Bratislava, SK',
    website: 'techcorp.com',
    stats: {
      activeCases: 3,
      closedCases: 5,
      revenue: '€25,000',
      hoursLogged: 48.5,
      lastCase: 'Contract Dispute',
      progress: 75,
      documents: 12,
      meetings: 8,
      responsiveness: 90
    },
    relationships: [
      {
        name: 'Mary Johnson',
        role: 'CFO',
        email: 'mary@techcorp.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop'
      },
      {
        name: 'Robert Wilson',
        role: 'Legal Contact',
        email: 'robert@techcorp.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&auto=format&fit=crop'
      }
    ],
    notes: 'Key client since 2022. Prefers morning meetings. Interested in expanding European operations.',
    upcoming: [
      {
        type: 'meeting',
        title: 'Q2 Review',
        date: '2024-04-15 10:00'
      },
      {
        type: 'deadline',
        title: 'Contract Renewal',
        date: '2024-04-30'
      }
    ]
  },
  {
    id: 2,
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&auto=format&fit=crop',
    company: 'Innovate Solutions',
    email: 'sarah.chen@innovatesolutions.com',
    phone: '+421 900 234 567',
    type: 'Corporate',
    status: 'Active',
    location: 'Prague, CZ',
    website: 'innovatesolutions.com',
    stats: {
      activeCases: 2,
      closedCases: 3,
      revenue: '€18,000',
      hoursLogged: 32.5,
      lastCase: 'IP Protection',
      progress: 60,
      documents: 8,
      meetings: 5,
      responsiveness: 95
    },
    relationships: [
      {
        name: 'David Lee',
        role: 'CEO',
        email: 'david@innovatesolutions.com',
        avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=256&h=256&auto=format&fit=crop'
      }
    ],
    notes: 'Growing tech company, expanding operations in EU. High priority for IP protection.',
    upcoming: [
      {
        type: 'meeting',
        title: 'Patent Review',
        date: '2024-04-20 14:00'
      }
    ]
  },
  {
    id: 3,
    name: 'Emily Brown',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&auto=format&fit=crop',
    company: 'Green Energy Ltd',
    email: 'emily.brown@greenenergy.com',
    phone: '+421 900 345 678',
    type: 'Corporate',
    status: 'Potential',
    location: 'Vienna, AT',
    website: 'greenenergy.com',
    stats: {
      activeCases: 1,
      closedCases: 0,
      revenue: '€8,000',
      hoursLogged: 12.0,
      lastCase: 'Environmental Compliance',
      progress: 25,
      documents: 4,
      meetings: 3,
      responsiveness: 85
    },
    relationships: [
      {
        name: 'Michael Green',
        role: 'Legal Director',
        email: 'michael@greenenergy.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&auto=format&fit=crop'
      }
    ],
    notes: 'Interested in renewable energy regulations compliance. Potential for long-term partnership.',
    upcoming: [
      {
        type: 'deadline',
        title: 'Proposal Submission',
        date: '2024-04-25 17:00'
      }
    ]
  },
  {
    id: 4,
    name: 'Marcus Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=256&h=256&auto=format&fit=crop',
    company: 'Global Logistics Inc',
    email: 'marcus@globallogistics.com',
    phone: '+421 900 456 789',
    type: 'Corporate',
    status: 'Active',
    location: 'Budapest, HU',
    website: 'globallogistics.com',
    stats: {
      activeCases: 4,
      closedCases: 7,
      revenue: '€35,000',
      hoursLogged: 65.0,
      lastCase: 'International Trade',
      progress: 80,
      documents: 15,
      meetings: 10,
      responsiveness: 88
    },
    relationships: [
      {
        name: 'Sofia Patel',
        role: 'Operations Director',
        email: 'sofia@globallogistics.com',
        avatar: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=256&h=256&auto=format&fit=crop'
      }
    ],
    notes: 'International logistics company with complex regulatory needs. Multiple jurisdictions.',
    upcoming: [
      {
        type: 'meeting',
        title: 'Regulatory Compliance Review',
        date: '2024-04-22 13:00'
      }
    ]
  },
  {
    id: 5,
    name: 'Anna Kowalski',
    avatar: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=256&h=256&auto=format&fit=crop',
    company: 'MedTech Innovations',
    email: 'anna@medtech-innovations.com',
    phone: '+421 900 567 890',
    type: 'Corporate',
    status: 'Active',
    location: 'Warsaw, PL',
    website: 'medtech-innovations.com',
    stats: {
      activeCases: 2,
      closedCases: 4,
      revenue: '€28,000',
      hoursLogged: 42.5,
      lastCase: 'Medical Device Approval',
      progress: 70,
      documents: 18,
      meetings: 6,
      responsiveness: 92
    },
    relationships: [
      {
        name: 'Thomas Weber',
        role: 'R&D Director',
        email: 'thomas@medtech-innovations.com',
        avatar: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=256&h=256&auto=format&fit=crop'
      }
    ],
    notes: 'Medical technology company seeking EU certifications. High-priority compliance matters.',
    upcoming: [
      {
        type: 'deadline',
        title: 'CE Mark Application',
        date: '2024-05-01 09:00'
      }
    ]
  }
];

export default function ClientsPage() {
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="flex flex-col gap-6 p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1"
          >
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Clients
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your client relationships and track case progress
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button className="shadow-lg">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>New Client Onboarding</DialogTitle>
                  <DialogDescription>
                    Add a new client with AI-assisted information gathering
                  </DialogDescription>
                </DialogHeader>
                <AIOnboardingWizard />
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ClientStatsOverview stats={mockStats} />
        </motion.div>

        {/* Filters and View Options */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="potential">Potential</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 bg-muted rounded-md p-1">
            <Button
              variant={selectedView === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setSelectedView('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={selectedView === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setSelectedView('list')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Client Cards Grid */}
        <ScrollArea className="flex-1 rounded-lg -mx-2 px-2">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className={cn(
              "grid gap-6 p-1",
              selectedView === 'grid' 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            )}
          >
            {clients.map((client) => (
              <motion.div
                key={client.id}
                variants={item}
                className="group"
              >
                <Card className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-background">
                          <AvatarImage src={client.avatar} alt={client.name} />
                          <AvatarFallback>{client.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{client.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Building className="mr-1 h-3 w-3" />
                            {client.company}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={client.status === 'Active' ? 'default' : 'secondary'}
                        className="shadow-sm"
                      >
                        {client.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Mail className="mr-1 h-3 w-3" />
                          {client.email}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Phone className="mr-1 h-3 w-3" />
                          {client.phone}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {client.location}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Globe className="mr-1 h-3 w-3" />
                          {client.website}
                        </div>
                      </div>
                    </div>

                    <Tabs defaultValue="stats" className="w-full">
                      <TabsList className="w-full">
                        <TabsTrigger value="stats" className="flex-1">Overview</TabsTrigger>
                        <TabsTrigger value="relationships" className="flex-1">Contacts</TabsTrigger>
                        <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="stats" className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Active Cases</span>
                              <span className="font-medium">{client.stats.activeCases}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Revenue</span>
                              <span className="font-medium">{client.stats.revenue}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Hours</span>
                              <span className="font-medium">{client.stats.hoursLogged}h</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Documents</span>
                              <span className="font-medium">{client.stats.documents}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Meetings</span>
                              <span className="font-medium">{client.stats.meetings}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Responsiveness</span>
                              <span className="font-medium">{client.stats.responsiveness}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Case Progress</div>
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-primary/10">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${client.stats.progress}%` }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="relationships" className="mt-4">
                        <ScrollArea className="h-[180px]">
                          <div className="space-y-4">
                            {client.relationships.map((contact, i) => (
                              <div key={i} className="flex items-center justify-between group/item hover:bg-muted/50 p-2 rounded-lg transition-colors">
                                <div>
                                  <div className="font-medium">{contact.name}</div>
                                  <div className="text-sm text-muted-foreground">{contact.role}</div>
                                  <div className="text-sm text-muted-foreground">{contact.email}</div>
                                </div>
                                <Button variant="ghost" size="icon" className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                                  <Mail className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="activity" className="mt-4">
                        <ScrollArea className="h-[180px]">
                          <div className="space-y-4">
                            {client.upcoming.map((event, i) => (
                              <div key={i} className="flex items-center gap-4 hover:bg-muted/50 p-2 rounded-lg transition-colors">
                                {event.type === 'meeting' ? (
                                  <Users className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <Clock className="h-4 w-4 text-orange-500" />
                                )}
                                <div>
                                  <div className="font-medium">{event.title}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(event.date).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div className="border-t bg-muted/50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <AlignLeft className="mr-1 h-3 w-3 inline" />
                        {client.notes}
                      </div>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Client</DropdownMenuItem>
                            <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                            <DropdownMenuItem>New Case</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Archive Client</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedClient(client);
                            setDetailsOpen(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </ScrollArea>
      </div>

      {selectedClient && (
        <ClientDetailsDialog
          client={selectedClient}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      )}
    </div>
  );
}