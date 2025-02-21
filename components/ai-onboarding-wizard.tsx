'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Upload,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  Bot,
  UserPlus,
  FolderTree
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isProcessing: boolean;
}

export function AIOnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [clientData, setClientData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const steps: OnboardingStep[] = [
    {
      id: 'info',
      title: 'Basic Information',
      description: 'Enter client details and initial notes',
      isCompleted: Boolean(clientData.name && clientData.email),
      isProcessing: false,
    },
    {
      id: 'documents',
      title: 'Document Upload',
      description: 'Upload relevant client documents for AI analysis',
      isCompleted: uploadedFiles.length > 0,
      isProcessing: false,
    },
    {
      id: 'analysis',
      title: 'AI Analysis',
      description: 'Analyzing documents and generating suggestions',
      isCompleted: aiSuggestions.length > 0,
      isProcessing: analysisProgress > 0 && analysisProgress < 100,
    },
    {
      id: 'review',
      title: 'Review & Confirm',
      description: 'Review AI suggestions and confirm setup',
      isCompleted: false,
      isProcessing: false,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setClientData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
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
            'Create dedicated case folder structure based on client industry',
            'Schedule initial consultation for next week',
            'Set up automated document reminders',
            'Generate preliminary task checklist'
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
                <div className="relative group">
                  <Input
                    name="name"
                    placeholder="Client Name"
                    value={clientData.name}
                    onChange={handleInputChange}
                    className="transition-all duration-200 hover:shadow-sm focus:shadow-md"
                    aria-label="Client Name"
                  />
                  <div className="absolute -top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs bg-background shadow-sm rounded-md px-2 py-1 pointer-events-none">
                    Name used in auto-generated documents
                  </div>
                </div>
              </div>
              <div>
                <Input
                  name="company"
                  placeholder="Company Name"
                  value={clientData.company}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={clientData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  value={clientData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Textarea
                  name="notes"
                  placeholder="Initial Notes"
                  value={clientData.notes}
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
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drop files here or click to upload
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
                <span className="text-sm font-medium">Analyzing documents</span>
                <span className="text-sm text-muted-foreground">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="transition-all duration-300" />
              <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
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
                      <h3 className="font-semibold">AI Suggestions</h3>
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
                  <h3 className="font-semibold">Client Profile</h3>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{clientData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span>
                    <span>{clientData.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{clientData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{clientData.phone}</span>
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
                    <FolderTree className="h-4 w-4" />
                    <span className="text-sm">Create folder structure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Schedule initial consultation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span className="text-sm">Set up team access</span>
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
            <h2 className="text-2xl font-bold">AI-Assisted Client Onboarding</h2>
            <p className="text-muted-foreground">
              Let our AI help you set up the perfect client workspace
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