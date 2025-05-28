/**
 * Enhanced Slider Component
 * Modern, feature-rich slider with animations, variants, and accessibility
 */

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  Volume,
  VolumeX,
  Volume1,
  Volume2,
  Brightness,
  Settings,
  Thermometer,
  DollarSign,
  Percent,
} from 'lucide-react';

// Enhanced slider variants
const enhancedSliderVariants = cva(
  [
    'relative flex items-center w-full touch-none select-none',
    'group',
  ],
  {
    variants: {
      variant: {
        default: '',
        primary: '',
        success: '',
        warning: '',
        error: '',
        info: '',
        gradient: '',
        glass: '',
      },
      size: {
        xs: 'h-3',
        sm: 'h-4',
        default: 'h-5',
        lg: 'h-6',
        xl: 'h-8',
      },
      orientation: {
        horizontal: 'w-full',
        vertical: 'h-full flex-col',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      orientation: 'horizontal',
    },
  }
);

// Track variants
const trackVariants = cva(
  [
    'relative flex-1 rounded-full',
    'transition-all duration-200',
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
        default: 'h-2',
        lg: 'h-3',
        xl: 'h-4',
      },
      orientation: {
        horizontal: '',
        vertical: 'w-2 h-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      orientation: 'horizontal',
    },
  }
);

