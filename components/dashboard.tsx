'use client';
import React from "react";
import { motion } from 'framer-motion';
import StatsCard from '../app/StatsCard';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Calendar,
  Briefcase,
  Clock,
  MessageSquare,
  Users,
  FileText,
  Bell,
} from 'lucide-react';

const stats = [
  {
    name: 'Active Cases',
    value: '24',
    icon: Briefcase,
    change: '+2 this week',
    href: '/cases',
    color: 'from-blue-500/20 to-blue-600/20'
  },
  {
    name: 'Upcoming Deadlines',
    value: '12',
    icon: Calendar,
    change: '3 today',
    href: '/calendar',
    color: 'from-purple-500/20 to-purple-600/20'
  },
  {
    name: 'Billable Hours',
    value: '164.5',
    icon: Clock,
    change: 'This month',
    href: '/billing',
    color: 'from-emerald-500/20 to-emerald-600/20'
  },
  {
    name: 'Unread Messages',
    value: '8',
    icon: MessageSquare,
    change: '3 urgent',
    href: '/messages',
    color: 'from-orange-500/20 to-orange-600/20'
  },
  {
    name: 'Active Clients',
    value: '45',
    icon: Users,
    change: '+5 this quarter',
    href: '/clients',
    color: 'from-pink-500/20 to-pink-600/20'
  },
  {
    name: 'Documents',
    value: '287',
    icon: FileText,
    change: '12 need review',
    href: '/documents',
    color: 'from-cyan-500/20 to-cyan-600/20'
  }
];

const revenueData = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 15600 },
  { month: 'Mar', revenue: 14200 },
  { month: 'Apr', revenue: 18900 },
  { month: 'May', revenue: 16800 },
  { month: 'Jun', revenue: 21500 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gradient bg-clip-text">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Here's your practice overview for today
          </p>
        </div>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-ping-slow" />
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <StatsCard key={stat.name} stat={stat} index={index} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="modern" className="overflow-hidden">
            <CardHeader>
              <h2 className="text-xl font-semibold">Revenue Trend</h2>
            </CardHeader>
            <div className="h-[300px] p-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
