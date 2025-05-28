/**
 * Enhanced Toast Component
 * Modern, feature-rich toast notifications with animations and queue management
 */

'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  X,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  Bell,
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
import { createPortal } from 'react-dom';

// Enhanced toast variants
const enhancedToastVariants = cva(
  [
    'relative flex items-start gap-3 p-4',
    'border rounded-lg shadow-lg',
    'transition-all duration-300',
    'max-w-md w-full',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-white border-gray-200 text-gray-900',
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
        loading: [
          'bg-gray-50 border-gray-200 text-gray-900',
          'dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100',
        ],
        gradient: [
          'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200',
          'text-gray-900 dark:from-blue-950 dark:to-purple-950',
          'dark:border-blue-800 dark:text-gray-100',
        ],
        glass: [
          'bg-white/80 backdrop-blur-sm border-white/30',
          'text-gray-900 dark:bg-gray-900/80 dark:border-gray-700/30',
          'dark:text-gray-100',
        ],
      },
      size: {
        sm: 'p-3 text-sm max-w-xs',
        default: 'p-4 text-base max-w-md',
        lg: 'p-5 text-lg max-w-lg',
      },
      position: {
        'top-left': 'top-4 left-4',
        'top-center': 'top-4 left-1/2 -translate-x-1/2',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
        'bottom-right': 'bottom-4 right-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      position: 'top-right',
    },
  }
);

// Toast icon variants
const toastIconVariants = cva(
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
        loading: 'text-gray-600 dark:text-gray-400',
        gradient: 'text-blue-600 dark:text-blue-400',
        glass: 'text-gray-600 dark:text-gray-400',
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

// Toast types
export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error' | 'loading' | 'gradient' | 'glass';
  size?: 'sm' | 'default' | 'lg';
  icon?: React.ReactNode;
  iconType?: string;
  duration?: number;
  closable?: boolean;
  action?: React.ReactNode;
  onClose?: () => void;
  progress?: boolean;
  animated?: boolean;
}

export interface EnhancedToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedToastVariants> {
  toast: ToastData;
  onRemove: (id: string) => void;
}

