'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  Legend 
} from 'recharts';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertTriangle,
  ArrowUpRight,
  DollarSign,
  Download,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Table as TableIcon,
  TrendingUp,
  Clock,
  Users,
} from 'lucide-react';

interface BillingStatsProps {
  colleagueStats: Array<{
    name: string;
    hours: number;
    amount: number;
    utilization: number;
    trend: Array<{
      month: string;
      hours: number;
    }>;
    practiceAreas?: Array<{
      name: string;
      percentage: number;
    }>;
    performance?: {
      realization: number;
      collection: number;
      avgRate: number;
      writeOffs: number;
    };
  }>;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#82CA9D', '#FDB462', '#B3DE69'
];

export function BillingStats({ colleagueStats = [] }: BillingStatsProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState('month');
  const [selectedMetric, setSelectedMetric] = React.useState('hours');

  const totalHours = colleagueStats.reduce((sum, stat) => sum + stat.hours, 0);
  const totalAmount = colleagueStats.reduce((sum, stat) => sum + stat.amount, 0);
  const averageUtilization = colleagueStats.length > 0
    ? (colleagueStats.reduce((sum, stat) => sum + stat.utilization, 0) / colleagueStats.length).toFixed(1)
    : '0.0';

  const pieData = colleagueStats.map((stat) => ({
    name: stat.name,
    value: selectedMetric === 'hours' ? stat.hours : stat.amount,
  }));

  // Calculate practice area distribution
  const practiceAreaData = colleagueStats
    .flatMap(stat => stat.practiceAreas || [])
    .reduce((acc, area) => {
      const existing = acc.find(a => a.name === area.name);
      if (existing) {
        existing.percentage += area.percentage;
      } else {
        acc.push({ ...area });
      }
      return acc;
    }, [] as Array<{ name: string; percentage: number }>)
    .map(area => ({
      ...area,
      percentage: Number((area.percentage / colleagueStats.length).toFixed(1))
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="practice-areas">Practice Areas</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <div className="flex gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total Hours</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{totalHours.toLocaleString()}</span>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total Billing</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold">€{totalAmount.toLocaleString()}</span>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Utilization</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{averageUtilization}%</span>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Active Attorneys</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{colleagueStats.length}</span>
                </div>
              </Card>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-4">Distribution by Attorney</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={120}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-sm font-medium mb-4">Time Entry Patterns</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={colleagueStats.flatMap(stat =>
                        stat.trend.map(t => ({
                          name: stat.name,
                          month: t.month,
                          hours: t.hours
                        }))
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {colleagueStats.map((stat, index) => (
                        <Line
                          key={stat.name}
                          type="monotone"
                          dataKey="hours"
                          name={stat.name}
                          stroke={COLORS[index % COLORS.length]}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="practice-areas">
            <div className="space-y-6">
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-4">Practice Area Distribution</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={practiceAreaData}
                      layout="vertical"
                      margin={{ left: 120 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" unit="%" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar
                        dataKey="percentage"
                        fill="#0088FE"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {practiceAreaData.map((area, index) => (
                  <Card key={area.name} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{area.name}</h4>
                      <Badge variant="outline">{area.percentage}%</Badge>
                    </div>
                    <Progress value={area.percentage} className="h-2" />
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="space-y-6">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {colleagueStats.map((stat) => (
                  <Card key={stat.name} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{stat.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {stat.hours} hours • €{stat.amount.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={
                        stat.utilization >= 85 ? 'default' :
                        stat.utilization >= 70 ? 'secondary' :
                        'destructive'
                      }>
                        {stat.utilization}% util.
                      </Badge>
                    </div>

                    {stat.performance && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Realization</span>
                            <span>{stat.performance.realization}%</span>
                          </div>
                          <Progress value={stat.performance.realization} className="h-1 mt-1" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Collection</span>
                            <span>{stat.performance.collection}%</span>
                          </div>
                          <Progress value={stat.performance.collection} className="h-1 mt-1" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Avg. Rate</span>
                          <span>€{stat.performance.avgRate}/h</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Write-offs</span>
                          <span className="text-red-500">
                            €{stat.performance.writeOffs.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <div className="space-y-6">
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-4">Billing Trends</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={colleagueStats.flatMap(stat =>
                        stat.trend.map(t => ({
                          name: stat.name,
                          month: t.month,
                          hours: t.hours,
                          amount: t.hours * (stat.performance?.avgRate || 0)
                        }))
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      {colleagueStats.map((stat, index) => (
                        <React.Fragment key={stat.name}>
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="hours"
                            name={`${stat.name} (Hours)`}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={2}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="amount"
                            name={`${stat.name} (€)`}
                            stroke={COLORS[(index + 4) % COLORS.length]}
                            strokeDasharray="3 3"
                          />
                        </React.Fragment>
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
}