'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Clock,
  DollarSign,
  PieChart,
  BarChart3,
  Filter,
  Download,
  Plus,
  Search,
  Calendar,
  UserCircle,
  Briefcase,
  FileText,
  Tag
} from 'lucide-react';
import { sampleBillingEntries, billingStats } from '@/lib/sample-billing';
import { format } from 'date-fns';

export default function BillingPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredEntries = sampleBillingEntries.filter(entry => 
    (selectedStatus === 'all' || entry.status === selectedStatus) &&
    (selectedCategory === 'all' || entry.category === selectedCategory)
  );

  return (
    <div className="p-8">
      <div className="max-w-[1800px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Time & Billing</h1>
            <p className="text-muted-foreground mt-1">
              Track billable hours and manage invoices
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Time Entry
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Billable Hours</p>
                <h3 className="text-2xl font-bold">{billingStats.totalBillableHours}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Billed</p>
                <h3 className="text-2xl font-bold">${billingStats.totalBilled.toLocaleString()}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Utilization Rate</p>
                <h3 className="text-2xl font-bold">{billingStats.utilization}%</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <h3 className="text-2xl font-bold">{billingStats.collectionRate}%</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Clients */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Top Clients</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {billingStats.topClients.map((client, index) => (
              <Card key={client.name} className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-full rounded ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    'bg-amber-600'
                  }`} />
                  <div>
                    <h3 className="font-medium">{client.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {client.hours}h
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${client.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Time Entries */}
        <Card>
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Time Entries</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search entries..."
                    className="pl-9 w-[300px]"
                  />
                </div>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="billed">Billed</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="drafting">Drafting</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="court">Court</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="p-6 space-y-4">
              {filteredEntries.map(entry => (
                <Card key={entry.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{entry.description}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(entry.date), 'MMM d, yyyy')}
                            </div>
                            <div className="flex items-center gap-1">
                              <UserCircle className="h-4 w-4" />
                              {entry.attorney}
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {entry.caseTitle}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{entry.category}</Badge>
                          <Badge
                            variant={
                              entry.status === 'paid' ? 'default' :
                              entry.status === 'disputed' ? 'destructive' :
                              'secondary'
                            }
                          >
                            {entry.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {entry.timeSpent} hours
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            ${(entry.timeSpent * entry.rate).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            ${entry.rate}/hour
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm">Delete</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}