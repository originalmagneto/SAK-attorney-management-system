/**
 * Enhanced Tabs Component
 * Modern, feature-rich tabs with animations, variants, and accessibility
 */

'use client';

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Home,
  User,
  Settings,
  FileText,
  Calendar,
  Mail,
  Phone,
  Search,
  Bell,
  Heart,
  Star,
  Bookmark,
  Download,
  Upload,
  Edit,
  Trash2,
} from 'lucide-react';

// Enhanced tabs variants
const enhancedTabsVariants = cva(
  [
    'w-full',
  ],
  {
    variants: {
      variant: {
        default: '',
        bordered: 'border border-gray-200 dark:border-gray-700 rounded-lg',
        card: 'bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700',
        pills: '',
        underlined: '',
        minimal: '',
        modern: 'bg-gray-50 dark:bg-gray-900 rounded-xl',
      },
      orientation: {
        horizontal: '',
        vertical: 'flex',
      },
    },
    defaultVariants: {
      variant: 'default',
      orientation: 'horizontal',
    },
  }
);

// Tab list variants
const tabListVariants = cva(
  [
    'flex relative',
  ],
  {
    variants: {
      variant: {
        default: 'border-b border-gray-200 dark:border-gray-700',
        bordered: 'border-b border-gray-200 dark:border-gray-700 px-4 pt-4',
        card: 'border-b border-gray-200 dark:border-gray-700 px-4 pt-4',
        pills: 'p-1 bg-gray-100 dark:bg-gray-800 rounded-lg',
        underlined: '',
        minimal: 'gap-1',
        modern: 'p-2 bg-gray-100 dark:bg-gray-800 rounded-lg',
      },
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col border-r border-gray-200 dark:border-gray-700 border-b-0 min-w-48',
      },
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      orientation: 'horizontal',
      size: 'default',
    },
  }
);

// Tab trigger variants
const tabTriggerVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap',
    'font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'relative group',
  ],
  {
    variants: {
      variant: {
        default: [
          'px-4 py-2 border-b-2 border-transparent',
          'text-gray-600 dark:text-gray-400',
          'hover:text-gray-900 dark:hover:text-gray-100',
          'data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400',
          'data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400',
        ],
        bordered: [
          'px-4 py-2 border-b-2 border-transparent',
          'text-gray-600 dark:text-gray-400',
          'hover:text-gray-900 dark:hover:text-gray-100',
          'data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400',
          'data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400',
        ],
        card: [
          'px-4 py-2 border-b-2 border-transparent',
          'text-gray-600 dark:text-gray-400',
          'hover:text-gray-900 dark:hover:text-gray-100',
          'data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400',
          'data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400',
        ],
        pills: [
          'px-3 py-1.5 rounded-md',
          'text-gray-600 dark:text-gray-400',
          'hover:bg-gray-200 dark:hover:bg-gray-700',
          'data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900',
          'data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100',
          'data-[state=active]:shadow-sm',
        ],
        underlined: [
          'px-4 py-2',
          'text-gray-600 dark:text-gray-400',
          'hover:text-gray-900 dark:hover:text-gray-100',
          'data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400',
        ],
        minimal: [
          'px-3 py-2 rounded-md',
          'text-gray-600 dark:text-gray-400',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20',
          'data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400',
        ],
        modern: [
          'px-4 py-2 rounded-lg',
          'text-gray-600 dark:text-gray-400',
          'hover:bg-gray-200 dark:hover:bg-gray-700',
          'data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900',
          'data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100',
          'data-[state=active]:shadow-sm',
        ],
      },
      size: {
        sm: 'text-sm px-2 py-1',
        default: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
      orientation: {
        horizontal: '',
        vertical: 'w-full justify-start',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      orientation: 'horizontal',
    },
  }
);

// Tab content variants
const tabContentVariants = cva(
  [
    'focus:outline-none',
  ],
  {
    variants: {
      variant: {
        default: 'p-4',
        bordered: 'p-4',
        card: 'p-4',
        pills: 'p-4',
        underlined: 'p-4',
        minimal: 'p-4',
        modern: 'p-6',
      },
      orientation: {
        horizontal: '',
        vertical: 'flex-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      orientation: 'horizontal',
    },
  }
);

// Tabs context
interface TabsContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: string;
  size?: string;
  animated?: boolean;
  closable?: boolean;
  onTabClose?: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
};

// Enhanced tabs props
export interface EnhancedTabsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedTabsVariants> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  animated?: boolean;
  closable?: boolean;
  addable?: boolean;
  scrollable?: boolean;
  onTabClose?: (value: string) => void;
  onTabAdd?: () => void;
  children: React.ReactNode;
}

