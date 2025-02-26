'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowRight,
  FileText,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Bot,
  Sparkles,
  Upload,
  Scale,
  Building,
  Users,
  Flag,
  Mail,
  Phone,
  MapPin,
  Globe,
  LinkIcon,
  Tags
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
    type: '',
    location: '',
    website: '',
    description: '',
    legalStructure: '',
    industry: '',
    tags: [] as string[],
    hasConflicts: false,
    notes: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState({
    conflictCheck: null as any,
    suggestedTeam: [] as string[],
    riskLevel: '',
    suggestedPracticeAreas: [] as string[],
    insights: [] as string[]
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'basic',
      title: 'Basic Info',
      description: 'Enter client details',
      isCompleted: Boolean(clientData.name && clientData.email),
      isProcessing: false
    },
    {
      id: 'business',
      title: 'Business Info',
      description: 'Business structure & industry',
      isCompleted: Boolean(clientData.type && clientData.industry),
      isProcessing: false
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Upload relevant documents',
      isCompleted: uploadedFiles.length > 0,
      isProcessing: false
    },
    {
      id: 'analysis',
      title: 'AI Analysis',
      description: 'Review AI insights',
      isCompleted: aiAnalysis.insights.length > 0,
      isProcessing: isAnalyzing
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setAiAnalysis({
        conflictCheck: {
          hasConflicts: false,
          details: 'No potential conflicts found in current cases'
        },
        suggestedTeam: ['Jane Smith', 'Robert Wilson'],
        riskLevel: 'Low',
        suggestedPracticeAreas: ['Corporate Law', 'Intellectual Property'],
        insights: [
          'Client operates in a highly regulated industry',
          'Similar case patterns found in previous matters',
          'Regular compliance reviews recommended',
          'Potential for long-term relationship based on business growth trajectory'
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="relative">
        <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center" style={{ width: '25%' }}>
              <motion.div
                initial={false}
                animate={{
                  scale: index === currentStep ? [1, 1.1, 1] : 1,
                  backgroundColor: index <= currentStep ? 'var(--primary)' : 'var(--muted)'
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              >
                {step.isCompleted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
              <span className="text-xs mt-1.5 text-muted-foreground font-medium">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input
                  placeholder="Enter full name"
                  value={clientData.name}
                  onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  placeholder="Enter company name"
                  value={clientData.company}
                  onChange={(e) => setClientData({ ...clientData, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={clientData.email}
                  onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="Enter phone number"
                  value={clientData.phone}
                  onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="City, Country"
                  value={clientData.location}
                  onChange={(e) => setClientData({ ...clientData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  placeholder="https://example.com"
                  value={clientData.website}
                  onChange={(e) => setClientData({ ...clientData, website: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client Type</Label>
                <Select
                  value={clientData.type}
                  onValueChange={(value) => setClientData({ ...clientData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="non-profit">Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Legal Structure</Label>
                <Select
                  value={clientData.legalStructure}
                  onValueChange={(value) => setClientData({ ...clientData, legalStructure: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select structure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole-prop">Sole Proprietorship</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Industry</Label>
                <Input
                  placeholder="e.g. Technology, Healthcare, etc."
                  value={clientData.industry}
                  onChange={(e) => setClientData({ ...clientData, industry: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Business Description</Label>
                <Textarea
                  placeholder="Brief description of the client's business..."
                  value={clientData.description}
                  onChange={(e) => setClientData({ ...clientData, description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <Card className="p-6 border-dashed">
              <div className="flex flex-col items-center justify-center text-center">
                <Upload className="h-8 w-8 mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-1">Upload Documents</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop files here or click to browse
                </p>
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Choose Files
                </Label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </Card>
            
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Uploaded Files</h4>
                <ScrollArea className="h-[120px] rounded-md border">
                  <div className="p-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">{file.name}</span>
                        </div>
                        <Badge variant="secondary">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-8 w-8 text-primary" />
                </motion.div>
                <p className="text-sm text-muted-foreground mt-4">
                  Analyzing client data and documents...
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Scale className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium">Conflict Check</h3>
                    </div>
                    {aiAnalysis.conflictCheck && (
                      <div className="flex items-center gap-2">
                        {aiAnalysis.conflictCheck.hasConflicts ? (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-sm">{aiAnalysis.conflictCheck.details}</span>
                      </div>
                    )}
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Suggested Team</h3>
                    </div>
                    <div className="space-y-2">
                      {aiAnalysis.suggestedTeam.map((member, index) => (
                        <div key={index} className="text-sm flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {member}
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-4 col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-medium">AI Insights</h3>
                    </div>
                    <div className="space-y-3">
                      {aiAnalysis.insights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Bot className="h-4 w-4 text-primary mt-0.5" />
                          <span className="text-sm">{insight}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            if (currentStep === 2 && uploadedFiles.length > 0) {
              runAIAnalysis();
            }
            if (currentStep < steps.length - 1) {
              setCurrentStep(currentStep + 1);
            }
          }}
        >
          {currentStep === steps.length - 1 ? 'Complete' : 'Continue'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}