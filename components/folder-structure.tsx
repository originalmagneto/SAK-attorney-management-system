'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  FileText,
  Image as ImageIcon,
  FileSignature,
  Plus,
  MoreVertical,
  Upload,
  Trash2,
  Copy,
  Share2
} from 'lucide-react';

interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: 'document' | 'image' | 'pdf' | 'signed';
  size?: string;
  lastModified?: string;
  children?: FolderItem[];
  shared?: boolean;
  tags?: string[];
}

interface FolderStructureProps {
  items: FolderItem[];
  onCreateFolder?: (parentId: string) => void;
  onUploadFiles?: (folderId: string) => void;
  onDelete?: (item: FolderItem) => void;
  onShare?: (item: FolderItem) => void;
  onCopy?: (item: FolderItem) => void;
}

const defaultFolderStructure: FolderItem[] = [
  {
    id: 'client-docs',
    name: 'Client Documents',
    type: 'folder',
    shared: true,
    children: [
      {
        id: 'contracts',
        name: 'Contracts',
        type: 'folder',
        tags: ['important', 'legal'],
        children: [
          {
            id: 'contract-1',
            name: 'Service_Agreement_2024.pdf',
            type: 'file',
            fileType: 'signed',
            size: '2.4 MB',
            lastModified: '2024-03-27',
            tags: ['final', 'signed']
          }
        ]
      },
      {
        id: 'identification',
        name: 'Identification',
        type: 'folder',
        tags: ['confidential'],
        children: [
          {
            id: 'id-1',
            name: 'ID_Scan.pdf',
            type: 'file',
            fileType: 'pdf',
            size: '1.2 MB',
            lastModified: '2024-03-26'
          }
        ]
      }
    ]
  },
  {
    id: 'case-files',
    name: 'Case Files',
    type: 'folder',
    children: [
      {
        id: 'evidence',
        name: 'Evidence',
        type: 'folder',
        tags: ['confidential', 'case-related'],
        children: [
          {
            id: 'photo-1',
            name: 'Evidence_Photo_1.jpg',
            type: 'file',
            fileType: 'image',
            size: '3.1 MB',
            lastModified: '2024-03-25'
          }
        ]
      },
      {
        id: 'legal-docs',
        name: 'Legal Documents',
        type: 'folder',
        tags: ['important'],
        children: [
          {
            id: 'brief-1',
            name: 'Legal_Brief_Draft.docx',
            type: 'file',
            fileType: 'document',
            size: '1.8 MB',
            lastModified: '2024-03-24'
          }
        ]
      }
    ]
  }
];

function FolderIcon({ type, fileType, isOpen }: { type: string; fileType?: string; isOpen?: boolean }) {
  if (type === 'folder') {
    return isOpen ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-primary" />;
  }

  switch (fileType) {
    case 'document':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'image':
      return <ImageIcon className="h-4 w-4 text-green-500" />;
    case 'signed':
      return <FileSignature className="h-4 w-4 text-purple-500" />;
    default:
      return <File className="h-4 w-4 text-gray-500" />;
  }
}

function FolderTreeItem({ 
  item, 
  level = 0, 
  onCreateFolder, 
  onUploadFiles,
  onDelete,
  onShare,
  onCopy 
}: { 
  item: FolderItem; 
  level?: number; 
  onCreateFolder?: (id: string) => void; 
  onUploadFiles?: (id: string) => void;
  onDelete?: (item: FolderItem) => void;
  onShare?: (item: FolderItem) => void;
  onCopy?: (item: FolderItem) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div
        className={`flex items-center gap-2 p-2 rounded-lg hover:bg-accent/5 cursor-pointer group transition-all duration-300 ${isOpen ? 'bg-accent/10' : ''}`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => item.type === 'folder' && setIsOpen(!isOpen)}
      >
        {item.type === 'folder' && (
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
            {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>
        )}
        <FolderIcon type={item.type} fileType={item.fileType} isOpen={isOpen} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm truncate">{item.name}</span>
            {item.shared && (
              <Share2 className="h-3 w-3 text-blue-500" />
            )}
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className="flex gap-1 mt-1">
              {item.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        {item.size && (
          <Badge variant="secondary" className="text-xs">
            {item.size}
          </Badge>
        )}
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 ml-auto flex items-center gap-1">
          <TooltipProvider>
            {item.type === 'folder' && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCreateFolder?.(item.id);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>New Folder</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUploadFiles?.(item.id);
                      }}
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Upload Files</TooltipContent>
                </Tooltip>
              </>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare?.(item);
                  }}
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy?.(item);
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(item);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {item.type === 'folder' && isOpen && item.children && (
        <div className="space-y-2 transition-all duration-300">
          {item.children.map((child) => (
            <FolderTreeItem
              key={child.id}
              item={child}
              level={level + 1}
              onCreateFolder={onCreateFolder}
              onUploadFiles={onUploadFiles}
              onDelete={onDelete}
              onShare={onShare}
              onCopy={onCopy}
            />
          ))}        
        </div>
      )}
    </div>
  );
}

export function FolderStructure({ 
  items = defaultFolderStructure, 
  onCreateFolder, 
  onUploadFiles,
  onDelete,
  onShare,
  onCopy 
}: FolderStructureProps) {
  return (
    <Card className="p-4">
      <ScrollArea className="h-[600px]">
        <div className="space-y-2">
          {items.map((item) => (
            <FolderTreeItem
              key={item.id}
              item={item}
              onCreateFolder={onCreateFolder}
              onUploadFiles={onUploadFiles}
              onDelete={onDelete}
              onShare={onShare}
              onCopy={onCopy}
            />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}