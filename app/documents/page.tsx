'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
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
  List,
  File,
  FileImage,
  FileSpreadsheet,
  ArrowUpDown,
  ArrowDownAZ,
  Calendar
} from 'lucide-react';
import { useUIStore } from '@/lib/store';
import { Document, Folder, ClientFolder } from '@/types/documents';
import { sampleClientFolders, recentDocuments, starredDocuments } from '@/lib/sample-documents';
import { format } from 'date-fns';

function getFileIcon(type: Document['type']) {
  switch (type) {
    case 'pdf':
      return <FileText className="h-8 w-8 text-red-500" />;
    case 'docx':
      return <File className="h-8 w-8 text-blue-500" />;
    case 'xlsx':
      return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    case 'jpg':
      return <FileImage className="h-8 w-8 text-purple-500" />;
    default:
      return <FileIcon className="h-8 w-8 text-gray-500" />;
  }
}

function formatFileSize(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function DocumentCard({ document, viewMode }: { document: Document & { client?: string; case?: string }; viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-4 hover:bg-accent rounded-lg group">
        {getFileIcon(document.type)}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{document.name}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {document.client && <span>{document.client}</span>}
            {document.case && (
              <>
                <span>•</span>
                <span>{document.case}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm">{format(new Date(document.modifiedAt), 'MMM d, yyyy')}</div>
          <div className="text-xs text-muted-foreground">{formatFileSize(document.size)}</div>
        </div>
        <Badge variant={document.status === 'final' ? 'default' : 'secondary'}>
          {document.status}
        </Badge>
      </div>
    );
  }

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow group">
      <div className="flex flex-col items-center text-center gap-4">
        {getFileIcon(document.type)}
        <div className="space-y-1 w-full">
          <h4 className="font-medium truncate">{document.name}</h4>
          {(document.client || document.case) && (
            <div className="text-sm text-muted-foreground truncate">
              {document.client}
              {document.case && ` • ${document.case}`}
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            {formatFileSize(document.size)}
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {format(new Date(document.modifiedAt), 'MMM d, yyyy')}
        </span>
        <Badge variant={document.status === 'final' ? 'default' : 'secondary'}>
          {document.status}
        </Badge>
      </div>
    </Card>
  );
}

function FolderItem({ folder, level = 0, selectedId, onSelect }: {
  folder: Folder;
  level?: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <Button
        variant={selectedId === folder.id ? 'secondary' : 'ghost'}
        className={cn(
          "w-full justify-start",
          level > 0 && `pl-${4 + level * 4}`
        )}
        onClick={() => onSelect(folder.id)}
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
      
      {folder.subFolders?.map(subFolder => (
        <FolderItem
          key={subFolder.id}
          folder={subFolder}
          level={level + 1}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

function findFolderAndDocuments(clientFolders: ClientFolder[], folderId: string): { folder: Folder; documents: Document[]; breadcrumb: string[] } | null {
  let result: { folder: Folder; documents: Document[]; breadcrumb: string[] } | null = null;

  const searchFolder = (folder: Folder, path: string[] = []): boolean => {
    if (folder.id === folderId) {
      result = {
        folder,
        documents: folder.documents,
        breadcrumb: [...path, folder.name]
      };
      return true;
    }

    return folder.subFolders?.some(subFolder => 
      searchFolder(subFolder, [...path, folder.name])
    ) || false;
  };

  clientFolders.some(client => 
    client.folders.some(folder => searchFolder(folder, [client.name]))
  );

  return result;
}

type SortOption = 'name' | 'date' | 'size';

export default function DocumentsPage() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('date');

  const client = selectedClient ? sampleClientFolders.find(c => c.id === selectedClient) : null;
  const folderData = selectedFolder ? findFolderAndDocuments(sampleClientFolders, selectedFolder) : null;

  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
    setSelectedFolder(null);
  };

  const sortDocuments = (docs: Document[]) => {
    return [...docs].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
        case 'size':
          return b.size - a.size;
        default:
          return 0;
      }
    });
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
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
            <Button variant="outline">
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
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {recentDocuments.map((doc) => (
                        <CarouselItem key={doc.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                          <DocumentCard
                            document={doc}
                            viewMode="grid"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </TabsContent>

                <TabsContent value="starred" className="m-0">
                  <div className={cn(
                    "grid gap-4",
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  )}>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Client Folders</h2>
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Sort by Date
                      </div>
                    </SelectItem>
                    <SelectItem value="name">
                      <div className="flex items-center">
                        <ArrowDownAZ className="mr-2 h-4 w-4" />
                        Sort by Name
                      </div>
                    </SelectItem>
                    <SelectItem value="size">
                      <div className="flex items-center">
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Sort by Size
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sampleClientFolders.map(client => (
                  <Card
                    key={client.id}
                    className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleClientSelect(client.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                          {client.avatar ? (
                            <img
                              src={client.avatar}
                              alt={client.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Users className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{client.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {client.totalDocuments} documents
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    
                    <div className="mt-3 space-y-1.5">
                      {client.folders.slice(0, 2).map(folder => (
                        <div
                          key={folder.id}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          {folder.type === 'case' ? (
                            <Briefcase className="h-3 w-3" />
                          ) : (
                            <FolderTree className="h-3 w-3" />
                          )}
                          <span className="truncate">{folder.name}</span>
                          {folder.status && (
                            <Badge
                              variant={folder.status === 'active' ? 'default' : 'secondary'}
                              className="ml-auto text-[10px] h-4"
                            >
                              {folder.status}
                            </Badge>
                          )}
                        </div>
                      ))}
                      {client.folders.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{client.folders.length - 2} more folders
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        Last modified {format(new Date(client.recentlyModified), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => {
              setSelectedClient(null);
              setSelectedFolder(null);
            }}>
              <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Clients
            </Button>

            <div className="flex items-start gap-6">
              {/* Folders Sidebar */}
              <Card className="w-[300px] p-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                    {client?.avatar ? (
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
                    <h2 className="font-semibold">{client?.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {client?.totalDocuments} documents
                    </p>
                  </div>
                </div>

                <ScrollArea className="h-[calc(100vh-15rem)]">
                  <div className="space-y-1">
                    {client?.folders.map(folder => (
                      <FolderItem
                        key={folder.id}
                        folder={folder}
                        selectedId={selectedFolder}
                        onSelect={setSelectedFolder}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </Card>

              {/* Main Content */}
              <Card className="flex-1 p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      {folderData?.breadcrumb && (
                        <div className="text-sm text-muted-foreground">
                          {folderData.breadcrumb.join(' / ')}
                        </div>
                      )}
                      <h3 className="text-lg font-semibold">
                        {folderData?.folder.name || 'All Documents'}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search documents..."
                          className="pl-9 w-[300px]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

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

                  {/* Document Grid/List */}
                  {folderData && (
                    <div className={cn(
                      "grid gap-4",
                      viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                    )}>
                      {sortDocuments(folderData.documents)
                        .filter(doc => 
                          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.tags?.some(tag => 
                            tag.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                        )
                        .map(doc => (
                          <DocumentCard
                            key={doc.id}
                            document={doc}
                            viewMode={viewMode}
                          />
                        ))
                      }
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}