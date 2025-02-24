'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { History, MessageSquare, Git, Save } from 'lucide-react';

interface Version {
  id: number;
  version: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  changes: string;
}

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
}

interface DocumentVersionControlProps {
  documentId: number;
  currentVersion: string;
}

export function DocumentVersionControl({ documentId, currentVersion }: DocumentVersionControlProps) {
  const [activeTab, setActiveTab] = useState<'versions' | 'comments'>('versions');
  const [newComment, setNewComment] = useState('');

  const versions: Version[] = [
    {
      id: 1,
      version: 'v2.0',
      author: {
        name: 'John Doe',
        avatar: '/images/avatars/avatar-1.png'
      },
      date: '2024-03-27 14:30',
      changes: 'Updated contract terms and conditions'
    },
    {
      id: 2,
      version: 'v1.1',
      author: {
        name: 'Sarah Smith',
        avatar: '/images/avatars/avatar-2.png'
      },
      date: '2024-03-26 11:20',
      changes: 'Fixed formatting issues'
    }
  ];

  const comments: Comment[] = [
    {
      id: 1,
      author: {
        name: 'Jane Wilson',
        avatar: '/images/avatars/avatar-3.png'
      },
      content: 'Please review section 3.2 regarding liability clauses',
      date: '2024-03-27 15:45'
    }
  ];

  const handleAddComment = () => {
    // Implement comment addition logic here
    setNewComment('');
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant={activeTab === 'versions' ? 'default' : 'outline'}
          onClick={() => setActiveTab('versions')}
          className="flex items-center gap-2"
        >
          <History className="h-4 w-4" />
          Versions
        </Button>
        <Button
          variant={activeTab === 'comments' ? 'default' : 'outline'}
          onClick={() => setActiveTab('comments')}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Comments
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        {activeTab === 'versions' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Git className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Current: {currentVersion}</span>
              </div>
              <Button size="sm" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save New Version
              </Button>
            </div>
            {versions.map((version) => (
              <Card key={version.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={version.author.avatar} />
                      <AvatarFallback>{version.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{version.author.name}</span>
                        <Badge variant="outline">{version.version}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{version.date}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Restore</Button>
                </div>
                <p className="text-sm text-muted-foreground">{version.changes}</p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{comment.author.name}</span>
                      <span className="text-sm text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              </Card>
            ))}
            <div className="flex gap-4 mt-4">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddComment}>Post</Button>
            </div>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}