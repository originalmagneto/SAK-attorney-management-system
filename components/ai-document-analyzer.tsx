'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertCircle,
  CheckCircle2,
  Upload,
  File,
  FileText,
  Sparkles,
  Search,
  Edit,
  AlertTriangle,
  Scale,
  BookOpen,
  Building2,
  CalendarClock,
  ScrollText,
  Users,
} from 'lucide-react';

interface AIDocumentAnalyzerProps {
  caseId: string;
  documents: File[];
  onAnalysisComplete?: (results: any) => void;
}

interface AnalysisResult {
  documentType: string;
  keyFindings: Array<{
    type: string;
    content: string;
    importance: 'high' | 'medium' | 'low';
    category: string;
  }>;
  parties: Array<{
    name: string;
    role: string;
    mentions: number;
  }>;
  dates: Array<{
    date: string;
    description: string;
    type: 'deadline' | 'event' | 'reference';
  }>;
  legalCitations: Array<{
    citation: string;
    relevance: string;
    support: 'positive' | 'negative' | 'neutral';
  }>;
  risks: Array<{
    description: string;
    severity: 'high' | 'medium' | 'low';
    recommendation: string;
  }>;
  metadata: {
    wordCount: number;
    pageCount: number;
    documentDate?: string;
    jurisdiction?: string;
    confidentialityLevel: string;
  };
}

