import { useState, useCallback } from 'react';
import { MessageThread, Message, MessageContextType } from '@/types/messages';

export interface UseMessagesProps {
  currentUserId: string;
}

type AttachmentType = {
  id: string;
  type: 'file' | 'image' | 'link';
  url: string;
  name: string;
  size?: number;
};

export function useMessages({ currentUserId }: UseMessagesProps) {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  const createThread = useCallback((
    title: string,
    contextType: MessageContextType,
    contextId: string,
    contextTitle: string,
    participants: { id: string; name: string; role: string; avatar?: string }[],
    metadata: Record<string, any>,
    parentThreadId?: string
  ) => {
    const newThread: MessageThread = {
      id: `thread-${Date.now()}`,
      title,
      contextType,
      contextId,
      contextTitle,
      parentThreadId,
      participants,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessageAt: new Date(),
      metadata
    };

    setThreads(prev => [...prev, newThread]);
    return newThread.id;
  }, []);

  const sendMessage = useCallback((
    threadId: string,
    content: string,
    replyToId?: string,
    metadata?: Record<string, any>,
    attachments?: AttachmentType[]
  ) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      threadId,
      senderId: currentUserId,
      content,
      createdAt: new Date(),
      replyToId,
      metadata,
      attachments
    };

    setMessages(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newMessage]
    }));

    setThreads(prev =>
      prev.map(thread =>
        thread.id === threadId
          ? { ...thread, lastMessageAt: new Date(), updatedAt: new Date() }
          : thread
      )
    );

    return newMessage.id;
  }, [currentUserId]);

  const createBranch = useCallback((
    parentThreadId: string,
    messageId: string,
    title: string
  ) => {
    const parentThread = threads.find(t => t.id === parentThreadId);
    if (!parentThread) return null;

    const branchedThreadId = createThread(
      title,
      parentThread.contextType,
      parentThread.contextId,
      parentThread.contextTitle,
      parentThread.participants,
      parentThread.metadata,
      parentThreadId
    );

    // Add a reference message in the new thread
    const referenceMessage = messages[parentThreadId]?.find(m => m.id === messageId);
    if (referenceMessage) {
      sendMessage(
        branchedThreadId,
        'Thread started from:',
        undefined,
        {
          referenceMessage: {
            id: referenceMessage.id,
            content: referenceMessage.content,
            sender: threads
              .find(t => t.id === parentThreadId)
              ?.participants.find(p => p.id === referenceMessage.senderId)
              ?.name
          }
        }
      );
    }

    return branchedThreadId;
  }, [threads, messages, createThread, sendMessage]);

  const addReaction = useCallback((
    threadId: string,
    messageId: string,
    emoji: string
  ) => {
    setMessages(prev => ({
      ...prev,
      [threadId]: prev[threadId].map(message =>
        message.id === messageId
          ? {
              ...message,
              reactions: [
                ...(message.reactions || []).filter(r => r.emoji !== emoji),
                {
                  emoji,
                  users: Array.from(new Set([
                    ...(message.reactions?.find(r => r.emoji === emoji)?.users || []),
                    currentUserId
                  ]))
                }
              ]
            }
          : message
      )
    }));
  }, [currentUserId]);

  const getThreadsByContext = useCallback((
    contextType: MessageContextType,
    contextId: string
  ) => {
    return threads.filter(
      thread => thread.contextType === contextType && thread.contextId === contextId
    );
  }, [threads]);

  return {
    threads,
    messages,
    createThread,
    sendMessage,
    createBranch,
    addReaction,
    getThreadsByContext
  };
}