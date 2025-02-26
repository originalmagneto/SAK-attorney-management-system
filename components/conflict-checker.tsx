'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  AlertTriangle,
  Search,
  Users,
  Building,
  FileText,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Scale,
  Loader2,
} from 'lucide-react';

interface ConflictResult {
  id: string;
  type: 'direct' | 'potential' | 'clear';
  severity: 'high' | 'medium' | 'low';
  entity: {
    name: string;
    type: 'client' | 'party' | 'company' | 'individual';
    relationship: string;
  };
  description: string;
  relatedCases?: Array<{
    id: string;
    title: string;
    date: string;
  }>;
  suggestedAction?: string;
  confidence: number;
}

interface ConflictCheckerProps {
  caseData: {
    parties: string[];
    entities: string[];
    description: string;
  };
  onConflictFound?: (conflicts: ConflictResult[]) => void;
}

export function ConflictChecker({ caseData, onConflictFound }: ConflictCheckerProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [conflicts, setConflicts] = useState<ConflictResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const runConflictCheck = async () => {
    setIsChecking(true);
    setProgress(0);

    // Simulate AI-powered conflict analysis
    const steps = [
      'Analyzing parties and entities...',
      'Checking historical cases...',
      'Reviewing relationships...',
      'Assessing potential conflicts...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setProgress(((i + 1) / steps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Simulate finding conflicts
    const results: ConflictResult[] = [
      {
        id: '1',
        type: 'direct',
        severity: 'high',
        entity: {
          name: 'Tech Corp International',
          type: 'company',
          relationship: 'Former Client',
        },
        description: 'Previously represented in similar matter within the last 2 years',
        relatedCases: [
          { id: 'CASE-2023-001', title: 'Tech Corp v. Innovation LLC', date: '2023-06-15' },
        ],
        suggestedAction: 'Obtain client waiver or decline representation',
        confidence: 95,
      },
      {
        id: '2',
        type: 'potential',
        severity: 'medium',
        entity: {
          name: 'John Anderson',
          type: 'individual',
          relationship: 'Related Party',
        },
        description: 'Board member of opposing party in current case',
        suggestedAction: 'Further review recommended',
        confidence: 75,
      },
    ];

    setConflicts(results);
    setIsChecking(false);
    onConflictFound?.(results);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'company':
        return <Building className="h-4 w-4" />;
      case 'individual':
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredConflicts = conflicts.filter(conflict =>
    conflict.entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conflict.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">Conflict Check</h3>
          <p className="text-sm text-muted-foreground">
            AI-powered analysis to identify potential conflicts of interest
          </p>
        </div>
        <Button
          onClick={runConflictCheck}
          disabled={isChecking}
          className="gap-2"
        >
          {isChecking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Scale className="h-4 w-4" />
              Run Check
            </>
          )}
        </Button>
      </div>

      {isChecking && (
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Brain className="h-5 w-5 text-primary animate-pulse" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Analyzing conflicts...</p>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </div>
          </div>
        </Card>
      )}

      {conflicts.length > 0 && (
        <>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conflicts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline" className="whitespace-nowrap">
              {conflicts.length} conflicts found
            </Badge>
          </div>

          <ScrollArea className="h-[400px]">
            <AnimatePresence>
              {filteredConflicts.map((conflict, index) => (
                <motion.div
                  key={conflict.id}
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
                          {conflict.type === 'direct' ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : conflict.type === 'potential' ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          <div className="flex items-center gap-2">
                            {getEntityIcon(conflict.entity.type)}
                            <span className="font-medium">{conflict.entity.name}</span>
                          </div>
                          <Badge variant="outline">{conflict.entity.relationship}</Badge>
                          <Badge className={getSeverityColor(conflict.severity)}>
                            {conflict.severity.toUpperCase()} Risk
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {conflict.description}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {conflict.confidence}% confident
                      </Badge>
                    </div>

                    {conflict.relatedCases && (
                      <div className="mt-4 pt-4 border-t space-y-2">
                        <p className="text-sm font-medium">Related Cases:</p>
                        {conflict.relatedCases.map((case_) => (
                          <div
                            key={case_.id}
                            className="flex items-center justify-between p-2 text-sm rounded-md bg-accent"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>{case_.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{case_.date}</Badge>
                              <Button variant="ghost" size="icon">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {conflict.suggestedAction && (
                      <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <div className="flex items-start gap-2">
                          <Brain className="h-4 w-4 text-primary mt-1" />
                          <div>
                            <p className="text-sm font-medium">Suggested Action</p>
                            <p className="text-sm text-muted-foreground">
                              {conflict.suggestedAction}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </>
      )}
    </div>
  );
}