'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  FileText,
  Users,
  Briefcase,
  AlertCircle,
  ChevronRight,
  Plus,
  Search,
  Sparkles,
  FolderTree,
  Scale,
  BadgeDollarSign,
} from 'lucide-react';

const newCaseSchema = z.object({
  title: z.string().min(2, { message: 'Case title is required' }),
  type: z.string(),
  description: z.string(),
  clientId: z.string().optional(),
  newClient: z.object({
    name: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
  fees: z.object({
    type: z.enum(['hourly', 'fixed', 'contingency']),
    rate: z.number().optional(),
    fixedAmount: z.number().optional(),
    contingencyPercentage: z.number().optional(),
    retainer: z.number().optional(),
  }),
  useAI: z.object({
    folderStructure: z.boolean(),
    clientAnalysis: z.boolean(),
    documentOrganization: z.boolean(),
  }),
  priority: z.enum(['high', 'medium', 'low']),
  assignedTo: z.array(z.string()),
  practiceArea: z.string(),
  jurisdictionId: z.string(),
  caseOrigin: z.string(),
});

interface NewCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewCaseDialog({ open, onOpenChange }: NewCaseDialogProps) {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  interface AIAnalysis {
    suggestedPracticeArea: string;
    riskLevel: 'high' | 'medium' | 'low';
    suggestedFolderStructure: string[];
    estimatedComplexity: string;
    similarCases: string[];
  }

  const [aiSuggestions, setAiSuggestions] = useState<AIAnalysis | null>(null);

  const form = useForm<z.infer<typeof newCaseSchema>>({
    resolver: zodResolver(newCaseSchema),
    defaultValues: {
      useAI: {
        folderStructure: true,
        clientAnalysis: true,
        documentOrganization: true,
      }
    }
  });

  const handleClientSearch = async (query: string) => {
    // Simulated client search
    setSearchResults([
      { id: '1', name: 'John Smith', email: 'john@example.com' },
      { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com' },
    ]);
  };

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    // Simulated AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAiSuggestions({
      suggestedPracticeArea: 'Personal Injury',
      riskLevel: 'medium',
      suggestedFolderStructure: [
        'Client Documents',
        'Court Filings',
        'Evidence',
        'Correspondence',
        'Billing',
      ],
      estimatedComplexity: 'moderate',
      similarCases: ['Smith v. Johnson', 'Davis Personal Injury'],
    });
    setIsAnalyzing(false);
  };

  const onSubmit = async (data: z.infer<typeof newCaseSchema>) => {
    console.log(data);
    // Handle case creation
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Case</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Badge
                    key={i}
                    variant={step === i ? 'default' : 'outline'}
                    className="px-6 py-1"
                  >
                    Step {i}
                  </Badge>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={analyzeWithAI}
                disabled={isAnalyzing}
              >
                <Sparkles className="h-4 w-4" />
                AI Assist
              </Button>
            </div>
            <Progress value={step * 33} className="h-2" />
          </div>

          <ScrollArea className="flex-1 max-h-[60vh]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Basic Case Information</CardTitle>
                          <CardDescription>
                            Enter the main details about the case
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Case Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter case title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Case Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select case type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="civil">Civil Litigation</SelectItem>
                                    <SelectItem value="criminal">Criminal Defense</SelectItem>
                                    <SelectItem value="corporate">Corporate</SelectItem>
                                    <SelectItem value="family">Family Law</SelectItem>
                                    <SelectItem value="estate">Estate Planning</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Case Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Provide a brief description of the case"
                                    className="h-32"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>

                      {aiSuggestions && (
                        <Card className="bg-primary/5 border-primary/20">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Sparkles className="h-5 w-5 text-primary" />
                              AI Suggestions
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Suggested Practice Area</Label>
                                <p className="text-sm text-muted-foreground">
                                  {aiSuggestions.suggestedPracticeArea}
                                </p>
                              </div>
                              <div>
                                <Label>Risk Level</Label>
                                <Badge variant={
                                  aiSuggestions.riskLevel === 'high' ? 'destructive' :
                                  aiSuggestions.riskLevel === 'medium' ? 'default' :
                                  'secondary'
                                }>
                                  {aiSuggestions.riskLevel} risk
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <Label>Similar Cases</Label>
                              <div className="flex gap-2 mt-1">
                                {aiSuggestions.similarCases.map((case_, i) => (
                                  <Badge key={i} variant="outline">{case_}</Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Client Information</CardTitle>
                          <CardDescription>
                            Select an existing client or create a new one
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search existing clients..."
                              className="pl-10"
                              onChange={(e) => handleClientSearch(e.target.value)}
                            />
                          </div>

                          {searchResults.length > 0 && (
                            <Card className="mt-2">
                              <ScrollArea className="h-48">
                                {searchResults.map((client) => (
                                  <div
                                    key={client.id}
                                    className="p-3 flex items-center justify-between hover:bg-accent cursor-pointer"
                                    onClick={() => form.setValue('clientId', client.id)}
                                  >
                                    <div>
                                      <p className="font-medium">{client.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {client.email}
                                      </p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                ))}
                              </ScrollArea>
                            </Card>
                          )}

                          <Separator className="my-4" />

                          <div>
                            <h4 className="font-medium mb-2">New Client</h4>
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="newClient.name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Client Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter client name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="newClient.email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Email</FormLabel>
                                      <FormControl>
                                        <Input type="email" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="newClient.phone"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Phone</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <FormField
                                control={form.control}
                                name="newClient.address"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <BadgeDollarSign className="h-5 w-5" />
                              Fee Structure
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <FormField
                              control={form.control}
                              name="fees.type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Fee Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select fee type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                                      <SelectItem value="fixed">Fixed Fee</SelectItem>
                                      <SelectItem value="contingency">Contingency</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {form.watch('fees.type') === 'hourly' && (
                              <FormField
                                control={form.control}
                                name="fees.rate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Hourly Rate</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}

                            {form.watch('fees.type') === 'fixed' && (
                              <FormField
                                control={form.control}
                                name="fees.fixedAmount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Fixed Amount</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}

                            {form.watch('fees.type') === 'contingency' && (
                              <FormField
                                control={form.control}
                                name="fees.contingencyPercentage"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Contingency Percentage</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}

                            <FormField
                              control={form.control}
                              name="fees.retainer"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Retainer Amount</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Sparkles className="h-5 w-5" />
                              AI Features
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <FormField
                              control={form.control}
                              name="useAI.folderStructure"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Automatic Folder Structure
                                    </FormLabel>
                                    <FormDescription>
                                      Create an organized folder structure based on case type
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
                              name="useAI.clientAnalysis"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Client Analysis
                                    </FormLabel>
                                    <FormDescription>
                                      Analyze client background and case history
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
                              name="useAI.documentOrganization"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Smart Document Organization
                                    </FormLabel>
                                    <FormDescription>
                                      Automatically categorize and rename documents
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
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </Form>
          </ScrollArea>
        </div>

        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              if (step < 3) {
                setStep(step + 1);
              } else {
                form.handleSubmit(onSubmit)();
              }
            }}
          >
            {step === 3 ? 'Create Case' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}