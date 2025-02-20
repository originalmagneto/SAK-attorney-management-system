'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  MoreVertical,
  Building,
  Users,
  Clock,
  Banknote,
  FileText,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const clients = [
  {
    id: 1,
    name: 'John Smith',
    avatar: '/images/avatars/avatar-1.png',
    company: 'Tech Corp',
    email: 'john.smith@techcorp.com',
    phone: '+421 900 123 456',
    type: 'Corporate',
    status: 'Active',
    stats: {
      activeCases: 3,
      closedCases: 5,
      revenue: '€25,000',
      hoursLogged: 48.5,
      lastCase: 'Contract Dispute',
      progress: 75
    }
  },
  {
    id: 2,
    name: 'Sarah Brown',
    avatar: '/images/avatars/avatar-2.png',
    company: 'Brown Family Trust',
    email: 'sarah.brown@email.com',
    phone: '+421 901 234 567',
    type: 'Individual',
    status: 'Active',
    stats: {
      activeCases: 1,
      closedCases: 2,
      revenue: '€12,500',
      hoursLogged: 24.0,
      lastCase: 'Estate Planning',
      progress: 90
    }
  },
  {
    id: 3,
    name: 'Michael Johnson',
    avatar: '/images/avatars/avatar-3.png',
    company: 'Johnson & Co',
    email: 'michael@johnsonco.com',
    phone: '+421 902 345 678',
    type: 'Corporate',
    status: 'Inactive',
    stats: {
      activeCases: 0,
      closedCases: 3,
      revenue: '€18,750',
      hoursLogged: 36.5,
      lastCase: 'IP Rights',
      progress: 100
    }
  },
];

const ClientProgressBar = ({ value }: { value: number }) => (
  <Progress value={value} className="h-2" />
);

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const totalRevenue = clients.reduce((sum, client) => {
    return sum + parseInt(client.stats.revenue.replace('€', '').replace(',', ''));
  }, 0);

  const totalHours = clients.reduce((sum, client) => sum + client.stats.hoursLogged, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage your client relationships
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          New Client
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Clients
              </p>
              <h2 className="text-2xl font-bold">{clients.length}</h2>
              <p className="text-xs text-muted-foreground">
                {clients.filter(c => c.status === 'Active').length} active
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Cases
              </p>
              <h2 className="text-2xl font-bold">
                {clients.reduce((sum, client) => 
                  sum + client.stats.activeCases + client.stats.closedCases, 0)}
              </h2>
              <p className="text-xs text-muted-foreground">
                {clients.reduce((sum, client) => sum + client.stats.activeCases, 0)} active
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Banknote className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </p>
              <h2 className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</h2>
              <p className="text-xs text-muted-foreground">
                From all cases
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Hours Logged
              </p>
              <h2 className="text-2xl font-bold">{totalHours.toFixed(1)}h</h2>
              <p className="text-xs text-muted-foreground">
                Total time tracked
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full sm:w-[300px]"
          />
        </div>
        <div className="flex items-center gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card key={client.id} className="p-6 hover:bg-accent/5 transition-colors">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={client.avatar} alt={client.name} />
                  <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                  <p className="text-sm text-muted-foreground">{client.company}</p>
                </div>
              </div>
              <Badge variant={client.status === 'Active' ? 'default' : 'secondary'}>
                {client.status}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Active Cases</p>
                  <p className="font-medium">{client.stats.activeCases}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Closed Cases</p>
                  <p className="font-medium">{client.stats.closedCases}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Revenue</p>
                  <p className="font-medium">{client.stats.revenue}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Hours Logged</p>
                  <p className="font-medium">{client.stats.hoursLogged}h</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <p className="text-muted-foreground">Latest Case Progress</p>
                  <span className="font-medium">{client.stats.progress}%</span>
                </div>
                <ClientProgressBar value={client.stats.progress} />
                <p className="text-xs text-muted-foreground mt-2">{client.stats.lastCase}</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}