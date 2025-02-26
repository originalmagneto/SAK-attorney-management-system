'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
import { sampleClients } from '@/lib/sample-clients';

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

// Transform sample clients to match the expected format
const clients = sampleClients.map(client => ({
  id: client.id,
  name: client.contactInfo.primaryContact,
  avatar: client.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(client.name)}`,
  company: client.name,
  email: client.contactInfo.email,
  phone: client.contactInfo.phone,
  type: client.industry === 'Individual' ? 'Individual' : 'Corporate',
  status: client.billingStatus === 'current' ? 'Active' : 'Inactive',
  location: client.contactInfo.address.split(', ').slice(-2).join(', '),
  website: client.website || `${client.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
  stats: {
    activeCases: client.activeCases,
    closedCases: client.totalCases - client.activeCases,
    revenue: `€${(Math.random() * 100000).toFixed(0)}`,
    hoursLogged: (Math.random() * 100).toFixed(1),
    lastCase: client.matters[0],
    progress: Math.floor(Math.random() * 100),
    documents: Math.floor(Math.random() * 20) + 5,
    meetings: Math.floor(Math.random() * 10) + 2,
    responsiveness: Math.floor(Math.random() * 30) + 70
  },
  relationships: [
    {
      name: client.contactInfo.primaryContact,
      role: 'Primary Contact',
      email: client.contactInfo.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(client.contactInfo.primaryContact)}`
    }
  ],
  notes: `Key client handling ${client.matters.join(', ')}. ${client.industry === 'Individual' ? 'Individual client.' : 'Corporate client with significant presence in ' + client.industry + ' sector.'}`,
  upcoming: [
    {
      type: 'meeting',
      title: 'Status Review',
      date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
}));

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
            {clients
              .filter(client => 
                (filterStatus === 'all' || client.status.toLowerCase() === filterStatus) &&
                (searchQuery === '' ||
                  client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  client.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
              )
              .map((client) => (
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