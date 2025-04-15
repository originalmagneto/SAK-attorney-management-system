'use client';

import { useState, useEffect } from 'react';
import { MessageThreadList } from '@/components/message-thread-list';
import { MessageThreadView } from '@/components/message-thread-view';
import { useMessages } from '@/hooks/use-messages';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageThread } from '@/types/messages';
import { sampleThreads, sampleMessages } from '@/lib/sample-messages';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useUIStore } from '@/lib/store';

// Mock current user - replace with actual auth
const currentUser = {
  id: 'user-2',
  name: 'Sarah Johnson',
  role: 'Attorney',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop'
};

export default function MessagesPage() {
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [branchTitle, setBranchTitle] = useState('');
  const [branchMessageId, setBranchMessageId] = useState<string | null>(null);
  
  const { messagePanelSizes, setMessagePanelSizes } = useUIStore();
  
  const {
    threads,
    messages,
    createThread,
    sendMessage,
    createBranch,
    addReaction,
    getThreadsByContext
  } = useMessages({ currentUserId: currentUser.id });

  // Initialize with sample data
  useEffect(() => {
    // Only initialize if no threads exist
    if (threads.length === 0) {
      // Use a local function to avoid dependency issues
      const initializeThread = async () => {
        for (const thread of sampleThreads) {
        const threadId = createThread(
          thread.title,
          thread.contextType,
          thread.contextId,
          thread.contextTitle,
          thread.participants.map(p => ({
            ...p,
            avatar: p.id === 'user-1' 
              ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&auto=format&fit=crop'
              : p.id === 'user-3'
              ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&auto=format&fit=crop'
              : p.id === 'user-4'
              ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&auto=format&fit=crop'
              : p.id === 'user-5'
              ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&auto=format&fit=crop'
              : p.id === 'user-6'
              ? 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=256&h=256&auto=format&fit=crop'
              : currentUser.avatar
          })),
          thread.metadata,
          thread.parentThreadId
        );

          const threadMessages = sampleMessages[thread.id] || [];
          for (const msg of threadMessages) {
            await sendMessage(
              threadId,
              msg.content,
              msg.replyToId,
              msg.metadata,
              msg.attachments as any
            );
          }
        }
      };
      
      // Execute the initialization
      initializeThread();
    }
  }, [threads.length, createThread, sendMessage]);

  useEffect(() => {
    // Hydrate UI store
    useUIStore.persist.rehydrate();
  }, []);

  const handleSendMessage = (content: string, replyToId?: string) => {
    if (selectedThread) {
      sendMessage(selectedThread.id, content, replyToId);
    }
  };

  const handleCreateBranch = (messageId: string) => {
    setBranchMessageId(messageId);
    setBranchTitle('');
    setBranchDialogOpen(true);
  };

  const handleConfirmBranch = () => {
    if (selectedThread && branchMessageId && branchTitle.trim()) {
      createBranch(selectedThread.id, branchMessageId, branchTitle);
      setBranchDialogOpen(false);
      setBranchMessageId(null);
      setBranchTitle('');
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (selectedThread) {
      addReaction(selectedThread.id, messageId, emoji);
    }
  };

  return (
    <TooltipProvider>
      <>
        <ResizablePanelGroup
          direction="horizontal"
          className="h-[calc(100vh-4rem)]"
          onLayout={(sizes) => {
            // Only update if the sizes actually changed
            if (sizes[0] !== messagePanelSizes[0] || sizes[1] !== messagePanelSizes[1]) {
              setMessagePanelSizes(sizes);
            }
          }}
        >
          <ResizablePanel 
            defaultSize={messagePanelSizes[0]} 
            minSize={20} 
            maxSize={40}
          >
            <div className="h-full border-r">
              <MessageThreadList
                threads={threads}
                selectedThreadId={selectedThread?.id}
                onThreadSelect={setSelectedThread}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel 
            defaultSize={messagePanelSizes[1]}
          >
            <div className="h-full">
              {selectedThread ? (
                <MessageThreadView
                  thread={selectedThread}
                  messages={messages[selectedThread.id] || []}
                  currentUserId={currentUser.id}
                  onSendMessage={handleSendMessage}
                  onCreateBranch={handleCreateBranch}
                  onReaction={handleReaction}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        <Dialog open={branchDialogOpen} onOpenChange={setBranchDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Thread</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Input
                  placeholder="Thread title..."
                  value={branchTitle}
                  onChange={(e) => setBranchTitle(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setBranchDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleConfirmBranch}>
                  Create Thread
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    </TooltipProvider>
  );
}