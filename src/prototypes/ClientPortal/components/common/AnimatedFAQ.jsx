import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown, HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const AnimatedFAQ = ({ faqs }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const { ref, inView, animations } = useScrollAnimation(0.1);
  
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={animations.staggerContainer}
      className="space-y-6"
    >
      {faqs.map((faq, index) => (
        <motion.div 
          key={index}
          variants={animations.fadeInUp}
          className={`bg-white shadow-md overflow-hidden rounded-lg transition-all duration-300 ${
            openFaqIndex === index ? 'ring-2 ring-[#800000]' : 'hover:shadow-lg'
          }`}
        >
          <motion.button
            className="w-full px-6 py-5 flex justify-between items-center focus:outline-none"
            onClick={() => toggleFaq(index)}
            aria-expanded={openFaqIndex === index}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="text-lg leading-6 font-medium text-gray-900 text-left">
              {faq.question}
            </h3>
            <motion.div 
              animate={{ 
                rotate: openFaqIndex === index ? 180 : 0,
                backgroundColor: openFaqIndex === index ? '#800000' : 'transparent',
                borderColor: openFaqIndex === index ? '#800000' : '#d1d5db'
              }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 ml-2 h-8 w-8 rounded-full flex items-center justify-center border-2"
            >
              <HiChevronDown 
                className={`h-5 w-5 ${
                  openFaqIndex === index ? 'text-white' : 'text-gray-500'
                }`} 
              />
            </motion.div>
          </motion.button>
          <AnimatePresence>
            {openFaqIndex === index && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-base text-gray-600">
                      {faq.answer}
                    </p>
                    <div className="mt-4 flex">
                      <motion.div 
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Link 
                          to="/contact" 
                          className="text-sm font-medium text-[#800000] hover:text-[#600000] flex items-center"
                        >
                          Need more help with this?
                          <HiArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnimatedFAQ;