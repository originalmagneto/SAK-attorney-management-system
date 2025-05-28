/**
 * Enhanced Checkbox Component
 * Modern, feature-rich checkbox with animations, states, and accessibility
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  Check,
  Minus,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';

// Enhanced checkbox variants
const enhancedCheckboxVariants = cva(
  [
    'relative inline-flex items-center justify-center',
    'border-2 rounded transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'cursor-pointer',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-900',
          'checked:bg-blue-600 checked:border-blue-600',
          'focus:ring-blue-500/20',
          'hover:border-blue-400 dark:hover:border-blue-500',
        ],
        primary: [
          'border-blue-300 dark:border-blue-600',
          'bg-white dark:bg-gray-900',
          'checked:bg-blue-600 checked:border-blue-600',
          'focus:ring-blue-500/20',
          'hover:border-blue-400',
        ],
        success: [
          'border-green-300 dark:border-green-600',
          'bg-white dark:bg-gray-900',
          'checked:bg-green-600 checked:border-green-600',
          'focus:ring-green-500/20',
          'hover:border-green-400',
        ],
        warning: [
          'border-yellow-300 dark:border-yellow-600',
          'bg-white dark:bg-gray-900',
          'checked:bg-yellow-600 checked:border-yellow-600',
          'focus:ring-yellow-500/20',
          'hover:border-yellow-400',
        ],
        error: [
          'border-red-300 dark:border-red-600',
          'bg-white dark:bg-gray-900',
          'checked:bg-red-600 checked:border-red-600',
          'focus:ring-red-500/20',
          'hover:border-red-400',
        ],
        ghost: [
          'border-transparent',
          'bg-transparent',
          'checked:bg-gray-600 checked:border-gray-600',
          'focus:ring-gray-500/20',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
        ],
        outline: [
          'border-2 border-gray-400 dark:border-gray-500',
          'bg-transparent',
          'checked:bg-transparent checked:border-blue-600',
          'focus:ring-blue-500/20',
          'hover:border-blue-400',
        ],
      },
      size: {
        sm: 'h-4 w-4',
        default: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-7 w-7',
      },
      shape: {
        square: 'rounded',
        rounded: 'rounded-md',
        circle: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'square',
    },
  }
);

// Label variants
const labelVariants = cva(
  [
    'text-gray-900 dark:text-gray-100',
    'cursor-pointer select-none',
    'transition-colors duration-200',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: 'hover:text-gray-700 dark:hover:text-gray-300',
      },
    },
    defaultVariants: {
      size: 'default',
      disabled: false,
    },
  }
);

// Enhanced checkbox props
export interface EnhancedCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof enhancedCheckboxVariants> {
  label?: string;
  description?: string;
  helperText?: string;
  error?: string;
  success?: string;
  warning?: string;
  info?: string;
  indeterminate?: boolean;
  labelPosition?: 'left' | 'right';
  animate?: boolean;
  ripple?: boolean;
  icon?: React.ReactNode;
  checkedIcon?: React.ReactNode;
  indeterminateIcon?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}

// State icons
const StateIcon = ({ state, size }: { state: 'error' | 'success' | 'warning' | 'info'; size: 'sm' | 'default' | 'lg' | 'xl' }) => {
  const iconSize = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
  }[size];

  switch (state) {
    case 'error':
      return <AlertCircle className={cn(iconSize, 'text-red-500')} />;
    case 'success':
      return <CheckCircle className={cn(iconSize, 'text-green-500')} />;
    case 'warning':
      return <AlertTriangle className={cn(iconSize, 'text-yellow-500')} />;
    case 'info':
      return <Info className={cn(iconSize, 'text-blue-500')} />;
    default:
      return null;
  }
};

// Ripple effect component
const RippleEffect = ({ animate }: { animate: boolean }) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const addRipple = useCallback((event: React.MouseEvent) => {
    if (!animate) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  }, [animate]);

  return (
    <>
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 20, height: 20, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
      <div
        className="absolute inset-0 rounded-inherit"
        onMouseDown={addRipple}
      />
    </>
  );
};

const EnhancedCheckbox = React.forwardRef<HTMLInputElement, EnhancedCheckboxProps>(
  (props, ref) => {
    const {
      label,
      description,
      helperText,
      error,
      success,
      warning,
      info,
      indeterminate = false,
      labelPosition = 'right',
      animate = true,
      ripple = true,
      icon,
      checkedIcon,
      indeterminateIcon,
      variant,
      size,
      shape,
      className,
      checked,
      defaultChecked,
      onChange,
      onCheckedChange,
      disabled,
      id,
      ...inputProps
    } = props;

    // State
    const [internalChecked, setInternalChecked] = useState(checked ?? defaultChecked ?? false);
    const [isFocused, setIsFocused] = useState(false);

    // Controlled vs uncontrolled
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;

    // Determine current state
    const currentState = error ? 'error' : success ? 'success' : warning ? 'warning' : info ? 'info' : null;
    const stateMessage = error || success || warning || info || helperText;

    // Handle change
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      
      onChange?.(e);
      onCheckedChange?.(newChecked);
    }, [isControlled, onChange, onCheckedChange]);

    // Handle focus
    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      inputProps.onFocus?.(e);
    }, [inputProps]);

    // Handle blur
    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      inputProps.onBlur?.(e);
    }, [inputProps]);

    // Generate unique ID
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    // Get check icon
    const getCheckIcon = () => {
      if (indeterminate) {
        return indeterminateIcon || <Minus className="h-3 w-3 text-white" />;
      }
      if (isChecked) {
        return checkedIcon || icon || <Check className="h-3 w-3 text-white" />;
      }
      return null;
    };

    // Checkbox element
    const checkboxElement = (
      <div className="relative">
        {/* Hidden input */}
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          checked={isChecked}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className="sr-only"
          {...inputProps}
        />
        
        {/* Visual checkbox */}
        <motion.div
          className={cn(
            enhancedCheckboxVariants({ variant, size, shape }),
            isChecked && 'border-opacity-0',
            indeterminate && 'border-opacity-0',
            isFocused && 'ring-2',
            className
          )}
          style={{
            backgroundColor: isChecked || indeterminate ? undefined : 'transparent',
          }}
          initial={animate ? { scale: 1 } : false}
          animate={animate ? {
            scale: isFocused ? 1.05 : 1,
            backgroundColor: isChecked || indeterminate ? 
              variant === 'success' ? '#16a34a' :
              variant === 'warning' ? '#ca8a04' :
              variant === 'error' ? '#dc2626' :
              variant === 'ghost' ? '#4b5563' :
              '#2563eb' : 'transparent'
          } : false}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          whileTap={animate ? { scale: 0.95 } : undefined}
        >
          {/* Ripple effect */}
          {ripple && <RippleEffect animate={animate} />}
          
          {/* Check icon */}
          <AnimatePresence>
            {(isChecked || indeterminate) && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={animate ? { scale: 0, opacity: 0 } : false}
                animate={animate ? { scale: 1, opacity: 1 } : false}
                exit={animate ? { scale: 0, opacity: 0 } : false}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                {getCheckIcon()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );

    // Label element
    const labelElement = label && (
      <label
        htmlFor={checkboxId}
        className={cn(
          labelVariants({ size, disabled }),
          labelPosition === 'left' ? 'mr-2' : 'ml-2'
        )}
      >
        <div>
          <span>{label}</span>
          {description && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {description}
            </div>
          )}
        </div>
      </label>
    );

    return (
      <div className="inline-block">
        {/* Checkbox and Label */}
        <div className="flex items-start">
          {labelPosition === 'left' && labelElement}
          {checkboxElement}
          {labelPosition === 'right' && labelElement}
          
          {/* State Icon */}
          {currentState && (
            <div className="ml-2 mt-0.5">
              <StateIcon state={currentState} size={size || 'default'} />
            </div>
          )}
        </div>

        {/* Helper Text / State Message */}
        {stateMessage && (
          <motion.div
            className={cn(
              'mt-1 text-xs',
              currentState === 'error' && 'text-red-600 dark:text-red-400',
              currentState === 'success' && 'text-green-600 dark:text-green-400',
              currentState === 'warning' && 'text-yellow-600 dark:text-yellow-400',
              currentState === 'info' && 'text-blue-600 dark:text-blue-400',
              !currentState && 'text-gray-500 dark:text-gray-400',
              labelPosition === 'left' ? 'text-right' : 'text-left'
            )}
            initial={animate ? { opacity: 0, y: -5 } : false}
            animate={animate ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.2 }}
          >
            {stateMessage}
          </motion.div>
        )}
      </div>
    );
  }
);

EnhancedCheckbox.displayName = 'EnhancedCheckbox';

export { EnhancedCheckbox, enhancedCheckboxVariants };
export type { EnhancedCheckboxProps };