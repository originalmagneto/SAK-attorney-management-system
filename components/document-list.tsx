import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  ArrowDownAZ,
  ArrowUpDown,
  Download,
  Share2,
  MoreVertical,
  ChevronRight,
  FileText,
  File,
  FileSpreadsheet,
  FileImage,
} from 'lucide-react';
import { Document, DocumentSortOption } from '@/types/documents';
import { format } from 'date-fns';

const sortOptions: DocumentSortOption[] = [
  {
    label: 'Date Modified',
    value: 'date',
    icon: Calendar
  },
  {
    label: 'Name',
    value: 'name',
    icon: ArrowDownAZ
  },
  {
    label: 'Size',
    value: 'size',
    icon: ArrowUpDown
  }
];

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
      return <FileText className="h-8 w-8 text-gray-500" />;
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

interface DocumentsListProps {
  documents: Document[];
  compact?: boolean;
}

export function DocumentList({ documents, compact = false }: DocumentsListProps) {
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');

  const sortedDocuments = [...documents].sort((a, b) => {
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

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={sortBy} onValueChange={(value: 'date' | 'name' | 'size') => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  <option.icon className="mr-2 h-4 w-4" />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className={compact ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-4"}>
          {sortedDocuments.map(doc => (
            <Card key={doc.id} className={compact ? "p-3 hover:shadow-lg transition-shadow" : "p-4"}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {getFileIcon(doc.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={doc.status === 'final' ? 'default' : 'secondary'} className="text-xs">
                      {doc.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(doc.size)}
                    </span>
                  </div>
                  {!compact && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Modified {format(new Date(doc.modifiedAt), 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span>v{doc.version}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  {!compact && (
                    <>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}