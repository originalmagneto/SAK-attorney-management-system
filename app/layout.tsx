'use client';

import { useState } from 'react';
import ErrorBoundary from '@/components/error-boundary';
import LoggingInitializer from '@/components/logging-initializer';
import DebugPanel from '@/components/debug-panel';
import './globals.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ChatSidebar } from '@/components/chat-sidebar';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { AuthProvider } from '@/contexts/auth-context';
import ClientSideNavigation from '@/components/client-side-navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <html lang="sk" suppressHydrationWarning className="antialiased">
      <head>
        {/* Fonts are loaded via npm packages */}
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <AuthProvider>
              <LoggingInitializer />
              <div className="flex h-screen overflow-hidden bg-gradient-to-bl from-background via-background to-background relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none" />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                </div>
                
                <ClientSideNavigation />
                
                <main className="flex-1 overflow-auto relative">
                  {children}
                </main>

                <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                
                <Button
                  variant="outline"
                  size="icon"
                  className="fixed right-4 bottom-4 h-12 w-12"
                  onClick={() => setIsChatOpen(true)}
                >
                  <MessageSquare className="h-6 w-6" />
                </Button>
              </div>
              <Toaster />
              {process.env.NODE_ENV === 'development' && <DebugPanel />}
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}