'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  FileText,
  Scale,
  Activity,
  Award,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

function StatCard({ title, value, change, icon, description, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("relative overflow-hidden", className)}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
              {change !== undefined && (
                <span className={cn(
                  "text-xs font-medium",
                  change > 0 ? "text-green-500" : "text-red-500"
                )}>
                  {change > 0 ? "+" : ""}{change}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            {icon}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-primary opacity-50" />
      </Card>
    </motion.div>
  );
}

interface ClientStatsOverviewProps {
  stats: {
    totalClients: number;
    activeClients: number;
    totalRevenue: string;
    avgCaseValue: string;
    activeMatters: number;
    clientSatisfaction: number;
    totalDocuments: number;
    avgResponseTime: string;
  };
}

export function ClientStatsOverview({ stats }: ClientStatsOverviewProps) {
  const statCards = [
    {
      title: "Total Clients",
      value: stats.totalClients,
      change: 12,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      description: "Active and inactive clients",
    },
    {
      title: "Active Matters",
      value: stats.activeMatters,
      change: 8,
      icon: <Scale className="h-5 w-5 text-indigo-600" />,
      description: "Ongoing legal cases",
    },
    {
      title: "Total Revenue",
      value: stats.totalRevenue,
      change: 23,
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      description: "Year to date",
    },
    {
      title: "Avg. Case Value",
      value: stats.avgCaseValue,
      icon: <TrendingUp className="h-5 w-5 text-yellow-600" />,
      description: "Per active matter",
    },
    {
      title: "Client Satisfaction",
      value: `${stats.clientSatisfaction}%`,
      change: 5,
      icon: <Award className="h-5 w-5 text-rose-600" />,
      description: "Based on feedback",
    },
    {
      title: "Response Time",
      value: stats.avgResponseTime,
      icon: <Activity className="h-5 w-5 text-purple-600" />,
      description: "Average response time",
    },
    {
      title: "Documents",
      value: stats.totalDocuments,
      icon: <FileText className="h-5 w-5 text-cyan-600" />,
      description: "Across all clients",
    },
    {
      title: "Active Rate",
      value: `${Math.round((stats.activeClients / stats.totalClients) * 100)}%`,
      icon: <Clock className="h-5 w-5 text-orange-600" />,
      description: "Active vs total clients",
    },
  ];

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 pb-4 min-w-max">
        {statCards.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            className="w-[280px]"
          />
        ))}
      </div>
    </ScrollArea>
  );
}