// Range variants
const rangeVariants = cva(
  [
    'absolute rounded-full',
    'transition-all duration-200',
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
      size: {
        xs: 'h-1',
        sm: 'h-2',
        default: 'h-2',
        lg: 'h-3',
        xl: 'h-4',
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
    'absolute rounded-full border-2 border-white dark:border-gray-900',
    'shadow-lg cursor-pointer',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'hover:scale-110 active:scale-95',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: 'bg-blue-600 dark:bg-blue-500 focus:ring-blue-500',
        primary: 'bg-blue-600 dark:bg-blue-500 focus:ring-blue-500',
        success: 'bg-green-600 dark:bg-green-500 focus:ring-green-500',
        warning: 'bg-yellow-600 dark:bg-yellow-500 focus:ring-yellow-500',
        error: 'bg-red-600 dark:bg-red-500 focus:ring-red-500',
        info: 'bg-blue-500 dark:bg-blue-400 focus:ring-blue-400',
        gradient: 'bg-gradient-to-r from-blue-500 to-purple-600 focus:ring-blue-500',
        glass: 'bg-white/80 backdrop-blur-sm dark:bg-gray-100/80 focus:ring-white/50',
      },
      size: {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        default: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Enhanced slider props
export interface EnhancedSliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof enhancedSliderVariants> {
  value?: number | number[];
  defaultValue?: number | number[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  range?: boolean;
  vertical?: boolean;
  marks?: Array<{ value: number; label?: string }>;
  tooltip?: boolean;
  tooltipFormatter?: (value: number) => string;
  showValue?: boolean;
  showMinMax?: boolean;
  icon?: React.ReactNode;
  iconType?: 'volume' | 'brightness' | 'temperature' | 'currency' | 'percentage' | 'settings';
  animated?: boolean;
  snapToMarks?: boolean;
  trackClickable?: boolean;
  onChange?: (value: number | number[]) => void;
  onChangeComplete?: (value: number | number[]) => void;
  formatValue?: (value: number) => string;
  className?: string;
  trackClassName?: string;
  rangeClassName?: string;
  thumbClassName?: string;
}

// Predefined icons
const PredefinedIcon = ({ iconType, size }: { iconType: string; size: string }) => {
  const iconSize = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    default: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-7 w-7',
  }[size] || 'h-5 w-5';

  switch (iconType) {
    case 'volume':
      return <Volume className={cn(iconSize, 'text-gray-600 dark:text-gray-400')} />;
    case 'brightness':
      return <Brightness className={cn(iconSize, 'text-gray-600 dark:text-gray-400')} />;
    case 'temperature':
      return <Thermometer className={cn(iconSize, 'text-gray-600 dark:text-gray-400')} />;
    case 'currency':
      return <DollarSign className={cn(iconSize, 'text-gray-600 dark:text-gray-400')} />;
    case 'percentage':
      return <Percent className={cn(iconSize, 'text-gray-600 dark:text-gray-400')} />;
    case 'settings':
      return <Settings className={cn(iconSize, 'text-gray-600 dark:text-gray-400')} />;
    default:
      return null;
  }
};

// Tooltip component
const SliderTooltip = ({ value, formatter, visible, position }: {
  value: number;
  formatter?: (value: number) => string;
  visible: boolean;
  position: { x: number; y: number };
}) => {
  if (!visible) return null;

  return (
    <motion.div
      className="absolute z-10 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg pointer-events-none dark:bg-gray-700"
      style={{
        left: position.x,
        top: position.y - 40,
        transform: 'translateX(-50%)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
    >
      {formatter ? formatter(value) : value}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
    </motion.div>
  );
};

const EnhancedSlider = React.forwardRef<HTMLDivElement, EnhancedSliderProps>(
  (props, ref) => {
    const {
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      range = false,
      vertical = false,
      marks = [],
      tooltip = false,
      tooltipFormatter,
      showValue = false,
      showMinMax = false,
      icon,
      iconType,
      animated = true,
      snapToMarks = false,
      trackClickable = true,
      onChange,
      onChangeComplete,
      formatValue,
      variant,
      size,
      orientation = vertical ? 'vertical' : 'horizontal',
      className,
      trackClassName,
      rangeClassName,
      thumbClassName,
      ...divProps
    } = props;

    // State
    const [internalValue, setInternalValue] = useState<number | number[]>(
      controlledValue ?? defaultValue
    );
    const [isDragging, setIsDragging] = useState(false);
    const [activeThumb, setActiveThumb] = useState<number | null>(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Refs
    const trackRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef<{ value: number | number[]; clientX: number; clientY: number } | null>(null);

    // Current value
    const currentValue = controlledValue ?? internalValue;
    const values = Array.isArray(currentValue) ? currentValue : [currentValue];

    // Normalize value to percentage
    const valueToPercentage = useCallback((val: number) => {
      return ((val - min) / (max - min)) * 100;
    }, [min, max]);

    // Convert percentage to value
    const percentageToValue = useCallback((percentage: number) => {
      const rawValue = min + (percentage / 100) * (max - min);
      
      if (snapToMarks && marks.length > 0) {
        // Find closest mark
        const closest = marks.reduce((prev, curr) => 
          Math.abs(curr.value - rawValue) < Math.abs(prev.value - rawValue) ? curr : prev
        );
        return closest.value;
      }
      
      // Snap to step
      return Math.round(rawValue / step) * step;
    }, [min, max, step, snapToMarks, marks]);

    // Get position from event
    const getPositionFromEvent = useCallback((event: MouseEvent | TouchEvent) => {
      if (!trackRef.current) return 0;
      
      const rect = trackRef.current.getBoundingClientRect();
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
      
      if (orientation === 'vertical') {
        const y = clientY - rect.top;
        return Math.max(0, Math.min(100, ((rect.height - y) / rect.height) * 100));
      } else {
        const x = clientX - rect.left;
        return Math.max(0, Math.min(100, (x / rect.width) * 100));
      }
    }, [orientation]);

    // Handle value change
    const handleValueChange = useCallback((newValue: number | number[]) => {
      if (disabled) return;
      
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }, [disabled, controlledValue, onChange]);

    // Handle mouse/touch start
    const handleStart = useCallback((event: React.MouseEvent | React.TouchEvent, thumbIndex?: number) => {
      if (disabled) return;
      
      event.preventDefault();
      setIsDragging(true);
      setActiveThumb(thumbIndex ?? 0);
      
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
      
      dragStartRef.current = {
        value: currentValue,
        clientX,
        clientY,
      };
      
      if (tooltip) {
        setTooltipVisible(true);
        setTooltipPosition({ x: clientX, y: clientY });
      }
    }, [disabled, currentValue, tooltip]);

    // Handle track click
    const handleTrackClick = useCallback((event: React.MouseEvent) => {
      if (disabled || !trackClickable) return;
      
      const percentage = getPositionFromEvent(event.nativeEvent);
      const newValue = percentageToValue(percentage);
      
      if (range && Array.isArray(currentValue)) {
        // Find closest thumb
        const distances = currentValue.map(val => Math.abs(val - newValue));
        const closestIndex = distances.indexOf(Math.min(...distances));
        
        const newValues = [...currentValue];
        newValues[closestIndex] = newValue;
        newValues.sort((a, b) => a - b);
        
        handleValueChange(newValues);
      } else {
        handleValueChange(newValue);
      }
    }, [disabled, trackClickable, getPositionFromEvent, percentageToValue, range, currentValue, handleValueChange]);

    // Mouse/touch move handler
    useEffect(() => {
      if (!isDragging || !dragStartRef.current) return;
      
      const handleMove = (event: MouseEvent | TouchEvent) => {
        const percentage = getPositionFromEvent(event);
        const newValue = percentageToValue(percentage);
        
        if (range && Array.isArray(currentValue) && activeThumb !== null) {
          const newValues = [...currentValue];
          newValues[activeThumb] = newValue;
          
          // Ensure values don't cross
          if (activeThumb === 0 && newValues[1] !== undefined) {
            newValues[0] = Math.min(newValues[0], newValues[1]);
          } else if (activeThumb === 1 && newValues[0] !== undefined) {
            newValues[1] = Math.max(newValues[1], newValues[0]);
          }
          
          handleValueChange(newValues);
        } else {
          handleValueChange(newValue);
        }
        
        // Update tooltip position
        if (tooltip) {
          const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
          const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
          setTooltipPosition({ x: clientX, y: clientY });
        }
      };
      
      const handleEnd = () => {
        setIsDragging(false);
        setActiveThumb(null);
        setTooltipVisible(false);
        onChangeComplete?.(currentValue);
        dragStartRef.current = null;
      };
      
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }, [isDragging, getPositionFromEvent, percentageToValue, range, currentValue, activeThumb, handleValueChange, tooltip, onChangeComplete]);

    // Calculate range style
    const getRangeStyle = () => {
      if (range && Array.isArray(currentValue)) {
        const start = valueToPercentage(Math.min(...currentValue));
        const end = valueToPercentage(Math.max(...currentValue));
        
        if (orientation === 'vertical') {
          return {
            bottom: `${start}%`,
            height: `${end - start}%`,
          };
        } else {
          return {
            left: `${start}%`,
            width: `${end - start}%`,
          };
        }
      } else {
        const percentage = valueToPercentage(values[0]);
        
        if (orientation === 'vertical') {
          return {
            bottom: 0,
            height: `${percentage}%`,
          };
        } else {
          return {
            left: 0,
            width: `${percentage}%`,
          };
        }
      }
    };

    // Format display value
    const formatDisplayValue = (val: number) => {
      return formatValue ? formatValue(val) : val.toString();
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...divProps}>
        {/* Header */}
        {(showValue || showMinMax || icon || iconType) && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {/* Icon */}
              {icon || (iconType && (
                <PredefinedIcon iconType={iconType} size={size || 'default'} />
              ))}
              
              {/* Min Value */}
              {showMinMax && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDisplayValue(min)}
                </span>
              )}
            </div>
            
            {/* Current Value */}
            {showValue && (
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {Array.isArray(currentValue)
                  ? currentValue.map(formatDisplayValue).join(' - ')
                  : formatDisplayValue(currentValue as number)
                }
              </div>
            )}
            
            {/* Max Value */}
            {showMinMax && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDisplayValue(max)}
              </span>
            )}
          </div>
        )}

        {/* Slider */}
        <div className={cn(enhancedSliderVariants({ variant, size, orientation }))}>
          {/* Track */}
          <div
            ref={trackRef}
            className={cn(trackVariants({ variant, size, orientation }), trackClassName)}
            onClick={handleTrackClick}
          >
            {/* Range */}
            <motion.div
              className={cn(rangeVariants({ variant, size }), rangeClassName)}
              style={getRangeStyle()}
              initial={animated ? { width: 0, height: 0 } : false}
              animate={animated ? getRangeStyle() : false}
              transition={animated ? { duration: 0.2 } : undefined}
            />
            
            {/* Marks */}
            {marks.map((mark) => {
              const percentage = valueToPercentage(mark.value);
              
              return (
                <div
                  key={mark.value}
                  className="absolute w-1 h-1 bg-gray-400 rounded-full dark:bg-gray-500"
                  style={{
                    [orientation === 'vertical' ? 'bottom' : 'left']: `${percentage}%`,
                    transform: orientation === 'vertical' ? 'translateY(50%)' : 'translateX(-50%)',
                  }}
                />
              );
            })}
            
            {/* Thumbs */}
            {values.map((value, index) => {
              const percentage = valueToPercentage(value);
              
              return (
                <motion.div
                  key={index}
                  className={cn(thumbVariants({ variant, size }), thumbClassName)}
                  style={{
                    [orientation === 'vertical' ? 'bottom' : 'left']: `${percentage}%`,
                    transform: orientation === 'vertical' ? 'translateY(50%)' : 'translateX(-50%)',
                  }}
                  initial={animated ? { scale: 0 } : false}
                  animate={animated ? {
                    scale: activeThumb === index ? 1.2 : 1,
                  } : false}
                  transition={animated ? { duration: 0.15 } : undefined}
                  onMouseDown={(e) => handleStart(e, index)}
                  onTouchStart={(e) => handleStart(e, index)}
                  tabIndex={disabled ? -1 : 0}
                  role="slider"
                  aria-valuemin={min}
                  aria-valuemax={max}
                  aria-valuenow={value}
                  aria-disabled={disabled}
                />
              );
            })}
          </div>
        </div>

        {/* Mark Labels */}
        {marks.some(mark => mark.label) && (
          <div className="relative mt-2">
            {marks.map((mark) => {
              if (!mark.label) return null;
              
              const percentage = valueToPercentage(mark.value);
              
              return (
                <div
                  key={mark.value}
                  className="absolute text-xs text-gray-500 dark:text-gray-400"
                  style={{
                    [orientation === 'vertical' ? 'bottom' : 'left']: `${percentage}%`,
                    transform: orientation === 'vertical' ? 'translateY(50%)' : 'translateX(-50%)',
                  }}
                >
                  {mark.label}
                </div>
              );
            })}
          </div>
        )}

        {/* Tooltip */}
        {tooltip && tooltipVisible && activeThumb !== null && (
          <SliderTooltip
            value={values[activeThumb]}
            formatter={tooltipFormatter}
            visible={tooltipVisible}
            position={tooltipPosition}
          />
        )}
      </div>
    );
  }
);

EnhancedSlider.displayName = 'EnhancedSlider';

export { EnhancedSlider, enhancedSliderVariants };
export type { EnhancedSliderProps };