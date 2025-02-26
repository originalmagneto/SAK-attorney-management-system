'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Brain,
  Loader2,
  FolderTree,
  Users,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Calendar,
} from 'lucide-react';

interface ClientSuggestion {
  id: string;
  name: string;
  email: string;
  phone: string;
  matchConfidence: number;
  existingCases?: string[];
}

interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
}

export function AICaseOnboarding() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestedClients, setSuggestedClients] = useState<ClientSuggestion[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [caseDetails, setCaseDetails] = useState({
    title: '',
    description: '',
    type: '',
    practiceArea: '',
    priority: 'medium',
    expectedDuration: '',
    estimatedFees: '',
    billingType: 'hourly',
  });

  const handleSubmit = async () => {
    setIsProcessing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStep(step + 1);
    setIsProcessing(false);
  };

  const practiceAreas = [
    { value: 'civil-litigation', label: 'Civil Litigation' },
    { value: 'corporate', label: 'Corporate Law' },
    { value: 'criminal', label: 'Criminal Law' },
    { value: 'family', label: 'Family Law' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'intellectual-property', label: 'Intellectual Property' },
  ];

  const priorityOptions = [
    { value: 'high', label: 'High Priority', variant: 'destructive' },
    { value: 'medium', label: 'Medium Priority', variant: 'default' },
    { value: 'low', label: 'Low Priority', variant: 'secondary' },
  ];

  return (
    <div className="space-y-6 py-4">
      <Tabs defaultValue="guided" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="guided">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI-Guided Setup
            </div>
          </TabsTrigger>
          <TabsTrigger value="manual">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Manual Entry
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guided" className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Case Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    Describe the case and our AI will help organize everything.
                  </p>
                  <Textarea
                    placeholder="Describe the case in detail..."
                    className="h-32"
                    value={caseDetails.description}
                    onChange={(e) => setCaseDetails({ ...caseDetails, description: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Practice Area</Label>
                      <Select
                        value={caseDetails.practiceArea}
                        onValueChange={(value) => setCaseDetails({ ...caseDetails, practiceArea: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select practice area" />
                        </SelectTrigger>
                        <SelectContent>
                          {practiceAreas.map(area => (
                            <SelectItem key={area.value} value={area.value}>
                              {area.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={caseDetails.priority}
                        onValueChange={(value) => setCaseDetails({ ...caseDetails, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              <Badge variant={option.variant as any}>
                                {option.label}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {isProcessing ? (
                  <Card className="p-4">
                    <div className="flex items-center gap-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Analyzing case details...</p>
                        <Progress value={65} className="mt-2" />
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Button onClick={handleSubmit} className="w-full">Continue</Button>
                )}
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-4">Client Matching</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Based on the case details, we've identified potential matching clients.
                  </p>
                  
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-3">
                      {[
                        {
                          id: '1',
                          name: 'John Smith',
                          email: 'john.smith@email.com',
                          phone: '+1 (555) 123-4567',
                          matchConfidence: 92,
                          existingCases: ['CASE-2024-001', 'CASE-2023-015'],
                          matchReason: 'Previous similar case types and ongoing relationship'
                        },
                        {
                          id: '2',
                          name: 'Sarah Johnson',
                          email: 'sarah.j@email.com',
                          phone: '+1 (555) 987-6543',
                          matchConfidence: 78,
                          existingCases: ['CASE-2024-003'],
                          matchReason: 'Related business interests'
                        },
                      ].map((client) => (
                        <Card
                          key={client.id}
                          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                            selectedClient === client.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedClient(client.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{client.name}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  {client.matchConfidence}% match
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                              <p className="text-sm text-muted-foreground">{client.phone}</p>
                              <p className="text-sm mt-2 text-muted-foreground">
                                {client.matchReason}
                              </p>
                            </div>
                            {selectedClient === client.id && (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          {client.existingCases && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-sm text-muted-foreground mb-2">
                                Existing Cases:
                              </p>
                              <div className="flex gap-2">
                                {client.existingCases.map((caseId) => (
                                  <Badge key={caseId} variant="outline">
                                    {caseId}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="flex items-center gap-4 mt-6">
                    <div className="flex-1">
                      <Button variant="outline" className="w-full">
                        Create New Client
                      </Button>
                    </div>
                    <div className="flex-1">
                      <Button 
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={!selectedClient}
                      >
                        Continue with Selected Client
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-4">Case Setup</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <Card className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center gap-2">
                          <FolderTree className="h-4 w-4" />
                          Document Structure
                        </h4>
                        <Badge variant="outline">AI Generated</Badge>
                      </div>
                      <ScrollArea className="h-[200px] pr-4">
                        <div className="space-y-2">
                          {[
                            { name: 'Client Information', subfolders: ['Personal Documents', 'Contact History'] },
                            { name: 'Pleadings', subfolders: ['Complaints', 'Answers', 'Motions'] },
                            { name: 'Discovery', subfolders: ['Requests', 'Responses', 'Depositions'] },
                            { name: 'Correspondence', subfolders: ['Client', 'Opposing Counsel', 'Court'] },
                            { name: 'Evidence', subfolders: ['Documents', 'Photos', 'Expert Reports'] },
                            { name: 'Research', subfolders: ['Case Law', 'Statutes', 'Notes'] },
                            { name: 'Billing', subfolders: ['Invoices', 'Time Entries', 'Expenses'] },
                          ].map((folder) => (
                            <div key={folder.name} className="space-y-1">
                              <div className="flex items-center gap-2 p-2 text-sm rounded-md bg-accent/50">
                                <FolderTree className="h-4 w-4" />
                                {folder.name}
                              </div>
                              <div className="pl-6 space-y-1">
                                {folder.subfolders.map((subfolder) => (
                                  <div
                                    key={subfolder}
                                    className="flex items-center gap-2 p-2 text-sm text-muted-foreground"
                                  >
                                    <FileText className="h-3 w-3" />
                                    {subfolder}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </Card>

                    <Card className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4" />
                          Billing Setup
                        </h4>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Fee Structure</Label>
                          <RadioGroup
                            defaultValue={caseDetails.billingType}
                            onValueChange={(value) => setCaseDetails({ ...caseDetails, billingType: value })}
                            className="grid gap-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="hourly" id="hourly" />
                              <Label htmlFor="hourly">Hourly Rate</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="fixed" id="fixed" />
                              <Label htmlFor="fixed">Fixed Fee</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="contingency" id="contingency" />
                              <Label htmlFor="contingency">Contingency</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="hybrid" id="hybrid" />
                              <Label htmlFor="hybrid">Hybrid (Mixed Fee)</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="grid gap-4">
                          {caseDetails.billingType === 'hourly' && (
                            <>
                              <div className="space-y-2">
                                <Label>Hourly Rate (USD)</Label>
                                <Input
                                  type="number"
                                  placeholder="e.g., 350"
                                  value={caseDetails.estimatedFees}
                                  onChange={(e) => setCaseDetails({ ...caseDetails, estimatedFees: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Retainer Amount (USD)</Label>
                                <Input type="number" placeholder="e.g., 5000" />
                              </div>
                            </>
                          )}

                          <div className="space-y-2">
                            <Label>Expected Duration</Label>
                            <Select
                              value={caseDetails.expectedDuration}
                              onValueChange={(value) => setCaseDetails({ ...caseDetails, expectedDuration: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1-3-months">1-3 months</SelectItem>
                                <SelectItem value="3-6-months">3-6 months</SelectItem>
                                <SelectItem value="6-12-months">6-12 months</SelectItem>
                                <SelectItem value="1-2-years">1-2 years</SelectItem>
                                <SelectItem value="2plus-years">2+ years</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card className="mt-6 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        AI Insights
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/50">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Potential Conflicts Detected</p>
                          <p className="text-sm text-muted-foreground">
                            Similar case found with overlapping parties. Review recommended.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                        <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Document Templates</p>
                          <p className="text-sm text-muted-foreground">
                            3 relevant templates identified for this case type.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
                        <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Team Suggestions</p>
                          <p className="text-sm text-muted-foreground">
                            2 attorneys with relevant expertise are available.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div className="flex justify-end mt-6">
                    <Button onClick={handleSubmit}>Create Case</Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Case Created Successfully</h3>
                      <p className="text-sm text-muted-foreground">
                        Your case has been set up with all the specified configurations.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Next Steps</h4>
                      <div className="space-y-2">
                        {[
                          'Review generated document structure',
                          'Complete conflict check documentation',
                          'Schedule initial client meeting',
                          'Set up billing arrangements',
                          'Review AI-suggested templates',
                          'Set up case timeline',
                        ].map((step, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent cursor-pointer"
                          >
                            <ChevronRight className="h-4 w-4" />
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Quick Actions</h4>
                      <div className="grid gap-2">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Calendar className="h-4 w-4" />
                          Schedule Initial Meeting
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <FileText className="h-4 w-4" />
                          Create Initial Documents
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Users className="h-4 w-4" />
                          Assign Team Members
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Brain className="h-4 w-4" />
                          Generate Case Summary
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Brain className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">AI Assistant is setting up your case</p>
                          <p className="text-sm text-muted-foreground">
                            Creating folders, generating templates, and organizing documents
                          </p>
                        </div>
                      </div>
                      <Progress value={75} className="w-[100px]" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          <FolderTree className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">7 folders created</span>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">3 templates ready</span>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">2 team suggestions</span>
                        </div>
                      </Card>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="manual">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">
              Manual case creation form will be implemented here.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}