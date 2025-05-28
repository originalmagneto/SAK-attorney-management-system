/**
 * Enhanced Progress Component
 * Modern, feature-rich progress indicator with animations, variants, and accessibility
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  TrendingUp,
  Activity,
} from 'lucide-react';

// Enhanced progress variants
const enhancedProgressVariants = cva(
  [
    'relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
    'transition-all duration-300',
  ],
  {
    variants: {
      variant: {
        default: 'bg-gray-200 dark:bg-gray-700',
        primary: 'bg-blue-100 dark:bg-blue-900/30',
        success: 'bg-green-100 dark:bg-green-900/30',
        warning: 'bg-yellow-100 dark:bg-yellow-900/30',
        error: 'bg-red-100 dark:bg-red-900/30',
        info: 'bg-blue-100 dark:bg-blue-900/30',
        gradient: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700',
        glass: 'bg-white/20 backdrop-blur-sm border border-white/30 dark:bg-gray-900/20 dark:border-gray-700/30',
      },
      size: {
        xs: 'h-1',
        sm: 'h-2',
        default: 'h-3',
        lg: 'h-4',
        xl: 'h-6',
        '2xl': 'h-8',
      },
      shape: {
        rounded: 'rounded-full',
        square: 'rounded-none',
        slight: 'rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'rounded',
    },
  }
);

// Progress bar variants
const progressBarVariants = cva(
  [
    'h-full transition-all duration-500 ease-out',
    'relative overflow-hidden',
  ],
  {
    variants: {
      variant: {
        default: 'bg-blue-600 dark:bg-blue-500',
        primary: 'bg-blue-600 dark:bg-blue-500',
        success: 'bg-green-600 dark:bg-green-500',
        warning: 'bg-yellow-600 dark:bg-yellow-500',
        error: 'bg-red-600 dark:bg-red-500',
        info: 'bg-blue-500 dark:bg-blue-400',
        gradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
        glass: 'bg-white/60 backdrop-blur-sm dark:bg-gray-100/60',
      },
      shape: {
        rounded: 'rounded-full',
        square: 'rounded-none',
        slight: 'rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      shape: 'rounded',
    },
  }
);

// Label variants
const labelVariants = cva(
  [
    'text-gray-700 dark:text-gray-300',
    'font-medium',
  ],
  {
    variants: {
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// Enhanced progress props
export interface EnhancedProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'value'>,
    VariantProps<typeof enhancedProgressVariants> {
  value?: number;
  max?: number;
  label?: string;
  description?: string;
  showValue?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  striped?: boolean;
  pulsing?: boolean;
  indeterminate?: boolean;
  steps?: number;
  currentStep?: number;
  stepLabels?: string[];
  icon?: React.ReactNode;
  status?: 'default' | 'success' | 'error' | 'warning' | 'loading';
  colorStops?: Array<{ value: number; color: string }>;
  onComplete?: () => void;
  onStepChange?: (step: number) => void;
  formatValue?: (value: number, max: number) => string;
  className?: string;
  barClassName?: string;
  labelClassName?: string;
}

// Status icons
const StatusIcon = ({ status, size }: { status: string; size: string }) => {
  const iconSize = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    default: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-7 w-7',
    '2xl': 'h-8 w-8',
  }[size] || 'h-5 w-5';

  switch (status) {
    case 'success':
      return <CheckCircle className={cn(iconSize, 'text-green-600 dark:text-green-400')} />;
    case 'error':
      return <AlertCircle className={cn(iconSize, 'text-red-600 dark:text-red-400')} />;
    case 'warning':
      return <AlertCircle className={cn(iconSize, 'text-yellow-600 dark:text-yellow-400')} />;
    case 'loading':
      return (
        <motion.div
          className={cn(iconSize, 'border-2 border-blue-600 border-t-transparent rounded-full')}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      );
    default:
      return null;
  }
};

// Get dynamic color based on value
const getDynamicColor = (value: number, max: number, colorStops?: Array<{ value: number; color: string }>) => {
  if (!colorStops || colorStops.length === 0) return undefined;
  
  const percentage = (value / max) * 100;
  
  // Find the appropriate color stop
  for (let i = 0; i < colorStops.length; i++) {
    if (percentage <= colorStops[i].value) {
      return colorStops[i].color;
    }
  }
  
  return colorStops[colorStops.length - 1].color;
};

const EnhancedProgress = React.forwardRef<HTMLDivElement, EnhancedProgressProps>(
  (props, ref) => {
    const {
      value = 0,
      max = 100,
      label,
      description,
      showValue = false,
      showPercentage = false,
      animated = true,
      striped = false,
      pulsing = false,
      indeterminate = false,
      steps,
      currentStep,
      stepLabels,
      icon,
      status = 'default',
      colorStops,
      onComplete,
      onStepChange,
      formatValue,
      variant,
      size,
      shape,
      className,
      barClassName,
      labelClassName,
      ...divProps
    } = props;

    // State
    const [displayValue, setDisplayValue] = useState(0);
    const [hasCompleted, setHasCompleted] = useState(false);

    // Calculate percentage
    const percentage = Math.min((value / max) * 100, 100);
    const stepPercentage = steps ? ((currentStep || 0) / steps) * 100 : percentage;
    const finalPercentage = steps ? stepPercentage : percentage;

    // Animate value changes
    useEffect(() => {
      if (!animated) {
        setDisplayValue(value);
        return;
      }

      const startValue = displayValue;
      const endValue = value;
      const duration = 500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easeOut;
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [value, animated, displayValue]);

    // Handle completion
    useEffect(() => {
      if (percentage >= 100 && !hasCompleted) {
        setHasCompleted(true);
        onComplete?.();
      } else if (percentage < 100 && hasCompleted) {
        setHasCompleted(false);
      }
    }, [percentage, hasCompleted, onComplete]);

    // Handle step changes
    useEffect(() => {
      if (steps && currentStep !== undefined) {
        onStepChange?.(currentStep);
      }
    }, [currentStep, steps, onStepChange]);

    // Format display value
    const formattedValue = formatValue ? formatValue(displayValue, max) : Math.round(displayValue);
    const formattedPercentage = Math.round((displayValue / max) * 100);

    // Dynamic color
    const dynamicColor = getDynamicColor(value, max, colorStops);

    return (
      <div ref={ref} className={cn('w-full', className)} {...divProps}>
        {/* Header */}
        {(label || description || showValue || showPercentage || icon || status !== 'default') && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {/* Icon or Status Icon */}
              {icon || (status !== 'default' && (
                <StatusIcon status={status} size={size || 'default'} />
              ))}
              
              {/* Label and Description */}
              <div>
                {label && (
                  <div className={cn(labelVariants({ size }), labelClassName)}>
                    {label}
                  </div>
                )}
                {description && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {description}
                  </div>
                )}
              </div>
            </div>
            
            {/* Value Display */}
            {(showValue || showPercentage) && (
              <div className={cn(
                'text-sm font-medium',
                status === 'success' && 'text-green-600 dark:text-green-400',
                status === 'error' && 'text-red-600 dark:text-red-400',
                status === 'warning' && 'text-yellow-600 dark:text-yellow-400',
                status === 'default' && 'text-gray-700 dark:text-gray-300'
              )}>
                {showValue && showPercentage
                  ? `${formattedValue} (${formattedPercentage}%)`
                  : showPercentage
                  ? `${formattedPercentage}%`
                  : formattedValue
                }
              </div>
            )}
          </div>
        )}

        {/* Progress Bar Container */}
        <div className={cn(enhancedProgressVariants({ variant, size, shape }))}>
          {/* Progress Bar */}
          <motion.div
            className={cn(
              progressBarVariants({ variant, shape }),
              striped && 'bg-stripes',
              pulsing && 'animate-pulse',
              barClassName
            )}
            style={{
              width: indeterminate ? '100%' : `${finalPercentage}%`,
              backgroundColor: dynamicColor,
            }}
            initial={animated ? { width: 0 } : false}
            animate={animated ? {
              width: indeterminate ? '100%' : `${finalPercentage}%`,
            } : false}
            transition={animated ? {
              duration: 0.5,
              ease: 'easeOut',
            } : undefined}
          >
            {/* Indeterminate Animation */}
            {indeterminate && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}
            
            {/* Striped Pattern */}
            {striped && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-stripes" />
            )}
            
            {/* Shimmer Effect */}
            {animated && !indeterminate && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: 'linear',
                }}
              />
            )}
          </motion.div>
        </div>

        {/* Steps */}
        {steps && stepLabels && (
          <div className="mt-3">
            <div className="flex justify-between">
              {stepLabels.map((stepLabel, index) => {
                const isActive = (currentStep || 0) >= index;
                const isCurrent = (currentStep || 0) === index;
                
                return (
                  <div
                    key={index}
                    className={cn(
                      'flex flex-col items-center text-xs',
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'
                    )}
                  >
                    <motion.div
                      className={cn(
                        'w-3 h-3 rounded-full mb-1 border-2',
                        isActive
                          ? 'bg-blue-600 border-blue-600 dark:bg-blue-400 dark:border-blue-400'
                          : 'bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600',
                        isCurrent && 'ring-2 ring-blue-200 dark:ring-blue-800'
                      )}
                      initial={animated ? { scale: 0.8 } : false}
                      animate={animated ? {
                        scale: isCurrent ? 1.2 : 1,
                      } : false}
                      transition={{ duration: 0.2 }}
                    />
                    <span className={cn(
                      'text-center max-w-16 leading-tight',
                      isCurrent && 'font-medium'
                    )}>
                      {stepLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

EnhancedProgress.displayName = 'EnhancedProgress';

export { EnhancedProgress, enhancedProgressVariants };
export type { EnhancedProgressProps };