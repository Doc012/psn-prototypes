import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const AnimatedSection = ({ 
  children, 
  className = "", 
  animation = "fadeInUp",
  threshold = 0.1,
  containerVariants,
  delay = 0
}) => {
  const { ref, inView, animations } = useScrollAnimation(threshold);
  
  // Select the animation variant based on the prop
  const selectedAnimation = animations[animation] || animations.fadeInUp;
  
  // Apply delay if specified
  if (delay > 0 && selectedAnimation.visible && selectedAnimation.visible.transition) {
    selectedAnimation.visible.transition.delay = delay;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants || selectedAnimation}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// For items inside staggered containers
export const AnimatedItem = ({ children, className = "", animation = "fadeInUp", delay = 0 }) => {
  const { animations } = useScrollAnimation();
  
  // Select the animation variant based on the prop
  const selectedAnimation = animations[animation] || animations.fadeInUp;
  
  // Apply delay if specified
  if (delay > 0 && selectedAnimation.visible && selectedAnimation.visible.transition) {
    selectedAnimation.visible.transition.delay = delay;
  }

  return (
    <motion.div
      variants={selectedAnimation}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;