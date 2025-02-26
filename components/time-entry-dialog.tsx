'use client';

import * as React from 'react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  Clock, 
  DollarSign, 
  Sparkles,
  Search,
  AlertCircle,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface TimeEntryData {
  date: Date;
  client: string;
  case: string;
  description: string;
  duration: number;
  rate: number;
  billingCode: string;
  billable: boolean;
  activity: string;
  notes?: string;
  aiAssisted?: boolean;
}

interface TimeEntryDialogProps {
  onSubmit: (data: TimeEntryData) => void;
  cases?: Array<{
    id: string;
    title: string;
    client: string;
    billingRate: number;
  }>;
}

// Legal billing activity codes (example ABA codes)
const ACTIVITY_CODES = [
  { code: 'L100', description: 'Case Assessment, Development and Administration' },
  { code: 'L110', description: 'Fact Investigation/Development' },
  { code: 'L120', description: 'Analysis/Strategy' },
  { code: 'L130', description: 'Experts/Consultants' },
  { code: 'L140', description: 'Document/File Management' },
  { code: 'L150', description: 'Budgeting' },
  { code: 'L160', description: 'Settlement/Non-Binding ADR' },
  { code: 'L190', description: 'Other Case Assessment, Development and Administration' },
  { code: 'L200', description: 'Pre-Trial Pleadings and Motions' },
  { code: 'L210', description: 'Pleadings' },
  { code: 'L220', description: 'Preliminary and Procedural Motions' },
  { code: 'L230', description: 'Discovery Motions' },
  { code: 'L240', description: 'Dispositive Motions' },
  { code: 'L250', description: 'Other Written Motions and Submissions' },
  { code: 'L260', description: 'Court Mandated Conferences' },
];

export function TimeEntryDialog({ onSubmit, cases = [] }: TimeEntryDialogProps) {
  const [date, setDate] = useState<Date>();
  const [duration, setDuration] = useState<number>(1);
  const [rate, setRate] = useState<number>(150);
  const [selectedCase, setSelectedCase] = useState<string>('');
  const [billable, setBillable] = useState(true);
  const [activitySearch, setActivitySearch] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [useAiAssistant, setUseAiAssistant] = useState(true);

  const filteredActivities = ACTIVITY_CODES.filter(
    activity => 
      activity.code.toLowerCase().includes(activitySearch.toLowerCase()) ||
      activity.description.toLowerCase().includes(activitySearch.toLowerCase())
  );

  const handleCaseChange = (caseId: string) => {
    setSelectedCase(caseId);
    const selectedCaseData = cases.find(c => c.id === caseId);
    if (selectedCaseData) {
      setRate(selectedCaseData.billingRate);
    }
  };

  const simulateAiAnalysis = async (description: string) => {
    // In a real implementation, this would call your AI service
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAiSuggestions({
      suggestedCode: 'L110',
      confidence: 0.85,
      suggestedDescription: description + ' (reviewed and verified)',
      warnings: [],
      similarEntries: [
        {
          date: '2024-03-20',
          description: 'Similar past entry example',
          duration: 1.5,
          code: 'L110'
        }
      ]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const description = formData.get('description') as string;
    if (useAiAssistant && description) {
      await simulateAiAnalysis(description);
    }

    onSubmit({
      date: date!,
      client: formData.get('client') as string,
      case: selectedCase,
      description,
      duration,
      rate,
      billingCode: selectedActivity,
      billable,
      activity: ACTIVITY_CODES.find(a => a.code === selectedActivity)?.description || '',
      notes: formData.get('notes') as string,
      aiAssisted: useAiAssistant
    });
  };

  const totalAmount = duration * rate;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Clock className="h-4 w-4 mr-2" />
          New Time Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Time Entry</DialogTitle>
          <DialogDescription>
            Record your time with smart billing assistance
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Case</Label>
              <Select value={selectedCase} onValueChange={handleCaseChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select case" />
                </SelectTrigger>
                <SelectContent>
                  {cases.map(case_ => (
                    <SelectItem key={case_.id} value={case_.id}>
                      {case_.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Activity Code</Label>
              <Input
                type="text"
                placeholder="Search codes..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="w-[200px]"
              />
            </div>
            <ScrollArea className="h-[150px] border rounded-md">
              <div className="p-4 space-y-2">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.code}
                    className={cn(
                      'p-2 rounded-md cursor-pointer hover:bg-accent',
                      selectedActivity === activity.code && 'bg-accent'
                    )}
                    onClick={() => setSelectedActivity(activity.code)}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{activity.code}</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <div className="relative">
              <Textarea
                name="description"
                placeholder="Describe your work..."
                className="min-h-[100px]"
              />
              {useAiAssistant && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => simulateAiAnalysis('')}
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes (Internal)</Label>
            <Textarea
              name="notes"
              placeholder="Add any internal notes..."
              className="min-h-[60px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration (hours)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  min={0.25}
                  max={8}
                  step={0.25}
                  value={[duration]}
                  onValueChange={([value]) => setDuration(value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={0.25}
                  step={0.25}
                  className="w-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rate (€/hour)</Label>
              <Input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                min={0}
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={billable}
                onCheckedChange={setBillable}
              />
              <Label>Billable Time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={useAiAssistant}
                onCheckedChange={setUseAiAssistant}
              />
              <Label>AI Assistant</Label>
            </div>
          </div>

          {aiSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Suggestions
                </h4>
                <Badge variant="outline">
                  {aiSuggestions.confidence * 100}% confidence
                </Badge>
              </div>
              {aiSuggestions.warnings.length > 0 && (
                <div className="flex items-center gap-2 text-yellow-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{aiSuggestions.warnings[0]}</span>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Similar past entries found:
                </p>
                {aiSuggestions.similarEntries.map((entry: any, i: number) => (
                  <div key={i} className="text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    {entry.description} ({entry.duration}h)
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="font-medium">
              Total Amount: €{(totalAmount).toFixed(2)}
            </div>
            <Button type="submit">Save Entry</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}