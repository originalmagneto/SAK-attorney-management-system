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