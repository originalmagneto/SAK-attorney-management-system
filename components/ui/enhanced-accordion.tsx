/**
 * Enhanced Accordion Component
 * Modern, feature-rich accordion with animations, variants, and accessibility
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Info,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Settings,
  FileText,
  User,
  Calendar,
  Mail,
} from 'lucide-react';

// Enhanced accordion variants
const enhancedAccordionVariants = cva(
  [
    'w-full',
  ],
  {
    variants: {
      variant: {
        default: 'border border-gray-200 dark:border-gray-700 rounded-lg',
        bordered: 'border border-gray-200 dark:border-gray-700',
        separated: 'space-y-2',
        flush: '',
        card: 'bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700',
        minimal: '',
        modern: 'bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700',
      },
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Accordion item variants
const accordionItemVariants = cva(
  [
    'group',
  ],
  {
    variants: {
      variant: {
        default: 'border-b border-gray-200 dark:border-gray-700 last:border-b-0',
        bordered: 'border border-gray-200 dark:border-gray-700 mb-2 last:mb-0 rounded-lg',
        separated: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm',
        flush: 'border-b border-gray-200 dark:border-gray-700 last:border-b-0',
        card: 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg mb-2 last:mb-0',
        minimal: 'border-b border-gray-100 dark:border-gray-800 last:border-b-0',
        modern: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl mb-3 last:mb-0 shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Accordion trigger variants
const accordionTriggerVariants = cva(
  [
    'flex w-full items-center justify-between text-left',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50',
  ],
  {
    variants: {
      variant: {
        default: 'p-4',
        bordered: 'p-4',
        separated: 'p-4',
        flush: 'py-4',
        card: 'p-4',
        minimal: 'py-3',
        modern: 'p-5',
      },
      size: {
        sm: 'text-sm py-2 px-3',
        default: 'text-base',
        lg: 'text-lg py-5 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Accordion content variants
const accordionContentVariants = cva(
  [
    'overflow-hidden',
  ],
  {
    variants: {
      variant: {
        default: 'px-4 pb-4',
        bordered: 'px-4 pb-4',
        separated: 'px-4 pb-4',
        flush: 'pb-4',
        card: 'px-4 pb-4',
        minimal: 'pb-3',
        modern: 'px-5 pb-5',
      },
      size: {
        sm: 'text-sm px-3 pb-2',
        default: 'text-base',
        lg: 'text-lg px-5 pb-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Accordion context
interface AccordionContextValue {
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  disabled?: boolean;
  variant?: string;
  size?: string;
  animated?: boolean;
  iconType?: string;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion');
  }
  return context;
};

// Enhanced accordion props
export interface EnhancedAccordionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedAccordionVariants> {
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  disabled?: boolean;
  animated?: boolean;
  iconType?: 'chevron' | 'plus' | 'arrow';
  children: React.ReactNode;
}

// Accordion item props
export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
}

// Accordion trigger props
export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

// Accordion content props
export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Predefined icons
const PredefinedIcon = ({ iconType, isOpen }: { iconType: string; isOpen: boolean }) => {
  const iconClass = 'h-4 w-4 transition-transform duration-200';
  
  switch (iconType) {
    case 'chevron':
      return (
        <ChevronDown 
          className={cn(iconClass, isOpen && 'rotate-180')} 
        />
      );
    case 'plus':
      return isOpen ? (
        <Minus className={iconClass} />
      ) : (
        <Plus className={iconClass} />
      );
    case 'arrow':
      return (
        <ChevronRight 
          className={cn(iconClass, isOpen && 'rotate-90')} 
        />
      );
    default:
      return (
        <ChevronDown 
          className={cn(iconClass, isOpen && 'rotate-180')} 
        />
      );
  }
};

// Status icons
const StatusIcon = ({ type, className }: { type: string; className?: string }) => {
  const iconClass = cn('h-4 w-4', className);
  
  switch (type) {
    case 'info':
      return <Info className={cn(iconClass, 'text-blue-500')} />;
    case 'success':
      return <CheckCircle className={cn(iconClass, 'text-green-500')} />;
    case 'warning':
      return <AlertTriangle className={cn(iconClass, 'text-yellow-500')} />;
    case 'error':
      return <AlertCircle className={cn(iconClass, 'text-red-500')} />;
    case 'help':
      return <HelpCircle className={cn(iconClass, 'text-gray-500')} />;
    case 'settings':
      return <Settings className={cn(iconClass, 'text-gray-500')} />;
    case 'document':
      return <FileText className={cn(iconClass, 'text-gray-500')} />;
    case 'user':
      return <User className={cn(iconClass, 'text-gray-500')} />;
    case 'calendar':
      return <Calendar className={cn(iconClass, 'text-gray-500')} />;
    case 'mail':
      return <Mail className={cn(iconClass, 'text-gray-500')} />;
    default:
      return null;
  }
};

// Main Accordion Component
const EnhancedAccordion = React.forwardRef<HTMLDivElement, EnhancedAccordionProps>(
  (props, ref) => {
    const {
      type = 'single',
      value: controlledValue,
      defaultValue,
      onValueChange,
      collapsible = false,
      disabled = false,
      animated = true,
      iconType = 'chevron',
      variant,
      size,
      className,
      children,
      ...divProps
    } = props;

    // State
    const [internalValue, setInternalValue] = useState<string | string[]>(
      controlledValue ?? defaultValue ?? (type === 'multiple' ? [] : '')
    );

    // Current value
    const currentValue = controlledValue ?? internalValue;

    // Handle value change
    const handleValueChange = (newValue: string | string[]) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    // Context value
    const contextValue: AccordionContextValue = {
      value: currentValue,
      onValueChange: handleValueChange,
      type,
      collapsible,
      disabled,
      variant,
      size,
      animated,
      iconType,
    };

    return (
      <AccordionContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(enhancedAccordionVariants({ variant, size }), className)}
          {...divProps}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

// Accordion Item Component
const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  (props, ref) => {
    const { value, disabled: itemDisabled, className, children, ...divProps } = props;
    const { variant, disabled: accordionDisabled } = useAccordion();
    
    const isDisabled = itemDisabled || accordionDisabled;

    return (
      <div
        ref={ref}
        className={cn(
          accordionItemVariants({ variant }),
          isDisabled && 'opacity-50',
          className
        )}
        data-value={value}
        {...divProps}
      >
        {children}
      </div>
    );
  }
);

// Accordion Trigger Component
const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  (props, ref) => {
    const {
      icon,
      iconPosition = 'right',
      className,
      children,
      disabled: triggerDisabled,
      onClick,
      ...buttonProps
    } = props;
    
    const {
      value: accordionValue,
      onValueChange,
      type,
      collapsible,
      disabled: accordionDisabled,
      variant,
      size,
      iconType,
    } = useAccordion();
    
    // Get item value from parent
    const itemElement = ref && 'current' in ref ? ref.current?.closest('[data-value]') : null;
    const itemValue = itemElement?.getAttribute('data-value') || '';
    
    // Check if item is open
    const isOpen = type === 'multiple'
      ? Array.isArray(accordionValue) && accordionValue.includes(itemValue)
      : accordionValue === itemValue;
    
    const isDisabled = triggerDisabled || accordionDisabled;

    // Handle click
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      
      onClick?.(event);
      
      if (type === 'multiple') {
        const currentValues = Array.isArray(accordionValue) ? accordionValue : [];
        const newValues = isOpen
          ? currentValues.filter(v => v !== itemValue)
          : [...currentValues, itemValue];
        onValueChange?.(newValues);
      } else {
        const newValue = isOpen && collapsible ? '' : itemValue;
        onValueChange?.(newValue);
      }
    };

    return (
      <button
        ref={ref}
        className={cn(
          accordionTriggerVariants({ variant, size }),
          className
        )}
        disabled={isDisabled}
        onClick={handleClick}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${itemValue}`}
        {...buttonProps}
      >
        {/* Left Icon */}
        {iconPosition === 'left' && (
          <div className="flex items-center gap-2">
            {icon || <PredefinedIcon iconType={iconType || 'chevron'} isOpen={isOpen} />}
            <span>{children}</span>
          </div>
        )}
        
        {/* Content with Right Icon */}
        {iconPosition === 'right' && (
          <>
            <span className="text-left">{children}</span>
            {icon || <PredefinedIcon iconType={iconType || 'chevron'} isOpen={isOpen} />}
          </>
        )}
      </button>
    );
  }
);

