/**
 * Enhanced Modal Component
 * Modern, accessible modal with advanced animations and multiple variants
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { modalVariants, overlayVariants } from '@/lib/animations';

// Enhanced modal variants
const enhancedModalVariants = cva(
  [
    // Base styles
    'relative bg-white rounded-xl shadow-2xl',
    'dark:bg-gray-900 dark:border dark:border-gray-700',
    'max-h-[90vh] overflow-hidden',
    'focus:outline-none',
  ],
  {
    variants: {
      size: {
        xs: 'w-full max-w-xs',
        sm: 'w-full max-w-sm',
        default: 'w-full max-w-md',
        lg: 'w-full max-w-lg',
        xl: 'w-full max-w-xl',
        '2xl': 'w-full max-w-2xl',
        '3xl': 'w-full max-w-3xl',
        '4xl': 'w-full max-w-4xl',
        '5xl': 'w-full max-w-5xl',
        '6xl': 'w-full max-w-6xl',
        '7xl': 'w-full max-w-7xl',
        full: 'w-full max-w-full m-4',
      },
      variant: {
        default: '',
        success: 'border-l-4 border-l-green-500',
        warning: 'border-l-4 border-l-yellow-500',
        error: 'border-l-4 border-l-red-500',
        info: 'border-l-4 border-l-blue-500',
        glass: [
          'bg-white/10 backdrop-blur-md border border-white/20',
          'dark:bg-black/10 dark:border-white/10',
        ],
        gradient: [
          'bg-gradient-to-br from-white via-gray-50 to-gray-100',
          'dark:from-gray-900 dark:via-gray-800 dark:to-gray-700',
        ],
      },
      centered: {
        true: '',
        false: 'mt-16',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
      centered: true,
    },
  }
);

// Modal header variants
const modalHeaderVariants = cva(
  'flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700',
  {
    variants: {
      variant: {
        default: '',
        success: 'bg-green-50 dark:bg-green-900/20',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20',
        error: 'bg-red-50 dark:bg-red-900/20',
        info: 'bg-blue-50 dark:bg-blue-900/20',
        glass: 'bg-transparent border-white/20',
        gradient: 'bg-gradient-to-r from-transparent to-gray-50/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Modal content variants
const modalContentVariants = cva(
  'p-6 overflow-y-auto',
  {
    variants: {
      size: {
        xs: 'max-h-60',
        sm: 'max-h-72',
        default: 'max-h-96',
        lg: 'max-h-[32rem]',
        xl: 'max-h-[36rem]',
        '2xl': 'max-h-[40rem]',
        '3xl': 'max-h-[44rem]',
        '4xl': 'max-h-[48rem]',
        '5xl': 'max-h-[52rem]',
        '6xl': 'max-h-[56rem]',
        '7xl': 'max-h-[60rem]',
        full: 'max-h-[calc(90vh-8rem)]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// Modal footer variants
const modalFooterVariants = cva(
  'flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
);

// Variant icons
const VariantIcon = ({ variant }: { variant: 'success' | 'warning' | 'error' | 'info' }) => {
  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
  };
  
  const colors = {
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
  };
  
  const Icon = icons[variant];
  
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30, delay: 0.1 }}
    >
      <Icon className={cn('h-6 w-6', colors[variant])} />
    </motion.div>
  );
};

// Focus trap hook
const useFocusTrap = (isOpen: boolean, containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    
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
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, containerRef]);
};

export interface EnhancedModalProps
  extends VariantProps<typeof enhancedModalVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  preventScroll?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  animationPreset?: 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'flip';
  onAnimationComplete?: () => void;
  role?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

const EnhancedModal = React.forwardRef<HTMLDivElement, EnhancedModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      footer,
      size,
      variant,
      centered,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      preventScroll = true,
      className,
      overlayClassName,
      contentClassName,
      headerClassName,
      footerClassName,
      animationPreset = 'scale',
      onAnimationComplete,
      role = 'dialog',
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      ...props
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    
    // Focus trap
    useFocusTrap(isOpen, modalRef);
    
    // Handle escape key
    useEffect(() => {
      if (!closeOnEscape) return;
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape, onClose]);
    
    // Prevent scroll
    useEffect(() => {
      if (!preventScroll) return;
      
      if (isOpen) {
        previousActiveElement.current = document.activeElement as HTMLElement;
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        previousActiveElement.current?.focus();
      }
      
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen, preventScroll]);
    
    // Animation variants based on preset
    const getAnimationVariants = () => {
      const baseVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
      
      switch (animationPreset) {
        case 'scale':
          return {
            ...baseVariants,
            initial: { ...baseVariants.initial, scale: 0.8 },
            animate: { ...baseVariants.animate, scale: 1 },
            exit: { ...baseVariants.exit, scale: 0.8 },
          };
        case 'slide-up':
          return {
            ...baseVariants,
            initial: { ...baseVariants.initial, y: 50 },
            animate: { ...baseVariants.animate, y: 0 },
            exit: { ...baseVariants.exit, y: 50 },
          };
        case 'slide-down':
          return {
            ...baseVariants,
            initial: { ...baseVariants.initial, y: -50 },
            animate: { ...baseVariants.animate, y: 0 },
            exit: { ...baseVariants.exit, y: -50 },
          };
        case 'slide-left':
          return {
            ...baseVariants,
            initial: { ...baseVariants.initial, x: 50 },
            animate: { ...baseVariants.animate, x: 0 },
            exit: { ...baseVariants.exit, x: 50 },
          };
        case 'slide-right':
          return {
            ...baseVariants,
            initial: { ...baseVariants.initial, x: -50 },
            animate: { ...baseVariants.animate, x: 0 },
            exit: { ...baseVariants.exit, x: -50 },
          };
        case 'flip':
          return {
            ...baseVariants,
            initial: { ...baseVariants.initial, rotateX: -90 },
            animate: { ...baseVariants.animate, rotateX: 0 },
            exit: { ...baseVariants.exit, rotateX: 90 },
          };
        default:
          return baseVariants;
      }
    };
    
    const animationVariants = getAnimationVariants();
    
    return (
      <AnimatePresence onExitComplete={onAnimationComplete}>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              className={cn(
                'absolute inset-0 bg-black/50 backdrop-blur-sm',
                overlayClassName
              )}
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={closeOnOverlayClick ? onClose : undefined}
            />
            
            {/* Modal */}
            <motion.div
              ref={modalRef}
              className={cn(
                enhancedModalVariants({ size, variant, centered }),
                className
              )}
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.3,
              }}
              role={role}
              aria-modal="true"
              aria-labelledby={ariaLabelledby || (title ? 'modal-title' : undefined)}
              aria-describedby={ariaDescribedby || (description ? 'modal-description' : undefined)}
              {...props}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <motion.div
                  className={cn(modalHeaderVariants({ variant }), headerClassName)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    {/* Variant Icon */}
                    {variant && ['success', 'warning', 'error', 'info'].includes(variant) && (
                      <VariantIcon variant={variant as 'success' | 'warning' | 'error' | 'info'} />
                    )}
                    
                    {/* Title */}
                    {title && (
                      <div>
                        <h2
                          id="modal-title"
                          className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                        >
                          {title}
                        </h2>
                        {description && (
                          <p
                            id="modal-description"
                            className="mt-1 text-sm text-gray-600 dark:text-gray-400"
                          >
                            {description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Close Button */}
                  {showCloseButton && (
                    <motion.button
                      type="button"
                      onClick={onClose}
                      className={cn(
                        'rounded-lg p-1.5 text-gray-400 transition-colors',
                        'hover:bg-gray-100 hover:text-gray-600',
                        'dark:hover:bg-gray-700 dark:hover:text-gray-300',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500'
                      )}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Close modal"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  )}
                </motion.div>
              )}
              
              {/* Content */}
              <motion.div
                className={cn(modalContentVariants({ size }), contentClassName)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {children}
              </motion.div>
              
              {/* Footer */}
              {footer && (
                <motion.div
                  className={cn(modalFooterVariants(), footerClassName)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {footer}
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }
);

EnhancedModal.displayName = 'EnhancedModal';

// Modal Header Component
export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof modalHeaderVariants>['variant'];
}

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(modalHeaderVariants({ variant }), className)}
      {...props}
    />
  )
);
ModalHeader.displayName = 'ModalHeader';

// Modal Content Component
export interface ModalContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalContentVariants> {}

const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(modalContentVariants({ size }), className)}
      {...props}
    />
  )
);
ModalContent.displayName = 'ModalContent';

// Modal Footer Component
export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(modalFooterVariants(), className)}
      {...props}
    />
  )
);
ModalFooter.displayName = 'ModalFooter';

export {
  EnhancedModal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  enhancedModalVariants,
};

export type {
  EnhancedModalProps,
  ModalHeaderProps,
  ModalContentProps,
  ModalFooterProps,
};