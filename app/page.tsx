'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SparkleEffect } from '@/components/ui/SparkleEffect';
import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  React.useEffect(() => {
    let frame: number;
    let start = 0;
    let end = Number(value);
    let duration = 600;
    let startTime: number | null = null;
    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <span>{displayValue}</span>;
};

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
        {stats.map((stat, index) => {
          const [sparkle, setSparkle] = useState(false);
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(80,80,200,0.08)' }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 120 }}
              onMouseEnter={() => setSparkle(true)}
              onAnimationComplete={() => setSparkle(false)}
              className="relative"
            >
              <Link href={stat.href}>
                <Card
                  variant="glass"
                  isHoverable
                  className="overflow-hidden group stats-card"
                >
                  <div className="relative p-6">
                    <SparkleEffect trigger={sparkle} duration={900} />
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.6 }}
                        className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                      >
                        <stat.icon className="h-6 w-6 text-foreground" />
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.name}
                        </p>
                        <h2 className="text-2xl font-bold tracking-tight mt-1">
                          <AnimatedNumber value={Number(stat.value)} />
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stat.change}
                        </p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground/50 float-animation" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
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
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
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
          <Card variant="modern" className="overflow-hidden">
            <CardHeader>
              <h2 className="text-xl font-semibold">Case Distribution</h2>
            </CardHeader>
            <div className="h-[300px] p-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={caseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {caseDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`hsl(${220 + index * 40}, 70%, 50%)`}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
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
        <Card variant="glass" className="overflow-hidden">
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </CardHeader>
          <div className="divide-y divide-border">
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