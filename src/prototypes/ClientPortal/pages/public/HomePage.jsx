import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineLightningBolt, 
  HiOutlineShieldCheck, 
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiArrowRight,
  HiOutlineChat,
  HiOutlineClock,
  HiOutlineScale,
  HiOutlineLockClosed,
  HiOutlineFingerPrint,
  HiOutlineClipboardCheck,
  HiOutlineServer,
  HiChevronDown
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import logoImage from '../../../../assets/PSN-removebg-preview.png';

const HomePage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeFaqCategory, setActiveFaqCategory] = useState('general');
  
  // Intersection observers for scroll animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [securityRef, securityInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [faqRef, faqInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [finalCtaRef, finalCtaInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
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
  
  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };
  
  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  
  // Testimonial data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Personal Injury Client",
      quote: "The client portal made it so easy to keep track of my case. I could see updates immediately and send questions to my attorney without having to call the office.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Michael Thompson",
      role: "Corporate Client",
      quote: "As a business owner, I appreciate being able to access all our legal documents and case information in one secure location. The portal saves us significant time and resources.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Priya Patel",
      role: "Family Law Client",
      quote: "During a stressful divorce, having 24/7 access to my case information and being able to securely communicate with my attorney gave me peace of mind.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];
  
  // Security features data
  const securityFeatures = [
    {
      title: "End-to-End Encryption",
      description: "All data transmitted through our portal is fully encrypted to prevent unauthorized access.",
      icon: <HiOutlineLockClosed className="h-6 w-6" />
    },
    {
      title: "Secure Authentication",
      description: "Multi-factor authentication ensures only authorized users can access sensitive information.",
      icon: <HiOutlineFingerPrint className="h-6 w-6" />
    },
    {
      title: "Compliant With Legal Standards",
      description: "Our platform adheres to legal industry security standards and compliance requirements.",
      icon: <HiOutlineClipboardCheck className="h-6 w-6" />
    },
    {
      title: "Regular Security Audits",
      description: "We perform regular security assessments to identify and address potential vulnerabilities.",
      icon: <HiOutlineServer className="h-6 w-6" />
    }
  ];
  
  // Updated FAQ data with categories
  const faqCategories = [
    { id: 'general', name: 'General Questions' },
    { id: 'account', name: 'Account & Security' },
    { id: 'portal', name: 'Using the Portal' },
    { id: 'technical', name: 'Technical Support' }
  ];
  
  // FAQs with category information
  const allFaqs = [
    // General Questions
    {
      question: "How do I create an account?",
      answer: "You can register for an account directly through our website. Your attorney will provide you with a registration code that links your account to your case.",
      category: "general"
    },
    {
      question: "What are the benefits of using the client portal?",
      answer: "Our portal provides 24/7 access to your case information, secure document sharing, direct communication with your legal team, and convenient payment options all in one place.",
      category: "general"
    },
    {
      question: "Do I need to pay extra for portal access?",
      answer: "No, access to our client portal is complimentary for all active clients of PSN Attorneys.",
      category: "general"
    },
    
    // Account & Security
    {
      question: "Is my information secure?",
      answer: "Yes. We use industry-standard encryption and security protocols to ensure your data remains private and protected at all times.",
      category: "account"
    },
    {
      question: "What if I forget my password?",
      answer: "You can reset your password through the login page by clicking on 'Forgot Password' and following the instructions sent to your email.",
      category: "account"
    },
    {
      question: "Can I change my email address or contact information?",
      answer: "Yes, you can update your contact information through the Profile section of your portal account. Changes will be reflected across your case information.",
      category: "account"
    },
    
    // Using the Portal
    {
      question: "Can I access the portal on my mobile device?",
      answer: "Absolutely! Our client portal is fully responsive and works seamlessly on smartphones, tablets, and desktop computers.",
      category: "portal"
    },
    {
      question: "How do I upload documents?",
      answer: "Once logged in, navigate to the Documents section for your case and use the upload button to select and share files with your legal team.",
      category: "portal"
    },
    {
      question: "How do I message my attorney?",
      answer: "Go to the Messages section in your portal, select your attorney or legal team member, compose your message, and send. You'll receive notifications when they respond.",
      category: "portal"
    },
    
    // Technical Support
    {
      question: "What browsers are supported?",
      answer: "Our portal supports all modern browsers including Chrome, Firefox, Safari, and Edge. For optimal performance, we recommend keeping your browser updated to the latest version.",
      category: "technical"
    },
    {
      question: "What should I do if I encounter an error?",
      answer: "First, try refreshing your browser. If the issue persists, please contact our technical support team via the Help section or by calling our office directly.",
      category: "technical"
    },
    {
      question: "Is there a mobile app available?",
      answer: "Currently, we offer a mobile-responsive web portal rather than a dedicated app. This ensures you always have the latest features without needing to download updates.",
      category: "technical"
    }
  ];
  
  // Filter FAQs based on active category
  const filteredFaqs = allFaqs.filter(faq => faq.category === activeFaqCategory);
  
  return (
    <>
      {/* Hero Section with Logo and Animated Overlay */}
      <motion.div 
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="relative bg-gray-900 overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1575505586569-646b2ca898fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Legal office backdrop"
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
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center"
          >
            Client Portal
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 max-w-3xl text-xl text-gray-100 mx-auto text-center"
          >
            Securely access your case information, communicate with your legal team, and stay
            updated on important developments in your legal matters.
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/client-portal/login"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#800000] bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Client Login
            </Link>
            <Link
              to="/client-portal/register"
              className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-all duration-300"
            >
              Register an Account
            </Link>
          </motion.div>
          
          {/* Scrolling indicator */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Feature Section with Enhanced Cards */}
      <motion.div 
        ref={featuresRef}
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemFadeIn} className="text-center">
            <h2 className="text-base font-semibold text-[#800000] tracking-wide uppercase">
              Client Portal Features
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need in one place
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Our secure client portal provides convenient access to your legal matters anywhere, anytime.
            </p>
          </motion.div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature cards with staggered animation */}
              <motion.div variants={itemFadeIn} className="pt-6 group">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 transition-all duration-300 hover:shadow-xl hover:bg-white border border-gray-100">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-[#800000] rounded-md shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <HiOutlineDocumentText className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight group-hover:text-[#800000] transition-colors duration-300">
                      Case Management
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      View your case details, status updates, and upcoming deadlines all in one convenient dashboard.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemFadeIn} className="pt-6 group">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 transition-all duration-300 hover:shadow-xl hover:bg-white border border-gray-100">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-[#800000] rounded-md shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <HiOutlineShieldCheck className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight group-hover:text-[#800000] transition-colors duration-300">
                      Secure Document Sharing
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Upload, download, and securely share important legal documents with your legal team.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemFadeIn} className="pt-6 group">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 transition-all duration-300 hover:shadow-xl hover:bg-white border border-gray-100">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-[#800000] rounded-md shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <HiOutlineChat className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight group-hover:text-[#800000] transition-colors duration-300">
                      Direct Communication
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Message your attorney directly through our secure platform and receive timely responses.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemFadeIn} className="pt-6 group">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 transition-all duration-300 hover:shadow-xl hover:bg-white border border-gray-100">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-[#800000] rounded-md shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <HiOutlineLightningBolt className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight group-hover:text-[#800000] transition-colors duration-300">
                      Real-Time Updates
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Receive notifications for case updates, new documents, and important deadlines.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemFadeIn} className="pt-6 group">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 transition-all duration-300 hover:shadow-xl hover:bg-white border border-gray-100">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-[#800000] rounded-md shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <HiOutlineClock className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight group-hover:text-[#800000] transition-colors duration-300">
                      Calendar & Scheduling
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Track appointments, court dates, and deadlines with our integrated calendar system.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemFadeIn} className="pt-6 group">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 transition-all duration-300 hover:shadow-xl hover:bg-white border border-gray-100">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-[#800000] rounded-md shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <HiOutlineScale className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight group-hover:text-[#800000] transition-colors duration-300">
                      Billing & Payments
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      View invoices, billing history, and make secure payments online at your convenience.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Improved CTA Section with Background Pattern */}
      <motion.div 
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="bg-[#800000] relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 404 384" fill="none">
            <defs>
              <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" fill="white" />
              </pattern>
            </defs>
            <rect width="404" height="384" fill="url(#pattern)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between relative">
          <motion.div variants={fadeInLeft}>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-white">Access your legal matters today.</span>
            </h2>
          </motion.div>
          <motion.div variants={fadeInRight} className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/client-portal/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#800000] bg-white hover:bg-gray-50 transition-colors duration-300"
              >
                Sign in
                <HiArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/client-portal/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#9c2a2a] hover:bg-[#8a2424] transition-colors duration-300"
              >
                Create account
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Testimonials Section with Images */}
      <motion.div 
        ref={testimonialsRef}
        initial="hidden"
        animate={testimonialsInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="bg-gray-50 py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemFadeIn} className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              What Our Clients Say
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
              Our clients love the convenience and transparency of our client portal.
            </p>
          </motion.div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  variants={itemFadeIn}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-white overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl"
                >
                  <div className="h-32 bg-[#800000] relative">
                    <div className="absolute -bottom-10 left-6">
                      <img 
                        className="h-20 w-20 rounded-full ring-4 ring-white" 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                      />
                    </div>
                  </div>
                  <div className="px-6 pt-14 pb-8">
                    <div className="mt-1">
                      <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-[#800000] font-medium">{testimonial.role}</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-base italic text-gray-600">"{testimonial.quote}"</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Security Section */}
      <motion.div 
        ref={securityRef}
        initial="hidden"
        animate={securityInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="bg-white py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeIn} className="lg:text-center">
            <h2 className="text-base text-[#800000] font-semibold tracking-wide uppercase">Security First</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Your Data Security is Our Priority
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We employ industry-leading security measures to ensure your sensitive legal information remains protected at all times.
            </p>
          </motion.div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-16">
              {securityFeatures.map((feature, index) => (
                <motion.div 
                  key={index} 
                  variants={itemFadeIn} 
                  className="relative group"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#800000] text-white group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 group-hover:text-[#800000] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Interactive FAQ Section with Category Tabs */}
      <motion.div 
        ref={faqRef}
        initial="hidden"
        animate={faqInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="bg-gray-50 py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemFadeIn} className="text-center">
            <span className="text-base text-[#800000] font-semibold tracking-wide uppercase">Support</span>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
              Have questions about our client portal? Find answers to common questions below.
            </p>
          </motion.div>
          
          {/* Responsive FAQ Category Tabs */}
          <motion.div variants={itemFadeIn} className="mt-12">
            {/* Desktop Tabs */}
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex flex-wrap justify-center space-x-8">
                  {faqCategories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setActiveFaqCategory(category.id);
                        setOpenFaqIndex(null);
                      }}
                      className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                        activeFaqCategory === category.id
                          ? 'border-[#800000] text-[#800000]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </nav>
              </div>
            </div
            >
            
            {/* Mobile Dropdown */}
            <div className="mt-4 sm:hidden">
              <label htmlFor="faq-category-select" className="sr-only">
                Select FAQ Category
              </label>
              <select
                id="faq-category-select"
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#800000] focus:outline-none focus:ring-[#800000] sm:text-sm"
                value={activeFaqCategory}
                onChange={(e) => {
                  setActiveFaqCategory(e.target.value);
                  setOpenFaqIndex(null);
                }}
              >
                {faqCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
          
          {/* FAQ Accordion List with Staggered Animation */}
          <motion.div 
            variants={staggerContainer}
            className="mt-8 space-y-6 max-w-3xl mx-auto"
          >
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <motion.div 
                  key={`${activeFaqCategory}-${index}`}
                  variants={itemFadeIn}
                  className={`bg-white shadow-md overflow-hidden rounded-lg transition-all duration-300 ${
                    openFaqIndex === index ? 'ring-2 ring-[#800000]' : 'hover:shadow-lg'
                  }`}
                >
                  <motion.button
                    whileTap={{ scale: 0.99 }}
                    className="w-full px-6 py-5 flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openFaqIndex === index}
                  >
                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-left">
                      {faq.question}
                    </h3>
                    <div className={`flex-shrink-0 ml-2 h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
          openFaqIndex === index ? 'bg-[#800000] border-[#800000]' : 'border-gray-300'
        }`}>
          <HiChevronDown 
            className={`h-5 w-5 transition-transform duration-300 ${
              openFaqIndex === index ? 'text-white transform rotate-180' : 'text-gray-500'
            }`} 
          />
        </div>
      </motion.button>
      <motion.div 
        className={`transition-all duration-300 overflow-hidden ${
          openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={openFaqIndex !== index}
      >
        <div className="px-6 pb-6">
          <div className="border-t border-gray-200 pt-4">
            <p className="text-base text-gray-600">
              {faq.answer}
            </p>
            <div className="mt-4 flex">
              <motion.div whileHover={{ x: 5 }}>
                <Link 
                  to="/client-portal/contact" 
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
    </motion.div>
 ))
) : (
  <motion.div 
    variants={scaleIn} 
    className="text-center py-8"
  >
    <p className="text-gray-500">No FAQs found in this category.</p>
  </motion.div>
)}
          </motion.div>
          
          {/* FAQ Footer with Links */}
          <motion.div 
            variants={itemFadeIn} 
            className="mt-12 text-center"
          >
            <p className="text-base text-gray-500">
              Can't find what you're looking for?
            </p>
            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                <Link 
                  to="/client-portal/faq"
                  className="inline-flex items-center justify-center px-4 py-2 border border-[#800000] rounded-md shadow-sm text-sm font-medium text-[#800000] bg-white hover:bg-[#800000] hover:text-white transition-colors duration-300"
                >
                  View All FAQs
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                <Link 
                  to="/client-portal/contact" 
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] transition-colors duration-300"
                >
                  Contact Support
                  <span className="ml-2 bg-white text-[#800000] rounded-full p-1 group-hover:translate-x-1 transition-all duration-300">
                    <HiArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Final CTA with Logo */}
      <motion.div 
        ref={finalCtaRef}
        initial="hidden"
        animate={finalCtaInView ? "visible" : "hidden"}
        variants={scaleIn}
        className="bg-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.img 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            src={logoImage} 
            alt="PSN Attorneys" 
            className="h-20 w-auto mx-auto mb-6" 
          />
          <motion.h2 
            variants={itemFadeIn}
            className="text-2xl font-bold text-gray-900"
          >
            Ready to experience a better way to manage your legal matters?
          </motion.h2>
          <motion.div 
            variants={itemFadeIn}
            className="mt-6"
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/client-portal/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] transition-colors duration-300 shadow-lg"
              >
                Get Started Today
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default HomePage;
