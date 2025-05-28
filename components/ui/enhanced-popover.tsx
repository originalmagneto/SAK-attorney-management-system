/**
 * Enhanced Popover Component
 * Modern, feature-rich popover with animations, positioning, and accessibility
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

// Enhanced popover variants
const enhancedPopoverVariants = cva(
  [
    'relative z-50',
    'bg-white dark:bg-gray-900',
    'border border-gray-200 dark:border-gray-700',
    'shadow-lg',
    'focus:outline-none',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-white dark:bg-gray-900',
          'border-gray-200 dark:border-gray-700',
        ],
        glass: [
          'bg-white/80 dark:bg-gray-900/80',
          'backdrop-blur-xl',
          'border-white/20 dark:border-gray-700/20',
        ],
        gradient: [
          'bg-gradient-to-br from-white to-gray-50',
          'dark:from-gray-900 dark:to-gray-800',
          'border-gray-200 dark:border-gray-700',
        ],
        minimal: [
          'bg-white dark:bg-gray-900',
          'border-0 shadow-xl',
        ],
        tooltip: [
          'bg-gray-900 dark:bg-gray-100',
          'text-white dark:text-gray-900',
          'border-gray-900 dark:border-gray-100',
          'text-sm',
        ],
      },
      size: {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        default: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        auto: 'max-w-max',
      },
      shape: {
        rounded: 'rounded-lg',
        square: 'rounded-none',
        pill: 'rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'rounded',
    },
  }
);

// Arrow variants
const arrowVariants = cva(
  [
    'absolute w-3 h-3',
    'rotate-45',
  ],
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700',
        glass: 'bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-700/20',
        gradient: 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700',
        minimal: 'bg-white dark:bg-gray-900 border-0',
        tooltip: 'bg-gray-900 dark:bg-gray-100 border-gray-900 dark:border-gray-100',
      },
      side: {
        top: 'border-t border-l',
        bottom: 'border-b border-r',
        left: 'border-l border-b',
        right: 'border-r border-t',
      },
    },
    defaultVariants: {
      variant: 'default',
      side: 'bottom',
    },
  }
);

// Position types
type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

// Enhanced popover props
export interface EnhancedPopoverProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedPopoverVariants> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  content?: React.ReactNode;
  side?: Side;
  align?: Align;
  offset?: number;
  arrow?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  closeOnScroll?: boolean;
  animated?: boolean;
  animationPreset?: 'fade' | 'scale' | 'slide' | 'flip';
  portal?: boolean;
  portalContainer?: Element;
  delay?: number;
  hoverToOpen?: boolean;
  clickToOpen?: boolean;
  focusToOpen?: boolean;
  interactive?: boolean;
  children?: React.ReactNode;
}

// Position calculation utility
const calculatePosition = (
  triggerRect: DOMRect,
  popoverRect: DOMRect,
  side: Side,
  align: Align,
  offset: number
) => {
  let x = 0;
  let y = 0;

  // Calculate position based on side
  switch (side) {
    case 'top':
      y = triggerRect.top - popoverRect.height - offset;
      break;
    case 'bottom':
      y = triggerRect.bottom + offset;
      break;
    case 'left':
      x = triggerRect.left - popoverRect.width - offset;
      break;
    case 'right':
      x = triggerRect.right + offset;
      break;
  }

  // Calculate alignment
  if (side === 'top' || side === 'bottom') {
    switch (align) {
      case 'start':
        x = triggerRect.left;
        break;
      case 'center':
        x = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
        break;
      case 'end':
        x = triggerRect.right - popoverRect.width;
        break;
    }
  } else {
    switch (align) {
      case 'start':
        y = triggerRect.top;
        break;
      case 'center':
        y = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
        break;
      case 'end':
        y = triggerRect.bottom - popoverRect.height;
        break;
    }
  }

  // Ensure popover stays within viewport
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  x = Math.max(8, Math.min(x, viewport.width - popoverRect.width - 8));
  y = Math.max(8, Math.min(y, viewport.height - popoverRect.height - 8));

  return { x, y };
};

// Calculate arrow position
const calculateArrowPosition = (
  triggerRect: DOMRect,
  popoverRect: DOMRect,
  side: Side,
  align: Align,
  popoverPosition: { x: number; y: number }
) => {
  let x = 0;
  let y = 0;

  const arrowSize = 12; // 3 * 4 (w-3 h-3)

  if (side === 'top' || side === 'bottom') {
    y = side === 'top' ? popoverRect.height - arrowSize / 2 : -arrowSize / 2;
    
    // Calculate x based on trigger center relative to popover
    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    x = triggerCenter - popoverPosition.x - arrowSize / 2;
    
    // Clamp arrow position within popover bounds
    x = Math.max(arrowSize, Math.min(x, popoverRect.width - arrowSize * 2));
  } else {
    x = side === 'left' ? popoverRect.width - arrowSize / 2 : -arrowSize / 2;
    
    // Calculate y based on trigger center relative to popover
    const triggerCenter = triggerRect.top + triggerRect.height / 2;
    y = triggerCenter - popoverPosition.y - arrowSize / 2;
    
    // Clamp arrow position within popover bounds
    y = Math.max(arrowSize, Math.min(y, popoverRect.height - arrowSize * 2));
  }

  return { x, y };
};

const EnhancedPopover = React.forwardRef<HTMLDivElement, EnhancedPopoverProps>(
  (props, ref) => {
    const {
      open: controlledOpen,
      onOpenChange,
      trigger,
      content,
      side = 'bottom',
      align = 'center',
      offset = 8,
      arrow = true,
      closeOnClickOutside = true,
      closeOnEscape = true,
      closeOnScroll = false,
      animated = true,
      animationPreset = 'scale',
      portal = true,
      portalContainer,
      delay = 0,
      hoverToOpen = false,
      clickToOpen = true,
      focusToOpen = false,
      interactive = true,
      variant,
      size,
      shape,
      className,
      children,
      ...divProps
    } = props;

    // State
    const [internalOpen, setInternalOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [arrowPosition, setArrowPosition] = useState({ x: 0, y: 0 });
    const [delayTimeout, setDelayTimeout] = useState<NodeJS.Timeout | null>(null);

    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setIsOpen = onOpenChange || setInternalOpen;

    // Refs
    const triggerRef = useRef<HTMLElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Update position
    const updatePosition = useCallback(() => {
      if (!triggerRef.current || !popoverRef.current || !isOpen) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();

      const newPosition = calculatePosition(triggerRect, popoverRect, side, align, offset);
      setPosition(newPosition);

      if (arrow) {
        const newArrowPosition = calculateArrowPosition(
          triggerRect,
          popoverRect,
          side,
          align,
          newPosition
        );
        setArrowPosition(newArrowPosition);
      }
    }, [isOpen, side, align, offset, arrow]);

    // Update position on open and window events
    useEffect(() => {
      if (isOpen) {
        updatePosition();
        
        const handleResize = () => updatePosition();
        const handleScroll = () => {
          if (closeOnScroll) {
            setIsOpen(false);
          } else {
            updatePosition();
          }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('scroll', handleScroll, true);
        };
      }
    }, [isOpen, updatePosition, closeOnScroll, setIsOpen]);

    // Handle click outside
    useEffect(() => {
      if (!closeOnClickOutside || !isOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          triggerRef.current?.contains(target) ||
          popoverRef.current?.contains(target)
        ) {
          return;
        }
        setIsOpen(false);
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeOnClickOutside, isOpen, setIsOpen]);

    // Handle escape key
    useEffect(() => {
      if (!closeOnEscape || !isOpen) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [closeOnEscape, isOpen, setIsOpen]);

    // Handle delayed open/close
    const handleDelayedOpen = useCallback((shouldOpen: boolean) => {
      if (delayTimeout) {
        clearTimeout(delayTimeout);
        setDelayTimeout(null);
      }

      if (delay > 0) {
        const timeout = setTimeout(() => {
          setIsOpen(shouldOpen);
          setDelayTimeout(null);
        }, delay);
        setDelayTimeout(timeout);
      } else {
        setIsOpen(shouldOpen);
      }
    }, [delay, delayTimeout, setIsOpen]);

    // Trigger event handlers
    const triggerHandlers = {
      onClick: clickToOpen ? () => setIsOpen(!isOpen) : undefined,
      onMouseEnter: hoverToOpen ? () => handleDelayedOpen(true) : undefined,
      onMouseLeave: hoverToOpen ? () => handleDelayedOpen(false) : undefined,
      onFocus: focusToOpen ? () => setIsOpen(true) : undefined,
      onBlur: focusToOpen ? () => setIsOpen(false) : undefined,
    };

    // Animation variants
    const getAnimationVariants = () => {
      const variants = {
        fade: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        },
        scale: {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
        },
        slide: {
          initial: {
            opacity: 0,
            y: side === 'top' ? 10 : side === 'bottom' ? -10 : 0,
            x: side === 'left' ? 10 : side === 'right' ? -10 : 0,
          },
          animate: { opacity: 1, y: 0, x: 0 },
          exit: {
            opacity: 0,
            y: side === 'top' ? 10 : side === 'bottom' ? -10 : 0,
            x: side === 'left' ? 10 : side === 'right' ? -10 : 0,
          },
        },
        flip: {
          initial: { opacity: 0, rotateX: -90 },
          animate: { opacity: 1, rotateX: 0 },
          exit: { opacity: 0, rotateX: 90 },
        },
      };

      return variants[animationPreset] || variants.scale;
    };

    // Render trigger
    const renderTrigger = () => {
      if (!trigger) return null;

      return React.cloneElement(trigger as React.ReactElement, {
        ref: triggerRef,
        ...triggerHandlers,
      });
    };

    // Render popover content
    const renderPopover = () => (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            className={cn(
              enhancedPopoverVariants({ variant, size, shape }),
              'fixed',
              className
            )}
            style={{
              left: position.x,
              top: position.y,
            }}
            variants={animated ? getAnimationVariants() : undefined}
            initial={animated ? 'initial' : false}
            animate={animated ? 'animate' : false}
            exit={animated ? 'exit' : false}
            transition={animated ? {
              duration: 0.2,
              ease: 'easeOut',
            } : undefined}
            role="tooltip"
            {...divProps}
          >
            {/* Arrow */}
            {arrow && (
              <div
                className={cn(
                  arrowVariants({ variant, side }),
                  'border'
                )}
                style={{
                  left: arrowPosition.x,
                  top: arrowPosition.y,
                }}
              />
            )}

            {/* Content */}
            <div className="relative z-10 p-3">
              {content || children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );

    // Render with or without portal
    const popoverContent = renderPopover();
    const portalContent = portal ? (
      portalContainer ? 
        createPortal(popoverContent, portalContainer) :
        (typeof document !== 'undefined' ? createPortal(popoverContent, document.body) : null)
    ) : popoverContent;

    return (
      <>
        {renderTrigger()}
        {portalContent}
      </>
    );
  }
);

EnhancedPopover.displayName = 'EnhancedPopover';

// Popover Trigger Component
const PopoverTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ children, ...props }, ref) => {
  return React.cloneElement(children as React.ReactElement, {
    ref,
    ...props,
  });
});
PopoverTrigger.displayName = 'PopoverTrigger';

// Popover Content Component
const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-3', className)}
    {...props}
  />
));
PopoverContent.displayName = 'PopoverContent';

// Export components and utilities
export {
  EnhancedPopover,
  PopoverTrigger,
  PopoverContent,
  enhancedPopoverVariants,
  arrowVariants,
};

export type { EnhancedPopoverProps, Side, Align };