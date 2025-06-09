import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { HiOutlineMenuAlt3, HiX, HiOutlineHome } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import logoImage from '../../../../assets/PSN.png';

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll events for header styling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Animation variants
  const fadeInUp = {
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

  // Footer section refs using react-intersection-observer
  const [footerRef, footerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [quickLinksRef, quickLinksInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [portalLinksRef, portalLinksInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [contactRef, contactInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [bottomFooterRef, bottomFooterInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Helper function to determine if a nav link is active
  const isActive = (path) => {
    return location.pathname.endsWith(path);
  };
  
  // Function to ensure links have the correct client-portal prefix
  const getPath = (path) => {
    return `/client-portal/${path}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to={getPath('home')}>
                  <img
                    className="block h-12 w-auto"
                    src={logoImage}
                    alt="PSN Attorneys"
                  />
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {/* Desktop navigation */}
                <Link
                  to={getPath('home')}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-300 relative ${
                    isActive('home')
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Home
                  <span className={`absolute h-0.5 bg-[#800000] left-0 right-0 bottom-0 transition-transform duration-300 ${isActive('home') ? 'scale-x-100' : 'scale-x-0 hover:scale-x-75'}`} />
                </Link>
                <Link
                  to={getPath('about')}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-300 relative ${
                    isActive('about')
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  About
                  <span className={`absolute h-0.5 bg-[#800000] left-0 right-0 bottom-0 transition-transform duration-300 ${isActive('about') ? 'scale-x-100' : 'scale-x-0 hover:scale-x-75'}`} />
                </Link>
                <Link
                  to={getPath('services')}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-300 relative ${
                    isActive('services')
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Services
                  <span className={`absolute h-0.5 bg-[#800000] left-0 right-0 bottom-0 transition-transform duration-300 ${isActive('services') ? 'scale-x-100' : 'scale-x-0 hover:scale-x-75'}`} />
                </Link>
                <Link
                  to={getPath('contact')}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-300 relative ${
                    isActive('contact')
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Contact
                  <span className={`absolute h-0.5 bg-[#800000] left-0 right-0 bottom-0 transition-transform duration-300 ${isActive('contact') ? 'scale-x-100' : 'scale-x-0 hover:scale-x-75'}`} />
                </Link>
                <Link
                  to={getPath('faq')}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-300 relative ${
                    isActive('faq')
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  FAQ
                  <span className={`absolute h-0.5 bg-[#800000] left-0 right-0 bottom-0 transition-transform duration-300 ${isActive('faq') ? 'scale-x-100' : 'scale-x-0 hover:scale-x-75'}`} />
                </Link>
                
                {/* Add Return to Main App link */}
                <a
                  href="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-300 relative text-gray-500 hover:text-gray-700"
                >
                  <HiOutlineHome className="mr-1 h-4 w-4" />
                  Main App
                  <span className={`absolute h-0.5 bg-[#800000] left-0 right-0 bottom-0 transition-transform duration-300 scale-x-0 hover:scale-x-75`} />
                </a>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-3">
              <Link
                to={getPath('login')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#800000] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] transition-colors duration-300"
              >
                Sign In
              </Link>
              <Link
                to={getPath('register')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] transition-colors duration-300"
              >
                Register
              </Link>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#800000]"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <HiX className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <HiOutlineMenuAlt3 className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to={getPath('home')}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-300 ${
                isActive('home')
                  ? 'bg-[#800000]/10 border-[#800000] text-[#800000]'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to={getPath('about')}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-300 ${
                isActive('about')
                  ? 'bg-[#800000]/10 border-[#800000] text-[#800000]'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to={getPath('contact')}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-300 ${
                isActive('contact')
                  ? 'bg-[#800000]/10 border-[#800000] text-[#800000]'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to={getPath('faq')}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-300 ${
                isActive('faq')
                  ? 'bg-[#800000]/10 border-[#800000] text-[#800000]'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              to={getPath('services')}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-300 ${
                isActive('services')
                  ? 'bg-[#800000]/10 border-[#800000] text-[#800000]'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            
            {/* Add Return to Main App link for mobile */}
            <a
              href="/"
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-300 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <HiOutlineHome className="mr-2 h-5 w-5" />
                Return to Main App
              </div>
            </a>
            
            {/* Add a divider */}
            <div className="border-t border-gray-200 my-4"></div>
            
            {/* Add login and registration links */}
            <div className="pl-3 pr-4 py-2 flex space-x-3">
              <Link
                to={getPath('login')}
                className="flex-1 px-4 py-2 border border-transparent text-center text-sm font-medium rounded-md text-[#800000] bg-white hover:bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to={getPath('register')}
                className="flex-1 px-4 py-2 border border-transparent text-center text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content with page transition */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-grow"
      >
        <Outlet />
      </motion.main>

      {/* Enhanced Footer with scroll animations */}
      <footer className="bg-gray-900 text-white">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <motion.div 
            ref={footerRef}
            initial="hidden"
            animate={footerInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* Company info and logo */}
            <motion.div 
              variants={fadeInUp}
              className="space-y-4"
            >
              <motion.img 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={footerInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                src={logoImage} 
                alt="PSN Attorneys" 
                className="h-10 w-auto" 
              />
              <motion.p 
                variants={fadeInUp}
                className="text-gray-300 text-sm"
              >
                PSN Attorneys is committed to providing exceptional legal services with integrity,
                professionalism, and personalized attention to each client's needs.
              </motion.p>
              <motion.div 
                variants={staggerContainer}
                className="flex space-x-4"
              >
                {/* Social Media Icons */}
                <motion.a
                  variants={fadeInUp}
                  whileHover={{ scale: 1.2, y: -3 }}
                  href="#"
                  className="text-gray-400 hover:text-gray-400 cursor-default"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.a>
                <motion.a
                  variants={fadeInUp}
                  whileHover={{ scale: 1.2, y: -3 }}
                  href="#"
                  className="text-gray-400 hover:text-gray-400 cursor-default"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </motion.a>
                <motion.a
                  variants={fadeInUp}
                  whileHover={{ scale: 1.2, y: -3 }}
                  href="#"
                  className="text-gray-400 hover:text-gray-400 cursor-default"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              ref={quickLinksRef}
              initial="hidden"
              animate={quickLinksInView ? "visible" : "hidden"}
              variants={fadeInUp}
            >
              <motion.h3 variants={fadeInUp} className="text-lg font-medium text-white mb-4">
                Quick Links
              </motion.h3>
              <motion.ul variants={staggerContainer} className="space-y-2">
                <motion.li variants={fadeInUp}>
                  <Link
                    to={getPath('about')}
                    className="text-gray-300 hover:text-white transition-colors duration-300 inline-block"
                  >
                    About Us
                  </Link>
                </motion.li>
                <motion.li variants={fadeInUp}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-400 cursor-default inline-block"
                    onClick={(e) => e.preventDefault()}
                  >
                    Practice Areas
                  </a>
                </motion.li>
                <motion.li variants={fadeInUp}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-400 cursor-default inline-block"
                    onClick={(e) => e.preventDefault()}
                  >
                    Our Attorneys
                  </a>
                </motion.li>
                <motion.li variants={fadeInUp}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-400 cursor-default inline-block"
                    onClick={(e) => e.preventDefault()}
                  >
                    Legal Resources
                  </a>
                </motion.li>
                <motion.li variants={fadeInUp}>
                  <Link
                    to={getPath('contact')}
                    className="text-gray-300 hover:text-white transition-colors duration-300 inline-block"
                  >
                    Contact Us
                  </Link>
                </motion.li>
                <motion.li variants={fadeInUp}>
                  <a
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors duration-300 inline-flex items-center"
                  >
                    <HiOutlineHome className="mr-1.5 h-4 w-4" />
                    Return to Main App
                  </a>
                </motion.li>
              </motion.ul>
            </motion.div>

            {/* Portal Links - with inactive links */}
            <motion.div
              ref={portalLinksRef}
              initial="hidden"
              animate={portalLinksInView ? "visible" : "hidden"}
              variants={fadeInUp}
            >
              <motion.h3 variants={fadeInUp} className="text-lg font-medium text-white mb-4">
                Client Portal
              </motion.h3>
              <motion.ul variants={staggerContainer} className="space-y-2">
                <motion.li variants={fadeInUp}>
                  <Link
                    to={getPath('login')}
                    className="text-gray-300 hover:text-white transition-colors duration-300 inline-block"
                  >
                    Login
                  </Link>
                </motion.li>
                <motion.li variants={fadeInUp}>
                  <Link
                    to={getPath('register')}
                    className="text-gray-300 hover:text-white transition-colors duration-300 inline-block"
                  >
                    Register
                  </Link>
                </motion.li>
                <motion.li variants={fadeInUp}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-400 cursor-default inline-block"
                    onClick={(e) => e.preventDefault()}
                  >
                    Reset Password
                  </a>
                </motion.li>
                <motion.li variants={fadeInUp}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-400 cursor-default inline-block"
                    onClick={(e) => e.preventDefault()}
                  >
                    Portal Guide
                  </a>
                </motion.li>
                <motion.li variants={fadeInUp}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-400 cursor-default inline-block"
                    onClick={(e) => e.preventDefault()}
                  >
                    Security Information
                  </a>
                </motion.li>
              </motion.ul>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              ref={contactRef}
              initial="hidden"
              animate={contactInView ? "visible" : "hidden"}
              variants={fadeInUp}
            >
              <motion.h3 variants={fadeInUp} className="text-lg font-medium text-white mb-4">
                Contact Us
              </motion.h3>
              <motion.address variants={staggerContainer} className="not-italic text-gray-300">
                <motion.p variants={fadeInUp} className="flex items-start mb-2">
                  <svg
                    className="h-5 w-5 mr-2 text-gray-400 mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>
                    PSN Incorporated, cnr Louis Trichardt Boulevard,<br />
                    President Hoffman St, &, Vanderbijlpark
                  </span>
                </motion.p>
                <motion.p variants={fadeInUp} className="flex items-center mb-2">
                  <svg
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  (555) 123-4567
                </motion.p>
                <motion.p variants={fadeInUp} className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  info@psnattorneys.com
                </motion.p>
                <motion.p variants={fadeInUp} className="mt-4 flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Mon-Fri: 9AM-5PM
                </motion.p>
              </motion.address>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom footer with copyright and terms */}
        <motion.div 
          ref={bottomFooterRef}
          initial="hidden"
          animate={bottomFooterInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="bg-gray-950 py-6"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <motion.div variants={fadeInUp} className="mb-4 md:mb-0 text-sm text-gray-400">
              &copy; {new Date().getFullYear()} PSN Attorneys. All rights reserved.
            </motion.div>
            <motion.div variants={staggerContainer} className="flex flex-wrap justify-center space-x-4 space-y-0 text-sm text-gray-400">
              <motion.div variants={fadeInUp} whileHover={{ y: -2 }}>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-400 cursor-default"
                  onClick={(e) => e.preventDefault()}
                >
                  Terms of Service
                </a>
              </motion.div>
              <motion.div variants={fadeInUp} whileHover={{ y: -2 }}>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-400 cursor-default"
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy Policy
                </a>
              </motion.div>
              <motion.div variants={fadeInUp} whileHover={{ y: -2 }}>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-400 cursor-default"
                  onClick={(e) => e.preventDefault()}
                >
                  Legal Disclaimer
                </a>
              </motion.div>
              <motion.div variants={fadeInUp} whileHover={{ y: -2 }}>
                <a
                  href="/"
                  className="hover:text-white transition-colors duration-300 inline-flex items-center"
                >
                  <HiOutlineHome className="mr-1 h-4 w-4" />
                  Main App
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

export default PublicLayout;