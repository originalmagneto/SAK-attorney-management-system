/**
 * Enhanced Button Component
 * Modern, accessible button with advanced animations and variants
 */

'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { buttonVariants, hoverVariants, tapVariants } from '@/lib/animations';

// Enhanced button variants with new design system
const enhancedButtonVariants = cva(
  [
    // Base styles
    'inline-flex items-center justify-center gap-2',
    'rounded-xl font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'relative overflow-hidden',
    // Typography
    'text-sm leading-none tracking-tight',
    // Interactive states
    'active:scale-[0.98] hover:shadow-lg',
  ],
  {
    variants: {
      variant: {
        // Primary variants
        primary: [
          'bg-gradient-to-r from-blue-600 to-blue-700',
          'text-white shadow-md',
          'hover:from-blue-700 hover:to-blue-800',
          'focus-visible:ring-blue-500',
          'dark:from-blue-500 dark:to-blue-600',
          'dark:hover:from-blue-600 dark:hover:to-blue-700',
        ],
        secondary: [
          'bg-gradient-to-r from-gray-100 to-gray-200',
          'text-gray-900 shadow-sm',
          'hover:from-gray-200 hover:to-gray-300',
          'focus-visible:ring-gray-400',
          'dark:from-gray-800 dark:to-gray-700',
          'dark:text-gray-100',
          'dark:hover:from-gray-700 dark:hover:to-gray-600',
        ],
        destructive: [
          'bg-gradient-to-r from-red-600 to-red-700',
          'text-white shadow-md',
          'hover:from-red-700 hover:to-red-800',
          'focus-visible:ring-red-500',
          'dark:from-red-500 dark:to-red-600',
        ],
        outline: [
          'border-2 border-gray-300 bg-transparent',
          'text-gray-700 hover:bg-gray-50',
          'focus-visible:ring-gray-400',
          'dark:border-gray-600 dark:text-gray-300',
          'dark:hover:bg-gray-800',
        ],
        ghost: [
          'bg-transparent text-gray-700',
          'hover:bg-gray-100 hover:text-gray-900',
          'focus-visible:ring-gray-400',
          'dark:text-gray-300',
          'dark:hover:bg-gray-800 dark:hover:text-gray-100',
        ],
        // New modern variants
        gradient: [
          'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600',
          'text-white shadow-lg',
          'hover:shadow-xl hover:scale-[1.02]',
          'focus-visible:ring-purple-500',
          'bg-size-200 hover:bg-pos-100',
        ],
        glass: [
          'bg-white/10 backdrop-blur-md border border-white/20',
          'text-gray-900 shadow-lg',
          'hover:bg-white/20',
          'focus-visible:ring-white/50',
          'dark:text-white dark:border-white/10',
          'dark:hover:bg-white/10',
        ],
        neon: [
          'bg-black text-cyan-400 border-2 border-cyan-400',
          'shadow-[0_0_10px_rgba(34,211,238,0.3)]',
          'hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]',
          'hover:text-cyan-300 hover:border-cyan-300',
          'focus-visible:ring-cyan-400',
        ],
        success: [
          'bg-gradient-to-r from-green-600 to-emerald-600',
          'text-white shadow-md',
          'hover:from-green-700 hover:to-emerald-700',
          'focus-visible:ring-green-500',
        ],
        warning: [
          'bg-gradient-to-r from-yellow-500 to-orange-500',
          'text-white shadow-md',
          'hover:from-yellow-600 hover:to-orange-600',
          'focus-visible:ring-yellow-500',
        ],
      },
      size: {
        xs: 'h-7 px-2 text-xs',
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
        'icon-lg': 'h-12 w-12 p-0',
      },
      loading: {
        true: 'cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      loading: false,
    },
  }
);

// Loading spinner component
const LoadingSpinner = ({ size = 'default' }: { size?: string }) => {
  const spinnerSize = {
    xs: 'w-3 h-3',
    sm: 'w-3 h-3',
    default: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
    icon: 'w-4 h-4',
    'icon-sm': 'w-3 h-3',
    'icon-lg': 'w-5 h-5',
  }[size] || 'w-4 h-4';

  return (
    <motion.div
      className={cn('border-2 border-current border-t-transparent rounded-full', spinnerSize)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
};

// Ripple effect component
const RippleEffect = () => {
  return (
    <motion.div
      className="absolute inset-0 bg-white/20 rounded-full"
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 4, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
  );
};

export interface EnhancedButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'size'>,
    VariantProps<typeof enhancedButtonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ripple?: boolean;
  tooltip?: string;
  badge?: string | number;
  fullWidth?: boolean;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      ripple = true,
      tooltip,
      badge,
      fullWidth = false,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [showRipple, setShowRipple] = React.useState(false);
    const [ripplePosition, setRipplePosition] = React.useState({ x: 0, y: 0 });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      if (ripple) {
        const rect = event.currentTarget.getBoundingClientRect();
        setRipplePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
        setShowRipple(true);
        setTimeout(() => setShowRipple(false), 600);
      }

      onClick?.(event);
    };

    const buttonContent = (
      <>
        {/* Ripple effect */}
        {showRipple && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: ripplePosition.x,
              top: ripplePosition.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <RippleEffect />
          </div>
        )}

        {/* Content */}
        <div className="relative flex items-center justify-center gap-2">
          {loading ? (
            <LoadingSpinner size={size} />
          ) : (
            <>
              {leftIcon && (
                <motion.span
                  className="flex-shrink-0"
                  variants={buttonVariants.icon}
                  initial="initial"
                  animate="animate"
                >
                  {leftIcon}
                </motion.span>
              )}
              
              {children && (
                <motion.span
                  className="flex-1 truncate"
                  variants={buttonVariants.text}
                  initial="initial"
                  animate="animate"
                >
                  {children}
                </motion.span>
              )}
              
              {rightIcon && (
                <motion.span
                  className="flex-shrink-0"
                  variants={buttonVariants.icon}
                  initial="initial"
                  animate="animate"
                >
                  {rightIcon}
                </motion.span>
              )}
            </>
          )}
        </div>

        {/* Badge */}
        {badge && (
          <motion.span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {badge}
          </motion.span>
        )}
      </>
    );

    const button = (
      <motion.button
        ref={ref}
        className={cn(
          enhancedButtonVariants({ variant, size, loading, className }),
          fullWidth && 'w-full'
        )}
        disabled={disabled || loading}
        onClick={handleClick}
        variants={buttonVariants.container}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
        {...props}
      >
        {buttonContent}
      </motion.button>
    );

    // Wrap with tooltip if provided
    if (tooltip) {
      return (
        <div className="relative group">
          {button}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      );
    }

    return button;
  }
);

EnhancedButton.displayName = 'EnhancedButton';

export { EnhancedButton, enhancedButtonVariants };
export type { EnhancedButtonProps };