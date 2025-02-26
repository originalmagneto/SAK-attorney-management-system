'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Clock,
  AlertTriangle,
  Brain,
  FileText,
  ChevronRight,
  Bell,
  CalendarClock,
} from 'lucide-react';

interface DeadlineInfo {
  id: string;
  type: string;
  description: string;
  dueDate: string;
  timeRemaining: {
    years: number;
    months: number;
    days: number;
  };
  statute: {
    name: string;
    jurisdiction: string;
    citation: string;
  };
  riskLevel: 'high' | 'medium' | 'low';
  confidence: number;
  relatedDocuments?: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  aiNotes?: string;
}

interface SOLTrackerProps {
  caseType: string;
  jurisdiction: string;
  incidentDate: string;
  onDeadlineIdentified?: (deadlines: DeadlineInfo[]) => void;
}

export function SOLTracker({
  caseType,
  jurisdiction,
  incidentDate,
  onDeadlineIdentified,
}: SOLTrackerProps) {
  const [deadlines, setDeadlines] = useState<DeadlineInfo[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const analyzeDeadlines = async () => {
    setIsAnalyzing(true);
    setProgress(0);

    // Simulate AI analysis of deadlines
    const steps = [
      'Analyzing case type and jurisdiction...',
      'Calculating statutory deadlines...',
      'Checking exceptions and tolling...',
      'Assessing risk factors...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setProgress(((i + 1) / steps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Simulate identified deadlines
    const results: DeadlineInfo[] = [
      {
        id: '1',
        type: 'Statute of Limitations',
        description: 'General negligence claim filing deadline',
        dueDate: '2025-03-15',
        timeRemaining: {
          years: 1,
          months: 2,
          days: 15,
        },
        statute: {
          name: 'Personal Injury Statute of Limitations',
          jurisdiction: 'California',
          citation: 'Cal. Code Civ. Proc. § 335.1',
        },
        riskLevel: 'high',
        confidence: 95,
        aiNotes: 'No tolling events identified. Standard two-year period applies.',
      },
      {
        id: '2',
        type: 'Notice Requirement',
        description: 'Required notice to governmental entity',
        dueDate: '2024-05-01',
        timeRemaining: {
          years: 0,
          months: 2,
          days: 1,
        },
        statute: {
          name: 'Government Claims Act',
          jurisdiction: 'California',
          citation: 'Cal. Gov. Code § 911.2',
        },
        riskLevel: 'high',
        confidence: 90,
        aiNotes: 'Strict 6-month notice requirement. No exceptions typically allowed.',
      },
    ];

    setDeadlines(results);
    setIsAnalyzing(false);
    onDeadlineIdentified?.(results);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">Deadline Tracker</h3>
          <p className="text-sm text-muted-foreground">
            AI-powered deadline analysis and risk assessment
          </p>
        </div>
        <Button
          onClick={analyzeDeadlines}
          disabled={isAnalyzing}
          className="gap-2"
        >
          {isAnalyzing ? (
            <>
              <Clock className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <CalendarClock className="h-4 w-4" />
              Analyze Deadlines
            </>
          )}
        </Button>
      </div>

      {isAnalyzing && (
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Analyzing deadlines...</p>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </div>
        </Card>
      )}

      <ScrollArea className="h-[400px]">
        <AnimatePresence>
          {deadlines.map((deadline, index) => (
            <motion.div
              key={deadline.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-4 w-4 ${
                        deadline.riskLevel === 'high' ? 'text-red-500' :
                        deadline.riskLevel === 'medium' ? 'text-yellow-500' :
                        'text-green-500'
                      }`} />
                      <span className="font-medium">{deadline.type}</span>
                      <Badge className={getRiskColor(deadline.riskLevel)}>
                        {deadline.riskLevel.toUpperCase()} Risk
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {deadline.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className="whitespace-nowrap">
                      Due: {deadline.dueDate}
                    </Badge>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Bell className="h-4 w-4" />
                      Set Reminder
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <Card className="p-3 bg-accent">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{deadline.timeRemaining.years}</p>
                      <p className="text-xs text-muted-foreground">Years</p>
                    </div>
                  </Card>
                  <Card className="p-3 bg-accent">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{deadline.timeRemaining.months}</p>
                      <p className="text-xs text-muted-foreground">Months</p>
                    </div>
                  </Card>
                  <Card className="p-3 bg-accent">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{deadline.timeRemaining.days}</p>
                      <p className="text-xs text-muted-foreground">Days</p>
                    </div>
                  </Card>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-accent">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-1" />
                    <div>
                      <p className="text-sm font-medium">{deadline.statute.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {deadline.statute.jurisdiction} - {deadline.statute.citation}
                      </p>
                    </div>
                  </div>
                </div>

                {deadline.aiNotes && (
                  <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-start gap-2">
                      <Brain className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="text-sm font-medium">AI Analysis</p>
                        <p className="text-sm text-muted-foreground">
                          {deadline.aiNotes}
                        </p>
                        <div className="mt-2">
                          <Badge variant="secondary">
                            {deadline.confidence}% confident
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {deadline.relatedDocuments && deadline.relatedDocuments.length > 0 && (
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <p className="text-sm font-medium">Related Documents:</p>
                    {deadline.relatedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 text-sm rounded-md bg-accent"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{doc.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{doc.type}</Badge>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}