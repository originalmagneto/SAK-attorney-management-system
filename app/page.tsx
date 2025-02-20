'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Briefcase,
  Clock,
  MessageSquare,
  Users,
  FileText,
  Bell,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const stats = [
  {
    name: 'Active Cases',
    value: '24',
    icon: Briefcase,
    change: '+2 this week',
    href: '/cases',
  },
  {
    name: 'Upcoming Deadlines',
    value: '12',
    icon: Calendar,
    change: '3 today',
    href: '/calendar',
  },
  {
    name: 'Billable Hours',
    value: '164.5',
    icon: Clock,
    change: 'This month',
    href: '/billing',
  },
  {
    name: 'Unread Messages',
    value: '8',
    icon: MessageSquare,
    change: '3 urgent',
    href: '/messages',
  },
  {
    name: 'Active Clients',
    value: '45',
    icon: Users,
    change: '+5 this quarter',
    href: '/clients',
  },
  {
    name: 'Documents',
    value: '287',
    icon: FileText,
    change: '12 need review',
    href: '/documents',
  },
];

const recentActivity = [
  {
    id: 1,
    type: 'case',
    title: 'Smith vs. Johnson - Document Updated',
    time: '10 minutes ago',
    description: 'Contract revision uploaded by Jane Doe',
  },
  {
    id: 2,
    type: 'billing',
    title: 'Invoice Generated',
    time: '1 hour ago',
    description: 'Monthly billing for Tech Corp completed',
  },
  {
    id: 3,
    type: 'calendar',
    title: 'Court Hearing Scheduled',
    time: '2 hours ago',
    description: 'Regional Court Bratislava, Room 304',
  },
];

const revenueData = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 15600 },
  { month: 'Mar', revenue: 14200 },
  { month: 'Apr', revenue: 18900 },
  { month: 'May', revenue: 16800 },
  { month: 'Jun', revenue: 21500 },
];

const caseDistribution = [
  { name: 'Corporate', value: 35 },
  { name: 'Civil', value: 25 },
  { name: 'Criminal', value: 15 },
  { name: 'Family', value: 25 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Home() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your practice overview.
          </p>
        </div>
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link href={stat.href} key={stat.name}>
            <Card className="p-6 hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <h2 className="text-2xl font-bold">{stat.value}</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0088FE"
                  fill="#0088FE"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Case Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={caseDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {caseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <div className="divide-y">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{activity.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}