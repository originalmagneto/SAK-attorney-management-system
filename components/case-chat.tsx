import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, Image as ImageIcon, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  content: string;
  sender: {
    name: string;
    avatar: string;
  };
  timestamp: string;
}

interface CaseChatProps {
  messages?: Message[];
  onSendMessage?: (content: string) => void;
}

export function CaseChat({ messages = [], onSendMessage }: CaseChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage?.(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass-effect rounded-lg">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="flex items-start gap-3 mb-4"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Avatar className="h-8 w-8 ring-2 ring-primary/20 shadow-lg">
                  <AvatarImage src={message.sender.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                    {message.sender.name[0]}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{message.sender.name}</span>
                  <span className="text-xs text-muted-foreground bg-primary/5 px-2 py-1 rounded-full">
                    {message.timestamp}
                  </span>
                </div>
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="mt-1 p-3 rounded-lg bg-gradient-to-br from-primary/5 via-primary/3 to-primary/10 backdrop-blur-sm shadow-sm"
                >
                  <p className="text-sm">{message.content}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
      
      <div className="p-4 border-t bg-gradient-to-t from-background/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <motion.div className="flex gap-2" initial={false}>
            {[
              { icon: Paperclip, tooltip: 'Attach file' },
              { icon: ImageIcon, tooltip: 'Upload image' },
              { icon: Smile, tooltip: 'Add emoji' }
            ].map((item, index) => (
              <motion.div
                key={item.tooltip}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="shrink-0 glass-effect hover:bg-primary/5 transition-all duration-300"
                >
                  <item.icon className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            className="flex-1 glass-effect border-primary/20 focus:border-primary/40"
          />
          <Button 
            onClick={handleSend}
            className="shrink-0 animated-gradient text-white shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}