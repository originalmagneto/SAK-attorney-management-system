/**
 * Enhanced Radio Component
 * Modern, feature-rich radio button with animations, states, and accessibility
 */

'use client';

import React, { useState, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  Circle,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';

// Radio Group Context
interface RadioGroupContextValue {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  variant?: VariantProps<typeof enhancedRadioVariants>['variant'];
  size?: VariantProps<typeof enhancedRadioVariants>['size'];
  animate?: boolean;
  ripple?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined);

// Enhanced radio variants
const enhancedRadioVariants = cva(
  [
    'relative inline-flex items-center justify-center',
    'border-2 rounded-full transition-all duration-200',
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
          'checked:border-blue-600 checked:bg-blue-50 dark:checked:bg-blue-900/20',
          'focus:ring-blue-500/20',
          'hover:border-blue-400 dark:hover:border-blue-500',
        ],
        primary: [
          'border-blue-300 dark:border-blue-600',
          'bg-white dark:bg-gray-900',
          'checked:border-blue-600 checked:bg-blue-50 dark:checked:bg-blue-900/20',
          'focus:ring-blue-500/20',
          'hover:border-blue-400',
        ],
        success: [
          'border-green-300 dark:border-green-600',
          'bg-white dark:bg-gray-900',
          'checked:border-green-600 checked:bg-green-50 dark:checked:bg-green-900/20',
          'focus:ring-green-500/20',
          'hover:border-green-400',
        ],
        warning: [
          'border-yellow-300 dark:border-yellow-600',
          'bg-white dark:bg-gray-900',
          'checked:border-yellow-600 checked:bg-yellow-50 dark:checked:bg-yellow-900/20',
          'focus:ring-yellow-500/20',
          'hover:border-yellow-400',
        ],
        error: [
          'border-red-300 dark:border-red-600',
          'bg-white dark:bg-gray-900',
          'checked:border-red-600 checked:bg-red-50 dark:checked:bg-red-900/20',
          'focus:ring-red-500/20',
          'hover:border-red-400',
        ],
        ghost: [
          'border-transparent',
          'bg-transparent',
          'checked:border-gray-600 checked:bg-gray-100 dark:checked:bg-gray-800',
          'focus:ring-gray-500/20',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
        ],
        outline: [
          'border-2 border-gray-400 dark:border-gray-500',
          'bg-transparent',
          'checked:border-blue-600 checked:bg-transparent',
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
    },
    defaultVariants: {
      variant: 'default',
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

// Radio Group variants
const radioGroupVariants = cva(
  'space-y-2',
  {
    variants: {
      orientation: {
        vertical: 'flex flex-col',
        horizontal: 'flex flex-row flex-wrap gap-4',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  }
);

// Enhanced radio props
export interface EnhancedRadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof enhancedRadioVariants> {
  label?: string;
  description?: string;
  helperText?: string;
  error?: string;
  success?: string;
  warning?: string;
  info?: string;
  labelPosition?: 'left' | 'right';
  animate?: boolean;
  ripple?: boolean;
  icon?: React.ReactNode;
  checkedIcon?: React.ReactNode;
  onValueChange?: (value: string) => void;
}

// Radio Group props
export interface EnhancedRadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  orientation?: 'vertical' | 'horizontal';
  label?: string;
  description?: string;
  helperText?: string;
  error?: string;
  success?: string;
  warning?: string;
  info?: string;
  variant?: VariantProps<typeof enhancedRadioVariants>['variant'];
  size?: VariantProps<typeof enhancedRadioVariants>['size'];
  animate?: boolean;
  ripple?: boolean;
  className?: string;
  children: React.ReactNode;
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
            className="absolute bg-blue-500/30 rounded-full pointer-events-none"
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
        className="absolute inset-0 rounded-full"
        onMouseDown={addRipple}
      />
    </>
  );
};

// Enhanced Radio Component
const EnhancedRadio = React.forwardRef<HTMLInputElement, EnhancedRadioProps>(
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
      ripple = true,
      icon,
      checkedIcon,
      variant,
      size,
      className,
      value,
      onChange,
      onValueChange,
      disabled,
      id,
      ...inputProps
    } = props;

    // Context
    const context = useContext(RadioGroupContext);
    
    // State
    const [isFocused, setIsFocused] = useState(false);

    // Use context values if available
    const groupValue = context?.value;
    const groupOnChange = context?.onChange;
    const groupName = context?.name;
    const groupDisabled = context?.disabled;
    const groupVariant = context?.variant;
    const groupSize = context?.size;
    const groupAnimate = context?.animate;
    const groupRipple = context?.ripple;

    // Final values
    const finalVariant = variant || groupVariant || 'default';
    const finalSize = size || groupSize || 'default';
    const finalAnimate = animate ?? groupAnimate ?? true;
    const finalRipple = ripple ?? groupRipple ?? true;
    const finalDisabled = disabled || groupDisabled;
    const isChecked = groupValue ? groupValue === value : false;

    // Determine current state
    const currentState = error ? 'error' : success ? 'success' : warning ? 'warning' : info ? 'info' : null;
    const stateMessage = error || success || warning || info || helperText;

    // Handle change
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (value) {
        groupOnChange?.(value);
        onValueChange?.(value);
      }
      onChange?.(e);
    }, [value, groupOnChange, onValueChange, onChange]);

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
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    // Get radio icon
    const getRadioIcon = () => {
      if (isChecked) {
        return checkedIcon || icon || (
          <Circle 
            className={cn(
              'fill-current',
              finalSize === 'sm' ? 'h-2 w-2' :
              finalSize === 'default' ? 'h-2.5 w-2.5' :
              finalSize === 'lg' ? 'h-3 w-3' :
              'h-3.5 w-3.5',
              finalVariant === 'success' ? 'text-green-600' :
              finalVariant === 'warning' ? 'text-yellow-600' :
              finalVariant === 'error' ? 'text-red-600' :
              finalVariant === 'ghost' ? 'text-gray-600' :
              'text-blue-600'
            )} 
          />
        );
      }
      return null;
    };

    // Radio element
    const radioElement = (
      <div className="relative">
        {/* Hidden input */}
        <input
          ref={ref}
          type="radio"
          id={radioId}
          name={groupName}
          value={value}
          checked={isChecked}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={finalDisabled}
          className="sr-only"
          {...inputProps}
        />
        
        {/* Visual radio */}
        <motion.div
          className={cn(
            enhancedRadioVariants({ variant: finalVariant, size: finalSize }),
            isChecked && 'border-opacity-100',
            isFocused && 'ring-2',
            className
          )}
          initial={finalAnimate ? { scale: 1 } : false}
          animate={finalAnimate ? {
            scale: isFocused ? 1.05 : 1,
          } : false}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          whileTap={finalAnimate ? { scale: 0.95 } : undefined}
        >
          {/* Ripple effect */}
          {finalRipple && <RippleEffect animate={finalAnimate} />}
          
          {/* Radio dot */}
          <AnimatePresence>
            {isChecked && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={finalAnimate ? { scale: 0, opacity: 0 } : false}
                animate={finalAnimate ? { scale: 1, opacity: 1 } : false}
                exit={finalAnimate ? { scale: 0, opacity: 0 } : false}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                {getRadioIcon()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );

    // Label element
    const labelElement = label && (
      <label
        htmlFor={radioId}
        className={cn(
          labelVariants({ size: finalSize, disabled: finalDisabled }),
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
        {/* Radio and Label */}
        <div className="flex items-start">
          {labelPosition === 'left' && labelElement}
          {radioElement}
          {labelPosition === 'right' && labelElement}
          
          {/* State Icon */}
          {currentState && (
            <div className="ml-2 mt-0.5">
              <StateIcon state={currentState} size={finalSize} />
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
            initial={finalAnimate ? { opacity: 0, y: -5 } : false}
            animate={finalAnimate ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.2 }}
          >
            {stateMessage}
          </motion.div>
        )}
      </div>
    );
  }
);

// Enhanced Radio Group Component
const EnhancedRadioGroup = React.forwardRef<HTMLDivElement, EnhancedRadioGroupProps>(
  (props, ref) => {
    const {
      value,
      defaultValue,
      onValueChange,
      name,
      disabled = false,
      required = false,
      orientation = 'vertical',
      label,
      description,
      helperText,
      error,
      success,
      warning,
      info,
      variant,
      size,
      animate = true,
      ripple = true,
      className,
      children,
    } = props;

    // State
    const [internalValue, setInternalValue] = useState(value || defaultValue || '');

    // Controlled vs uncontrolled
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    // Determine current state
    const currentState = error ? 'error' : success ? 'success' : warning ? 'warning' : info ? 'info' : null;
    const stateMessage = error || success || warning || info || helperText;

    // Handle value change
    const handleValueChange = useCallback((newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    }, [isControlled, onValueChange]);

    // Context value
    const contextValue: RadioGroupContextValue = {
      value: currentValue,
      onChange: handleValueChange,
      name,
      disabled,
      variant,
      size,
      animate,
      ripple,
    };

    return (
      <div ref={ref} className="w-full">
        {/* Label */}
        {label && (
          <motion.div
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            initial={animate ? { opacity: 0, y: -10 } : false}
            animate={animate ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.2 }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
            {description && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-normal">
                {description}
              </div>
            )}
          </motion.div>
        )}

        {/* Radio Group */}
        <RadioGroupContext.Provider value={contextValue}>
          <div
            className={cn(
              radioGroupVariants({ orientation }),
              className
            )}
            role="radiogroup"
            aria-required={required}
            aria-invalid={!!error}
          >
            {children}
          </div>
        </RadioGroupContext.Provider>

        {/* Helper Text / State Message */}
        {stateMessage && (
          <motion.div
            className={cn(
              'mt-2 text-xs',
              currentState === 'error' && 'text-red-600 dark:text-red-400',
              currentState === 'success' && 'text-green-600 dark:text-green-400',
              currentState === 'warning' && 'text-yellow-600 dark:text-yellow-400',
              currentState === 'info' && 'text-blue-600 dark:text-blue-400',
              !currentState && 'text-gray-500 dark:text-gray-400'
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

EnhancedRadio.displayName = 'EnhancedRadio';
EnhancedRadioGroup.displayName = 'EnhancedRadioGroup';

export { EnhancedRadio, EnhancedRadioGroup, enhancedRadioVariants, radioGroupVariants };
export type { EnhancedRadioProps, EnhancedRadioGroupProps };