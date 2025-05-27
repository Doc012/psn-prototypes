import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiOutlineArrowRight } from 'react-icons/hi';

const AboutPage = () => {
  // Set up intersection observers for scroll animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [storyRef, storyInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [teamRef, teamInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const imageScaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.7 }
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6 }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6 }
    }
  };

  const slideInBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  return (
    <div className="bg-white">
      {/* Hero section with animation */}
      <motion.div 
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="relative bg-gray-900"
      >
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://t3.ftcdn.net/jpg/03/57/71/46/360_F_357714636_pm6xQeM0fVbXV4KrMMAZqgyfYrarCsPs.jpg"
            alt="Law firm office"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-[#800000] mix-blend-multiply" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <motion.h1 
            variants={fadeInLeft}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            About PSN Attorneys
          </motion.h1>
          <motion.p 
            variants={fadeInRight}
            className="mt-6 max-w-3xl text-xl text-gray-100"
          >
            A premier legal firm dedicated to providing exceptional service and legal representation to our clients.
          </motion.p>
        </div>
      </motion.div>

      {/* Firm overview with staggered animations */}
      <motion.div 
        ref={storyRef}
        initial="hidden"
        animate={storyInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="py-16 bg-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemFadeIn} className="lg:text-center">
            <h2 className="text-base text-[#800000] font-semibold tracking-wide uppercase">Our Story</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Commitment to Excellence in Legal Services
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Founded in 2005, PSN Attorneys has grown to become one of South Africa's most respected legal firms, with a commitment to client service and legal excellence.
            </p>
          </motion.div>

          <div className="mt-16">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <motion.div 
                variants={imageScaleIn} 
                className="relative"
              >
                <img
                  className="w-full rounded-lg shadow-lg"
                  src="https://images.unsplash.com/photo-1593115057322-e94b77572f20?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Law firm team meeting"
                />
                <div className="absolute inset-0 bg-[#800000] rounded-lg mix-blend-multiply opacity-10"></div>
              </motion.div>
              <motion.div variants={fadeInRight} className="mt-10 lg:mt-0">
                <h3 className="text-2xl font-extrabold text-gray-900">
                  Our Mission
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  To provide accessible, efficient, and effective legal services. We strive to understand our clients' needs and deliver tailored solutions while maintaining the highest ethical standards.
                </p>
                
                <h3 className="mt-8 text-2xl font-extrabold text-gray-900">
                  Our Vision
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  To be the most trusted legal partner for our clients, combining legal expertise with innovation to address modern legal challenges.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Values section with card animations */}
      <motion.div 
        ref={valuesRef}
        initial="hidden"
        animate={valuesInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="bg-gray-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemFadeIn} className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Our Core Values
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
              These principles guide our practice and ensure we deliver the highest quality service.
            </p>
          </motion.div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Integrity",
                  description: "We adhere to the highest ethical standards in all our dealings. Our reputation is built on trust and honesty."
                },
                {
                  title: "Excellence",
                  description: "We strive for excellence in every aspect of our work, from client communication to legal representation."
                },
                {
                  title: "Client Focus",
                  description: "We put our clients first, taking the time to understand their unique needs and concerns."
                },
                {
                  title: "Innovation",
                  description: "We embrace technology and new approaches to deliver more efficient and effective legal services."
                },
                {
                  title: "Accessibility",
                  description: "We believe that quality legal services should be accessible to all who need them."
                },
                {
                  title: "Community",
                  description: "We are committed to making a positive impact in the communities we serve through pro bono work and community involvement."
                }
              ].map((value, index) => (
                <motion.div 
                  key={index} 
                  variants={itemFadeIn}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-white overflow-hidden shadow rounded-lg transform transition-all duration-300 hover:shadow-xl"
                >
                  <div className="px-6 py-8">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="flex items-center justify-center h-12 w-12 rounded-md bg-[#800000] text-white"
                        >
                          {index + 1}
                        </motion.div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{value.title}</h3>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-base text-gray-500">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Team section with animated profiles */}
      <motion.div 
        ref={teamRef}
        initial="hidden"
        animate={teamInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="bg-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemFadeIn} className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Our Leadership Team
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
              Meet the experienced professionals who lead our firm.
            </p>
          </motion.div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
              {
              [
                {
                  name: "Patricia Smith",
                  role: "Managing Partner",
                  bio: "With over 20 years of experience in corporate law, Patricia leads our firm with vision and strategic direction.",
                  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                },
                {
                  name: "Samuel Ndlovu",
                  role: "Senior Partner",
                  bio: "Samuel specializes in commercial litigation and has successfully represented clients in complex legal matters for over 15 years.",
                  image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                },
                {
                  name: "Natalie Pretorius",
                  role: "Head of Family Law",
                  bio: "Natalie brings compassion and expertise to our family law practice, helping clients navigate difficult personal situations.",
                  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                }
              ].map((member, index) => (
                <motion.div 
                  key={index} 
                  variants={itemFadeIn}
                  className="text-center"
                >
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="overflow-hidden rounded-full mx-auto h-40 w-40 xl:w-56 xl:h-56"
                    >
                      <img 
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" 
                        src={member.image} 
                        alt={member.name} 
                      />
                    </motion.div>
                    <div className="space-y-2">
                      <div className="text-lg leading-6 font-medium space-y-1">
                        <h3 className="text-gray-900">{member.name}</h3>
                        <p className="text-[#800000]">{member.role}</p>
                      </div>
                      <div className="text-gray-500">
                        <p className="text-sm">{member.bio}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA section with gradient animation */}
      <motion.div 
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={slideInBottom}
        className="bg-[#800000] relative overflow-hidden"
      >
        <motion.div 
          animate={{ 
            opacity: [0.5, 0.3, 0.5], 
            x: [0, 10, 0],
            y: [0, 5, 0]
          }}
          transition={{ 
            duration: 8, 
            ease: "easeInOut",
            repeat: Infinity
          }}
          className="absolute inset-0 bg-gradient-to-r from-[#800000] to-[#600000] opacity-50"
        />
        
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between relative z-10">
          <motion.div variants={fadeInLeft}>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-gray-200">Contact us today for a consultation.</span>
            </h2>
          </motion.div>
          <motion.div 
            variants={fadeInRight}
            className="mt-8 flex lg:mt-0 lg:flex-shrink-0"
          >
            <div className="inline-flex rounded-md shadow">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/client-portal/contact"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#800000] bg-white hover:bg-gray-50 transition-all duration-300"
                >
                  Contact Us
                  <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;