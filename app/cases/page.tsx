'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CaseTimeline } from '@/components/case-timeline';
import { NewCaseDialog } from '@/components/new-case-dialog';
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
  const [isNewCaseDialogOpen, setIsNewCaseDialogOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Cases</h1>
        <Button onClick={() => setIsNewCaseDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Case
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search cases..."
              className="pl-10"
            />
          </div>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="civil">Civil Litigation</SelectItem>
            <SelectItem value="corporate">Corporate</SelectItem>
            <SelectItem value="estate">Estate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="mb-8">
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
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((case_) => (
              <TableRow key={case_.id}>
                <TableCell>{case_.id}</TableCell>
                <TableCell>{case_.title}</TableCell>
                <TableCell>{case_.type}</TableCell>
                <TableCell>{case_.status}</TableCell>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
              <h2 className="text-2xl font-bold">24</h2>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
              <h2 className="text-2xl font-bold">18</h2>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming Deadlines</p>
              <h2 className="text-2xl font-bold">7</h2>
            </div>
          </div>
        </Card>
      </div>

      <NewCaseDialog
        open={isNewCaseDialogOpen}
        onOpenChange={setIsNewCaseDialogOpen}
      />
    </div>
  );
}