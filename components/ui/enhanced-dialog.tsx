/**
 * Enhanced Dialog Component
 * Modern, feature-rich dialog with animations, variants, and accessibility
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { createPortal } from 'react-dom';

// Enhanced dialog variants
const enhancedDialogVariants = cva(
  [
    'relative bg-white dark:bg-gray-900',
    'border border-gray-200 dark:border-gray-700',
    'shadow-xl',
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
          'border-0 shadow-2xl',
        ],
        modern: [
          'bg-white dark:bg-gray-900',
          'border-gray-100 dark:border-gray-800',
          'shadow-2xl',
        ],
      },
      size: {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        default: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        full: 'max-w-full',
        screen: 'w-screen h-screen max-w-none',
      },
      shape: {
        rounded: 'rounded-lg',
        square: 'rounded-none',
        pill: 'rounded-3xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'rounded',
    },
  }
);

// Overlay variants
const overlayVariants = cva(
  [
    'fixed inset-0 z-50',
    'flex items-center justify-center',
    'p-4',
  ],
  {
    variants: {
      backdrop: {
        default: 'bg-black/50',
        light: 'bg-black/30',
        dark: 'bg-black/70',
        blur: 'bg-black/30 backdrop-blur-sm',
        none: 'bg-transparent',
      },
    },
    defaultVariants: {
      backdrop: 'default',
    },
  }
);

// Enhanced dialog props
export interface EnhancedDialogProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedDialogVariants> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  backdrop?: 'default' | 'light' | 'dark' | 'blur' | 'none';
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  fullscreenable?: boolean;
  animated?: boolean;
  animationPreset?: 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'flip';
  portal?: boolean;
  portalContainer?: Element;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  children?: React.ReactNode;
}

// Hook for managing focus trap
const useFocusTrap = (enabled: boolean, containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [enabled, containerRef]);
};

const EnhancedDialog = React.forwardRef<HTMLDivElement, EnhancedDialogProps>(
  (props, ref) => {
    const {
      open = false,
      onOpenChange,
      modal = true,
      backdrop = 'default',
      closeOnBackdropClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      resizable = false,
      draggable = false,
      fullscreenable = false,
      animated = true,
      animationPreset = 'scale',
      portal = true,
      portalContainer,
      trapFocus = true,
      restoreFocus = true,
      variant,
      size,
      shape,
      className,
      children,
      ...divProps
    } = props;

    // State
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [previousActiveElement, setPreviousActiveElement] = useState<Element | null>(null);
    const dialogRef = React.useRef<HTMLDivElement>(null);
    const overlayRef = React.useRef<HTMLDivElement>(null);

    // Focus trap
    useFocusTrap(trapFocus && open, dialogRef);

    // Store previous active element for focus restoration
    useEffect(() => {
      if (open && restoreFocus) {
        setPreviousActiveElement(document.activeElement);
      }
    }, [open, restoreFocus]);

    // Restore focus when dialog closes
    useEffect(() => {
      if (!open && restoreFocus && previousActiveElement) {
        (previousActiveElement as HTMLElement)?.focus();
        setPreviousActiveElement(null);
      }
    }, [open, restoreFocus, previousActiveElement]);

    // Handle escape key
    useEffect(() => {
      if (!closeOnEscape || !open) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onOpenChange?.(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [closeOnEscape, open, onOpenChange]);

    // Handle backdrop click
    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
      if (closeOnBackdropClick && e.target === overlayRef.current) {
        onOpenChange?.(false);
      }
    }, [closeOnBackdropClick, onOpenChange]);

    // Handle close button
    const handleClose = useCallback(() => {
      onOpenChange?.(false);
    }, [onOpenChange]);

    // Handle fullscreen toggle
    const handleFullscreenToggle = useCallback(() => {
      setIsFullscreen(!isFullscreen);
    }, [isFullscreen]);

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
        'slide-up': {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 50 },
        },
        'slide-down': {
          initial: { opacity: 0, y: -50 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -50 },
        },
        'slide-left': {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 50 },
        },
        'slide-right': {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -50 },
        },
        flip: {
          initial: { opacity: 0, rotateX: -90 },
          animate: { opacity: 1, rotateX: 0 },
          exit: { opacity: 0, rotateX: 90 },
        },
      };

      return variants[animationPreset] || variants.scale;
    };

    const overlayAnimation = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };

    const dialogAnimation = getAnimationVariants();

    // Dialog content
    const dialogContent = (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            className={cn(overlayVariants({ backdrop }))}
            onClick={handleBackdropClick}
            variants={animated ? overlayAnimation : undefined}
            initial={animated ? 'initial' : false}
            animate={animated ? 'animate' : false}
            exit={animated ? 'exit' : false}
            transition={animated ? { duration: 0.2 } : undefined}
          >
            <motion.div
              ref={dialogRef}
              className={cn(
                enhancedDialogVariants({
                  variant,
                  size: isFullscreen ? 'screen' : size,
                  shape: isFullscreen ? 'square' : shape,
                }),
                isFullscreen && 'rounded-none',
                className
              )}
              variants={animated ? dialogAnimation : undefined}
              initial={animated ? 'initial' : false}
              animate={animated ? 'animate' : false}
              exit={animated ? 'exit' : false}
              transition={animated ? {
                duration: 0.3,
                ease: 'easeOut',
              } : undefined}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal={modal}
              tabIndex={-1}
              {...divProps}
            >
              {/* Header with controls */}
              {(showCloseButton || fullscreenable) && (
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                  {fullscreenable && (
                    <motion.button
                      className={cn(
                        'p-2 rounded-md',
                        'text-gray-500 hover:text-gray-700',
                        'dark:text-gray-400 dark:hover:text-gray-200',
                        'hover:bg-gray-100 dark:hover:bg-gray-800',
                        'transition-colors duration-150',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500'
                      )}
                      onClick={handleFullscreenToggle}
                      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                      whileHover={animated ? { scale: 1.05 } : undefined}
                      whileTap={animated ? { scale: 0.95 } : undefined}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </motion.button>
                  )}

                  {showCloseButton && (
                    <motion.button
                      className={cn(
                        'p-2 rounded-md',
                        'text-gray-500 hover:text-gray-700',
                        'dark:text-gray-400 dark:hover:text-gray-200',
                        'hover:bg-gray-100 dark:hover:bg-gray-800',
                        'transition-colors duration-150',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500'
                      )}
                      onClick={handleClose}
                      aria-label="Close dialog"
                      whileHover={animated ? { scale: 1.05 } : undefined}
                      whileTap={animated ? { scale: 0.95 } : undefined}
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="relative">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );

    // Render with or without portal
    if (portal) {
      const container = portalContainer || (typeof document !== 'undefined' ? document.body : null);
      return container ? createPortal(dialogContent, container) : null;
    }

    return dialogContent;
  }
);

EnhancedDialog.displayName = 'EnhancedDialog';

// Dialog Header Component
const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      'p-6 pb-4',
      className
    )}
    {...props}
  />
));
DialogHeader.displayName = 'DialogHeader';

// Dialog Footer Component
const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      'p-6 pt-4',
      className
    )}
    {...props}
  />
));
DialogFooter.displayName = 'DialogFooter';

// Dialog Title Component
const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      'text-gray-900 dark:text-gray-100',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

// Dialog Description Component
const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-gray-600 dark:text-gray-400',
      className
    )}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

// Dialog Content Component
const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6', className)}
    {...props}
  />
));
DialogContent.displayName = 'DialogContent';

// Export components and utilities
export {
  EnhancedDialog,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogContent,
  enhancedDialogVariants,
  overlayVariants,
};

export type { EnhancedDialogProps };