// Tab list props
export interface TabListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Tab trigger props
export interface TabTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: React.ReactNode;
  iconType?: string;
  closable?: boolean;
  children: React.ReactNode;
}

// Tab content props
export interface TabContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

// Predefined icons
const PredefinedIcon = ({ iconType, className }: { iconType: string; className?: string }) => {
  const iconClass = cn('h-4 w-4', className);
  
  const icons: Record<string, React.ReactNode> = {
    home: <Home className={iconClass} />,
    user: <User className={iconClass} />,
    settings: <Settings className={iconClass} />,
    document: <FileText className={iconClass} />,
    calendar: <Calendar className={iconClass} />,
    mail: <Mail className={iconClass} />,
    phone: <Phone className={iconClass} />,
    search: <Search className={iconClass} />,
    bell: <Bell className={iconClass} />,
    heart: <Heart className={iconClass} />,
    star: <Star className={iconClass} />,
    bookmark: <Bookmark className={iconClass} />,
    download: <Download className={iconClass} />,
    upload: <Upload className={iconClass} />,
    edit: <Edit className={iconClass} />,
    trash: <Trash2 className={iconClass} />,
  };
  
  return icons[iconType] || null;
};

// Main Tabs Component
const EnhancedTabs = React.forwardRef<HTMLDivElement, EnhancedTabsProps>(
  (props, ref) => {
    const {
      value: controlledValue,
      defaultValue,
      onValueChange,
      animated = true,
      closable = false,
      addable = false,
      scrollable = false,
      onTabClose,
      onTabAdd,
      variant,
      orientation,
      className,
      children,
      ...divProps
    } = props;

    // State
    const [internalValue, setInternalValue] = useState<string>(
      controlledValue ?? defaultValue ?? ''
    );

    // Current value
    const currentValue = controlledValue ?? internalValue;

    // Handle value change
    const handleValueChange = (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    // Context value
    const contextValue: TabsContextValue = {
      value: currentValue,
      onValueChange: handleValueChange,
      orientation,
      variant,
      animated,
      closable,
      onTabClose,
    };

    return (
      <TabsContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(enhancedTabsVariants({ variant, orientation }), className)}
          {...divProps}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

// Tab List Component
const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
  (props, ref) => {
    const { className, children, ...divProps } = props;
    const { orientation, variant } = useTabs();
    const [showScrollButtons, setShowScrollButtons] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Check scroll state
    const checkScrollState = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      setShowScrollButtons(scrollWidth > clientWidth);
    };

    // Scroll functions
    const scrollLeft = () => {
      scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
    };

    const scrollRight = () => {
      scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
    };

    // Effect to check scroll state
    useEffect(() => {
      checkScrollState();
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener('scroll', checkScrollState);
        window.addEventListener('resize', checkScrollState);
        return () => {
          container.removeEventListener('scroll', checkScrollState);
          window.removeEventListener('resize', checkScrollState);
        };
      }
    }, [children]);

    return (
      <div className="relative">
        {/* Scroll Left Button */}
        {showScrollButtons && orientation === 'horizontal' && (
          <button
            className={cn(
              'absolute left-0 top-0 z-10 h-full px-2',
              'bg-gradient-to-r from-white to-transparent dark:from-gray-800',
              'flex items-center justify-center',
              'transition-opacity duration-200',
              canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
            onClick={scrollLeft}
            tabIndex={-1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {/* Tab List Container */}
        <div
          ref={scrollContainerRef}
          className={cn(
            tabListVariants({ variant, orientation }),
            orientation === 'horizontal' && showScrollButtons && 'overflow-x-auto scrollbar-hide',
            className
          )}
          role="tablist"
          aria-orientation={orientation}
          {...divProps}
        >
          {children}
        </div>

        {/* Scroll Right Button */}
        {showScrollButtons && orientation === 'horizontal' && (
          <button
            className={cn(
              'absolute right-0 top-0 z-10 h-full px-2',
              'bg-gradient-to-l from-white to-transparent dark:from-gray-800',
              'flex items-center justify-center',
              'transition-opacity duration-200',
              canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
            onClick={scrollRight}
            tabIndex={-1}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

// Tab Trigger Component
const TabTrigger = React.forwardRef<HTMLButtonElement, TabTriggerProps>(
  (props, ref) => {
    const {
      value,
      icon,
      iconType,
      closable: triggerClosable,
      className,
      children,
      onClick,
      ...buttonProps
    } = props;
    
    const {
      value: activeValue,
      onValueChange,
      orientation,
      variant,
      animated,
      closable: tabsClosable,
      onTabClose,
    } = useTabs();
    
    const isActive = activeValue === value;
    const isClosable = triggerClosable ?? tabsClosable;

    // Handle click
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      onValueChange?.(value);
    };

    // Handle close
    const handleClose = (event: React.MouseEvent) => {
      event.stopPropagation();
      onTabClose?.(value);
    };

    return (
      <button
        ref={ref}
        className={cn(
          tabTriggerVariants({ variant, orientation }),
          className
        )}
        role="tab"
        aria-selected={isActive}
        aria-controls={`tab-content-${value}`}
        data-state={isActive ? 'active' : 'inactive'}
        onClick={handleClick}
        {...buttonProps}
      >
        {/* Content */}
        <div className="flex items-center gap-2">
          {/* Icon */}
          {icon || (iconType && (
            <PredefinedIcon iconType={iconType} />
          ))}
          
          {/* Label */}
          <span>{children}</span>
          
          {/* Close Button */}
          {isClosable && (
            <button
              className={cn(
                'ml-1 p-0.5 rounded-sm',
                'hover:bg-gray-200 dark:hover:bg-gray-700',
                'transition-colors duration-150'
              )}
              onClick={handleClose}
              tabIndex={-1}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        
        {/* Active Indicator for Underlined Variant */}
        {variant === 'underlined' && isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
            layoutId="activeTab"
            initial={animated ? { opacity: 0 } : false}
            animate={animated ? { opacity: 1 } : false}
            transition={animated ? { duration: 0.2 } : undefined}
          />
        )}
      </button>
    );
  }
);

// Tab Content Component
const TabContent = React.forwardRef<HTMLDivElement, TabContentProps>(
  (props, ref) => {
    const { value, className, children, ...divProps } = props;
    const { value: activeValue, orientation, variant, animated } = useTabs();
    
    const isActive = activeValue === value;

    if (!isActive) return null;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          ref={ref}
          id={`tab-content-${value}`}
          className={cn(
            tabContentVariants({ variant, orientation }),
            className
          )}
          role="tabpanel"
          aria-labelledby={`tab-trigger-${value}`}
          initial={animated ? { opacity: 0, y: 10 } : false}
          animate={animated ? {
            opacity: 1,
            y: 0,
          } : false}
          exit={animated ? {
            opacity: 0,
            y: -10,
          } : false}
          transition={animated ? {
            duration: 0.2,
            ease: 'easeInOut',
          } : undefined}
          {...divProps}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }
);

// Display names
EnhancedTabs.displayName = 'EnhancedTabs';
TabList.displayName = 'TabList';
TabTrigger.displayName = 'TabTrigger';
TabContent.displayName = 'TabContent';

// Export components and utilities
export {
  EnhancedTabs,
  TabList,
  TabTrigger,
  TabContent,
  PredefinedIcon,
  enhancedTabsVariants,
};

export type {
  EnhancedTabsProps,
  TabListProps,
  TabTriggerProps,
  TabContentProps,
};