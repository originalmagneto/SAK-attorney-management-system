/**
 * Enhanced Dropdown Component
 * Modern, feature-rich dropdown with animations, positioning, and accessibility
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  Check,
  Search,
  X,
  MoreHorizontal,
  Plus,
  Filter,
  Settings,
  User,
  LogOut,
} from 'lucide-react';
import { createPortal } from 'react-dom';

// Enhanced dropdown variants
const enhancedDropdownVariants = cva(
  [
    'relative inline-block text-left',
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

// Trigger button variants
const triggerVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
          'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700',
          'focus:ring-blue-500/20',
        ],
        primary: [
          'bg-blue-600 text-white hover:bg-blue-700',
          'dark:bg-blue-500 dark:hover:bg-blue-600',
          'focus:ring-blue-500/20',
        ],
        secondary: [
          'bg-gray-600 text-white hover:bg-gray-700',
          'dark:bg-gray-500 dark:hover:bg-gray-600',
          'focus:ring-gray-500/20',
        ],
        ghost: [
          'text-gray-700 hover:bg-gray-100',
          'dark:text-gray-200 dark:hover:bg-gray-800',
          'focus:ring-gray-500/20',
        ],
        outline: [
          'border border-gray-300 text-gray-700 hover:bg-gray-50',
          'dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800',
          'focus:ring-blue-500/20',
        ],
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        default: 'px-4 py-2 text-base',
        lg: 'px-5 py-3 text-lg',
        xl: 'px-6 py-4 text-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Menu variants
const menuVariants = cva(
  [
    'absolute z-50 rounded-lg shadow-lg border backdrop-blur-sm',
    'focus:outline-none',
    'max-h-96 overflow-auto',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-white border-gray-200',
          'dark:bg-gray-800 dark:border-gray-700',
        ],
        glass: [
          'bg-white/80 border-white/20',
          'dark:bg-gray-900/80 dark:border-gray-700/20',
        ],
        solid: [
          'bg-white border-gray-300',
          'dark:bg-gray-900 dark:border-gray-600',
        ],
      },
      size: {
        sm: 'min-w-32 py-1',
        default: 'min-w-40 py-2',
        lg: 'min-w-48 py-3',
        xl: 'min-w-56 py-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Menu item variants
const menuItemVariants = cva(
  [
    'flex items-center gap-3 w-full px-3 py-2 text-left',
    'transition-colors duration-150',
    'cursor-pointer select-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-gray-700 hover:bg-gray-100',
          'dark:text-gray-200 dark:hover:bg-gray-700',
        ],
        destructive: [
          'text-red-600 hover:bg-red-50',
          'dark:text-red-400 dark:hover:bg-red-900/20',
        ],
        success: [
          'text-green-600 hover:bg-green-50',
          'dark:text-green-400 dark:hover:bg-green-900/20',
        ],
        warning: [
          'text-yellow-600 hover:bg-yellow-50',
          'dark:text-yellow-400 dark:hover:bg-yellow-900/20',
        ],
      },
      size: {
        sm: 'px-2 py-1 text-sm',
        default: 'px-3 py-2 text-base',
        lg: 'px-4 py-3 text-lg',
        xl: 'px-5 py-4 text-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Position type
export type DropdownPosition = 
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';

// Animation presets
export type DropdownAnimation = 'fade' | 'scale' | 'slide' | 'flip';

// Dropdown item interface
export interface DropdownItem {
  id: string;
  label: React.ReactNode;
  value?: any;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  onClick?: (item: DropdownItem) => void;
  href?: string;
  target?: string;
  divider?: boolean;
  header?: boolean;
}

// Enhanced dropdown props
export interface EnhancedDropdownProps
  extends VariantProps<typeof enhancedDropdownVariants> {
  children?: React.ReactNode;
  items?: DropdownItem[];
  trigger?: React.ReactNode;
  triggerVariant?: VariantProps<typeof triggerVariants>['variant'];
  triggerSize?: VariantProps<typeof triggerVariants>['size'];
  menuVariant?: VariantProps<typeof menuVariants>['variant'];
  menuSize?: VariantProps<typeof menuVariants>['size'];
  position?: DropdownPosition;
  animation?: DropdownAnimation;
  offset?: number;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  multiSelect?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selectedItems: string[]) => void;
  closeOnSelect?: boolean;
  maxHeight?: number;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
  onOpen?: () => void;
  onClose?: () => void;
  portal?: boolean;
  portalContainer?: Element;
}

// Animation variants
const getAnimationVariants = (animation: DropdownAnimation, position: DropdownPosition) => {
  const isTop = position.startsWith('top');
  const isLeft = position.includes('left');
  const isRight = position.includes('right');
  
  switch (animation) {
    case 'fade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
    
    case 'scale':
      return {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
      };
    
    case 'slide':
      return {
        initial: {
          opacity: 0,
          y: isTop ? 10 : -10,
          x: isLeft ? 10 : isRight ? -10 : 0,
        },
        animate: { opacity: 1, y: 0, x: 0 },
        exit: {
          opacity: 0,
          y: isTop ? 10 : -10,
          x: isLeft ? 10 : isRight ? -10 : 0,
        },
      };
    
    case 'flip':
      return {
        initial: {
          opacity: 0,
          rotateX: isTop ? 90 : -90,
        },
        animate: { opacity: 1, rotateX: 0 },
        exit: {
          opacity: 0,
          rotateX: isTop ? 90 : -90,
        },
      };
    
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
  }
};

// Calculate position
const calculatePosition = (
  triggerRect: DOMRect,
  menuRect: DOMRect,
  position: DropdownPosition,
  offset: number
) => {
  const { top, left, width, height } = triggerRect;
  const { width: menuWidth, height: menuHeight } = menuRect;
  
  let x = 0;
  let y = 0;
  
  // Calculate base position
  switch (position) {
    case 'bottom-start':
      x = left;
      y = top + height + offset;
      break;
    case 'bottom-end':
      x = left + width - menuWidth;
      y = top + height + offset;
      break;
    case 'top-start':
      x = left;
      y = top - menuHeight - offset;
      break;
    case 'top-end':
      x = left + width - menuWidth;
      y = top - menuHeight - offset;
      break;
    case 'left-start':
      x = left - menuWidth - offset;
      y = top;
      break;
    case 'left-end':
      x = left - menuWidth - offset;
      y = top + height - menuHeight;
      break;
    case 'right-start':
      x = left + width + offset;
      y = top;
      break;
    case 'right-end':
      x = left + width + offset;
      y = top + height - menuHeight;
      break;
  }
  
  return { x, y };
};

const EnhancedDropdown: React.FC<EnhancedDropdownProps> = ({
  children,
  items = [],
  trigger,
  triggerVariant = 'default',
  triggerSize,
  menuVariant = 'default',
  menuSize,
  position = 'bottom-start',
  animation = 'scale',
  offset = 4,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  multiSelect = false,
  selectedItems = [],
  onSelectionChange,
  closeOnSelect = true,
  maxHeight = 384,
  size,
  className,
  triggerClassName,
  menuClassName,
  itemClassName,
  onOpen,
  onClose,
  portal = true,
  portalContainer,
}) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [internalSelectedItems, setInternalSelectedItems] = useState<string[]>(selectedItems);
  
  // Refs
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Controlled vs uncontrolled selection
  const isControlled = onSelectionChange !== undefined;
  const currentSelectedItems = isControlled ? selectedItems : internalSelectedItems;
  
  // Filter items based on search
  const filteredItems = searchable
    ? items.filter(item => {
        if (typeof item.label === 'string') {
          return item.label.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
      })
    : items;
  
  // Update position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !menuRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    
    const newPosition = calculatePosition(triggerRect, menuRect, position, offset);
    
    // Viewport bounds checking
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    
    // Adjust for viewport bounds
    if (newPosition.x < 8) {
      newPosition.x = 8;
    } else if (newPosition.x + menuRect.width > viewport.width - 8) {
      newPosition.x = viewport.width - menuRect.width - 8;
    }
    
    if (newPosition.y < 8) {
      newPosition.y = 8;
    } else if (newPosition.y + menuRect.height > viewport.height - 8) {
      newPosition.y = viewport.height - menuRect.height - 8;
    }
    
    setMenuPosition(newPosition);
  }, [position, offset]);
  
  // Open dropdown
  const openDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    onOpen?.();
  }, [disabled, onOpen]);
  
  // Close dropdown
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    onClose?.();
  }, [onClose]);
  
  // Toggle dropdown
  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }, [isOpen, openDropdown, closeDropdown]);
  
  // Handle item click
  const handleItemClick = useCallback((item: DropdownItem) => {
    if (item.disabled) return;
    
    // Handle selection
    if (multiSelect) {
      const newSelection = currentSelectedItems.includes(item.id)
        ? currentSelectedItems.filter(id => id !== item.id)
        : [...currentSelectedItems, item.id];
      
      if (isControlled) {
        onSelectionChange?.(newSelection);
      } else {
        setInternalSelectedItems(newSelection);
      }
    } else {
      const newSelection = [item.id];
      if (isControlled) {
        onSelectionChange?.(newSelection);
      } else {
        setInternalSelectedItems(newSelection);
      }
      
      if (closeOnSelect) {
        closeDropdown();
      }
    }
    
    // Handle custom click
    item.onClick?.(item);
    
    // Handle navigation
    if (item.href) {
      if (item.target === '_blank') {
        window.open(item.href, '_blank');
      } else {
        window.location.href = item.href;
      }
    }
  }, [multiSelect, currentSelectedItems, isControlled, onSelectionChange, closeOnSelect, closeDropdown]);
  
  // Handle outside click
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        menuRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !menuRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeDropdown]);
  
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeDropdown]);
  
  // Update position when open
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen, updatePosition]);
  
  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, searchable]);
  
  // Animation variants
  const animationVariants = getAnimationVariants(animation, position);
  
  // Default trigger
  const defaultTrigger = (
    <button
      ref={triggerRef}
      className={cn(
        triggerVariants({ variant: triggerVariant, size: triggerSize || size }),
        triggerClassName
      )}
      onClick={toggleDropdown}
      disabled={disabled}
      aria-expanded={isOpen}
      aria-haspopup="menu"
    >
      {children || 'Options'}
      <ChevronDown
        className={cn(
          'transition-transform duration-200',
          isOpen && 'rotate-180',
          triggerSize === 'sm' || size === 'sm' ? 'h-3 w-3' :
          triggerSize === 'lg' || size === 'lg' ? 'h-5 w-5' :
          triggerSize === 'xl' || size === 'xl' ? 'h-6 w-6' :
          'h-4 w-4'
        )}
      />
    </button>
  );
  
  // Menu content
  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className={cn(
            menuVariants({ variant: menuVariant, size: menuSize || size }),
            menuClassName
          )}
          style={{
            position: 'fixed',
            left: menuPosition.x,
            top: menuPosition.y,
            maxHeight,
            zIndex: 9999,
          }}
          initial={animationVariants.initial}
          animate={animationVariants.animate}
          exit={animationVariants.exit}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          role="menu"
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'w-full pl-10 pr-4 py-2 text-sm rounded-md border border-gray-300',
                    'bg-white text-gray-900 placeholder-gray-500',
                    'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  )}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Items */}
          <div className="py-1">
            {filteredItems.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No results found' : 'No items available'}
              </div>
            ) : (
              filteredItems.map((item, index) => {
                if (item.divider) {
                  return (
                    <hr
                      key={`divider-${index}`}
                      className="my-1 border-gray-200 dark:border-gray-700"
                    />
                  );
                }
                
                if (item.header) {
                  return (
                    <div
                      key={item.id}
                      className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {item.label}
                    </div>
                  );
                }
                
                const isSelected = currentSelectedItems.includes(item.id);
                
                return (
                  <button
                    key={item.id}
                    className={cn(
                      menuItemVariants({
                        variant: item.variant || 'default',
                        size: menuSize || size,
                      }),
                      itemClassName,
                      item.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    role="menuitem"
                  >
                    {/* Icon */}
                    {item.icon && (
                      <span className="flex-shrink-0">
                        {item.icon}
                      </span>
                    )}
                    
                    {/* Label */}
                    <span className="flex-1 text-left">
                      {item.label}
                    </span>
                    
                    {/* Selection indicator */}
                    {multiSelect && isSelected && (
                      <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  
  return (
    <div className={cn(enhancedDropdownVariants({ size }), className)}>
      {/* Trigger */}
      {trigger ? (
        <div onClick={toggleDropdown} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        defaultTrigger
      )}
      
      {/* Menu */}
      {portal ? (
        typeof window !== 'undefined' &&
        createPortal(
          menuContent,
          portalContainer || document.body
        )
      ) : (
        menuContent
      )}
    </div>
  );
};

EnhancedDropdown.displayName = 'EnhancedDropdown';

export { EnhancedDropdown, enhancedDropdownVariants };
export type { EnhancedDropdownProps };