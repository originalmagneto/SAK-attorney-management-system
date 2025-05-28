/**
 * Enhanced Animation System
 * Provides consistent motion design language across the application
 */

import { Variants } from 'framer-motion';

// Animation Duration Constants
export const DURATION = {
  micro: 150,      // Micro-interactions (hover, focus)
  transition: 300, // Component transitions
  page: 500,       // Page transitions
  slow: 800,       // Complex animations
} as const;

// Easing Functions
export const EASING = {
  easeOut: [0.0, 0.0, 0.2, 1.0],
  easeIn: [0.4, 0.0, 1.0, 1.0],
  easeInOut: [0.4, 0.0, 0.2, 1.0],
  spring: { type: 'spring', damping: 25, stiffness: 300 },
  bouncy: { type: 'spring', damping: 10, stiffness: 100 },
} as const;

// Stagger Delays
export const STAGGER = {
  list: 0.05,      // List items
  card: 0.1,       // Card grids
  complex: 0.15,   // Complex layouts
} as const;

// Page Transition Variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.page / 1000,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: DURATION.transition / 1000,
      ease: EASING.easeIn,
    },
  },
};

// Card Animation Variants
export const cardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.transition / 1000,
      ease: EASING.easeOut,
    },
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: DURATION.micro / 1000,
      ease: EASING.easeOut,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: DURATION.micro / 1000,
      ease: EASING.easeOut,
    },
  },
};

// List Animation Variants
export const listVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.list,
      delayChildren: 0.1,
    },
  },
};

export const listItemVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION.transition / 1000,
      ease: EASING.easeOut,
    },
  },
};

// Modal/Dialog Variants
export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: DURATION.transition / 1000,
      ease: EASING.spring,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: DURATION.transition / 1000,
      ease: EASING.easeIn,
    },
  },
};

// Sidebar/Drawer Variants
export const sidebarVariants: Variants = {
  closed: {
    x: '-100%',
    transition: {
      duration: DURATION.transition / 1000,
      ease: EASING.easeIn,
    },
  },
  open: {
    x: 0,
    transition: {
      duration: DURATION.transition / 1000,
      ease: EASING.easeOut,
    },
  },
};

// Button Animation Variants
export const buttonVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: DURATION.micro / 1000,
      ease: EASING.easeOut,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: DURATION.micro / 1000,
      ease: EASING.easeOut,
    },
  },
};

// Loading Spinner Variants
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Skeleton Loading Variants
export const skeletonVariants: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Notification/Toast Variants
export const toastVariants: Variants = {
  initial: {
    opacity: 0,
    y: -50,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.transition / 1000,
      ease: EASING.spring,
    },
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.9,
    transition: {
      duration: DURATION.transition / 1000,
      ease: EASING.easeIn,
    },
  },
};

// Floating Action Button Variants
export const fabVariants: Variants = {
  initial: {
    scale: 0,
    rotate: -180,
  },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: DURATION.transition / 1000,
      ease: EASING.spring,
    },
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: DURATION.micro / 1000,
      ease: EASING.easeOut,
    },
  },
  tap: {
    scale: 0.9,
    transition: {
      duration: DURATION.micro / 1000,
      ease: EASING.easeOut,
    },
  },
};

// Progress Bar Variants
export const progressVariants: Variants = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  animate: (progress: number) => ({
    scaleX: progress / 100,
    transition: {
      duration: DURATION.transition / 1000,
      ease: EASING.easeOut,
    },
  }),
};

// Accordion Variants
export const accordionVariants: Variants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: DURATION.transition / 1000,
      ease: EASING.easeIn,
    },
  },
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: DURATION.transition / 1000,
      ease: EASING.easeOut,
    },
  },
};

// Utility Functions
export const createStaggerContainer = (staggerDelay: number = STAGGER.list) => ({
  animate: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

export const createFadeInUp = (delay: number = 0) => ({
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.transition / 1000,
      ease: EASING.easeOut,
      delay,
    },
  },
});

export const createSlideIn = (direction: 'left' | 'right' | 'up' | 'down' = 'left') => {
  const directions = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: -50 },
    down: { x: 0, y: 50 },
  };

  return {
    initial: {
      opacity: 0,
      ...directions[direction],
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: DURATION.transition / 1000,
        ease: EASING.easeOut,
      },
    },
  };
};

export const createScaleIn = (delay: number = 0) => ({
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.transition / 1000,
      ease: EASING.spring,
      delay,
    },
  },
});

// Gesture Variants for Mobile
export const swipeVariants: Variants = {
  initial: {
    x: 0,
  },
  swipeLeft: {
    x: -100,
    opacity: 0.5,
    transition: {
      duration: DURATION.micro / 1000,
      ease: EASING.easeOut,
    },
  },
  swipeRight: {
    x: 100,
    opacity: 0.5,
    transition: {
      duration: DURATION.micro / 1000,
      ease: EASING.easeOut,
    },
  },
};

// Export all variants as a collection
export const animations = {
  page: pageVariants,
  card: cardVariants,
  list: listVariants,
  listItem: listItemVariants,
  modal: modalVariants,
  sidebar: sidebarVariants,
  button: buttonVariants,
  spinner: spinnerVariants,
  skeleton: skeletonVariants,
  toast: toastVariants,
  fab: fabVariants,
  progress: progressVariants,
  accordion: accordionVariants,
  swipe: swipeVariants,
};