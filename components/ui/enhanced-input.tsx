/**
 * Enhanced Input Component
 * Modern, animated input with validation states and advanced features
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Search, X, AlertCircle, CheckCircle, Info } from 'lucide-react';

// Enhanced input variants
const enhancedInputVariants = cva(
  [
    // Base styles
    'flex w-full rounded-lg border transition-all duration-200',
    'focus-within:ring-2 focus-within:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-gray-300 bg-white',
          'focus-within:border-blue-500 focus-within:ring-blue-500/20',
          'dark:border-gray-600 dark:bg-gray-800',
          'dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400/20',
        ],
        filled: [
          'border-transparent bg-gray-100',
          'focus-within:bg-white focus-within:border-blue-500 focus-within:ring-blue-500/20',
          'dark:bg-gray-700 dark:focus-within:bg-gray-800',
          'dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400/20',
        ],
        outlined: [
          'border-2 border-gray-300 bg-transparent',
          'focus-within:border-blue-500 focus-within:ring-blue-500/20',
          'dark:border-gray-600',
          'dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400/20',
        ],
        underlined: [
          'border-0 border-b-2 border-gray-300 bg-transparent rounded-none',
          'focus-within:border-blue-500 focus-within:ring-0',
          'dark:border-gray-600',
          'dark:focus-within:border-blue-400',
        ],
        ghost: [
          'border-transparent bg-transparent',
          'hover:bg-gray-50 focus-within:bg-white focus-within:border-gray-300',
          'focus-within:ring-gray-300/20',
          'dark:hover:bg-gray-800 dark:focus-within:bg-gray-800',
          'dark:focus-within:border-gray-600 dark:focus-within:ring-gray-600/20',
        ],
      },
      size: {
        sm: 'h-8 px-2 text-sm',
        default: 'h-10 px-3 text-base',
        lg: 'h-12 px-4 text-lg',
        xl: 'h-14 px-5 text-xl',
      },
      state: {
        default: '',
        error: [
          'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20',
          'dark:border-red-400 dark:focus-within:border-red-400 dark:focus-within:ring-red-400/20',
        ],
        success: [
          'border-green-500 focus-within:border-green-500 focus-within:ring-green-500/20',
          'dark:border-green-400 dark:focus-within:border-green-400 dark:focus-within:ring-green-400/20',
        ],
        warning: [
          'border-yellow-500 focus-within:border-yellow-500 focus-within:ring-yellow-500/20',
          'dark:border-yellow-400 dark:focus-within:border-yellow-400 dark:focus-within:ring-yellow-400/20',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

// Input field variants
const inputFieldVariants = cva(
  [
    'flex-1 bg-transparent border-0 outline-none',
    'placeholder:text-gray-500 dark:placeholder:text-gray-400',
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
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
    'block text-sm font-medium transition-colors duration-200',
    'text-gray-700 dark:text-gray-300',
  ],
  {
    variants: {
      state: {
        default: '',
        error: 'text-red-600 dark:text-red-400',
        success: 'text-green-600 dark:text-green-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-red-500",
        false: '',
      },
    },
    defaultVariants: {
      state: 'default',
      required: false,
    },
  }
);

// Helper text variants
const helperTextVariants = cva(
  'text-xs mt-1 transition-colors duration-200',
  {
    variants: {
      state: {
        default: 'text-gray-500 dark:text-gray-400',
        error: 'text-red-600 dark:text-red-400',
        success: 'text-green-600 dark:text-green-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

// State icons
const StateIcon = ({ state }: { state: 'error' | 'success' | 'warning' }) => {
  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    warning: Info,
  };
  
  const Icon = icons[state];
  const colors = {
    error: 'text-red-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
  };
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <Icon className={cn('h-4 w-4', colors[state])} />
    </motion.div>
  );
};

// Floating label component
const FloatingLabel = ({
  label,
  focused,
  hasValue,
  state,
  required,
}: {
  label: string;
  focused: boolean;
  hasValue: boolean;
  state: 'default' | 'error' | 'success' | 'warning';
  required?: boolean;
}) => {
  return (
    <motion.label
      className={cn(
        'absolute left-3 pointer-events-none transition-all duration-200',
        'text-gray-500 dark:text-gray-400',
        focused || hasValue
          ? 'top-0 -translate-y-1/2 text-xs bg-white dark:bg-gray-800 px-1'
          : 'top-1/2 -translate-y-1/2 text-base',
        state === 'error' && (focused || hasValue) && 'text-red-600 dark:text-red-400',
        state === 'success' && (focused || hasValue) && 'text-green-600 dark:text-green-400',
        state === 'warning' && (focused || hasValue) && 'text-yellow-600 dark:text-yellow-400',
        focused && state === 'default' && 'text-blue-600 dark:text-blue-400'
      )}
      animate={{
        fontSize: focused || hasValue ? '0.75rem' : '1rem',
        y: focused || hasValue ? '-50%' : '-50%',
        top: focused || hasValue ? '0px' : '50%',
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {label}
      {required && (
        <span className="ml-0.5 text-red-500">*</span>
      )}
    </motion.label>
  );
};

export interface EnhancedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof enhancedInputVariants> {
  label?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  warningText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  searchable?: boolean;
  loading?: boolean;
  floating?: boolean;
  characterCount?: boolean;
  maxLength?: number;
  onClear?: () => void;
  containerClassName?: string;
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  (
    {
      className,
      containerClassName,
      variant,
      size,
      state: propState,
      type = 'text',
      label,
      helperText,
      errorText,
      successText,
      warningText,
      leftIcon,
      rightIcon,
      clearable = false,
      searchable = false,
      loading = false,
      floating = false,
      characterCount = false,
      maxLength,
      required = false,
      disabled = false,
      value,
      defaultValue,
      onClear,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Determine the current state
    const state = propState || (errorText ? 'error' : successText ? 'success' : warningText ? 'warning' : 'default');
    
    // Get current value
    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = Boolean(currentValue && String(currentValue).length > 0);
    
    // Get helper text based on state
    const currentHelperText = errorText || successText || warningText || helperText;
    
    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };
    
    // Handle clear
    const handleClear = () => {
      if (value === undefined) {
        setInternalValue('');
      }
      onClear?.();
      inputRef.current?.focus();
    };
    
    // Handle focus
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };
    
    // Handle blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };
    
    // Auto-focus for searchable inputs
    useEffect(() => {
      if (searchable && inputRef.current) {
        inputRef.current.focus();
      }
    }, [searchable]);
    
    // Determine input type
    const inputType = type === 'password' && showPassword ? 'text' : type;
    
    // Character count
    const characterCountText = maxLength
      ? `${String(currentValue).length}/${maxLength}`
      : String(currentValue).length;
    
    return (
      <div className={cn('w-full', containerClassName)}>
        {/* Label */}
        {label && !floating && (
          <motion.label
            className={cn(labelVariants({ state, required }), 'mb-1')}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        
        {/* Input Container */}
        <motion.div
          className={cn(
            enhancedInputVariants({ variant, size, state }),
            'relative',
            floating && 'pt-4'
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Floating Label */}
          {floating && label && (
            <FloatingLabel
              label={label}
              focused={focused}
              hasValue={hasValue}
              state={state}
              required={required}
            />
          )}
          
          {/* Left Icon */}
          {(leftIcon || searchable) && (
            <div className="flex items-center pl-3">
              {searchable ? (
                <Search className="h-4 w-4 text-gray-400" />
              ) : (
                leftIcon
              )}
            </div>
          )}
          
          {/* Input Field */}
          <input
            ref={inputRef}
            type={inputType}
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled || loading}
            maxLength={maxLength}
            className={cn(
              inputFieldVariants({ size }),
              leftIcon || searchable ? 'pl-0' : '',
              (rightIcon || clearable || type === 'password' || state !== 'default' || loading) ? 'pr-0' : ''
            )}
            {...props}
          />
          
          {/* Right Icons */}
          <div className="flex items-center pr-3 space-x-1">
            {/* Loading Spinner */}
            {loading && (
              <motion.div
                className="h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            )}
            
            {/* State Icon */}
            <AnimatePresence>
              {state !== 'default' && !loading && (
                <StateIcon state={state as 'error' | 'success' | 'warning'} />
              )}
            </AnimatePresence>
            
            {/* Clear Button */}
            {clearable && hasValue && !loading && (
              <motion.button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
            
            {/* Password Toggle */}
            {type === 'password' && (
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </motion.button>
            )}
            
            {/* Custom Right Icon */}
            {rightIcon && !loading && (
              <div className="text-gray-400">
                {rightIcon}
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Helper Text and Character Count */}
        <div className="flex justify-between items-center mt-1">
          {/* Helper Text */}
          <AnimatePresence>
            {currentHelperText && (
              <motion.p
                className={helperTextVariants({ state })}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {currentHelperText}
              </motion.p>
            )}
          </AnimatePresence>
          
          {/* Character Count */}
          {characterCount && (
            <motion.span
              className={cn(
                'text-xs',
                maxLength && String(currentValue).length > maxLength * 0.9
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-gray-500 dark:text-gray-400'
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {characterCountText}
            </motion.span>
          )}
        </div>
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';

export { EnhancedInput, enhancedInputVariants };
export type { EnhancedInputProps };