'use client';

import { useState } from 'react';
import './globals.css';
// Import fonts directly without preloading
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/navigation';
import { ChatSidebar } from '@/components/chat-sidebar';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

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
          <div className="flex h-screen overflow-hidden bg-gradient-to-bl from-background via-background to-background relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            </div>
            
            <Navigation />
            
            <main className="flex-1 overflow-auto relative">
              <div className="relative z-10">
                {children}
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Button
                  variant="modern"
                  size="icon"
                  onClick={() => setIsChatOpen(true)}
                  className="fixed bottom-4 right-4 shadow-xl"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-ping-slow" />
                </Button>
              </motion.div>
            </main>
            
            <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}