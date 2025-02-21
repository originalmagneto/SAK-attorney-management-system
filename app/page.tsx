/* eslint-disable react/no-unescaped-entities */

'use client';

import { motion } from 'framer-motion';
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
          <h1 className="text-3xl font-bold bg-clip-text text-transparent animated-gradient">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here is your practice overview.
          </p>
        </div>
        <Button variant="outline" size="icon" className="hover-card glass-effect">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Link href={stat.href}>
              <Card className="gradient-card hover-card glass-effect p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 animated-gradient">
                    <stat.icon className="h-6 w-6 text-white" />
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
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="gradient-card hover-card glass-effect p-6">
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent animated-gradient">Revenue Trend</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="gradient-card hover-card glass-effect p-6">
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent animated-gradient">Case Distribution</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={caseDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {caseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${220 + index * 20}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent animated-gradient">Recent Activity</h2>
        <Card className="gradient-card hover-card glass-effect">
          <div className="divide-y divide-primary/10">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{activity.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}