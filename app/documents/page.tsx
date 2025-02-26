'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentVersionControl } from '@/components/document-version-control';
import { AIDocumentAnalyzer } from '@/components/ai-document-analyzer';
import {
  FileText,
  FolderTree,
  Search,
  Upload,
  Clock,
  Star,
  History,
  Users,
  Briefcase,
  FileIcon,
  FolderIcon,
  ChevronRight,
  Settings,
  Grid2X2,
  List
} from 'lucide-react';
import { useUIStore } from '@/lib/store';

interface ClientFolder {
  id: string;
  name: string;
  avatar?: string;
  totalDocuments: number;
  recentlyModified: string;
  folders: {
    id: string;
    name: string;
    type: 'case' | 'category';
    documents: number;
    status?: string;
  }[];
}

const clientFolders: ClientFolder[] = [
  {
    id: 'client-1',
    name: 'Tech Corp',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&auto=format&fit=crop',
    totalDocuments: 156,
    recentlyModified: '2024-04-15',
    folders: [
      { id: 'case-1', name: 'Patent Litigation', type: 'case', documents: 45, status: 'active' },
      { id: 'case-2', name: 'Corporate', type: 'case', documents: 32, status: 'active' },
      { id: 'cat-1', name: 'Contracts', type: 'category', documents: 28 },
      { id: 'cat-2', name: 'IP Portfolio', type: 'category', documents: 51 }
    ]
  },
  {
    id: 'client-2',
    name: 'Smith Industries',
    avatar: 'https://images.unsplash.com/photo-1523287562758-66c7fc58967f?q=80&w=256&h=256&auto=format&fit=crop',
    totalDocuments: 89,
    recentlyModified: '2024-04-14',
    folders: [
      { id: 'case-3', name: 'Employment Case', type: 'case', documents: 35, status: 'active' },
      { id: 'cat-3', name: 'HR Documents', type: 'category', documents: 24 },
      { id: 'cat-4', name: 'Compliance', type: 'category', documents: 30 }
    ]
  },
  // Add more clients...
];

const recentDocuments = [
  {
    id: 'doc-1',
    name: 'Patent Filing Brief.docx',
    client: 'Tech Corp',
    case: 'Patent Litigation',
    modifiedAt: '2024-04-15T14:30:00',
    modifiedBy: 'Sarah Johnson',
    status: 'final'
  },
  {
    id: 'doc-2',
    name: 'Settlement Agreement Draft.docx',
    client: 'Smith Industries',
    case: 'Employment Case',
    modifiedAt: '2024-04-15T11:20:00',
    modifiedBy: 'Mark Wilson',
    status: 'draft'
  },
  // Add more recent documents...
];

const starredDocuments = [
  {
    id: 'doc-3',
    name: 'Master Services Agreement.docx',
    client: 'Tech Corp',
    case: 'Corporate',
    modifiedAt: '2024-04-14T16:45:00',
    modifiedBy: 'Sarah Johnson',
    status: 'final'
  },
  // Add more starred documents...
];

