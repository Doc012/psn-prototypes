// Animation configuration for the application

// Timing
export const durations = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.7,
  verySlow: 1.2
};

// Easing
export const easing = {
  default: [0.6, 0.01, -0.05, 0.95], // Custom cubic-bezier
  smooth: "easeInOut",
  springy: [0.43, 0.13, 0.23, 0.96], // Bouncy cubic-bezier
  gentle: "easeOut"
};

// Animation variants
export const variants = {
  // Page transitions
  pageEntry: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: durations.normal, ease: easing.gentle }},
    exit: { opacity: 0, y: -20, transition: { duration: durations.fast }}
  },
  
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: durations.normal }},
    exit: { opacity: 0, transition: { duration: durations.fast }}
  },
  
  // Slide animations
  slideFromRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: durations.normal, ease: easing.smooth }},
    exit: { x: 100, opacity: 0, transition: { duration: durations.fast }}
  },
  
  slideFromLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: durations.normal, ease: easing.smooth }},
    exit: { x: -100, opacity: 0, transition: { duration: durations.fast }}
  },
  
  // Scale animations
  scaleUp: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: durations.normal, ease: easing.springy }},
    exit: { scale: 0.8, opacity: 0, transition: { duration: durations.fast }}
  },
  
  // Stagger container for child elements
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  
  // For staggered children
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: durations.normal, ease: easing.smooth }},
    exit: { opacity: 0, y: 20, transition: { duration: durations.fast }}
  }
};

// Common animation props
export const animationProps = {
  fadeIn: {
    initial: "initial",
    animate: "animate",
    exit: "exit",
    variants: variants.fadeIn
  },
  
  slideFromRight: {
    initial: "initial",
    animate: "animate",
    exit: "exit",
    variants: variants.slideFromRight
  }
  
  // Add more as needed
};