/**
 * Enhanced Badge Component
 * Modern, animated badge with multiple variants and interactive states
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X, Check, AlertTriangle, Info, Star, Zap } from 'lucide-react';

// Enhanced badge variants
const enhancedBadgeVariants = cva(
  [
    // Base styles
    'inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-gray-100 text-gray-800 border border-gray-200',
          'hover:bg-gray-200',
          'dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
          'dark:hover:bg-gray-700',
        ],
        primary: [
          'bg-blue-100 text-blue-800 border border-blue-200',
          'hover:bg-blue-200',
          'dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
          'dark:hover:bg-blue-900/50',
        ],
        secondary: [
          'bg-purple-100 text-purple-800 border border-purple-200',
          'hover:bg-purple-200',
          'dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
          'dark:hover:bg-purple-900/50',
        ],
        success: [
          'bg-green-100 text-green-800 border border-green-200',
          'hover:bg-green-200',
          'dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
          'dark:hover:bg-green-900/50',
        ],
        warning: [
          'bg-yellow-100 text-yellow-800 border border-yellow-200',
          'hover:bg-yellow-200',
          'dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
          'dark:hover:bg-yellow-900/50',
        ],
        error: [
          'bg-red-100 text-red-800 border border-red-200',
          'hover:bg-red-200',
          'dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
          'dark:hover:bg-red-900/50',
        ],
        info: [
          'bg-cyan-100 text-cyan-800 border border-cyan-200',
          'hover:bg-cyan-200',
          'dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800',
          'dark:hover:bg-cyan-900/50',
        ],
        gradient: [
          'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0',
          'hover:from-blue-600 hover:to-purple-700',
          'shadow-sm hover:shadow-md',
        ],
        glass: [
          'bg-white/10 backdrop-blur-md border border-white/20 text-white',
          'hover:bg-white/20',
          'shadow-lg',
        ],
        neon: [
          'bg-black border-2 border-cyan-400 text-cyan-400',
          'shadow-[0_0_10px_rgba(34,211,238,0.3)]',
          'hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]',
          'hover:border-cyan-300 hover:text-cyan-300',
        ],
        outline: [
          'bg-transparent border-2 text-gray-700',
          'border-gray-300 hover:border-gray-400 hover:bg-gray-50',
          'dark:text-gray-300 dark:border-gray-600',
          'dark:hover:border-gray-500 dark:hover:bg-gray-800',
        ],
      },
      size: {
        xs: 'px-1.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-sm',
        xl: 'px-4 py-1.5 text-base',
      },
      interactive: {
        true: 'cursor-pointer select-none',
        false: '',
      },
      removable: {
        true: 'pr-1',
        false: '',
      },
      pulse: {
        true: 'animate-pulse',
        false: '',
      },
      glow: {
        true: 'shadow-lg',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
      removable: false,
      pulse: false,
      glow: false,
    },
  }
);

// Icon variants
const iconVariants = cva(
  'flex-shrink-0',
  {
    variants: {
      size: {
        xs: 'h-2.5 w-2.5',
        sm: 'h-3 w-3',
        default: 'h-3.5 w-3.5',
        lg: 'h-4 w-4',
        xl: 'h-5 w-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// Predefined icons for variants
const variantIcons = {
  success: Check,
  warning: AlertTriangle,
  error: X,
  info: Info,
  star: Star,
  zap: Zap,
};

// Dot indicator component
const DotIndicator = ({ variant, size }: { variant: string; size: string }) => {
  const dotColors = {
    default: 'bg-gray-400',
    primary: 'bg-blue-500',
    secondary: 'bg-purple-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-cyan-500',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
    glass: 'bg-white',
    neon: 'bg-cyan-400',
    outline: 'bg-gray-500',
  };
  
  const dotSizes = {
    xs: 'h-1 w-1',
    sm: 'h-1.5 w-1.5',
    default: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
    xl: 'h-3 w-3',
  };
  
  return (
    <motion.div
      className={cn(
        'rounded-full',
        dotColors[variant as keyof typeof dotColors] || dotColors.default,
        dotSizes[size as keyof typeof dotSizes] || dotSizes.default
      )}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    />
  );
};

export interface EnhancedBadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'>,
    VariantProps<typeof enhancedBadgeVariants> {
  children?: React.ReactNode;
  icon?: React.ReactNode | keyof typeof variantIcons;
  dot?: boolean;
  count?: number;
  maxCount?: number;
  showZero?: boolean;
  onRemove?: () => void;
  removeIcon?: React.ReactNode;
  tooltip?: string;
  href?: string;
  target?: string;
  animate?: boolean;
  animationDelay?: number;
}

const EnhancedBadge = React.forwardRef<HTMLDivElement, EnhancedBadgeProps>(
  (
    {
      className,
      variant,
      size,
      interactive,
      removable,
      pulse,
      glow,
      children,
      icon,
      dot = false,
      count,
      maxCount = 99,
      showZero = false,
      onRemove,
      removeIcon,
      tooltip,
      href,
      target,
      animate = true,
      animationDelay = 0,
      onClick,
      ...props
    },
    ref
  ) => {
    // Determine if badge should be interactive
    const isInteractive = interactive || Boolean(onClick) || Boolean(href);
    
    // Determine if badge should be removable
    const isRemovable = removable || Boolean(onRemove);
    
    // Handle count display
    const displayCount = count !== undefined
      ? count > maxCount
        ? `${maxCount}+`
        : count.toString()
      : null;
    
    // Show badge if count is greater than 0 or showZero is true
    const shouldShow = count === undefined || count > 0 || (count === 0 && showZero);
    
    // Render icon
    const renderIcon = () => {
      if (!icon) return null;
      
      if (typeof icon === 'string' && icon in variantIcons) {
        const IconComponent = variantIcons[icon as keyof typeof variantIcons];
        return (
          <motion.div
            initial={animate ? { scale: 0, rotate: -180 } : false}
            animate={animate ? { scale: 1, rotate: 0 } : false}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              delay: animationDelay + 0.1,
            }}
          >
            <IconComponent className={iconVariants({ size })} />
          </motion.div>
        );
      }
      
      return (
        <motion.div
          className={iconVariants({ size })}
          initial={animate ? { scale: 0, rotate: -180 } : false}
          animate={animate ? { scale: 1, rotate: 0 } : false}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
            delay: animationDelay + 0.1,
          }}
        >
          {icon}
        </motion.div>
      );
    };
    
    // Render remove button
    const renderRemoveButton = () => {
      if (!isRemovable) return null;
      
      return (
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className={cn(
            'ml-1 rounded-full p-0.5 transition-colors',
            'hover:bg-black/10 dark:hover:bg-white/10',
            'focus:outline-none focus:ring-1 focus:ring-current'
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Remove badge"
        >
          {removeIcon || <X className={iconVariants({ size })} />}
        </motion.button>
      );
    };
    
    // Badge content
    const badgeContent = (
      <>
        {/* Dot indicator */}
        {dot && <DotIndicator variant={variant || 'default'} size={size || 'default'} />}
        
        {/* Icon */}
        {renderIcon()}
        
        {/* Content */}
        <motion.span
          className="truncate"
          initial={animate ? { opacity: 0, x: -10 } : false}
          animate={animate ? { opacity: 1, x: 0 } : false}
          transition={{ delay: animationDelay + 0.2 }}
        >
          {displayCount || children}
        </motion.span>
        
        {/* Remove button */}
        {renderRemoveButton()}
      </>
    );
    
    // Animation variants
    const animationVariants = {
      initial: {
        opacity: 0,
        scale: 0.8,
        y: -10,
      },
      animate: {
        opacity: 1,
        scale: 1,
        y: 0,
      },
      exit: {
        opacity: 0,
        scale: 0.8,
        y: -10,
      },
      hover: {
        scale: 1.05,
        y: -1,
      },
      tap: {
        scale: 0.95,
      },
    };
    
    if (!shouldShow) return null;
    
    // Render as link if href is provided
    if (href) {
      return (
        <motion.a
          ref={ref as any}
          href={href}
          target={target}
          className={cn(
            enhancedBadgeVariants({
              variant,
              size,
              interactive: true,
              removable: isRemovable,
              pulse,
              glow,
            }),
            className
          )}
          variants={animate ? animationVariants : undefined}
          initial={animate ? "initial" : false}
          animate={animate ? "animate" : false}
          exit={animate ? "exit" : false}
          whileHover={isInteractive && animate ? "hover" : undefined}
          whileTap={isInteractive && animate ? "tap" : undefined}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
            delay: animationDelay,
          }}
          title={tooltip}
          {...props}
        >
          {badgeContent}
        </motion.a>
      );
    }
    
    // Render as button if interactive
    if (isInteractive) {
      return (
        <motion.button
          ref={ref as any}
          type="button"
          onClick={onClick}
          className={cn(
            enhancedBadgeVariants({
              variant,
              size,
              interactive: true,
              removable: isRemovable,
              pulse,
              glow,
            }),
            className
          )}
          variants={animate ? animationVariants : undefined}
          initial={animate ? "initial" : false}
          animate={animate ? "animate" : false}
          exit={animate ? "exit" : false}
          whileHover={animate ? "hover" : undefined}
          whileTap={animate ? "tap" : undefined}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
            delay: animationDelay,
          }}
          title={tooltip}
          {...props}
        >
          {badgeContent}
        </motion.button>
      );
    }
    
    // Render as div
    return (
      <motion.div
        ref={ref}
        className={cn(
          enhancedBadgeVariants({
            variant,
            size,
            interactive: false,
            removable: isRemovable,
            pulse,
            glow,
          }),
          className
        )}
        variants={animate ? animationVariants : undefined}
        initial={animate ? "initial" : false}
        animate={animate ? "animate" : false}
        exit={animate ? "exit" : false}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
          delay: animationDelay,
        }}
        title={tooltip}
        {...props}
      >
        {badgeContent}
      </motion.div>
    );
  }
);

EnhancedBadge.displayName = 'EnhancedBadge';

export { EnhancedBadge, enhancedBadgeVariants };
export type { EnhancedBadgeProps };