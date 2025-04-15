'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { EventType } from '@/types/calendar';
import {
  Clock,
  MapPin,
  Users,
  Link2,
  AlertTriangle,
  DollarSign,
  FileText,
  Bell,
  Lock,
  Calendar as CalendarIcon,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';

type IconComponent = ComponentType<LucideProps & { className?: string }>;

const eventTypes: Record<string, { label: string; icon: IconComponent }> = {
  HEARING: { label: 'Hearing', icon: CalendarIcon },
  MEETING: { label: 'Meeting', icon: Users },
  DEPOSITION: { label: 'Deposition', icon: FileText },
  INTERNAL: { label: 'Internal', icon: Lock },
  DEADLINE: { label: 'Deadline', icon: AlertTriangle },
  SOL: { label: 'SOL Deadline', icon: AlertTriangle },
  MEDIATION: { label: 'Mediation', icon: Users },
  TRAINING: { label: 'Training', icon: Users },
  BOARD_MEETING: { label: 'Board Meeting', icon: Users },
} as const;

const legalEventSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  type: z.string(),
  date: z.date(),
  time: z.string(),
  location: z.string(),
  description: z.string(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  notifications: z.object({
    enabled: z.boolean(),
    reminderTimes: z.array(z.number()),
    notifyParticipants: z.boolean(),
  }),
  courtDetails: z.object({
    courtroom: z.string().optional(),
    judge: z.string().optional(),
    caseNumber: z.string().optional(),
    filingDeadline: z.string().optional(),
  }).optional(),
  billingDetails: z.object({
    billableHours: z.number().optional(),
    billingRate: z.number().optional(),
    billingDescription: z.string().optional(),
    matterNumber: z.string(),
  }).optional(),
  linkedDocuments: z.array(z.object({
    id: z.string(),
    title: z.string(),
    type: z.string(),
    url: z.string(),
  })).optional(),
  participants: z.array(z.object({
    name: z.string(),
    role: z.string(),
    email: z.string().email().optional(),
  })).optional(),
});

interface LegalCalendarFormProps {
  initialData?: z.infer<typeof legalEventSchema>;
  onSubmit: (data: z.infer<typeof legalEventSchema>) => void;
  onCancel: () => void;
}

export function LegalCalendarForm({
  initialData,
  onSubmit,
  onCancel
}: LegalCalendarFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const form = useForm<z.infer<typeof legalEventSchema>>({
    resolver: zodResolver(legalEventSchema),
    defaultValues: initialData || {
      notifications: {
        enabled: true,
        reminderTimes: [30],
        notifyParticipants: true,
      }
    }
  });

  function handleSubmit(data: z.infer<typeof legalEventSchema>) {
    onSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 gap-4 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="court">Court Details</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(eventTypes).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">                               <value.icon className="h-4 w-4" />
                              <span>{value.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="critical">
                          <Badge variant="destructive">Critical</Badge>
                        </SelectItem>
                        <SelectItem value="high">
                          <Badge variant="destructive">High</Badge>
                        </SelectItem>
                        <SelectItem value="medium">
                          <Badge>Medium</Badge>
                        </SelectItem>
                        <SelectItem value="low">
                          <Badge variant="secondary">Low</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      className="rounded-md border"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="court" className="space-y-4">
            <FormField
              control={form.control}
              name="courtDetails.courtroom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Courtroom</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Room 302" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courtDetails.judge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judge</FormLabel>
                  <FormControl>
                    <Input placeholder="Judge's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courtDetails.caseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter case number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courtDetails.filingDeadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filing Deadline</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <FormField
              control={form.control}
              name="billingDetails.matterNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matter Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter matter number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="billingDetails.billableHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Billable Hours</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billingDetails.billingRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Rate</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="billingDetails.billingDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter billing description"
                      className="h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="additional" className="space-y-4">
            <FormField
              control={form.control}
              name="notifications.enabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable Notifications
                    </FormLabel>
                    <FormDescription>
                      Receive reminders about this event
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifications.notifyParticipants"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Notify Participants
                    </FormLabel>
                    <FormDescription>
                      Send event notifications to all participants
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes & Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes or description"
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Event</Button>
        </div>
      </form>
    </Form>
  );
}