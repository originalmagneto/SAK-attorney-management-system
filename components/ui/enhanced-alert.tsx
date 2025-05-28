/**
 * Enhanced Alert Component
 * Modern, feature-rich alert with animations, variants, and accessibility
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  X,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Bell,
  Lightbulb,
  Shield,
  Zap,
  Heart,
  Star,
  Gift,
  Megaphone,
  Clock,
  TrendingUp,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';

// Enhanced alert variants
const enhancedAlertVariants = cva(
  [
    'relative w-full rounded-lg border p-4',
    'transition-all duration-300',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-gray-50 border-gray-200 text-gray-900',
          'dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100',
        ],
        info: [
          'bg-blue-50 border-blue-200 text-blue-900',
          'dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
        ],
        success: [
          'bg-green-50 border-green-200 text-green-900',
          'dark:bg-green-950 dark:border-green-800 dark:text-green-100',
        ],
        warning: [
          'bg-yellow-50 border-yellow-200 text-yellow-900',
          'dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100',
        ],
        error: [
          'bg-red-50 border-red-200 text-red-900',
          'dark:bg-red-950 dark:border-red-800 dark:text-red-100',
        ],
        destructive: [
          'bg-red-50 border-red-200 text-red-900',
          'dark:bg-red-950 dark:border-red-800 dark:text-red-100',
        ],
        gradient: [
          'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200',
          'text-gray-900 dark:from-blue-950 dark:to-purple-950',
          'dark:border-blue-800 dark:text-gray-100',
        ],
        glass: [
          'bg-white/70 backdrop-blur-sm border-white/30',
          'text-gray-900 dark:bg-gray-900/70 dark:border-gray-700/30',
          'dark:text-gray-100',
        ],
        solid: [
          'bg-gray-900 border-gray-900 text-white',
          'dark:bg-gray-100 dark:border-gray-100 dark:text-gray-900',
        ],
      },
      size: {
        sm: 'p-3 text-sm',
        default: 'p-4 text-base',
        lg: 'p-6 text-lg',
      },
      shape: {
        rounded: 'rounded-lg',
        square: 'rounded-none',
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'rounded',
    },
  }
);

// Alert icon variants
const alertIconVariants = cva(
  [
    'flex-shrink-0',
  ],
  {
    variants: {
      variant: {
        default: 'text-gray-600 dark:text-gray-400',
        info: 'text-blue-600 dark:text-blue-400',
        success: 'text-green-600 dark:text-green-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        error: 'text-red-600 dark:text-red-400',
        destructive: 'text-red-600 dark:text-red-400',
        gradient: 'text-blue-600 dark:text-blue-400',
        glass: 'text-gray-600 dark:text-gray-400',
        solid: 'text-white dark:text-gray-900',
      },
      size: {
        sm: 'h-4 w-4',
        default: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Enhanced alert props
export interface EnhancedAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedAlertVariants> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  iconType?: string;
  closable?: boolean;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  animated?: boolean;
  actions?: React.ReactNode;
  progress?: boolean;
  progressValue?: number;
  children?: React.ReactNode;
}

// Predefined icons
const PredefinedIcon = ({ iconType, variant, size }: {
  iconType: string;
  variant?: string;
  size?: string;
}) => {
  const iconClass = cn(alertIconVariants({ variant, size }));
  
  const icons: Record<string, React.ReactNode> = {
    // Status icons
    info: <Info className={iconClass} />,
    success: <CheckCircle className={iconClass} />,
    warning: <AlertTriangle className={iconClass} />,
    error: <AlertCircle className={iconClass} />,
    
    // General icons
    bell: <Bell className={iconClass} />,
    lightbulb: <Lightbulb className={iconClass} />,
    shield: <Shield className={iconClass} />,
    zap: <Zap className={iconClass} />,
    heart: <Heart className={iconClass} />,
    star: <Star className={iconClass} />,
    gift: <Gift className={iconClass} />,
    megaphone: <Megaphone className={iconClass} />,
    clock: <Clock className={iconClass} />,
    trending: <TrendingUp className={iconClass} />,
    download: <Download className={iconClass} />,
    upload: <Upload className={iconClass} />,
    mail: <Mail className={iconClass} />,
    phone: <Phone className={iconClass} />,
    location: <MapPin className={iconClass} />,
    calendar: <Calendar className={iconClass} />,
  };
  
  return icons[iconType] || null;
};

// Get default icon for variant
const getDefaultIcon = (variant?: string) => {
  switch (variant) {
    case 'info':
      return <Info />;
    case 'success':
      return <CheckCircle />;
    case 'warning':
      return <AlertTriangle />;
    case 'error':
    case 'destructive':
      return <AlertCircle />;
    default:
      return <Info />;
  }
};

const EnhancedAlert = React.forwardRef<HTMLDivElement, EnhancedAlertProps>(
  (props, ref) => {
    const {
      title,
      description,
      icon,
      iconType,
      closable = false,
      onClose,
      autoClose = false,
      autoCloseDelay = 5000,
      animated = true,
      actions,
      progress = false,
      progressValue = 0,
      variant,
      size,
      shape,
      className,
      children,
      ...divProps
    } = props;

    // State
    const [isVisible, setIsVisible] = useState(true);
    const [progressPercent, setProgressPercent] = useState(0);

    // Auto close effect
    useEffect(() => {
      if (autoClose && autoCloseDelay > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);

        // Progress animation
        if (progress) {
          const interval = setInterval(() => {
            setProgressPercent((prev) => {
              const increment = 100 / (autoCloseDelay / 100);
              return Math.min(prev + increment, 100);
            });
          }, 100);

          return () => {
            clearTimeout(timer);
            clearInterval(interval);
          };
        }

        return () => clearTimeout(timer);
      }
    }, [autoClose, autoCloseDelay, progress]);

    // Handle close
    const handleClose = () => {
      if (animated) {
        setIsVisible(false);
        // Delay the onClose callback to allow exit animation
        setTimeout(() => {
          onClose?.();
        }, 300);
      } else {
        onClose?.();
      }
    };

    // Determine icon to display
    const displayIcon = icon || 
      (iconType ? <PredefinedIcon iconType={iconType} variant={variant} size={size} /> : null) ||
      getDefaultIcon(variant);

    // Animation variants
    const alertVariants = {
      initial: {
        opacity: 0,
        scale: 0.95,
        y: -10,
      },
      animate: {
        opacity: 1,
        scale: 1,
        y: 0,
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        y: -10,
      },
    };

    const iconVariants = {
      initial: { scale: 0, rotate: -180 },
      animate: {
        scale: 1,
        rotate: 0,
        transition: {
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.1,
        },
      },
    };

    const contentVariants = {
      initial: { opacity: 0, x: -20 },
      animate: {
        opacity: 1,
        x: 0,
        transition: {
          delay: 0.2,
          duration: 0.3,
        },
      },
    };

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={ref}
            className={cn(enhancedAlertVariants({ variant, size, shape }), className)}
            variants={animated ? alertVariants : undefined}
            initial={animated ? 'initial' : false}
            animate={animated ? 'animate' : false}
            exit={animated ? 'exit' : false}
            transition={animated ? {
              duration: 0.3,
              ease: 'easeInOut',
            } : undefined}
            role="alert"
            {...divProps}
          >
            {/* Progress Bar */}
            {(progress && autoClose) && (
              <motion.div
                className="absolute top-0 left-0 h-1 bg-current opacity-30 rounded-t-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            )}

            {/* Main Content */}
            <div className="flex items-start gap-3">
              {/* Icon */}
              {displayIcon && (
                <motion.div
                  className={cn(alertIconVariants({ variant, size }))}
                  variants={animated ? iconVariants : undefined}
                  initial={animated ? 'initial' : false}
                  animate={animated ? 'animate' : false}
                >
                  {React.cloneElement(displayIcon as React.ReactElement, {
                    className: cn(alertIconVariants({ variant, size })),
                  })}
                </motion.div>
              )}

              {/* Content */}
              <motion.div
                className="flex-1 min-w-0"
                variants={animated ? contentVariants : undefined}
                initial={animated ? 'initial' : false}
                animate={animated ? 'animate' : false}
              >
                {/* Title */}
                {title && (
                  <div className="font-semibold mb-1">
                    {title}
                  </div>
                )}

                {/* Description */}
                {description && (
                  <div className={cn(
                    'text-sm opacity-90',
                    title && 'mt-1'
                  )}>
                    {description}
                  </div>
                )}

                {/* Children */}
                {children && (
                  <div className={cn(
                    (title || description) && 'mt-2'
                  )}>
                    {children}
                  </div>
                )}

                {/* Actions */}
                {actions && (
                  <div className="mt-3 flex items-center gap-2">
                    {actions}
                  </div>
                )}
              </motion.div>

              {/* Close Button */}
              {closable && (
                <motion.button
                  className={cn(
                    'flex-shrink-0 p-1 rounded-md',
                    'hover:bg-black/10 dark:hover:bg-white/10',
                    'transition-colors duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2'
                  )}
                  onClick={handleClose}
                  aria-label="Close alert"
                  initial={animated ? { opacity: 0, scale: 0 } : false}
                  animate={animated ? {
                    opacity: 1,
                    scale: 1,
                    transition: { delay: 0.3 },
                  } : false}
                  whileHover={animated ? { scale: 1.1 } : undefined}
                  whileTap={animated ? { scale: 0.95 } : undefined}
                >
                  <X className={cn(alertIconVariants({ size }))} />
                </motion.button>
              )}
            </div>

            {/* Custom Progress Bar */}
            {progress && !autoClose && typeof progressValue === 'number' && (
              <div className="mt-3">
                <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2">
                  <motion.div
                    className="h-2 bg-current rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(Math.max(progressValue, 0), 100)}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

EnhancedAlert.displayName = 'EnhancedAlert';

// Alert Title Component
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

// Alert Description Component
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

// Export components and utilities
export {
  EnhancedAlert,
  AlertTitle,
  AlertDescription,
  PredefinedIcon,
  enhancedAlertVariants,
};

export type { EnhancedAlertProps };