import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const AnimatedCard = ({ 
  children, 
  className = "", 
  hoverEffect = true,
  delay = 0
}) => {
  const { ref, inView } = useScrollAnimation(0.1);
  
  // Card animation
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        delay
      }
    },
    hover: hoverEffect ? { 
      y: -10, 
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
    } : {}
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={hoverEffect ? "hover" : undefined}
      variants={cardVariants}
      className={className}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;