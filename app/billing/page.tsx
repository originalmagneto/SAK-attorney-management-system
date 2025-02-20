'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  Download,
  Clock,
  EuroIcon,
  TrendingUp,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const timeEntries = [
  {
    id: 1,
    date: '2024-03-27',
    client: 'Tech Corp',
    case: 'Contract Review',
    description: 'Document review and analysis',
    duration: '2.5',
    rate: '150',
    amount: '375.00',
    status: 'Unbilled',
  },
  {
    id: 2,
    date: '2024-03-27',
    client: 'John Smith',
    case: 'Smith vs. Johnson',
    description: 'Court hearing preparation',
    duration: '3.0',
    rate: '150',
    amount: '450.00',
    status: 'Billed',
  },
  {
    id: 3,
    date: '2024-03-26',
    client: 'Sarah Brown',
    case: 'Estate Planning',
    description: 'Client consultation',
    duration: '1.5',
    rate: '150',
    amount: '225.00',
    status: 'Unbilled',
  },
];

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Time & Billing</h1>
          <p className="text-muted-foreground mt-1">
            Track time and manage invoices
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Time Entry
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Hours
              </p>
              <h2 className="text-2xl font-bold">164.5</h2>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <EuroIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Billable Amount
              </p>
              <h2 className="text-2xl font-bold">€24,675</h2>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Utilization
              </p>
              <h2 className="text-2xl font-bold">85%</h2>
              <p className="text-xs text-muted-foreground">Target: 80%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-8">
        <div className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search time entries..."
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
                <SelectItem value="billed">Billed</SelectItem>
                <SelectItem value="unbilled">Unbilled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Case</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Duration (h)</TableHead>
              <TableHead className="text-right">Rate (€)</TableHead>
              <TableHead className="text-right">Amount (€)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.client}</TableCell>
                <TableCell>{entry.case}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell className="text-right">{entry.duration}</TableCell>
                <TableCell className="text-right">{entry.rate}</TableCell>
                <TableCell className="text-right">{entry.amount}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.status === 'Billed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {entry.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}