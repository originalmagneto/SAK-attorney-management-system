'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Briefcase,
  Clock,
  MessageSquare,
  Settings,
  Users,
  FileText,
  Menu,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Sun, Moon } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Cases', href: '/cases', icon: Briefcase },
  { name: 'Time & Billing', href: '/billing', icon: Clock },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={cn(
        'relative border-r bg-card/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60',
        'transition-all duration-300 ease-in-out'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-2 font-semibold',
            isCollapsed && 'justify-center'
          )}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-primary/20 blur-lg" />
            <Briefcase className="h-6 w-6 relative z-10 text-primary" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-gradient bg-clip-text text-xl"
            >
              LegalFlow
            </motion.span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-primary/10"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-1 p-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  animate={{ 
                    backgroundColor: isActive ? 'hsl(var(--primary)/0.1)' : 'transparent',
                  }}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    'hover:bg-primary/10',
                    isCollapsed && 'justify-center',
                    isActive && 'text-primary'
                  )}
                >
                  <motion.div
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                      rotate: isActive ? 360 : 0 
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className="h-4 w-4" />
                  </motion.div>
                  
                  {!isCollapsed && (
                    <motion.span
                      initial={false}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex-1"
                    >
                      {item.name}
                    </motion.span>
                  )}
                  
                  {!isCollapsed && isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <ChevronRight className="h-4 w-4 text-primary" />
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
          {/* Dark/Light mode toggle */}
          <div className="flex flex-col items-center py-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    aria-label="Toggle dark mode"
                    className="flex items-center justify-center rounded-full p-2 hover:bg-accent transition-colors"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {theme === 'dark' ? (
                        <motion.span
                          key="moon"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Moon className="h-6 w-6 text-yellow-300" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="sun"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Sun className="h-6 w-6 text-yellow-400" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Toggle dark/light mode</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </ScrollArea>
      </motion.div>
  );
}