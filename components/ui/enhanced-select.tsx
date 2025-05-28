/**
 * Enhanced Select Component
 * Modern, feature-rich select with search, multi-select, and animations
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Check,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { EnhancedBadge } from './enhanced-badge';

// Enhanced select variants
const enhancedSelectVariants = cva(
  [
    'relative w-full rounded-md border transition-all duration-200',
    'focus-within:ring-2 focus-within:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-900',
          'focus-within:border-blue-500 focus-within:ring-blue-500/20',
        ],
        filled: [
          'border-transparent',
          'bg-gray-100 dark:bg-gray-800',
          'focus-within:bg-white dark:focus-within:bg-gray-900',
          'focus-within:border-blue-500 focus-within:ring-blue-500/20',
        ],
        outlined: [
          'border-2 border-gray-300 dark:border-gray-600',
          'bg-transparent',
          'focus-within:border-blue-500 focus-within:ring-blue-500/20',
        ],
        underlined: [
          'border-0 border-b-2 border-gray-300 dark:border-gray-600',
          'bg-transparent rounded-none',
          'focus-within:border-blue-500 focus-within:ring-0',
        ],
        ghost: [
          'border-transparent',
          'bg-transparent',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'focus-within:bg-gray-100 dark:focus-within:bg-gray-800',
          'focus-within:ring-0',
        ],
      },
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
      },
      state: {
        default: '',
        error: 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20',
        success: 'border-green-500 focus-within:border-green-500 focus-within:ring-green-500/20',
        warning: 'border-yellow-500 focus-within:border-yellow-500 focus-within:ring-yellow-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

// Select trigger variants
const selectTriggerVariants = cva(
  [
    'flex items-center justify-between w-full px-3 py-2',
    'text-left cursor-pointer',
    'focus:outline-none',
  ],
  {
    variants: {
      size: {
        sm: 'px-2 py-1.5 text-sm min-h-[32px]',
        default: 'px-3 py-2 text-base min-h-[40px]',
        lg: 'px-4 py-3 text-lg min-h-[48px]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// Dropdown variants
const dropdownVariants = cva(
  [
    'absolute z-50 w-full mt-1 bg-white dark:bg-gray-900',
    'border border-gray-200 dark:border-gray-700',
    'rounded-md shadow-lg',
    'max-h-60 overflow-auto',
  ],
  {
    variants: {
      position: {
        bottom: 'top-full',
        top: 'bottom-full mb-1',
      },
    },
    defaultVariants: {
      position: 'bottom',
    },
  }
);

// Option variants
const optionVariants = cva(
  [
    'flex items-center px-3 py-2 cursor-pointer transition-colors',
    'hover:bg-gray-100 dark:hover:bg-gray-800',
  ],
  {
    variants: {
      selected: {
        true: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        false: 'text-gray-900 dark:text-gray-100',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed hover:bg-transparent',
        false: '',
      },
      size: {
        sm: 'px-2 py-1.5 text-sm',
        default: 'px-3 py-2 text-base',
        lg: 'px-4 py-3 text-lg',
      },
    },
    defaultVariants: {
      selected: false,
      disabled: false,
      size: 'default',
    },
  }
);

// Option interface
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
  group?: string;
}

// Enhanced select props
export interface EnhancedSelectProps
  extends VariantProps<typeof enhancedSelectVariants> {
  options: SelectOption[];
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  required?: boolean;
  maxSelections?: number;
  groupBy?: boolean;
  creatable?: boolean;
  createLabel?: (inputValue: string) => string;
  noOptionsMessage?: string;
  loadingMessage?: string;
  onChange?: (value: string | number | (string | number)[] | null) => void;
  onSearch?: (query: string) => void;
  onCreate?: (inputValue: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  animate?: boolean;
  closeOnSelect?: boolean;
  portal?: boolean;
}

// State icons
const StateIcon = ({ state }: { state: 'error' | 'success' | 'warning' | 'default' }) => {
  switch (state) {
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
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

// No options message
const NoOptionsMessage = ({ message }: { message: string }) => (
  <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-center">
    {message}
  </div>
);

// Create option component
const CreateOption = ({ 
  inputValue, 
  createLabel, 
  onCreate 
}: { 
  inputValue: string; 
  createLabel: (value: string) => string;
  onCreate: (value: string) => void;
}) => (
  <div
    className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
    onClick={() => onCreate(inputValue)}
  >
    <span className="text-blue-600 dark:text-blue-400">
      {createLabel(inputValue)}
    </span>
  </div>
);

const EnhancedSelect = React.forwardRef<HTMLDivElement, EnhancedSelectProps>(
  (props, ref) => {
    const {
      options,
      value,
      defaultValue,
      placeholder = 'Select an option...',
      searchable = false,
      searchPlaceholder = 'Search...',
      clearable = false,
      multiple = false,
      disabled = false,
      loading = false,
      error,
      helperText,
      label,
      required = false,
      maxSelections,
      groupBy = false,
      creatable = false,
      createLabel = (value) => `Create "${value}"`,
      noOptionsMessage = 'No options available',
      loadingMessage = 'Loading...',
      onChange,
      onSearch,
      onCreate,
      onFocus,
      onBlur,
      variant,
      size,
      state,
      className,
      dropdownClassName,
      optionClassName,
      animate = true,
      closeOnSelect = true,
      portal = false,
    } = props;

    // State
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [internalValue, setInternalValue] = useState<string | number | (string | number)[]>(
      value ?? defaultValue ?? (multiple ? [] : '')
    );
    const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Controlled vs uncontrolled
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    // Handle value change
    const handleValueChange = useCallback((newValue: string | number | (string | number)[] | null) => {
      if (!isControlled) {
        setInternalValue(newValue ?? (multiple ? [] : ''));
      }
      onChange?.(newValue);
    }, [isControlled, multiple, onChange]);

    // Get selected options
    const selectedOptions = React.useMemo(() => {
      if (multiple && Array.isArray(currentValue)) {
        return options.filter(option => currentValue.includes(option.value));
      }
      if (!multiple && currentValue) {
        return options.filter(option => option.value === currentValue);
      }
      return [];
    }, [options, currentValue, multiple]);

    // Filter options based on search
    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options;
      return options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery]);

    // Group options if needed
    const groupedOptions = React.useMemo(() => {
      if (!groupBy) return { '': filteredOptions };
      
      return filteredOptions.reduce((groups, option) => {
        const group = option.group || 'Other';
        if (!groups[group]) groups[group] = [];
        groups[group].push(option);
        return groups;
      }, {} as Record<string, SelectOption[]>);
    }, [filteredOptions, groupBy]);

    // Handle option selection
    const handleOptionSelect = useCallback((option: SelectOption) => {
      if (option.disabled) return;

      if (multiple) {
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        const isSelected = currentArray.includes(option.value);
        
        let newValue: (string | number)[];
        if (isSelected) {
          newValue = currentArray.filter(v => v !== option.value);
        } else {
          if (maxSelections && currentArray.length >= maxSelections) {
            return; // Don't allow more selections
          }
          newValue = [...currentArray, option.value];
        }
        
        handleValueChange(newValue);
        
        if (!closeOnSelect) {
          return; // Keep dropdown open
        }
      } else {
        handleValueChange(option.value);
      }
      
      if (closeOnSelect) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }, [currentValue, multiple, maxSelections, handleValueChange, closeOnSelect]);

    // Handle clear
    const handleClear = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      handleValueChange(multiple ? [] : null);
    }, [multiple, handleValueChange]);

    // Handle search
    const handleSearch = useCallback((query: string) => {
      setSearchQuery(query);
      onSearch?.(query);
    }, [onSearch]);

    // Handle create
    const handleCreate = useCallback((inputValue: string) => {
      onCreate?.(inputValue);
      setSearchQuery('');
      setIsOpen(false);
    }, [onCreate]);

    // Handle dropdown position
    useEffect(() => {
      if (isOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        if (spaceBelow < 200 && spaceAbove > spaceBelow) {
          setDropdownPosition('top');
        } else {
          setDropdownPosition('bottom');
        }
      }
    }, [isOpen]);

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchQuery('');
          onBlur?.();
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen, onBlur]);

    // Handle keyboard navigation
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen) return;
        
        switch (event.key) {
          case 'Escape':
            setIsOpen(false);
            setSearchQuery('');
            break;
          case 'Enter':
            event.preventDefault();
            // Handle enter on focused option
            break;
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }
    }, [isOpen]);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    // Determine state
    const currentState = error ? 'error' : state || 'default';

    // Render display value
    const renderDisplayValue = () => {
      if (multiple && Array.isArray(currentValue) && currentValue.length > 0) {
        if (selectedOptions.length <= 2) {
          return (
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map((option) => (
                <EnhancedBadge
                  key={option.value}
                  variant="secondary"
                  size="sm"
                  removable
                  onRemove={(e) => {
                    e.stopPropagation();
                    const newValue = (currentValue as (string | number)[]).filter(v => v !== option.value);
                    handleValueChange(newValue);
                  }}
                >
                  {option.label}
                </EnhancedBadge>
              ))}
            </div>
          );
        } else {
          return (
            <div className="flex items-center gap-2">
              <EnhancedBadge variant="secondary" size="sm">
                {selectedOptions.length} selected
              </EnhancedBadge>
              {clearable && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        }
      }
      
      if (!multiple && selectedOptions.length > 0) {
        return (
          <div className="flex items-center gap-2">
            {selectedOptions[0].icon && (
              <span className="flex-shrink-0">{selectedOptions[0].icon}</span>
            )}
            <span className="truncate">{selectedOptions[0].label}</span>
          </div>
        );
      }
      
      return (
        <span className="text-gray-500 dark:text-gray-400">
          {placeholder}
        </span>
      );
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Select Container */}
        <div
          ref={containerRef}
          className={cn(
            enhancedSelectVariants({ variant, size, state: currentState }),
            className
          )}
        >
          {/* Trigger */}
          <div
            className={selectTriggerVariants({ size })}
            onClick={() => {
              if (!disabled) {
                setIsOpen(!isOpen);
                onFocus?.();
              }
            }}
          >
            <div className="flex-1 min-w-0">
              {renderDisplayValue()}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* State Icon */}
              <StateIcon state={currentState} />
              
              {/* Loading */}
              {loading && <LoadingSpinner />}
              
              {/* Clear Button */}
              {clearable && !loading && selectedOptions.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              {/* Dropdown Arrow */}
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </motion.div>
            </div>
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={dropdownRef}
                className={cn(
                  dropdownVariants({ position: dropdownPosition }),
                  dropdownClassName
                )}
                initial={animate ? { opacity: 0, y: dropdownPosition === 'bottom' ? -10 : 10 } : false}
                animate={animate ? { opacity: 1, y: 0 } : false}
                exit={animate ? { opacity: 0, y: dropdownPosition === 'bottom' ? -10 : 10 } : false}
                transition={{ duration: 0.2 }}
              >
                {/* Search */}
                {searchable && (
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Options */}
                <div className="max-h-48 overflow-auto">
                  {loading ? (
                    <div className="px-3 py-2 text-center text-gray-500 dark:text-gray-400">
                      {loadingMessage}
                    </div>
                  ) : Object.keys(groupedOptions).length === 0 ? (
                    <NoOptionsMessage message={noOptionsMessage} />
                  ) : (
                    Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                      <div key={groupName}>
                        {/* Group Header */}
                        {groupBy && groupName && (
                          <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                            {groupName}
                          </div>
                        )}
                        
                        {/* Group Options */}
                        {groupOptions.map((option) => {
                          const isSelected = multiple
                            ? Array.isArray(currentValue) && currentValue.includes(option.value)
                            : currentValue === option.value;

                          return (
                            <motion.div
                              key={option.value}
                              className={cn(
                                optionVariants({
                                  selected: isSelected,
                                  disabled: option.disabled,
                                  size,
                                }),
                                optionClassName
                              )}
                              onClick={() => handleOptionSelect(option)}
                              initial={animate ? { opacity: 0, x: -10 } : false}
                              animate={animate ? { opacity: 1, x: 0 } : false}
                              transition={{ duration: 0.1 }}
                            >
                              {/* Option Content */}
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {option.icon && (
                                  <span className="flex-shrink-0">{option.icon}</span>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="truncate">{option.label}</div>
                                  {option.description && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                      {option.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Selection Indicator */}
                              {isSelected && (
                                <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    ))
                  )}
                  
                  {/* Create Option */}
                  {creatable && searchQuery && !filteredOptions.some(opt => opt.label.toLowerCase() === searchQuery.toLowerCase()) && (
                    <CreateOption
                      inputValue={searchQuery}
                      createLabel={createLabel}
                      onCreate={handleCreate}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Helper Text / Error */}
        {(helperText || error) && (
          <motion.div
            className={cn(
              'mt-1 text-xs',
              error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
            )}
            initial={animate ? { opacity: 0, y: -5 } : false}
            animate={animate ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.2 }}
          >
            {error || helperText}
          </motion.div>
        )}
      </div>
    );
  }
);

EnhancedSelect.displayName = 'EnhancedSelect';

export { EnhancedSelect, enhancedSelectVariants };
export type { EnhancedSelectProps, SelectOption };