/**
 * Enhanced Card Component
 * Modern, animated card with multiple variants and interactive states
 */

'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { cardVariants, hoverVariants } from '@/lib/animations';

// Enhanced card variants
const enhancedCardVariants = cva(
  [
    // Base styles
    'rounded-xl border transition-all duration-300',
    'relative overflow-hidden',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-white border-gray-200 shadow-sm',
          'hover:shadow-md hover:border-gray-300',
          'dark:bg-gray-900 dark:border-gray-800',
          'dark:hover:border-gray-700',
        ],
        elevated: [
          'bg-white border-gray-200 shadow-lg',
          'hover:shadow-xl hover:-translate-y-1',
          'dark:bg-gray-900 dark:border-gray-800',
        ],
        glass: [
          'bg-white/10 backdrop-blur-md border-white/20',
          'shadow-lg hover:shadow-xl',
          'hover:bg-white/20',
          'dark:bg-black/10 dark:border-white/10',
          'dark:hover:bg-black/20',
        ],
        gradient: [
          'bg-gradient-to-br from-white via-gray-50 to-gray-100',
          'border-gray-200 shadow-md',
          'hover:shadow-lg hover:from-gray-50 hover:to-gray-200',
          'dark:from-gray-900 dark:via-gray-800 dark:to-gray-700',
          'dark:border-gray-700',
        ],
        modern: [
          'bg-white border-l-4 border-l-blue-500 border-r-0 border-t-0 border-b-0',
          'shadow-sm hover:shadow-md',
          'hover:border-l-blue-600',
          'dark:bg-gray-900 dark:border-l-blue-400',
        ],
        neon: [
          'bg-black border-2 border-cyan-400',
          'shadow-[0_0_10px_rgba(34,211,238,0.3)]',
          'hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]',
          'hover:border-cyan-300',
        ],
        outlined: [
          'bg-transparent border-2 border-gray-300',
          'hover:border-gray-400 hover:bg-gray-50',
          'dark:border-gray-600 dark:hover:border-gray-500',
          'dark:hover:bg-gray-800',
        ],
        success: [
          'bg-green-50 border-green-200',
          'hover:bg-green-100 hover:border-green-300',
          'dark:bg-green-900/20 dark:border-green-800',
          'dark:hover:bg-green-900/30',
        ],
        warning: [
          'bg-yellow-50 border-yellow-200',
          'hover:bg-yellow-100 hover:border-yellow-300',
          'dark:bg-yellow-900/20 dark:border-yellow-800',
          'dark:hover:bg-yellow-900/30',
        ],
        error: [
          'bg-red-50 border-red-200',
          'hover:bg-red-100 hover:border-red-300',
          'dark:bg-red-900/20 dark:border-red-800',
          'dark:hover:bg-red-900/30',
        ],
      },
      size: {
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
      interactive: {
        true: 'cursor-pointer select-none',
        false: '',
      },
      loading: {
        true: 'animate-pulse',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
      loading: false,
    },
  }
);

// Card header variants
const cardHeaderVariants = cva(
  'flex flex-col space-y-1.5',
  {
    variants: {
      size: {
        sm: 'pb-2',
        default: 'pb-3',
        lg: 'pb-4',
        xl: 'pb-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// Card content variants
const cardContentVariants = cva(
  '',
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

// Card footer variants
const cardFooterVariants = cva(
  'flex items-center',
  {
    variants: {
      size: {
        sm: 'pt-2',
        default: 'pt-3',
        lg: 'pt-4',
        xl: 'pt-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// Loading skeleton component
const LoadingSkeleton = ({ lines = 3 }: { lines?: number }) => {
  return (
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-gray-200 rounded animate-pulse dark:bg-gray-700"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
};

// Shimmer effect component
const ShimmerEffect = () => {
  return (
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      initial={{ x: '-100%' }}
      animate={{ x: '100%' }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export interface EnhancedCardProps
  extends Omit<HTMLMotionProps<'div'>, 'size'>,
    VariantProps<typeof enhancedCardVariants> {
  loading?: boolean;
  shimmer?: boolean;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  imagePosition?: 'top' | 'left' | 'right' | 'background';
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  (
    {
      className,
      variant,
      size,
      interactive,
      loading,
      shimmer = false,
      badge,
      actions,
      image,
      imageAlt,
      imagePosition = 'top',
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const cardContent = (
      <>
        {/* Shimmer effect */}
        {shimmer && !loading && <ShimmerEffect />}
        
        {/* Badge */}
        {badge && (
          <motion.div
            className="absolute top-3 right-3 z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
          >
            {badge}
          </motion.div>
        )}
        
        {/* Background image */}
        {image && imagePosition === 'background' && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url(${image})` }}
          />
        )}
        
        {/* Image */}
        {image && imagePosition !== 'background' && (
          <motion.div
            className={cn(
              'overflow-hidden',
              imagePosition === 'top' && 'rounded-t-xl -m-4 mb-4',
              imagePosition === 'left' && 'w-1/3 rounded-l-xl -m-4 mr-4',
              imagePosition === 'right' && 'w-1/3 rounded-r-xl -m-4 ml-4'
            )}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={image}
              alt={imageAlt || ''}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
        
        {/* Content */}
        <div className={cn(
          'relative z-10',
          imagePosition === 'left' && 'flex-1',
          imagePosition === 'right' && 'flex-1'
        )}>
          {loading ? <LoadingSkeleton /> : children}
        </div>
        
        {/* Actions */}
        {actions && (
          <motion.div
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            {actions}
          </motion.div>
        )}
      </>
    );

    return (
      <motion.div
        ref={ref}
        className={cn(
          enhancedCardVariants({ variant, size, interactive, loading }),
          'group',
          imagePosition === 'left' && 'flex items-center',
          imagePosition === 'right' && 'flex items-center flex-row-reverse',
          className
        )}
        onClick={interactive ? onClick : undefined}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover={interactive ? "hover" : undefined}
        whileTap={interactive ? "tap" : undefined}
        layout
        {...props}
      >
        {cardContent}
      </motion.div>
    );
  }
);

EnhancedCard.displayName = 'EnhancedCard';

// Card Header Component
export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, size, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(cardHeaderVariants({ size }), className)}
      variants={{
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
      }}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.1 }}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

// Card Title Component
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100',
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

// Card Description Component
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-600 dark:text-gray-400', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

// Card Content Component
export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, size, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(cardContentVariants({ size }), className)}
      variants={{
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
      }}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.2 }}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

// Card Footer Component
export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, size, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(cardFooterVariants({ size }), className)}
      variants={{
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
      }}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.3 }}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export {
  EnhancedCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  enhancedCardVariants,
};

export type {
  EnhancedCardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
};