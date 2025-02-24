'use client';

import { useState } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/navigation';
import { ChatSidebar } from '@/components/chat-sidebar';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <html lang="sk" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen">
            <Navigation />
            <main className="flex-1 overflow-auto relative">
              {children}
              <Button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-4 right-4 shadow-lg"
                size="icon"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </main>
            <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}