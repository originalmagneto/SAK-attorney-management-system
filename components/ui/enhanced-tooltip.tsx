/**
 * Enhanced Tooltip Component
 * Modern, feature-rich tooltip with animations, positioning, and accessibility
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

// Enhanced tooltip variants
const enhancedTooltipVariants = cva(
  [
    'absolute z-50 px-3 py-2 text-sm font-medium rounded-lg shadow-lg',
    'pointer-events-none select-none',
    'max-w-xs break-words',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-gray-900 text-white',
          'dark:bg-gray-100 dark:text-gray-900',
        ],
        light: [
          'bg-white text-gray-900 border border-gray-200',
          'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
        ],
        dark: [
          'bg-gray-900 text-white',
          'dark:bg-gray-900 dark:text-white',
        ],
        primary: [
          'bg-blue-600 text-white',
          'dark:bg-blue-500 dark:text-white',
        ],
        success: [
          'bg-green-600 text-white',
          'dark:bg-green-500 dark:text-white',
        ],
        warning: [
          'bg-yellow-600 text-white',
          'dark:bg-yellow-500 dark:text-white',
        ],
        error: [
          'bg-red-600 text-white',
          'dark:bg-red-500 dark:text-white',
        ],
        info: [
          'bg-blue-500 text-white',
          'dark:bg-blue-400 dark:text-white',
        ],
        glass: [
          'bg-white/80 backdrop-blur-sm text-gray-900 border border-white/20',
          'dark:bg-gray-900/80 dark:text-gray-100 dark:border-gray-700/20',
        ],
        gradient: [
          'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
        ],
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        default: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
        xl: 'px-5 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Arrow variants
const arrowVariants = cva(
  'absolute w-2 h-2 rotate-45',
  {
    variants: {
      variant: {
        default: [
          'bg-gray-900',
          'dark:bg-gray-100',
        ],
        light: [
          'bg-white border-l border-t border-gray-200',
          'dark:bg-gray-800 dark:border-gray-700',
        ],
        dark: [
          'bg-gray-900',
          'dark:bg-gray-900',
        ],
        primary: [
          'bg-blue-600',
          'dark:bg-blue-500',
        ],
        success: [
          'bg-green-600',
          'dark:bg-green-500',
        ],
        warning: [
          'bg-yellow-600',
          'dark:bg-yellow-500',
        ],
        error: [
          'bg-red-600',
          'dark:bg-red-500',
        ],
        info: [
          'bg-blue-500',
          'dark:bg-blue-400',
        ],
        glass: [
          'bg-white/80 backdrop-blur-sm border-l border-t border-white/20',
          'dark:bg-gray-900/80 dark:border-gray-700/20',
        ],
        gradient: [
          'bg-gradient-to-br from-blue-500 to-purple-600',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Position type
export type TooltipPosition = 
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

// Animation presets
export type TooltipAnimation = 'fade' | 'scale' | 'slide' | 'bounce' | 'flip';

// Enhanced tooltip props
export interface EnhancedTooltipProps
  extends VariantProps<typeof enhancedTooltipVariants> {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  animation?: TooltipAnimation;
  showArrow?: boolean;
  disabled?: boolean;
  delayShow?: number;
  delayHide?: number;
  offset?: number;
  interactive?: boolean;
  followCursor?: boolean;
  maxWidth?: number;
  className?: string;
  contentClassName?: string;
  arrowClassName?: string;
  onShow?: () => void;
  onHide?: () => void;
  portal?: boolean;
  portalContainer?: Element;
}

// Animation variants
const getAnimationVariants = (animation: TooltipAnimation, position: TooltipPosition) => {
  const isVertical = position.startsWith('top') || position.startsWith('bottom');
  const isTop = position.startsWith('top');
  const isLeft = position.startsWith('left');
  
  switch (animation) {
    case 'fade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
    
    case 'scale':
      return {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
      };
    
    case 'slide':
      return {
        initial: {
          opacity: 0,
          x: isVertical ? 0 : (isLeft ? -10 : 10),
          y: isVertical ? (isTop ? -10 : 10) : 0,
        },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: {
          opacity: 0,
          x: isVertical ? 0 : (isLeft ? -10 : 10),
          y: isVertical ? (isTop ? -10 : 10) : 0,
        },
      };
    
    case 'bounce':
      return {
        initial: { opacity: 0, scale: 0.3 },
        animate: {
          opacity: 1,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 10,
          },
        },
        exit: { opacity: 0, scale: 0.3 },
      };
    
    case 'flip':
      return {
        initial: {
          opacity: 0,
          rotateX: isVertical ? (isTop ? -90 : 90) : 0,
          rotateY: isVertical ? 0 : (isLeft ? -90 : 90),
        },
        animate: { opacity: 1, rotateX: 0, rotateY: 0 },
        exit: {
          opacity: 0,
          rotateX: isVertical ? (isTop ? -90 : 90) : 0,
          rotateY: isVertical ? 0 : (isLeft ? -90 : 90),
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
  tooltipRect: DOMRect,
  position: TooltipPosition,
  offset: number,
  followCursor?: boolean,
  mousePosition?: { x: number; y: number }
) => {
  if (followCursor && mousePosition) {
    return {
      x: mousePosition.x + offset,
      y: mousePosition.y - tooltipRect.height - offset,
    };
  }

  const { top, left, width, height } = triggerRect;
  const { width: tooltipWidth, height: tooltipHeight } = tooltipRect;
  
  let x = 0;
  let y = 0;
  
  // Calculate base position
  switch (position) {
    case 'top':
    case 'top-start':
    case 'top-end':
      y = top - tooltipHeight - offset;
      break;
    case 'bottom':
    case 'bottom-start':
    case 'bottom-end':
      y = top + height + offset;
      break;
    case 'left':
    case 'left-start':
    case 'left-end':
      x = left - tooltipWidth - offset;
      break;
    case 'right':
    case 'right-start':
    case 'right-end':
      x = left + width + offset;
      break;
  }
  
  // Calculate alignment
  switch (position) {
    case 'top':
    case 'bottom':
      x = left + width / 2 - tooltipWidth / 2;
      break;
    case 'top-start':
    case 'bottom-start':
      x = left;
      break;
    case 'top-end':
    case 'bottom-end':
      x = left + width - tooltipWidth;
      break;
    case 'left':
    case 'right':
      y = top + height / 2 - tooltipHeight / 2;
      break;
    case 'left-start':
    case 'right-start':
      y = top;
      break;
    case 'left-end':
    case 'right-end':
      y = top + height - tooltipHeight;
      break;
  }
  
  return { x, y };
};

// Calculate arrow position
const calculateArrowPosition = (position: TooltipPosition) => {
  const arrowSize = 8; // 2 * 4px (w-2 h-2)
  
  switch (position) {
    case 'top':
      return {
        bottom: -arrowSize / 2,
        left: '50%',
        transform: 'translateX(-50%)',
      };
    case 'top-start':
      return {
        bottom: -arrowSize / 2,
        left: arrowSize,
      };
    case 'top-end':
      return {
        bottom: -arrowSize / 2,
        right: arrowSize,
      };
    case 'bottom':
      return {
        top: -arrowSize / 2,
        left: '50%',
        transform: 'translateX(-50%)',
      };
    case 'bottom-start':
      return {
        top: -arrowSize / 2,
        left: arrowSize,
      };
    case 'bottom-end':
      return {
        top: -arrowSize / 2,
        right: arrowSize,
      };
    case 'left':
      return {
        right: -arrowSize / 2,
        top: '50%',
        transform: 'translateY(-50%)',
      };
    case 'left-start':
      return {
        right: -arrowSize / 2,
        top: arrowSize,
      };
    case 'left-end':
      return {
        right: -arrowSize / 2,
        bottom: arrowSize,
      };
    case 'right':
      return {
        left: -arrowSize / 2,
        top: '50%',
        transform: 'translateY(-50%)',
      };
    case 'right-start':
      return {
        left: -arrowSize / 2,
        top: arrowSize,
      };
    case 'right-end':
      return {
        left: -arrowSize / 2,
        bottom: arrowSize,
      };
    default:
      return {};
  }
};

const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  children,
  content,
  position = 'top',
  animation = 'fade',
  showArrow = true,
  disabled = false,
  delayShow = 200,
  delayHide = 0,
  offset = 8,
  interactive = false,
  followCursor = false,
  maxWidth = 320,
  variant,
  size,
  className,
  contentClassName,
  arrowClassName,
  onShow,
  onHide,
  portal = true,
  portalContainer,
}) => {
  // State
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Refs
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Update position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    const newPosition = calculatePosition(
      triggerRect,
      tooltipRect,
      position,
      offset,
      followCursor,
      mousePosition
    );
    
    // Viewport bounds checking
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    
    // Adjust for viewport bounds
    if (newPosition.x < 0) {
      newPosition.x = 8;
    } else if (newPosition.x + tooltipRect.width > viewport.width) {
      newPosition.x = viewport.width - tooltipRect.width - 8;
    }
    
    if (newPosition.y < 0) {
      newPosition.y = 8;
    } else if (newPosition.y + tooltipRect.height > viewport.height) {
      newPosition.y = viewport.height - tooltipRect.height - 8;
    }
    
    setTooltipPosition(newPosition);
  }, [position, offset, followCursor, mousePosition]);
  
  // Show tooltip
  const showTooltip = useCallback(() => {
    if (disabled) return;
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }
    
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      onShow?.();
    }, delayShow);
  }, [disabled, delayShow, onShow]);
  
  // Hide tooltip
  const hideTooltip = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = undefined;
    }
    
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      onHide?.();
    }, delayHide);
  }, [delayHide, onHide]);
  
  // Mouse move handler for cursor following
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (followCursor) {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  }, [followCursor]);
  
  // Update position when visible
  useEffect(() => {
    if (isVisible) {
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
  }, [isVisible, updatePosition]);
  
  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);
  
  // Animation variants
  const animationVariants = getAnimationVariants(animation, position);
  
  // Arrow position
  const arrowPosition = calculateArrowPosition(position);
  
  // Tooltip content
  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          className={cn(
            enhancedTooltipVariants({ variant, size }),
            contentClassName
          )}
          style={{
            position: 'fixed',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            maxWidth,
            zIndex: 9999,
          }}
          initial={animationVariants.initial}
          animate={animationVariants.animate}
          exit={animationVariants.exit}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          onMouseEnter={interactive ? showTooltip : undefined}
          onMouseLeave={interactive ? hideTooltip : undefined}
        >
          {content}
          
          {/* Arrow */}
          {showArrow && (
            <div
              className={cn(
                arrowVariants({ variant }),
                arrowClassName
              )}
              style={arrowPosition}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
  
  return (
    <>
      {/* Trigger */}
      <div
        ref={triggerRef}
        className={cn('inline-block', className)}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onMouseMove={handleMouseMove}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      
      {/* Tooltip */}
      {portal ? (
        typeof window !== 'undefined' &&
        createPortal(
          tooltipContent,
          portalContainer || document.body
        )
      ) : (
        tooltipContent
      )}
    </>
  );
};

EnhancedTooltip.displayName = 'EnhancedTooltip';

export { EnhancedTooltip, enhancedTooltipVariants };
export type { EnhancedTooltipProps };