import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiChevronDown, 
  HiArrowRight, 
  HiOutlineSearch, 
  HiCheck, 
  HiOutlineQuestionMarkCircle,
  HiOutlineLightBulb,
  HiOutlineBookOpen,
  HiOutlineSupport
} from 'react-icons/hi';
import { useInView } from 'react-intersection-observer';

const FAQPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeFaqCategory, setActiveFaqCategory] = useState(searchParams.get('category') || 'general');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Intersection observers for scroll animations
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [tabsRef, tabsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [faqsRef, faqsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [contactRef, contactInView] = useInView({ triggerOnce: true, threshold: 0.1 });

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

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Update URL when category changes
  useEffect(() => {
    if (activeFaqCategory) {
      setSearchParams({ category: activeFaqCategory });
    }
  }, [activeFaqCategory, setSearchParams]);

  // Reset openFaqIndex when category changes
  useEffect(() => {
    setOpenFaqIndex(null);
  }, [activeFaqCategory]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Simple search algorithm
    const query = searchQuery.toLowerCase();
    const results = allFaqs.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    );
    
    setSearchResults(results);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };
  
  // FAQ categories with icons
  const faqCategories = [
    { id: 'general', name: 'General Questions', icon: <HiOutlineQuestionMarkCircle className="h-5 w-5" /> },
    { id: 'account', name: 'Account & Security', icon: <HiCheck className="h-5 w-5" /> },
    { id: 'portal', name: 'Using the Portal', icon: <HiOutlineBookOpen className="h-5 w-5" /> },
    { id: 'technical', name: 'Technical Support', icon: <HiOutlineSupport className="h-5 w-5" /> }
  ];
  
  // Expanded FAQs with category information
  const allFaqs = [
    // General Questions
    {
      question: "How do I create an account?",
      answer: "You can register for an account directly through our website by clicking the 'Register' button in the top navigation bar. To complete the registration, you'll need the registration code provided by your attorney. This code links your portal account to your specific case information.",
      category: "general"
    },
    {
      question: "What are the benefits of using the client portal?",
      answer: "Our portal provides numerous benefits, including: 24/7 access to your case information, secure document sharing between you and your legal team, direct communication with your attorneys, real-time status updates, calendar management for important dates, and convenient online payment options. All these features are designed to increase transparency and improve your experience as our client.",
      category: "general"
    },
    {
      question: "Do I need to pay extra for portal access?",
      answer: "No, access to our client portal is complimentary for all active clients of PSN Attorneys. The portal is included as part of our commitment to providing excellent service and enhancing communication with our clients.",
      category: "general"
    },
    {
      question: "Can multiple people from my organization access the same account?",
      answer: "Yes, for business clients, we offer multi-user access with different permission levels. Each user will have their own login credentials, but they'll be able to access the same case information based on their assigned permissions. This feature needs to be set up by your attorney, so please contact them directly to arrange this.",
      category: "general"
    },
    {
      question: "How quickly is information updated in the portal?",
      answer: "Most updates to your case information, including document uploads and status changes, are reflected in real-time or within minutes. Calendar events and scheduled appointments are typically updated within 1-2 business hours after being confirmed by your legal team.",
      category: "general"
    },
    
    // Account & Security
    {
      question: "Is my information secure?",
      answer: "Yes. We implement comprehensive security measures to protect your data, including: End-to-end encryption for all data transmission, secure SSL connections, multi-factor authentication options, regular security audits, and compliance with legal industry data protection standards. Our security protocols meet or exceed recommended standards for handling sensitive legal information.",
      category: "account"
    },
    {
      question: "What if I forget my password?",
      answer: "You can reset your password through the login page by clicking on 'Forgot Password' and following the instructions sent to your email. For security reasons, password reset links expire after 24 hours. If you don't receive the email or have any issues, please contact our support team.",
      category: "account"
    },
    {
      question: "Can I change my email address or contact information?",
      answer: "Yes, you can update your contact information through the Profile section of your portal account. Changes will be reflected across your case information. It's important to keep your contact information up-to-date to ensure you receive all important notifications and communications.",
      category: "account"
    },
    {
      question: "How does multi-factor authentication work?",
      answer: "Multi-factor authentication adds an extra layer of security by requiring two forms of verification when you log in. After entering your password, you'll receive a one-time code via text message or email that you'll need to enter to complete the login process. You can enable this feature in your account settings under the Security section.",
      category: "account"
    },
    {
      question: "How long will I have access to my portal account?",
      answer: "Your portal account remains active for as long as you are a client with active cases. After your case is closed, you'll maintain access to your documents and case information for 12 months. After this period, you can request an extension or a complete export of your data if needed.",
      category: "account"
    },
    
    // Using the Portal
    {
      question: "Can I access the portal on my mobile device?",
      answer: "Absolutely! Our client portal is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. You can access all the same features regardless of the device you're using. For the best mobile experience, we recommend using the latest version of Chrome, Safari, or Firefox on your mobile device.",
      category: "portal"
    },
    {
      question: "How do I upload documents?",
      answer: "Once logged in, navigate to the Documents section for your case and use the upload button to select and share files with your legal team. Our portal accepts most common file formats including PDF, Word, Excel, JPG, and PNG. There is a 50MB size limit per file. For larger files, please contact your legal team for alternative upload options.",
      category: "portal"
    },
    {
      question: "How do I message my attorney?",
      answer: "Go to the Messages section in your portal, select your attorney or legal team member, compose your message, and send. You'll receive notifications when they respond. You can also attach documents to your messages for quick reference. All communication is securely stored in your portal account for future reference.",
      category: "portal"
    },
    {
      question: "How do I make payments through the portal?",
      answer: "To make a payment, navigate to the Billing section of your portal where you'll see any outstanding invoices. Click on the invoice you want to pay, review the details, and select your preferred payment method. We accept major credit cards and ACH bank transfers. You'll receive a receipt via email after your payment is processed.",
      category: "portal"
    },
    {
      question: "Can I schedule appointments through the portal?",
      answer: "Yes, you can request appointments through the Calendar section. Select your preferred date and time, and your attorney will confirm or suggest alternatives. Once confirmed, the appointment will appear in your portal calendar with any relevant details and reminders.",
      category: "portal"
    },
    
    // Technical Support
    {
      question: "What browsers are supported?",
      answer: "Our portal supports all modern browsers including Chrome, Firefox, Safari, and Edge. For optimal performance, we recommend keeping your browser updated to the latest version. Internet Explorer is not supported as it lacks modern security features necessary for protecting your data.",
      category: "technical"
    },
    {
      question: "What should I do if I encounter an error?",
      answer: "First, try refreshing your browser. If the issue persists, clear your browser cache and cookies, then try again. If you're still experiencing problems, please contact our technical support team via the Help section or by calling our office directly. It helps if you can provide details about the error, including any error messages and the actions you were attempting when the error occurred.",
      category: "technical"
    },
    {
      question: "Is there a mobile app available?",
      answer: "Currently, we offer a mobile-responsive web portal rather than a dedicated app. This ensures you always have the latest features without needing to download updates. Our web portal provides full functionality on mobile devices through your browser, eliminating the need for separate app installations.",
      category: "technical"
    },
    {
      question: "How do I enable notifications?",
      answer: "You can manage notification preferences in your account settings. We offer email notifications for all updates and browser notifications when you're logged into the portal. To enable browser notifications, you'll need to accept the permission request from your browser when prompted.",
      category: "technical"
    },
    {
      question: "What are the system requirements for using the portal?",
      answer: "Our portal works on any device with a modern web browser and internet connection. For desktop computers, we recommend at least 4GB of RAM and a processor made within the last 5 years. For mobile devices, any smartphone or tablet manufactured in the last 4-5 years should work well with our portal.",
      category: "technical"
    }
  ];
  
  // Filter FAQs based on active category
  const filteredFaqs = allFaqs.filter(faq => faq.category === activeFaqCategory);
  const displayFaqs = isSearching ? searchResults : filteredFaqs;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header section */}
      <motion.div 
        ref={headerRef}
        initial="hidden"
        animate={headerInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            variants={fadeInUp}
            className="text-3xl font-extrabold text-white sm:text-4xl"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Find answers to common questions about our client portal, account management, and technical support.
          </motion.p>
          
          {/* Search bar */}
          <motion.div 
            variants={fadeInUp}
            className="mt-8 max-w-2xl mx-auto"
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="flex shadow-sm">
                <div className="relative flex items-stretch flex-grow focus-within:z-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="focus:ring-[#800000] focus:border-[#800000] block w-full rounded-none rounded-l-md pl-10 py-3 sm:text-sm border-gray-300"
                    placeholder="Search for answers..."
                  />
                </div>
                <button
                  type="submit"
                  className="relative -ml-px inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                >
                  Search
                </button>
              </div>
            </form>
            
            {/* Search results indicator */}
            {isSearching && (
              <div className="mt-4 text-white flex justify-between items-center">
                <span>
                  {searchResults.length === 0 
                    ? "No results found" 
                    : `Found ${searchResults.length} result${searchResults.length === 1 ? '' : 's'}`}
                </span>
                <button 
                  onClick={clearSearch}
                  className="text-sm underline hover:text-gray-300"
                >
                  Clear search
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {!isSearching && (
          <motion.div 
            ref={tabsRef}
            initial="hidden"
            animate={tabsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="mb-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl font-bold text-gray-900 text-center mb-8"
            >
              Browse by Category
            </motion.h2>
            
            {/* Category cards - desktop */}
            <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {faqCategories.map((category) => (
                <motion.button
                  key={category.id}
                  variants={fadeInUp}
                  onClick={() => setActiveFaqCategory(category.id)}
                  className={`flex flex-col items-center p-6 rounded-lg transition-all duration-300 ${
                    activeFaqCategory === category.id
                      ? 'bg-[#800000] text-white shadow-lg'
                      : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`p-3 rounded-full ${
                    activeFaqCategory === category.id
                      ? 'bg-white/20'
                      : 'bg-[#800000]/10'
                  }`}>
                    <span className={activeFaqCategory === category.id ? 'text-white' : 'text-[#800000]'}>
                      {category.icon}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium">{category.name}</h3>
                  <span className="mt-2 text-sm">
                    {allFaqs.filter(faq => faq.category === category.id).length} articles
                  </span>
                </motion.button>
              ))}
            </div>
            
            {/* Category tabs - mobile */}
            <div className="sm:hidden">
              <label htmlFor="faq-category-mobile" className="sr-only">
                Select FAQ Category
              </label>
              <select
                id="faq-category-mobile"
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#800000] focus:outline-none focus:ring-[#800000] sm:text-sm"
                value={activeFaqCategory}
                onChange={(e) => setActiveFaqCategory(e.target.value)}
              >
                {faqCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({allFaqs.filter(faq => faq.category === category.id).length})
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* FAQ Accordion List */}
        <motion.div 
          ref={faqsRef}
          initial="hidden"
          animate={faqsInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="space-y-6 max-w-3xl mx-auto"
        >
          {!isSearching && (
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl font-bold text-gray-900 mb-6"
            >
              {faqCategories.find(c => c.id === activeFaqCategory)?.name}
            </motion.h2>
          )}
          
          {isSearching && searchResults.length === 0 ? (
            <motion.div 
              variants={fadeInUp}
              className="text-center py-12 bg-white rounded-lg shadow-sm"
            >
              <HiOutlineLightBulb className="h-12 w-12 text-[#800000] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any FAQs matching your search. Try using different keywords or browse by category.
              </p>
            </motion.div>
          ) : displayFaqs.length > 0 ? (
            displayFaqs.map((faq, index) => (
              <motion.div 
                key={isSearching ? `search-${index}` : `${activeFaqCategory}-${index}`}
                variants={fadeInUp}
                className={`bg-white shadow-sm overflow-hidden rounded-lg transition-all duration-300 ${
                  openFaqIndex === index ? 'ring-2 ring-[#800000]' : 'hover:shadow-md'
                }`}
              >
                <button
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
                </button>
                <div 
                  className={`transition-all duration-300 overflow-hidden ${
                    openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                  aria-hidden={openFaqIndex !== index}
                >
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-base text-gray-600 whitespace-pre-line">
                        {faq.answer}
                      </p>
                      
                      {/* Display category tag for search results */}
                      {isSearching && (
                        <div className="mt-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {faqCategories.find(c => c.id === faq.category)?.name}
                          </span>
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-between items-center">
                        <Link 
                          to="/contact" 
                          className="text-sm font-medium text-[#800000] hover:text-[#600000] flex items-center group"
                        >
                          Need more help with this?
                          <HiArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                        
                        <button 
                          className="text-sm text-gray-500 hover:text-gray-700"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.origin + window.location.pathname + `?category=${faq.category}`);
                            alert('Link copied to clipboard!');
                          }}
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              variants={fadeInUp}
              className="text-center py-8 bg-white rounded-lg"
            >
              <p className="text-gray-500">No FAQs found in this category.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Contact section */}
        <motion.div 
          ref={contactRef}
          initial="hidden"
          animate={contactInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="mt-16 bg-white rounded-lg shadow-sm overflow-hidden sm:grid sm:grid-cols-2"
        >
          <div className="p-10 bg-[#800000]">
            <h3 className="text-2xl font-bold text-white">Still have questions?</h3>
            <p className="mt-4 text-white/90">
              Our support team is ready to assist you with any questions or issues you may have about our client portal.
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <HiCheck className="h-6 w-6 text-white" />
                </div>
                <p className="ml-3 text-white/90">
                  Technical assistance with portal features
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <HiCheck className="h-6 w-6 text-white" />
                </div>
                <p className="ml-3 text-white/90">
                  Account access and security questions
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <HiCheck className="h-6 w-6 text-white" />
                </div>
                <p className="ml-3 text-white/90">
                  Help with document uploads and downloads
                </p>
              </li>
            </ul>
          </div>
          <div className="p-10 bg-white">
            <h3 className="text-lg font-medium text-gray-900">Contact Support</h3>
            <p className="mt-4 text-gray-500">
              Our support team is available Monday through Friday, 8am to 6pm.
            </p>
            <div className="mt-8 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Email</h4>
                <a href="mailto:support@psnattorneys.com" className="block mt-1 text-[#800000] hover:text-[#600000]">
                  support@psnattorneys.com
                </a>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Phone</h4>
                <a href="tel:+15551234567" className="block mt-1 text-[#800000] hover:text-[#600000]">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] transition-colors duration-300"
              >
                Contact Us
                <HiArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;