// Toast context
interface ToastContextType {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Predefined icons
const PredefinedIcon = ({ iconType, variant, size }: {
  iconType: string;
  variant?: string;
  size?: string;
}) => {
  const iconClass = cn(toastIconVariants({ variant, size }));
  
  const icons: Record<string, React.ReactNode> = {
    // Status icons
    info: <Info className={iconClass} />,
    success: <CheckCircle className={iconClass} />,
    warning: <AlertTriangle className={iconClass} />,
    error: <AlertCircle className={iconClass} />,
    loading: <Loader2 className={cn(iconClass, 'animate-spin')} />,
    
    // General icons
    bell: <Bell className={iconClass} />,
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
      return <AlertCircle />;
    case 'loading':
      return <Loader2 className="animate-spin" />;
    default:
      return <Info />;
  }
};

// Individual Toast Component
const EnhancedToast = React.forwardRef<HTMLDivElement, EnhancedToastProps>(
  ({ toast, onRemove, className, ...props }, ref) => {
    const {
      id,
      title,
      description,
      variant = 'default',
      size = 'default',
      icon,
      iconType,
      duration = 5000,
      closable = true,
      action,
      onClose,
      progress = true,
      animated = true,
    } = toast;

    // State
    const [progressPercent, setProgressPercent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto dismiss effect
    useEffect(() => {
      if (duration <= 0 || isPaused) return;

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percent = (elapsed / duration) * 100;
        
        setProgressPercent(percent);
        
        if (percent >= 100) {
          handleClose();
        }
      }, 50);

      return () => clearInterval(interval);
    }, [duration, isPaused]);

    // Handle close
    const handleClose = useCallback(() => {
      onClose?.();
      onRemove(id);
    }, [id, onClose, onRemove]);

    // Determine icon to display
    const displayIcon = icon || 
      (iconType ? <PredefinedIcon iconType={iconType} variant={variant} size={size} /> : null) ||
      getDefaultIcon(variant);

    // Animation variants
    const toastVariants = {
      initial: {
        opacity: 0,
        scale: 0.95,
        x: 100,
      },
      animate: {
        opacity: 1,
        scale: 1,
        x: 0,
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        x: 100,
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
      <motion.div
        ref={ref}
        className={cn(
          enhancedToastVariants({ variant, size }),
          'fixed z-50',
          className
        )}
        variants={animated ? toastVariants : undefined}
        initial={animated ? 'initial' : false}
        animate={animated ? 'animate' : false}
        exit={animated ? 'exit' : false}
        transition={animated ? {
          duration: 0.3,
          ease: 'easeOut',
        } : undefined}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="alert"
        {...props}
      >
        {/* Progress Bar */}
        {progress && duration > 0 && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-lg"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.05, ease: 'linear' }}
          />
        )}

        {/* Icon */}
        {displayIcon && (
          <motion.div
            className={cn(toastIconVariants({ variant, size }))}
            variants={animated ? iconVariants : undefined}
            initial={animated ? 'initial' : false}
            animate={animated ? 'animate' : false}
          >
            {React.cloneElement(displayIcon as React.ReactElement, {
              className: cn(toastIconVariants({ variant, size })),
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

          {/* Action */}
          {action && (
            <div className="mt-3">
              {action}
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
            aria-label="Close toast"
            initial={animated ? { opacity: 0, scale: 0 } : false}
            animate={animated ? {
              opacity: 1,
              scale: 1,
              transition: { delay: 0.3 },
            } : false}
            whileHover={animated ? { scale: 1.1 } : undefined}
            whileTap={animated ? { scale: 0.95 } : undefined}
          >
            <X className={cn(toastIconVariants({ size }))} />
          </motion.button>
        )}
      </motion.div>
    );
  }
);

EnhancedToast.displayName = 'EnhancedToast';

// Toast Container Component
interface ToastContainerProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  maxToasts?: number;
  className?: string;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  maxToasts = 5,
  className,
}) => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('ToastContainer must be used within a ToastProvider');
  }

  const { toasts, removeToast } = context;
  const visibleToasts = toasts.slice(-maxToasts);

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return createPortal(
    <motion.div
      className={cn(
        'fixed z-50 flex flex-col gap-2',
        enhancedToastVariants({ position }),
        className
      )}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <AnimatePresence mode="popLayout">
        {visibleToasts.map((toast) => (
          <EnhancedToast
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </AnimatePresence>
    </motion.div>,
    document.body
  );
};

// Toast Provider Component
interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      id,
      duration: 5000,
      closable: true,
      progress: true,
      animated: true,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

// Toast hook
const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, clearToasts } = context;

  // Convenience methods
  const toast = {
    success: (message: string, options?: Partial<ToastData>) =>
      addToast({ variant: 'success', description: message, ...options }),
    error: (message: string, options?: Partial<ToastData>) =>
      addToast({ variant: 'error', description: message, ...options }),
    warning: (message: string, options?: Partial<ToastData>) =>
      addToast({ variant: 'warning', description: message, ...options }),
    info: (message: string, options?: Partial<ToastData>) =>
      addToast({ variant: 'info', description: message, ...options }),
    loading: (message: string, options?: Partial<ToastData>) =>
      addToast({ variant: 'loading', description: message, duration: 0, ...options }),
    custom: (options: Omit<ToastData, 'id'>) => addToast(options),
  };

  return {
    toast,
    addToast,
    removeToast,
    clearToasts,
  };
};

// Export components and utilities
export {
  EnhancedToast,
  ToastContainer,
  ToastProvider,
  useToast,
  PredefinedIcon,
  enhancedToastVariants,
  toastIconVariants,
};

export type { ToastData, EnhancedToastProps, ToastContextType };