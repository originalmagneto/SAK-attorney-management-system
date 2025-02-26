'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  History,
  GitBranch,
  GitMerge,
  Download,
  Eye,
  ArrowLeftRight,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  FileText,
  Users,
} from 'lucide-react';

interface DocumentVersion {
  id: string;
  version: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  changes: string;
  status: 'current' | 'archived' | 'superseded';
  reviewStatus: 'pending' | 'approved' | 'rejected';
  reviewers?: Array<{
    name: string;
    avatar: string;
    status: 'pending' | 'approved' | 'rejected';
    comments?: string;
  }>;
  metadata: {
    wordCount?: number;
    changedSections?: string[];
    significance?: 'minor' | 'major';
    relatedDocuments?: string[];
  };
}

interface DocumentVersionControlProps {
  documentId: string;
  currentVersion: string;
  versions: DocumentVersion[];
  onVersionSelect?: (version: string) => void;
  onCompare?: (version1: string, version2: string) => void;
  onDownload?: (version: string) => void;
}

// Example data
const mockVersions: DocumentVersion[] = [
  {
    id: '1',
    version: '1.2',
    date: '2024-03-27',
    author: {
      name: 'Jane Smith',
      avatar: '/images/avatars/avatar-1.png'
    },
    changes: 'Updated section 3.2 with new terms',
    status: 'current',
    reviewStatus: 'approved',
    reviewers: [
      {
        name: 'Mike Wilson',
        avatar: '/images/avatars/avatar-2.png',
        status: 'approved',
        comments: 'Approved with minor suggestions'
      }
    ],
    metadata: {
      wordCount: 2450,
      changedSections: ['Section 3.2', 'Section 4.1'],
      significance: 'major',
      relatedDocuments: ['Supporting Exhibit A']
    }
  },
  {
    id: '2',
    version: '1.1',
    date: '2024-03-25',
    author: {
      name: 'John Doe',
      avatar: '/images/avatars/avatar-3.png'
    },
    changes: 'Initial draft review changes',
    status: 'archived',
    reviewStatus: 'approved',
    metadata: {
      wordCount: 2300,
      changedSections: ['Section 1', 'Section 2'],
      significance: 'minor'
    }
  }
];

export function DocumentVersionControl({
  documentId,
  currentVersion,
  versions = mockVersions,
  onVersionSelect,
  onCompare,
  onDownload
}: DocumentVersionControlProps) {
  const [selectedVersion, setSelectedVersion] = useState<string>(currentVersion);
  const [compareVersion, setCompareVersion] = useState<string>('');
  const [showDiff, setShowDiff] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Version History</h3>
          <p className="text-sm text-muted-foreground">
            Track and manage document versions
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedVersion}
            onValueChange={setSelectedVersion}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              {versions.map((v) => (
                <SelectItem key={v.id} value={v.version}>
                  Version {v.version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Compare
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Compare Versions</DialogTitle>
                <DialogDescription>
                  Select two versions to compare changes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Version 1</label>
                    <Select
                      value={selectedVersion}
                      onValueChange={setSelectedVersion}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        {versions.map((v) => (
                          <SelectItem key={v.id} value={v.version}>
                            Version {v.version}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium">Version 2</label>
                    <Select
                      value={compareVersion}
                      onValueChange={setCompareVersion}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        {versions.map((v) => (
                          <SelectItem key={v.id} value={v.version}>
                            Version {v.version}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => {
                    onCompare?.(selectedVersion, compareVersion);
                    setShowDiff(true);
                  }}
                >
                  Compare Versions
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Changes</TableHead>
              <TableHead>Review Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((version) => (
              <TableRow key={version.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">v{version.version}</div>
                      <Badge variant={
                        version.status === 'current' ? 'default' :
                        version.status === 'archived' ? 'secondary' :
                        'outline'
                      }>
                        {version.status}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {version.date}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={version.author.avatar} />
                      <AvatarFallback>{version.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{version.author.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[300px]">
                    <p className="text-sm truncate">{version.changes}</p>
                    {version.metadata.significance && (
                      <Badge variant={version.metadata.significance === 'major' ? 'default' : 'secondary'}>
                        {version.metadata.significance} changes
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {version.reviewStatus === 'approved' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : version.reviewStatus === 'rejected' ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="capitalize">{version.reviewStatus}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onVersionSelect?.(version.version)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDownload?.(version.version)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {version?.reviewers && (
        <Card className="p-4">
          <h4 className="font-medium mb-4">Review History</h4>
          <div className="space-y-4">
            {version.reviewers.map((reviewer, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-lg border">
                <Avatar>
                  <AvatarImage src={reviewer.avatar} />
                  <AvatarFallback>{reviewer.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{reviewer.name}</div>
                    <Badge variant={
                      reviewer.status === 'approved' ? 'default' :
                      reviewer.status === 'rejected' ? 'destructive' :
                      'secondary'
                    }>
                      {reviewer.status}
                    </Badge>
                  </div>
                  {reviewer.comments && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {reviewer.comments}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}