export function AIDocumentAnalyzer({
  caseId,
  documents = [],
  onAnalysisComplete
}: AIDocumentAnalyzerProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(documents);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('upload');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [selectedTab, setSelectedTab] = useState('summary');
  const [useAdvancedAnalysis, setUseAdvancedAnalysis] = useState(true);

  // Example analysis result
  const mockAnalysisResult: AnalysisResult = {
    documentType: 'Legal Motion',
    keyFindings: [
      {
        type: 'Legal Argument',
        content: 'Defendant claims lack of personal jurisdiction',
        importance: 'high',
        category: 'Jurisdiction'
      },
      {
        type: 'Factual Statement',
        content: 'Business transactions occurred in multiple states',
        importance: 'medium',
        category: 'Facts'
      }
    ],
    parties: [
      {
        name: 'Tech Corp',
        role: 'Plaintiff',
        mentions: 15
      },
      {
        name: 'John Smith',
        role: 'Defendant',
        mentions: 12
      }
    ],
    dates: [
      {
        date: '2024-04-15',
        description: 'Response deadline',
        type: 'deadline'
      },
      {
        date: '2024-03-01',
        description: 'Contract execution date',
        type: 'reference'
      }
    ],
    legalCitations: [
      {
        citation: 'Smith v. Jones, 123 F.3d 456 (2023)',
        relevance: 'Supports personal jurisdiction argument',
        support: 'positive'
      }
    ],
    risks: [
      {
        description: 'Possible statute of limitations issue',
        severity: 'high',
        recommendation: 'Review filing deadlines and consider tolling arguments'
      }
    ],
    metadata: {
      wordCount: 2450,
      pageCount: 8,
      documentDate: '2024-03-27',
      jurisdiction: 'Federal District Court',
      confidentialityLevel: 'Confidential'
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const simulateAnalysis = async () => {
    setAnalyzing(true);
    setCurrentStep('analyzing');

    // Simulate analysis progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(i);
    }

    setAnalysisResults(mockAnalysisResult);
    setCurrentStep('results');
    setAnalyzing(false);
    onAnalysisComplete?.(mockAnalysisResult);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {currentStep === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="p-6 border-dashed border-2">
              <div className="flex flex-col items-center justify-center gap-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <h3 className="font-medium">Upload Documents</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your documents here or click to browse
                  </p>
                </div>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Browse Files
                  </Button>
                </label>
              </div>
            </Card>

            {uploadedFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Uploaded Files</h4>
                  <Button onClick={() => simulateAnalysis()}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze Documents
                  </Button>
                </div>
                <Card>
                  <ScrollArea className="h-[200px]">
                    <div className="p-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg border"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <Badge variant="outline">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">Analysis Settings</div>
                      <p className="text-sm text-muted-foreground">
                        Configure document analysis options
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="advanced-analysis">Advanced Analysis</Label>
                      <Switch
                        id="advanced-analysis"
                        checked={useAdvancedAnalysis}
                        onCheckedChange={setUseAdvancedAnalysis}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        )}

        {currentStep === 'analyzing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="p-6">
              <div className="space-y-4 text-center">
                <Sparkles className="h-8 w-8 mx-auto text-primary animate-pulse" />
                <div>
                  <h3 className="font-medium">Analyzing Documents</h3>
                  <p className="text-sm text-muted-foreground">
                    Using AI to process and analyze your documents
                  </p>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  {progress}% complete
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {currentStep === 'results' && analysisResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="parties">Parties</TabsTrigger>
                <TabsTrigger value="dates">Key Dates</TabsTrigger>
                <TabsTrigger value="citations">Citations</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <Card className="p-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <ScrollText className="h-4 w-4 text-muted-foreground" />
                        Document Type
                      </h4>
                      <p className="text-sm mt-1">{analysisResults.documentType}</p>
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        Jurisdiction
                      </h4>
                      <p className="text-sm mt-1">{analysisResults.metadata.jurisdiction}</p>
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        Document Date
                      </h4>
                      <p className="text-sm mt-1">{analysisResults.metadata.documentDate}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="font-medium mb-4">Key Findings</h4>
                  <div className="space-y-4">
                    {analysisResults.keyFindings.map((finding, index) => (
                      <div key={index} className="p-4 rounded-lg border">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant={
                              finding.importance === 'high' ? 'destructive' :
                              finding.importance === 'medium' ? 'default' :
                              'secondary'
                            }>
                              {finding.type}
                            </Badge>
                            <p className="mt-2">{finding.content}</p>
                          </div>
                          <Badge variant="outline">{finding.category}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="parties">
                <Card className="p-6">
                  <div className="space-y-6">
                    {analysisResults.parties.map((party, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <div className="font-medium">{party.name}</div>
                          <Badge variant="outline" className="mt-1">
                            {party.role}
                          </Badge>
                        </div>
                        <Badge>
                          {party.mentions} mentions
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="dates">
                <Card className="p-6">
                  <div className="space-y-4">
                    {analysisResults.dates.map((date, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <div className="font-medium">{date.date}</div>
                          <p className="text-sm text-muted-foreground">
                            {date.description}
                          </p>
                        </div>
                        <Badge variant={
                          date.type === 'deadline' ? 'destructive' :
                          date.type === 'event' ? 'default' :
                          'secondary'
                        }>
                          {date.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="citations">
                <Card className="p-6">
                  <div className="space-y-4">
                    {analysisResults.legalCitations.map((citation, index) => (
                      <div key={index} className="p-4 rounded-lg border">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{citation.citation}</div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {citation.relevance}
                            </p>
                          </div>
                          <Badge variant={
                            citation.support === 'positive' ? 'default' :
                            citation.support === 'negative' ? 'destructive' :
                            'secondary'
                          }>
                            {citation.support}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="risks">
                <Card className="p-6">
                  <div className="space-y-4">
                    {analysisResults.risks.map((risk, index) => (
                      <div key={index} className="p-4 rounded-lg border">
                        <div className="flex items-start gap-4">
                          <AlertTriangle className={
                            risk.severity === 'high' ? 'text-red-500' :
                            risk.severity === 'medium' ? 'text-yellow-500' :
                            'text-blue-500'
                          } />
                          <div className="flex-1">
                            <div className="font-medium">{risk.description}</div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {risk.recommendation}
                            </p>
                          </div>
                          <Badge variant={
                            risk.severity === 'high' ? 'destructive' :
                            risk.severity === 'medium' ? 'default' :
                            'secondary'
                          }>
                            {risk.severity} risk
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}