'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  FileText,
  Calendar,
  Clock,
  DollarSign,
  ChevronRight,
  AlignLeft,
  Link,
  Activity,
  MessageSquare,
  Briefcase
} from 'lucide-react';

interface ClientDetailsDialogProps {
  client: any; // Replace with proper type
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientDetailsDialog({
  client,
  open,
  onOpenChange
}: ClientDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400 p-6">
            <div className="absolute bottom-0 left-6 transform translate-y-1/2 flex items-end gap-4">
              <Avatar className="h-20 w-20 border-4 border-background">
                <AvatarImage src={client.avatar} alt={client.name} />
                <AvatarFallback>{client.name[0]}</AvatarFallback>
              </Avatar>
              <div className="mb-2">
                <h2 className="text-2xl font-bold text-white">{client.name}</h2>
                <div className="flex items-center text-blue-100">
                  <Building className="mr-1 h-4 w-4" />
                  {client.company}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden pt-16">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="px-6 border-b">
                <TabsList className="inline-flex h-10 items-center justify-center rounded-none p-0">
                  <TabsTrigger value="overview" className="px-4">Overview</TabsTrigger>
                  <TabsTrigger value="cases" className="px-4">Cases</TabsTrigger>
                  <TabsTrigger value="documents" className="px-4">Documents</TabsTrigger>
                  <TabsTrigger value="activity" className="px-4">Activity</TabsTrigger>
                  <TabsTrigger value="relationships" className="px-4">Relationships</TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="flex-1 p-6">
                <TabsContent value="overview" className="mt-0 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h3 className="font-semibold mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          <span className="text-sm">{client.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          <span className="text-sm">{client.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{client.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          <span className="text-sm">{client.website}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-semibold mb-4">Key Statistics</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2" />
                            <span className="text-sm">Active Cases</span>
                          </div>
                          <span className="font-medium">{client.stats.activeCases}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span className="text-sm">Total Revenue</span>
                          </div>
                          <span className="font-medium">{client.stats.revenue}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="text-sm">Hours Logged</span>
                          </div>
                          <span className="font-medium">{client.stats.hoursLogged}h</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Activity className="h-4 w-4 mr-2" />
                            <span className="text-sm">Responsiveness</span>
                          </div>
                          <span className="font-medium">{client.stats.responsiveness}%</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 col-span-2">
                      <h3 className="font-semibold mb-4">Notes & Important Information</h3>
                      <div className="space-y-4">
                        <div className="text-sm">{client.notes}</div>
                        <div className="pt-4 border-t">
                          <h4 className="text-sm font-medium mb-2">Upcoming Events</h4>
                          <div className="space-y-2">
                            {client.upcoming.map((event: any, i: number) => (
                              <div key={i} className="flex items-center text-sm">
                                {event.type === 'meeting' ? (
                                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                                ) : (
                                  <Clock className="h-4 w-4 mr-2 text-orange-500" />
                                )}
                                <span className="flex-1">{event.title}</span>
                                <span className="text-muted-foreground">
                                  {new Date(event.date).toLocaleDateString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="cases" className="mt-0">
                  {/* Cases content */}
                </TabsContent>

                <TabsContent value="documents" className="mt-0">
                  {/* Documents content */}
                </TabsContent>

                <TabsContent value="activity" className="mt-0">
                  {/* Activity timeline */}
                </TabsContent>

                <TabsContent value="relationships" className="mt-0">
                  <div className="grid grid-cols-2 gap-6">
                    {client.relationships.map((contact: any, i: number) => (
                      <Card key={i} className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.avatar} alt={contact.name} />
                            <AvatarFallback>{contact.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium">{contact.name}</h4>
                            <div className="text-sm text-muted-foreground">{contact.role}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              <Mail className="h-3 w-3 inline mr-1" />
                              {contact.email}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}