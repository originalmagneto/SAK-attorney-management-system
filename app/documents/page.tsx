'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Filter,
  Upload,
  FolderOpen,
  FileText,
  MoreVertical,
  Download,
  File,
  Clock,
  Users,
  LayoutGrid,
  LayoutList,
  FileImage,
  FilePdf,
  FileCode,
  Share2,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const documents = [
  {
    id: 1,
    name: 'Contract_Draft_v2.docx',
    case: 'Tech Corp Contract Review',
    type: 'Contract',
    lastModified: '2024-03-27',
    size: '2.4 MB',
    status: 'Draft',
    preview: '/images/document-preview.png',
    icon: FileText,
    sharedWith: ['John D.', 'Sarah M.'],
    progress: 65
  },
  {
    id: 2,
    name: 'Court_Filing_Smith.pdf',
    case: 'Smith vs. Johnson',
    type: 'Legal Filing',
    lastModified: '2024-03-26',
    size: '1.8 MB',
    status: 'Final',
    preview: '/images/pdf-preview.png',
    icon: FilePdf,
    sharedWith: ['Legal Team'],
    progress: 100
  },
  {
    id: 3,
    name: 'Estate_Plan_Brown.pdf',
    case: 'Estate Planning - Brown Family',
    type: 'Estate Document',
    lastModified: '2024-03-25',
    size: '3.1 MB',
    status: 'Under Review',
    preview: '/images/pdf-preview.png',
    icon: FilePdf,
    sharedWith: ['Brown Family', 'Tax Advisor'],
    progress: 80
  },
];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [view, setView] = useState('grid');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize case documents
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            <FolderOpen className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <File className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Documents
              </p>
              <h2 className="text-2xl font-bold">287</h2>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Recent Updates
              </p>
              <h2 className="text-2xl font-bold">12</h2>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Shared With
              </p>
              <h2 className="text-2xl font-bold">8</h2>
              <p className="text-xs text-muted-foreground">External users</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-[300px]"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="contract">Contracts</SelectItem>
              <SelectItem value="filing">Legal Filings</SelectItem>
              <SelectItem value="estate">Estate Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-4">
          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="grid">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="list">
                <LayoutList className="h-4 w-4 mr-2" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline">
            <FolderOpen className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {view === 'list' ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell>{doc.case}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.lastModified}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === 'Final'
                          ? 'bg-green-100 text-green-800'
                          : doc.status === 'Draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="overflow-hidden">
              <div className="p-4 bg-accent/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-lg">
                      <doc.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium truncate" title={doc.name}>
                        {doc.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {doc.case}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <Progress value={doc.progress} className="h-1" />
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge 
                    variant={doc.status === 'Final' ? 'default' : 
                           doc.status === 'Draft' ? 'secondary' : 'outline'}
                  >
                    {doc.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last modified</span>
                  <span>{doc.lastModified}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Size</span>
                  <span>{doc.size}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    Shared with {doc.sharedWith.join(', ')}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}