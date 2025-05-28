/**
 * Enhanced Textarea Component
 * Modern, feature-rich textarea with auto-resize, character counting, and animations
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Copy,
  RotateCcw,
  Maximize2,
  Minimize2,
} from 'lucide-react';

// Enhanced textarea variants
const enhancedTextareaVariants = cva(
  [
    'w-full rounded-md border transition-all duration-200',
    'focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'resize-none', // We'll handle resize programmatically
  ],
  {
    variants: {
      variant: {
        default: [
          'border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-900',
          'focus:border-blue-500 focus:ring-blue-500/20',
        ],
        filled: [
          'border-transparent',
          'bg-gray-100 dark:bg-gray-800',
          'focus:bg-white dark:focus:bg-gray-900',
          'focus:border-blue-500 focus:ring-blue-500/20',
        ],
        outlined: [
          'border-2 border-gray-300 dark:border-gray-600',
          'bg-transparent',
          'focus:border-blue-500 focus:ring-blue-500/20',
        ],
        underlined: [
          'border-0 border-b-2 border-gray-300 dark:border-gray-600',
          'bg-transparent rounded-none',
          'focus:border-blue-500 focus:ring-0',
        ],
        ghost: [
          'border-transparent',
          'bg-transparent',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'focus:bg-gray-100 dark:focus:bg-gray-800',
          'focus:ring-0',
        ],
      },
      size: {
        sm: 'text-sm px-2 py-1.5',
        default: 'text-base px-3 py-2',
        lg: 'text-lg px-4 py-3',
      },
      state: {
        default: '',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
        warning: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20',
        info: 'border-blue-500 focus:border-blue-500 focus:ring-blue-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

// Container variants
const containerVariants = cva(
  'relative w-full',
  {
    variants: {
      fullscreen: {
        true: 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4',
        false: '',
      },
    },
    defaultVariants: {
      fullscreen: false,
    },
  }
);

// Enhanced textarea props
export interface EnhancedTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof enhancedTextareaVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  warning?: string;
  info?: string;
  required?: boolean;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  showCharCount?: boolean;
  maxLength?: number;
  copyable?: boolean;
  clearable?: boolean;
  fullscreenable?: boolean;
  loading?: boolean;
  animate?: boolean;
  onCopy?: () => void;
  onClear?: () => void;
  onFullscreenToggle?: (isFullscreen: boolean) => void;
}

// State icons
const StateIcon = ({ state }: { state: 'error' | 'success' | 'warning' | 'info' | 'default' }) => {
  switch (state) {
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

// Loading spinner
const LoadingSpinner = () => (
  <motion.div
    className="h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  />
);

// Character count component
const CharacterCount = ({ 
  current, 
  max, 
  state 
}: { 
  current: number; 
  max?: number; 
  state: 'default' | 'warning' | 'error';
}) => {
  const getColor = () => {
    switch (state) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <span className={cn('text-xs', getColor())}>
      {current}{max && `/${max}`}
    </span>
  );
};

const EnhancedTextarea = React.forwardRef<HTMLTextAreaElement, EnhancedTextareaProps>(
  (props, ref) => {
    const {
      label,
      helperText,
      error,
      success,
      warning,
      info,
      required = false,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      showCharCount = false,
      maxLength,
      copyable = false,
      clearable = false,
      fullscreenable = false,
      loading = false,
      animate = true,
      variant,
      size,
      state,
      className,
      value,
      defaultValue,
      onChange,
      onCopy,
      onClear,
      onFullscreenToggle,
      disabled,
      placeholder,
      ...textareaProps
    } = props;

    // State
    const [internalValue, setInternalValue] = useState(value || defaultValue || '');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Refs
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Controlled vs uncontrolled
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    // Determine current state
    const currentState = error ? 'error' : success ? 'success' : warning ? 'warning' : info ? 'info' : state || 'default';
    const stateMessage = error || success || warning || info || helperText;

    // Character count state
    const charCount = String(currentValue).length;
    const charCountState = maxLength
      ? charCount > maxLength
        ? 'error'
        : charCount > maxLength * 0.9
        ? 'warning'
        : 'default'
      : 'default';

    // Auto-resize functionality
    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea || !autoResize) return;

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate the number of rows
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const padding = parseInt(getComputedStyle(textarea).paddingTop) + parseInt(getComputedStyle(textarea).paddingBottom);
      const minHeight = lineHeight * minRows + padding;
      const maxHeight = lineHeight * maxRows + padding;
      
      // Set the height based on content, respecting min/max rows
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    }, [autoResize, minRows, maxRows]);

    // Handle value change
    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      
      // Respect maxLength
      if (maxLength && newValue.length > maxLength) {
        return;
      }
      
      if (!isControlled) {
        setInternalValue(newValue);
      }
      
      onChange?.(e);
      
      // Adjust height after value change
      setTimeout(adjustHeight, 0);
    }, [isControlled, onChange, maxLength, adjustHeight]);

    // Handle copy
    const handleCopy = useCallback(async () => {
      if (currentValue) {
        try {
          await navigator.clipboard.writeText(String(currentValue));
          onCopy?.();
        } catch (err) {
          console.error('Failed to copy text:', err);
        }
      }
    }, [currentValue, onCopy]);

    // Handle clear
    const handleClear = useCallback(() => {
      if (!isControlled) {
        setInternalValue('');
      }
      
      // Create synthetic event for controlled components
      if (onChange && textareaRef.current) {
        const syntheticEvent = {
          target: { ...textareaRef.current, value: '' },
          currentTarget: textareaRef.current,
        } as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(syntheticEvent);
      }
      
      onClear?.();
      setTimeout(adjustHeight, 0);
    }, [isControlled, onChange, onClear, adjustHeight]);

    // Handle fullscreen toggle
    const handleFullscreenToggle = useCallback(() => {
      const newFullscreen = !isFullscreen;
      setIsFullscreen(newFullscreen);
      onFullscreenToggle?.(newFullscreen);
    }, [isFullscreen, onFullscreenToggle]);

    // Handle escape key in fullscreen
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isFullscreen) {
          handleFullscreenToggle();
        }
      };

      if (isFullscreen) {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          document.body.style.overflow = '';
        };
      }
    }, [isFullscreen, handleFullscreenToggle]);

    // Adjust height on mount and value changes
    useEffect(() => {
      adjustHeight();
    }, [adjustHeight, currentValue]);

    // Focus management
    const handleFocus = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      textareaProps.onFocus?.(e);
    }, [textareaProps]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      textareaProps.onBlur?.(e);
    }, [textareaProps]);

    // Merge refs
    const mergedRef = useCallback((node: HTMLTextAreaElement) => {
      textareaRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);

    return (
      <div className={containerVariants({ fullscreen: isFullscreen })}>
        {/* Fullscreen Header */}
        {isFullscreen && (
          <motion.div
            className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700"
            initial={animate ? { opacity: 0, y: -20 } : false}
            animate={animate ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {label || 'Text Editor'}
            </h3>
            <button
              type="button"
              onClick={handleFullscreenToggle}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Minimize2 className="h-5 w-5" />
            </button>
          </motion.div>
        )}

        <div className="w-full">
          {/* Label */}
          {label && !isFullscreen && (
            <motion.label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              initial={animate ? { opacity: 0, y: -10 } : false}
              animate={animate ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.2 }}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </motion.label>
          )}

          {/* Textarea Container */}
          <div ref={containerRef} className="relative">
            {/* Textarea */}
            <motion.textarea
              ref={mergedRef}
              value={currentValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled || loading}
              placeholder={placeholder}
              maxLength={maxLength}
              className={cn(
                enhancedTextareaVariants({ variant, size, state: currentState }),
                isFullscreen && 'h-full min-h-[400px]',
                !isFullscreen && autoResize && `min-h-[${minRows * 1.5}rem]`,
                'pr-12', // Space for action buttons
                className
              )}
              style={{
                ...(autoResize && !isFullscreen ? { overflow: 'hidden' } : {}),
              }}
              initial={animate ? { opacity: 0, scale: 0.95 } : false}
              animate={animate ? { opacity: 1, scale: 1 } : false}
              transition={{ duration: 0.2 }}
              {...textareaProps}
            />

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex items-center gap-1">
              {/* Loading */}
              {loading && <LoadingSpinner />}
              
              {/* State Icon */}
              {!loading && <StateIcon state={currentState} />}
              
              {/* Copy Button */}
              {copyable && currentValue && (
                <motion.button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                  whileHover={animate ? { scale: 1.1 } : undefined}
                  whileTap={animate ? { scale: 0.95 } : undefined}
                  title="Copy text"
                >
                  <Copy className="h-4 w-4" />
                </motion.button>
              )}
              
              {/* Clear Button */}
              {clearable && currentValue && (
                <motion.button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                  whileHover={animate ? { scale: 1.1 } : undefined}
                  whileTap={animate ? { scale: 0.95 } : undefined}
                  title="Clear text"
                >
                  <RotateCcw className="h-4 w-4" />
                </motion.button>
              )}
              
              {/* Fullscreen Button */}
              {fullscreenable && (
                <motion.button
                  type="button"
                  onClick={handleFullscreenToggle}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                  whileHover={animate ? { scale: 1.1 } : undefined}
                  whileTap={animate ? { scale: 0.95 } : undefined}
                  title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-1">
            {/* Helper Text / Error */}
            <div className="flex-1">
              {stateMessage && (
                <motion.div
                  className={cn(
                    'text-xs',
                    currentState === 'error' && 'text-red-600 dark:text-red-400',
                    currentState === 'success' && 'text-green-600 dark:text-green-400',
                    currentState === 'warning' && 'text-yellow-600 dark:text-yellow-400',
                    currentState === 'info' && 'text-blue-600 dark:text-blue-400',
                    currentState === 'default' && 'text-gray-500 dark:text-gray-400'
                  )}
                  initial={animate ? { opacity: 0, y: -5 } : false}
                  animate={animate ? { opacity: 1, y: 0 } : false}
                  transition={{ duration: 0.2 }}
                >
                  {stateMessage}
                </motion.div>
              )}
            </div>

            {/* Character Count */}
            {showCharCount && (
              <motion.div
                initial={animate ? { opacity: 0, scale: 0.8 } : false}
                animate={animate ? { opacity: 1, scale: 1 } : false}
                transition={{ duration: 0.2 }}
              >
                <CharacterCount
                  current={charCount}
                  max={maxLength}
                  state={charCountState}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

EnhancedTextarea.displayName = 'EnhancedTextarea';

export { EnhancedTextarea, enhancedTextareaVariants };
export type { EnhancedTextareaProps };