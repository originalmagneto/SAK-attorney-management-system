'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CaseTimeline } from '@/components/case-timeline';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  FileText,
  Users,
  Calendar,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const cases = [
  {
    id: 'CASE-2024-001',
    title: 'Smith vs. Johnson',
    type: 'Civil Litigation',
    status: 'Active',
    client: 'John Smith',
    lastUpdated: '2024-03-27',
    nextDeadline: '2024-04-15',
  },
  {
    id: 'CASE-2024-002',
    title: 'Tech Corp Contract Review',
    type: 'Corporate',
    status: 'Pending',
    client: 'Tech Corp',
    lastUpdated: '2024-03-26',
    nextDeadline: '2024-04-10',
  },
  {
    id: 'CASE-2024-003',
    title: 'Estate Planning - Brown Family',
    type: 'Estate',
    status: 'Active',
    client: 'Sarah Brown',
    lastUpdated: '2024-03-25',
    nextDeadline: '2024-05-01',
  },
];

type TimelineEvent = {
  id: number;
  type: 'court' | 'document' | 'message';
  title: string;
  description: string;
  date: string;
  user?: {
    name: string;
    avatar: string;
  };
};

const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    type: 'court',
    title: 'Initial Hearing Scheduled',
    description: 'Court hearing scheduled at Regional Court Bratislava',
    date: '2024-03-28 09:00',
  },
  {
    id: 2,
    type: 'document',
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
    type: 'message',
    title: 'Client Communication',
    description: 'Discussed contract terms with client',
    date: '2024-03-27 11:00',
    user: {
      name: 'John Doe',
      avatar: '/images/avatars/avatar-2.png',
    },
  },
];

export default function CasesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Cases</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your legal cases
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <CaseTimeline events={timelineEvents} />
        </Card>
        
        <div className="grid gap-4 content-start">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Cases
                </p>
                <h2 className="text-2xl font-bold">24</h2>
                <p className="text-xs text-muted-foreground">Current month</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Upcoming Deadlines
                </p>
                <h2 className="text-2xl font-bold">8</h2>
                <p className="text-xs text-muted-foreground">Next 7 days</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Clients
                </p>
                <h2 className="text-2xl font-bold">45</h2>
                <p className="text-xs text-muted-foreground">Across all cases</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-[300px]"
            />
          </div>
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Next Deadline</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((case_) => (
              <TableRow key={case_.id}>
                <TableCell className="font-medium">{case_.id}</TableCell>
                <TableCell>{case_.title}</TableCell>
                <TableCell>{case_.type}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      case_.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : case_.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {case_.status}
                  </span>
                </TableCell>
                <TableCell>{case_.client}</TableCell>
                <TableCell>{case_.lastUpdated}</TableCell>
                <TableCell>{case_.nextDeadline}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}