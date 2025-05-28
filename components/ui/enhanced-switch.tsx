/**
 * Enhanced Switch Component
 * Modern, feature-rich toggle switch with animations, states, and accessibility
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  Check,
  X,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
} from 'lucide-react';

// Enhanced switch variants
const enhancedSwitchVariants = cva(
  [
    'relative inline-flex items-center rounded-full transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'cursor-pointer',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-gray-200 dark:bg-gray-700',
          'checked:bg-blue-600 dark:checked:bg-blue-500',
          'focus:ring-blue-500/20',
        ],
        primary: [
          'bg-gray-200 dark:bg-gray-700',
          'checked:bg-blue-600 dark:checked:bg-blue-500',
          'focus:ring-blue-500/20',
        ],
        success: [
          'bg-gray-200 dark:bg-gray-700',
          'checked:bg-green-600 dark:checked:bg-green-500',
          'focus:ring-green-500/20',
        ],
        warning: [
          'bg-gray-200 dark:bg-gray-700',
          'checked:bg-yellow-600 dark:checked:bg-yellow-500',
          'focus:ring-yellow-500/20',
        ],
        error: [
          'bg-gray-200 dark:bg-gray-700',
          'checked:bg-red-600 dark:checked:bg-red-500',
          'focus:ring-red-500/20',
        ],
        ghost: [
          'bg-gray-100 dark:bg-gray-800',
          'checked:bg-gray-600 dark:checked:bg-gray-400',
          'focus:ring-gray-500/20',
        ],
        gradient: [
          'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600',
          'checked:from-blue-500 checked:to-purple-600',
          'focus:ring-blue-500/20',
        ],
      },
      size: {
        sm: 'h-5 w-9',
        default: 'h-6 w-11',
        lg: 'h-7 w-12',
        xl: 'h-8 w-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Thumb variants
const thumbVariants = cva(
  [
    'inline-block rounded-full bg-white shadow-lg transform transition-transform duration-300',
    'ring-0',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        default: 'h-5 w-5',
        lg: 'h-5 w-5',
        xl: 'h-6 w-6',
      },
    },
    defaultVariants: {
      size: 'default',
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

// Enhanced switch props
export interface EnhancedSwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof enhancedSwitchVariants> {
  label?: string;
  description?: string;
  helperText?: string;
  error?: string;
  success?: string;
  warning?: string;
  info?: string;
  labelPosition?: 'left' | 'right';
  animate?: boolean;
  showIcons?: boolean;
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
  iconType?: 'check' | 'sun-moon' | 'volume' | 'wifi' | 'custom';
  loading?: boolean;
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

// Loading spinner
const LoadingSpinner = ({ size }: { size: 'sm' | 'default' | 'lg' | 'xl' }) => {
  const spinnerSize = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
    lg: 'h-4 w-4',
    xl: 'h-5 w-5',
  }[size];

  return (
    <motion.div
      className={cn(
        'border-2 border-gray-300 border-t-blue-500 rounded-full',
        spinnerSize
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
};

// Get predefined icons
const getPredefinedIcons = (iconType: string, isChecked: boolean, size: 'sm' | 'default' | 'lg' | 'xl') => {
  const iconSize = {
    sm: 'h-2.5 w-2.5',
    default: 'h-3 w-3',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
  }[size];

  switch (iconType) {
    case 'check':
      return isChecked ? (
        <Check className={cn(iconSize, 'text-white')} />
      ) : (
        <X className={cn(iconSize, 'text-gray-400')} />
      );
    case 'sun-moon':
      return isChecked ? (
        <Sun className={cn(iconSize, 'text-white')} />
      ) : (
        <Moon className={cn(iconSize, 'text-gray-400')} />
      );
    case 'volume':
      return isChecked ? (
        <Volume2 className={cn(iconSize, 'text-white')} />
      ) : (
        <VolumeX className={cn(iconSize, 'text-gray-400')} />
      );
    case 'wifi':
      return isChecked ? (
        <Wifi className={cn(iconSize, 'text-white')} />
      ) : (
        <WifiOff className={cn(iconSize, 'text-gray-400')} />
      );
    default:
      return null;
  }
};

const EnhancedSwitch = React.forwardRef<HTMLInputElement, EnhancedSwitchProps>(
  (props, ref) => {
    const {
      label,
      description,
      helperText,
      error,
      success,
      warning,
      info,
      labelPosition = 'right',
      animate = true,
      showIcons = false,
      checkedIcon,
      uncheckedIcon,
      iconType = 'check',
      loading = false,
      variant,
      size,
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
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    // Get thumb position
    const getThumbPosition = () => {
      const positions = {
        sm: isChecked ? 'translate-x-4' : 'translate-x-0.5',
        default: isChecked ? 'translate-x-5' : 'translate-x-0.5',
        lg: isChecked ? 'translate-x-5' : 'translate-x-1',
        xl: isChecked ? 'translate-x-6' : 'translate-x-1',
      };
      return positions[size || 'default'];
    };

    // Get icons
    const getIcons = () => {
      if (iconType === 'custom') {
        return {
          checked: checkedIcon,
          unchecked: uncheckedIcon,
        };
      }
      
      const predefinedIcon = getPredefinedIcons(iconType, isChecked, size || 'default');
      return {
        checked: predefinedIcon,
        unchecked: predefinedIcon,
      };
    };

    const icons = getIcons();

    // Switch element
    const switchElement = (
      <div className="relative">
        {/* Hidden input */}
        <input
          ref={ref}
          type="checkbox"
          id={switchId}
          checked={isChecked}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled || loading}
          className="sr-only"
          {...inputProps}
        />
        
        {/* Visual switch */}
        <motion.div
          className={cn(
            enhancedSwitchVariants({ variant, size }),
            isChecked && 'bg-opacity-100',
            isFocused && 'ring-2',
            className
          )}
          initial={animate ? { scale: 1 } : false}
          animate={animate ? {
            scale: isFocused ? 1.02 : 1,
            backgroundColor: isChecked ? undefined : undefined, // Let CSS handle this
          } : false}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          whileTap={animate ? { scale: 0.98 } : undefined}
        >
          {/* Background icons */}
          {showIcons && (
            <>
              {/* Checked icon (left side) */}
              <motion.div
                className="absolute left-1 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
                initial={animate ? { opacity: 0, scale: 0.8 } : false}
                animate={animate ? {
                  opacity: isChecked ? 1 : 0,
                  scale: isChecked ? 1 : 0.8,
                } : false}
                transition={{ duration: 0.2 }}
              >
                {icons.checked}
              </motion.div>
              
              {/* Unchecked icon (right side) */}
              <motion.div
                className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
                initial={animate ? { opacity: 1, scale: 1 } : false}
                animate={animate ? {
                  opacity: isChecked ? 0 : 1,
                  scale: isChecked ? 0.8 : 1,
                } : false}
                transition={{ duration: 0.2 }}
              >
                {icons.unchecked}
              </motion.div>
            </>
          )}
          
          {/* Thumb */}
          <motion.div
            className={cn(
              thumbVariants({ size }),
              getThumbPosition(),
              'flex items-center justify-center'
            )}
            layout={animate}
            transition={animate ? { type: 'spring', stiffness: 500, damping: 30 } : undefined}
          >
            {/* Loading spinner or thumb icon */}
            {loading ? (
              <LoadingSpinner size={size || 'default'} />
            ) : showIcons && !icons.checked && !icons.unchecked ? (
              <motion.div
                initial={animate ? { rotate: 0 } : false}
                animate={animate ? { rotate: isChecked ? 180 : 0 } : false}
                transition={{ duration: 0.3 }}
              >
                {isChecked ? (
                  <Check className={cn(
                    size === 'sm' ? 'h-2.5 w-2.5' :
                    size === 'lg' ? 'h-3 w-3' :
                    size === 'xl' ? 'h-3.5 w-3.5' :
                    'h-3 w-3',
                    'text-blue-600'
                  )} />
                ) : (
                  <X className={cn(
                    size === 'sm' ? 'h-2.5 w-2.5' :
                    size === 'lg' ? 'h-3 w-3' :
                    size === 'xl' ? 'h-3.5 w-3.5' :
                    'h-3 w-3',
                    'text-gray-400'
                  )} />
                )}
              </motion.div>
            ) : null}
          </motion.div>
        </motion.div>
      </div>
    );

    // Label element
    const labelElement = label && (
      <label
        htmlFor={switchId}
        className={cn(
          labelVariants({ size, disabled: disabled || loading }),
          labelPosition === 'left' ? 'mr-3' : 'ml-3'
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
        {/* Switch and Label */}
        <div className="flex items-start">
          {labelPosition === 'left' && labelElement}
          {switchElement}
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

EnhancedSwitch.displayName = 'EnhancedSwitch';

export { EnhancedSwitch, enhancedSwitchVariants };
export type { EnhancedSwitchProps };