// filepath: c:\Users\Public\Projects\psn_prototypes\src\prototypes\ClientPortal\pages\public\ContactPage.jsx
import React, { useState, useEffect } from 'react';
import { HiPhone, HiMail, HiLocationMarker, HiCheck, HiOutlineOfficeBuilding, HiOutlineClock, HiOutlineGlobe } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    caseType: 'general-inquiry'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Intersection observers for scroll animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [contactInfoRef, contactInfoInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formRef, formInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [mapRef, mapInView] = useInView({ triggerOnce: true, threshold: 0.1 });

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
        staggerChildren: 0.2
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

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formState.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formState.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!formState.subject.trim()) {
      errors.subject = "Subject is required";
    }
    
    if (!formState.message.trim()) {
      errors.message = "Message is required";
    } else if (formState.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', formState);
      
      // Success
      setFormSubmitted(true);
      setFormState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        caseType: 'general-inquiry'
      });
    } catch (error) {
      console.error('Form submission error:', error);
      // You could set a general error state here
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Business hours data for the interactive schedule display
  const businessHours = [
    { day: 'Monday', hours: '8:00 AM - 6:00 PM' },
    { day: 'Tuesday', hours: '8:00 AM - 6:00 PM' },
    { day: 'Wednesday', hours: '8:00 AM - 6:00 PM' },
    { day: 'Thursday', hours: '8:00 AM - 6:00 PM' },
    { day: 'Friday', hours: '8:00 AM - 5:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 1:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
  ];
  
  // Get current day to highlight
  const today = new Date().getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[today];
  
  // Case types for the form dropdown
  const caseTypes = [
    { value: 'general-inquiry', label: 'General Inquiry' },
    { value: 'personal-injury', label: 'Personal Injury' },
    { value: 'family-law', label: 'Family Law' },
    { value: 'criminal-defense', label: 'Criminal Defense' },
    { value: 'estate-planning', label: 'Estate Planning' },
    { value: 'business-law', label: 'Business Law' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero section with enhanced animation */}
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
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Office building"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 bg-gradient-to-r from-[#800000] to-[#4b0000] mix-blend-multiply"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Contact Us
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 max-w-3xl text-xl text-gray-100"
          >
            We're here to help. Let's discuss how our legal team can assist with your case.
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-8"
          >
            <a
              href="#contact-form"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-[#800000] bg-white hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced contact information with interactive elements */}
      <motion.div 
        ref={contactInfoRef}
        initial="hidden"
        animate={contactInfoInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="bg-white py-12 lg:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemFadeIn} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How Can We Help You?
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Connect with our team through any of these channels or use our contact form below.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Contact Card - Phone */}
            <motion.div 
              variants={itemFadeIn}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="relative bg-white rounded-2xl border border-gray-200 p-8 shadow-sm transition-all duration-300"
            >
              <div className="absolute top-0 inline-block -translate-y-1/2 transform rounded-xl bg-[#800000] p-3 shadow-lg">
                <HiPhone className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Phone</h3>
              <address className="mt-4 not-italic text-gray-500">
                <p className="text-lg font-semibold text-[#800000]">+27 (11) 123 4567</p>
                <div className="mt-2 space-y-1 text-sm">
                  <motion.div 
                    whileHover={{ x: 3 }}
                    className="flex items-center"
                  >
                    <HiOutlineOfficeBuilding className="mr-2 h-4 w-4 text-gray-400" />
                    <span>Main Office</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ x: 3 }}
                    className="flex items-center"
                  >
                    <HiOutlineClock className="mr-2 h-4 w-4 text-gray-400" />
                    <span>8:00AM to 6:00PM (Mon-Fri)</span>
                  </motion.div>
                </div>
              </address>
              
              {/* Interactive business hours dropdown */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="text-sm text-[#800000] hover:text-[#600000] font-medium flex items-center focus:outline-none"
                  onClick={() => document.getElementById('business-hours-modal').classList.toggle('hidden')}
                >
                  <HiOutlineClock className="mr-2 h-4 w-4" />
                  View Business Hours
                </motion.button>
                
                <div id="business-hours-modal" className="hidden mt-2 bg-gray-50 rounded-lg p-4 text-sm">
                  <h4 className="font-medium text-gray-900 mb-2">Our Business Hours</h4>
                  <div className="space-y-1">
                    {businessHours.map((item) => (
                      <div 
                        key={item.day} 
                        className={`flex justify-between ${item.day === currentDay ? 'text-[#800000] font-medium' : ''}`}
                      >
                        <span>{item.day}</span>
                        <span>{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Card - Email */}
            <motion.div 
              variants={itemFadeIn}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="relative bg-white rounded-2xl border border-gray-200 p-8 shadow-sm transition-all duration-300"
            >
              <div className="absolute top-0 inline-block -translate-y-1/2 transform rounded-xl bg-[#800000] p-3 shadow-lg">
                <HiMail className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Email</h3>
              <div className="mt-4 text-gray-500">
                <motion.a 
                  href="mailto:info@psnattorneys.co.za"
                  className="text-lg font-semibold text-[#800000] hover:underline"
                  whileHover={{ x: 3 }}
                >
                  info@psnattorneys.co.za
                </motion.a>
                <p className="mt-2 text-sm">We aim to respond within 24 hours</p>
                
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-medium">Legal Inquiries</p>
                    <motion.a 
                      href="mailto:legal@psn.co.za"
                      className="text-sm font-medium text-[#800000] hover:underline mt-1 block"
                      whileHover={{ x: 3 }}
                    >
                      legal@psn.co.za
                    </motion.a>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-medium">Support</p>
                    <motion.a 
                      href="mailto:support@psn.co.za"
                      className="text-sm font-medium text-[#800000] hover:underline mt-1 block"
                      whileHover={{ x: 3 }}
                    >
                      support@psn.co.za
                    </motion.a>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 pt-5 border-t border-gray-100">
                <motion.a 
                  href="https://calendly.com/psnattorneys/consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#800000] hover:text-[#600000] font-medium flex items-center"
                  whileHover={{ x: 3 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule a Consultation
                </motion.a>
              </div>
            </motion.div>
            
            {/* Contact Card - Office */}
            <motion.div 
              variants={itemFadeIn}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="relative bg-white rounded-2xl border border-gray-200 p-8 shadow-sm transition-all duration-300"
            >
              <div className="absolute top-0 inline-block -translate-y-1/2 transform rounded-xl bg-[#800000] p-3 shadow-lg">
                <HiLocationMarker className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Office</h3>
              <address className="mt-4 not-italic text-gray-500">
                <p className="text-lg font-semibold">Sandton Office</p>
                <div className="mt-2 space-y-1 text-sm">
                  <motion.p whileHover={{ x: 3 }} className="flex items-center">
                    <HiOutlineOfficeBuilding className="mr-2 h-4 w-4 text-gray-400" />
                    <span>123 Main Street</span>
                  </motion.p>
                  <p>Sandton, Johannesburg</p>
                  <p>2196, South Africa</p>
                </div>
              </address>
              
              <div className="mt-5 pt-5 border-t border-gray-100">
                <motion.a 
                  href="https://maps.google.com/?q=Sandton,Johannesburg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#800000] hover:text-[#600000] font-medium flex items-center"
                  whileHover={{ x: 3 }}
                >
                  <HiOutlineGlobe className="mr-2 h-4 w-4" />
                  Get Directions
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced contact form with animations and better UX - FIXED OVERFLOW */}
      <motion.div 
        id="contact-form"
        ref={formRef}
        initial="hidden"
        animate={formInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="bg-gray-50 py-16 lg:py-24 overflow-hidden" // Added overflow-hidden
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Decorative elements - Fixed positioning */}
          <div className="absolute left-0 top-0 hidden lg:block ml-4 mt-4"> {/* Changed negative margins to positive */}
            <svg width="80" height="80" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="2" cy="2" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="2" cy="22" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="2" cy="42" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="2" cy="62" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="2" cy="82" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="22" cy="2" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="22" cy="22" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="22" cy="42" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="22" cy="62" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="22" cy="82" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="42" cy="2" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="42" cy="22" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="42" cy="42" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="42" cy="62" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="42" cy="82" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="62" cy="2" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="62" cy="22" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="62" cy="42" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="62" cy="62" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="62" cy="82" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="82" cy="2" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="82" cy="22" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="82" cy="42" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="82" cy="62" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="82" cy="82" r="2" fill="#800000" fillOpacity="0.3" />
            </svg>
          </div>
          
          <div className="absolute right-0 bottom-0 hidden lg:block mr-4 mb-4 transform rotate-180"> {/* Changed negative margins to positive */}
            <svg width="80" height="80" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="2" cy="2" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="2" cy="22" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="2" cy="42" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="2" cy="62" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="2" cy="82" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="22" cy="2" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="22" cy="22" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="22" cy="42" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="22" cy="62" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="22" cy="82" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="42" cy="2" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="42" cy="22" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="42" cy="42" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="42" cy="62" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="42" cy="82" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="62" cy="2" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="62" cy="22" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="62" cy="42" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="62" cy="62" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="62" cy="82" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="82" cy="2" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="82" cy="22" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="82" cy="42" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="82" cy="62" r="2" fill="#800000" fillOpacity="0.3" />
              <circle cx="82" cy="82" r="2" fill="#800000" fillOpacity="0.3" />
            </svg>
          </div>
          
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Form description */}
            <motion.div 
              variants={itemFadeIn}
              className="lg:col-span-5"
            >
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Send Us a Message
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Fill out the form, and our team will get back to you within 24 hours.
              </p>
              
              <div className="mt-8 space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#800000]/10">
                      <HiCheck className="h-5 w-5 text-[#800000]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Free Initial Consultation</p>
                    <p className="mt-1 text-gray-500">We offer a free initial consultation to discuss your case.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#800000]/10">
                      <HiCheck className="h-5 w-5 text-[#800000]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Client Confidentiality</p>
                    <p className="mt-1 text-gray-500">All communications are strictly confidential and protected.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#800000]/10">
                      <HiCheck className="h-5 w-5 text-[#800000]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Experienced Legal Team</p>
                    <p className="mt-1 text-gray-500">Our attorneys have decades of combined experience in various legal fields.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h3>
                <div className="mt-6 space-y-4">
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="group rounded-lg cursor-pointer"
                  >
                    <Link to="/faq" className="text-base text-gray-900 font-medium group-hover:text-[#800000]">
                      How soon will I hear back from your team?
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">We aim to respond to all inquiries within 24 hours during business days.</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="group rounded-lg cursor-pointer"
                  >
                    <Link to="/faq" className="text-base text-gray-900 font-medium group-hover:text-[#800000]">
                      Do you offer virtual consultations?
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">Yes, we offer both in-person and secure video consultations for your convenience.</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Form container */}
            <motion.div 
              variants={itemFadeIn}
              className="mt-12 lg:col-span-7 lg:mt-0"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-8 sm:p-10">
                  <h3 className="text-2xl font-semibold text-gray-900">Contact Form</h3>
                  <p className="mt-1 text-gray-500">We're ready to help with your legal needs.</p>
                
                  {formSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-8 p-6 bg-green-50 rounded-xl"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <HiCheck className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-green-800">Message Sent Successfully</h4>
                          <p className="mt-2 text-green-700">
                            Thank you for contacting PSN Attorneys. One of our team members will get back to you shortly.
                          </p>
                          <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setFormSubmitted(false)}
                              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Send Another Message
                            </motion.button>
                            <motion.a
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              href="/faq"
                              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                            >
                              Browse Our FAQ
                            </motion.a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full name <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1 relative">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              autoComplete="name"
                              value={formState.name}
                              onChange={handleChange}
                              className={`block w-full rounded-md shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent border ${
                                formErrors.name ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {formErrors.name && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1 relative">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              value={formState.email}
                              onChange={handleChange}
                              className={`block w-full rounded-md shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent border ${
                                formErrors.email ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {formErrors.email && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="phone"
                              id="phone"
                              autoComplete="tel"
                              value={formState.phone}
                              onChange={handleChange}
                              className="block w-full rounded-md border-gray-300 shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="caseType" className="block text-sm font-medium text-gray-700">
                            Case Type
                          </label>
                          <div className="mt-1">
                            <select
                              id="caseType"
                              name="caseType"
                              value={formState.caseType}
                              onChange={handleChange}
                              className="block w-full rounded-md border-gray-300 shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                            >
                              {caseTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                            Subject <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1 relative">
                            <input
                              type="text"
                              name="subject"
                              id="subject"
                              value={formState.subject}
                              onChange={handleChange}
                              className={`block w-full rounded-md shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent border ${
                                formErrors.subject ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {formErrors.subject && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.subject}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            Message <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1 relative">
                            <textarea
                              id="message"
                              name="message"
                              rows={5}
                              value={formState.message}
                              onChange={handleChange}
                              className={`block w-full rounded-md shadow-sm py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent border ${
                                formErrors.message ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="Please describe your case or inquiry..."
                            ></textarea>
                            {formErrors.message && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Your message will be kept strictly confidential.
                          </p>
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <input
                              id="privacy-policy"
                              name="privacy-policy"
                              type="checkbox"
                              className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
                              required
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-500">
                              By submitting this form, you agree to our{' '}
                              <Link to="/privacy-policy" className="font-medium text-[#800000] hover:text-[#600000]">
                                Privacy Policy
                              </Link>{' '}
                              and consent to being contacted regarding your inquiry.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] ${
                            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            'Submit'
                          )}
                        </motion.button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Improved map section with info overlay */}
      <motion.div 
        ref={mapRef}
        initial="hidden"
        animate={mapInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="bg-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Visit Our Office</h2>
            <p className="mt-4 text-lg text-gray-500">
              Located in the heart of Sandton, our office is easily accessible by both public and private transport.
            </p>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <iframe
              title="Office Location"
              className="w-full h-[600px]"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.765557288491!2d28.049600315443!3d-26.235712983411367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9506a4bd51bb07%3A0xd37ef5d3fca738c7!2sSandton%2C%20Johannesburg%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1621509700664!5m2!1sen!2sus"
              style={{ filter: 'grayscale(1) contrast(1.2) opacity(0.9)' }}
            ></iframe>
            
            {/* Info card overlay */}
            <div className="absolute bottom-8 left-8 lg:left-auto lg:right-8 max-w-sm bg-white rounded-lg shadow-xl p-6 border-l-4 border-[#800000]">
              <h3 className="text-lg font-bold text-gray-900">PSN Attorneys</h3>
              <address className="mt-3 not-italic text-gray-600">
                <p>123 Main Street</p>
                <p>Sandton, Johannesburg</p>
                <p>2196, South Africa</p>
              </address>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <HiPhone className="h-5 w-5 text-[#800000] mr-2" />
                  <span>+27 (11) 123 4567</span>
                </div>
                <div className="flex items-center">
                  <HiOutlineClock className="h-5 w-5 text-[#800000] mr-2" />
                  <span>Mon-Fri: 8AM - 6PM</span>
                </div>
              </div>
              <div className="mt-6">
                <a
                  href="https://maps.google.com/?q=Sandton,Johannesburg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000]"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
          
          {/* Nearby amenities */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#800000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 002-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 002 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="ml-2 text-lg font-medium text-gray-900">Parking</h3>
              </div>
              <p className="mt-2 text-gray-600">
                Secure underground parking available for all clients at no additional cost.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#800000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h3 className="ml-2 text-lg font-medium text-gray-900">Public Transport</h3>
              </div>
              <p className="mt-2 text-gray-600">
                Just 5 minutes walk from Sandton Gautrain Station with taxi services available.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#800000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="ml-2 text-lg font-medium text-gray-900">Accessibility</h3>
              </div>
              <p className="mt-2 text-gray-600">
                Our office is wheelchair accessible with elevator access to all floors.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;