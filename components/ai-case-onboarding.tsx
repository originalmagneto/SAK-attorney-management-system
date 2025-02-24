'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowRight,
  Upload,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  Bot,
  Scale,
  Gavel,
  Clock,
  Users
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isProcessing: boolean;
}

interface CaseData {
  title: string;
  type: string;
  jurisdiction: string;
  filingDate: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignedTeam: string[];
}

export function AICaseOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [caseData, setCaseData] = useState<CaseData>({
    title: '',
    type: '',
    jurisdiction: '',
    filingDate: '',
    description: '',
    priority: 'medium',
    assignedTeam: []
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const steps: OnboardingStep[] = [
    {
      id: 'details',
      title: 'Case Details',
      description: 'Enter basic case information',
      isCompleted: Boolean(caseData.title && caseData.type),
      isProcessing: false,
    },
    {
      id: 'documents',
      title: 'Case Documents',
      description: 'Upload relevant case files for AI analysis',
      isCompleted: uploadedFiles.length > 0,
      isProcessing: false,
    },
    {
      id: 'analysis',
      title: 'AI Analysis',
      description: 'Analyzing documents and generating insights',
      isCompleted: aiSuggestions.length > 0,
      isProcessing: analysisProgress > 0 && analysisProgress < 100,
    },
    {
      id: 'review',
      title: 'Review & Setup',
      description: 'Review AI suggestions and confirm case setup',
      isCompleted: false,
      isProcessing: false,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCaseData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCaseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const simulateAIAnalysis = () => {
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAiSuggestions([
            'Identified potential statute of limitations deadline: March 15, 2025',
            'Suggested case classification: Complex Commercial Litigation',
            'Recommended document organization structure based on similar cases',
            'Detected 3 related precedent cases in the database',
            'Generated preliminary timeline of key events and deadlines',
            'Identified potential expert witness requirements'
          ]);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Input
                  name="title"
                  placeholder="Case Title"
                  value={caseData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Select value={caseData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Case Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="civil">Civil Litigation</SelectItem>
                    <SelectItem value="criminal">Criminal Defense</SelectItem>
                    <SelectItem value="corporate">Corporate Law</SelectItem>
                    <SelectItem value="family">Family Law</SelectItem>
                    <SelectItem value="intellectual">Intellectual Property</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  name="jurisdiction"
                  placeholder="Jurisdiction"
                  value={caseData.jurisdiction}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Input
                  name="filingDate"
                  type="date"
                  placeholder="Filing Date"
                  value={caseData.filingDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Select 
                  value={caseData.priority} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => handleSelectChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Textarea
                  name="description"
                  placeholder="Case Description"
                  value={caseData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <Card className="p-4 border-dashed border-2 text-center transition-all duration-300 hover:border-primary hover:bg-accent/5">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="case-file-upload"
              />
              <label htmlFor="case-file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drop case files here or click to upload
                  </p>
                </div>
              </label>
            </Card>
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                    <Badge variant="secondary">{Math.round(file.size / 1024)} KB</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Analyzing case documents</span>
                <span className="text-sm text-muted-foreground">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="transition-all duration-300" />
            </div>

            {analysisProgress === 100 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Analysis Complete</span>
                </div>
                <Card className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">AI Insights</h3>
                    </div>
                    <ul className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-1" />
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Case Overview</h3>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span>{caseData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{caseData.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jurisdiction:</span>
                    <span>{caseData.jurisdiction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Filing Date:</span>
                    <span>{caseData.filingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge variant={caseData.priority === 'high' ? 'destructive' : 
                           caseData.priority === 'medium' ? 'default' : 'secondary'}>
                      {caseData.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Setup Actions</h3>
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    <span className="text-sm">Set up case deadlines and reminders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gavel className="h-4 w-4" />
                    <span className="text-sm">Create case-specific document templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Schedule initial strategy meeting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Assign team members and roles</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 mb-8">
          <Bot className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">AI-Assisted Case Setup</h2>
            <p className="text-muted-foreground">
              Let our AI help you organize and optimize your case workflow
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {steps.map((step, index) => (
            <Card
              key={step.id}
              className={`p-4 transition-all duration-300 ${currentStep === index ? 'border-primary shadow-md scale-105' : 'hover:border-primary/50'}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{step.title}</span>
                  {step.isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {step.isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <ScrollArea className="h-[400px] mb-8">
          {renderStepContent()}
        </ScrollArea>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button
            onClick={() => {
              if (currentStep === 2) {
                simulateAIAnalysis();
              }
              if (currentStep < steps.length - 1) {
                setCurrentStep(prev => prev + 1);
              }
            }}
            disabled={currentStep === 3}
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Continue'}
          </Button>
        </div>
      </div>
    </Card>
  );
}