// Accordion Content Component
const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  (props, ref) => {
    const { className, children, ...divProps } = props;
    const { value: accordionValue, type, variant, size, animated } = useAccordion();
    
    // Get item value from parent
    const itemElement = ref && 'current' in ref ? ref.current?.closest('[data-value]') : null;
    const itemValue = itemElement?.getAttribute('data-value') || '';
    
    // Check if item is open
    const isOpen = type === 'multiple'
      ? Array.isArray(accordionValue) && accordionValue.includes(itemValue)
      : accordionValue === itemValue;

    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            ref={ref}
            id={`accordion-content-${itemValue}`}
            className={cn(
              accordionContentVariants({ variant, size }),
              className
            )}
            initial={animated ? { height: 0, opacity: 0 } : false}
            animate={animated ? {
              height: 'auto',
              opacity: 1,
            } : false}
            exit={animated ? {
              height: 0,
              opacity: 0,
            } : false}
            transition={animated ? {
              duration: 0.3,
              ease: 'easeInOut',
            } : undefined}
            {...divProps}
          >
            <motion.div
              initial={animated ? { y: -10 } : false}
              animate={animated ? { y: 0 } : false}
              exit={animated ? { y: -10 } : false}
              transition={animated ? {
                duration: 0.2,
                delay: 0.1,
              } : undefined}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

// Display names
EnhancedAccordion.displayName = 'EnhancedAccordion';
AccordionItem.displayName = 'AccordionItem';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionContent.displayName = 'AccordionContent';

// Export components and utilities
export {
  EnhancedAccordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  StatusIcon,
  enhancedAccordionVariants,
};

export type {
  EnhancedAccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
};