export default function DocumentsPage() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { lastVisitedClient, setLastVisitedClient } = useUIStore();

  // Initialize with last visited client if available
  useState(() => {
    if (lastVisitedClient) {
      setSelectedClient(lastVisitedClient);
    }
  });

  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
    setLastVisitedClient(clientId);
    setSelectedFolder(null);
  };

  return (
    <div className="p-8">
      <div className="max-w-[1800px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="text-muted-foreground mt-1">
              Manage and organize your legal documents
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => {}}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
            <Button variant="outline" onClick={() => {}}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {!selectedClient ? (
          <div className="space-y-8">
            {/* Quick Access */}
            <Card className="p-6">
              <Tabs defaultValue="recent" className="space-y-6">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="recent">
                      <Clock className="h-4 w-4 mr-2" />
                      Recent
                    </TabsTrigger>
                    <TabsTrigger value="starred">
                      <Star className="h-4 w-4 mr-2" />
                      Starred
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid2X2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <TabsContent value="recent" className="m-0">
                  <div className={`grid gap-4 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                      : 'grid-cols-1'
                  }`}>
                    {recentDocuments.map(doc => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="starred" className="m-0">
                  <div className={`grid gap-4 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                      : 'grid-cols-1'
                  }`}>
                    {starredDocuments.map(doc => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Client Folders */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {clientFolders.map(client => (
                <Card
                  key={client.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleClientSelect(client.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                        {client.avatar ? (
                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Users className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{client.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {client.totalDocuments} documents
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="mt-4 space-y-2">
                    {client.folders.slice(0, 2).map(folder => (
                      <div
                        key={folder.id}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        {folder.type === 'case' ? (
                          <Briefcase className="h-4 w-4" />
                        ) : (
                          <FolderTree className="h-4 w-4" />
                        )}
                        <span>{folder.name}</span>
                        {folder.status && (
                          <Badge
                            variant={folder.status === 'active' ? 'default' : 'secondary'}
                            className="ml-auto text-xs"
                          >
                            {folder.status}
                          </Badge>
                        )}
                      </div>
                    ))}
                    {client.folders.length > 2 && (
                      <p className="text-sm text-muted-foreground">
                        +{client.folders.length - 2} more folders
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Last modified {new Date(client.recentlyModified).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <ClientView
            client={clientFolders.find(c => c.id === selectedClient)!}
            selectedFolder={selectedFolder}
            onFolderSelect={setSelectedFolder}
            onBack={() => {
              setSelectedClient(null);
              setSelectedFolder(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function DocumentCard({ document, viewMode }: { document: any; viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-4 hover:bg-accent rounded-lg">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{document.name}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{document.client}</span>
            <span>•</span>
            <span>{document.case}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm">{new Date(document.modifiedAt).toLocaleDateString()}</div>
          <div className="text-xs text-muted-foreground">{document.modifiedBy}</div>
        </div>
        <Badge variant={document.status === 'final' ? 'default' : 'secondary'}>
          {document.status}
        </Badge>
      </div>
    );
  }

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{document.name}</h4>
          <div className="mt-1 text-sm text-muted-foreground truncate">
            {document.client} • {document.case}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{new Date(document.modifiedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{document.modifiedBy}</span>
        <Badge variant={document.status === 'final' ? 'default' : 'secondary'}>
          {document.status}
        </Badge>
      </div>
    </Card>
  );
}

function ClientView({ 
  client, 
  selectedFolder,
  onFolderSelect,
  onBack 
}: { 
  client: ClientFolder;
  selectedFolder: string | null;
  onFolderSelect: (id: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack}>
        <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
        Back to Clients
      </Button>

      <div className="flex items-start gap-6">
        {/* Folders Sidebar */}
        <Card className="w-[300px] p-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
              {client.avatar ? (
                <img
                  src={client.avatar}
                  alt={client.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Users className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <h2 className="font-semibold">{client.name}</h2>
              <p className="text-sm text-muted-foreground">
                {client.totalDocuments} documents
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {client.folders.map(folder => (
              <Button
                key={folder.id}
                variant={selectedFolder === folder.id ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => onFolderSelect(folder.id)}
              >
                {folder.type === 'case' ? (
                  <Briefcase className="h-4 w-4 mr-2" />
                ) : (
                  <FolderTree className="h-4 w-4 mr-2" />
                )}
                <span className="truncate">{folder.name}</span>
                {folder.status && (
                  <Badge
                    variant={folder.status === 'active' ? 'default' : 'secondary'}
                    className="ml-auto"
                  >
                    {folder.status}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </Card>

        {/* Main Content */}
        <Card className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {selectedFolder 
                ? client.folders.find(f => f.id === selectedFolder)?.name 
                : 'All Documents'}
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-9 w-[300px]"
                />
              </div>
              <Button variant="outline">
                <History className="h-4 w-4 mr-2" />
                Version History
              </Button>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          {/* Document grid/list will go here */}
        </Card>
      </div>
    </div>
  );
}