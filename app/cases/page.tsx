'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CaseTimeline } from '@/components/case-timeline';
import { NewCaseDialog } from '@/components/new-case-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  FileText,
  Users,
  Calendar,
  Sparkles,
  AlertTriangle,
  DollarSign,
  ChevronRight,
  BarChart,
  Clock,
  Link,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Example data
const cases = [
  {
    id: 'CASE-2024-001',
    title: 'Smith vs. Johnson',
    type: 'Civil Litigation',
    status: 'Active',
    client: 'John Smith',
    lastUpdated: '2024-03-27',
    nextDeadline: '2024-04-15',
    progress: 65,
    risk: 'medium',
    billingStatus: 'Current',
    aiInsights: {
      sentiment: 'positive',
      predictedOutcome: '75% favorable',
      similarCases: 3,
      documentCount: 45,
    },
  },
  // ... other cases
];

const caseMetrics = {
  totalCases: 24,
  activeCases: 18,
  upcomingDeadlines: 7,
  totalBillableHours: 156.5,
  recentDocuments: 12,
  averageTimeToClose: '4.5 months',
};

export default function CasesPage() {
  const [isNewCaseDialogOpen, setIsNewCaseDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedView, setSelectedView] = useState('list');

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Case Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your legal cases
          </p>
        </div>
        <Button onClick={() => setIsNewCaseDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Case
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="relative overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
                  <h2 className="text-2xl font-bold">{caseMetrics.activeCases}</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    +3 this month
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={75} className="h-1" />
                <p className="text-xs text-muted-foreground mt-2">
                  75% case completion rate
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <DollarSign className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Billable Hours</p>
                  <h2 className="text-2xl font-bold">{caseMetrics.totalBillableHours}</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    This month
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="outline">90% billed</Badge>
                <Badge variant="outline">6 pending</Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-yellow-500/10">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Time to Close</p>
                  <h2 className="text-2xl font-bold">{caseMetrics.averageTimeToClose}</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    -2 weeks from last quarter
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Improved</Badge>
                  <span className="text-xs text-muted-foreground">↓ 15%</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <Sparkles className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AI Insights</p>
                  <h2 className="text-2xl font-bold">{caseMetrics.recentDocuments}</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    New documents analyzed
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">3 actions suggested</Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search cases by title, client, or case number..."
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select defaultValue={activeFilter} onValueChange={setActiveFilter}>
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
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="list">List View</SelectItem>
              <SelectItem value="board">Board View</SelectItem>
              <SelectItem value="timeline">Timeline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cases Table with Modern Features */}
      <Card className="mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Case ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Next Deadline</TableHead>
              <TableHead>AI Insights</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((case_) => (
              <TableRow key={case_.id} className="group">
                <TableCell className="font-mono text-xs">{case_.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{case_.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Last updated: {case_.lastUpdated}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{case_.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      case_.status === 'Active' ? 'default' :
                      case_.status === 'Pending' ? 'secondary' :
                      'outline'
                    }
                  >
                    {case_.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {case_.client[0]}
                    </div>
                    <div>
                      <div className="font-medium">{case_.client}</div>
                      <div className="text-xs text-muted-foreground">
                        {case_.billingStatus}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Progress value={case_.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {case_.progress}% complete
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {case_.nextDeadline}
                    {new Date(case_.nextDeadline) <= new Date(new Date().setDate(new Date().getDate() + 7)) && (
                      <Badge variant="destructive" className="ml-2">
                        Soon
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={
                        case_.aiInsights.sentiment === 'positive' ? 'text-green-500 border-green-500' :
                        case_.aiInsights.sentiment === 'negative' ? 'text-red-500 border-red-500' :
                        'text-yellow-500 border-yellow-500'
                      }
                    >
                      {case_.aiInsights.predictedOutcome}
                    </Badge>
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="h-4 w-4 mr-2" /> Schedule Event
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DollarSign className="h-4 w-4 mr-2" /> Billing
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link className="h-4 w-4 mr-2" /> Related Cases
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <AlertTriangle className="h-4 w-4 mr-2" /> Report Issue
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* AI Insights Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Case Insights
            </h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
              <div className="flex items-center gap-4">
                <BarChart className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Similar Case Analysis</p>
                  <p className="text-sm text-muted-foreground">3 similar cases found</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
              <div className="flex items-center gap-4">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Document Analysis</p>
                  <p className="text-sm text-muted-foreground">12 new documents processed</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Review</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Upcoming Deadlines
            </h3>
            <Button variant="outline" size="sm">View Calendar</Button>
          </div>
          <ScrollArea className="h-[200px]">
            <div className="space-y-4">
              {/* Example deadlines */}
              <DeadlineItem
                title="File Motion for Summary Judgment"
                case="Smith vs. Johnson"
                date="2024-04-15"
                priority="high"
              />
              <DeadlineItem
                title="Discovery Deadline"
                case="Tech Corp Contract"
                date="2024-04-20"
                priority="medium"
              />
              <DeadlineItem
                title="Client Meeting"
                case="Estate Planning - Brown"
                date="2024-04-22"
                priority="low"
              />
            </div>
          </ScrollArea>
        </Card>
      </div>

      <NewCaseDialog
        open={isNewCaseDialogOpen}
        onOpenChange={setIsNewCaseDialogOpen}
      />
    </div>
  );
}

function DeadlineItem({ title, case: caseName, date, priority }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full ${
          priority === 'high' ? 'bg-red-500' :
          priority === 'medium' ? 'bg-yellow-500' :
          'bg-green-500'
        }`} />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{caseName}</p>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">{date}</div>
    </div>
  );
}