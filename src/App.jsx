import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import psnLogo from './assets/PSN.png';

// Prototype components
import ClientPortal from './prototypes/ClientPortal/ClientPortal';
import CollectionsTracker from './prototypes/CollectionsTracker/CollectionsTracker';
import DocumentManagement from './prototypes/DocumentManagement/DocumentManagement';
import LitigationTimeline from './prototypes/LitigationTimeline/LitigationTimeline';
import EmailAutomation from './prototypes/EmailAutomation/EmailAutomation';

// Import icons
import { 
  HiOutlineKey, HiOutlineCash, HiOutlineDocument,
  HiOutlineCalendar, HiOutlineMail, HiArrowRight,
  HiOutlineChevronDown, HiOutlineLightBulb,
  HiX, HiInformationCircle, HiOutlineExternalLink
} from 'react-icons/hi';

const App = () => {
  // Prototype card data
  const prototypes = [
    {
      id: 1,
      title: "Client Portal",
      description: "Secure platform for document submission, case tracking, and attorney communication.",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      path: "/client-portal",
      icon: <HiOutlineKey className="w-6 h-6" />,
      color: "bg-gradient-to-br from-blue-600 to-blue-800",
      benefits: [
        "Secure document submission",
        "Real-time case updates",
        "Direct attorney communication"
      ],
      fullDescription: "My Client Portal prototype demonstrates how I can create a secure, user-friendly platform where clients can submit documents, track their case progress, and communicate directly with their attorneys. The platform includes features like secure document upload, case status tracking, appointment scheduling, and encrypted messaging.",
      features: [
        "Secure document upload with encryption",
        "Real-time case status updates and notifications",
        "In-app messaging with attorneys",
        "Appointment scheduling and reminders",
        "Document e-signing capabilities",
        "Mobile responsive design"
      ],
      technologies: ["React", "Tailwind CSS", "JWT Authentication", "Encryption"]
    },
    {
      id: 2,
      title: "Collections Tracker",
      description: "Dashboard for tracking payment collections, reminders, and client balances.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      path: "/collections-tracker",
      icon: <HiOutlineCash className="w-6 h-6" />,
      color: "bg-gradient-to-br from-emerald-600 to-emerald-800",
      benefits: [
        "Real-time payment tracking",
        "Automated payment reminders",
        "Financial reporting dashboard"
      ],
      fullDescription: "My Collections Tracker prototype showcases a comprehensive dashboard for monitoring payment collections. I've designed this system to help law firms track outstanding payments, send automated reminders, and generate detailed financial reports to improve cash flow and reduce administrative burden.",
      features: [
        "Visual dashboard with payment status metrics",
        "Automated email and SMS payment reminders",
        "Client payment history and balance tracking",
        "Custom report generation",
        "Payment plan management",
        "Overdue payment flagging system"
      ],
      technologies: ["React", "Tailwind CSS", "Chart.js", "Data Visualization"]
    },
    {
      id: 3,
      title: "Document Management",
      description: "System to upload, organize, and search legal files with expiry alerts.",
      image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      path: "/document-management",
      icon: <HiOutlineDocument className="w-6 h-6" />,
      color: "bg-gradient-to-br from-purple-600 to-purple-800",
      benefits: [
        "Centralized document storage",
        "Advanced search capabilities",
        "Expiry & renewal alerts"
      ],
      fullDescription: "My Document Management prototype demonstrates an intuitive system for organizing, accessing, and managing legal documents. I've designed this solution to help law firms centralize their document storage, implement version control, and automate document expiry alerts to ensure nothing important is missed.",
      features: [
        "Advanced document search with OCR technology",
        "Document categorization and tagging system",
        "Version control and change tracking",
        "Automated expiry date tracking and alerts",
        "Document template library",
        "Access control and permission settings"
      ],
      technologies: ["React", "Tailwind CSS", "Full-text Search", "OCR Integration"]
    },
    {
      id: 4,
      title: "Litigation Timeline",
      description: "Timeline view for tracking court dates, submissions, and deadlines.",
      image: "https://images.unsplash.com/photo-1423592707957-3b212afa6733?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      path: "/litigation-timeline",
      icon: <HiOutlineCalendar className="w-6 h-6" />,
      color: "bg-gradient-to-br from-amber-500 to-amber-700",
      benefits: [
        "Visual case progression",
        "Deadline management",
        "Court date reminders"
      ],
      fullDescription: "My Litigation Timeline prototype features a visual timeline tool for tracking all important dates in litigation matters. I've developed this solution to help legal teams visualize case progression, manage critical deadlines, and stay on top of court dates and document submission requirements.",
      features: [
        "Interactive visual timeline for each case",
        "Automated deadline calculation based on court rules",
        "Integration with court calendars",
        "Color-coded event categorization",
        "Multi-user assignment and notification system",
        "Timeline export and sharing capabilities"
      ],
      technologies: ["React", "Tailwind CSS", "Timeline Visualization", "Calendar Integration"]
    },
    {
      id: 5,
      title: "Email Automation",
      description: "Automate client updates and reminders through pre-written templates.",
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      path: "/email-automation",
      icon: <HiOutlineMail className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-500 to-red-700",
      benefits: [
        "Customizable email templates",
        "Scheduled client updates",
        "Engagement tracking"
      ],
      fullDescription: "My Email Automation prototype demonstrates how I can streamline client communications with automated, personalized emails. This system allows attorneys to create template emails, schedule automatic updates, and track client engagement to ensure effective communication without increasing administrative workload.",
      features: [
        "Customizable email template library",
        "Scheduled email campaigns based on case events",
        "Personalized merge fields for client information",
        "Email open and engagement tracking",
        "A/B testing capabilities for email effectiveness",
        "Multi-language support for diverse client bases"
      ],
      technologies: ["React", "Tailwind CSS", "Email Integration", "Analytics"]
    }
  ];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrototypesDashboard prototypes={prototypes} />} />
        <Route path="/client-portal/*" element={<ClientPortal />} />
        <Route path="/collections-tracker/*" element={<CollectionsTracker />} />
        <Route path="/document-management/*" element={<DocumentManagement />} />
        <Route path="/litigation-timeline/*" element={<LitigationTimeline />} />
        <Route path="/email-automation/*" element={<EmailAutomation />} />
      </Routes>
    </Router>
  );
};

// Dashboard component to showcase all prototypes
const PrototypesDashboard = ({ prototypes }) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedPrototype, setSelectedPrototype] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY + 300;
      
      sections.forEach(section => {
        if (scrollPosition >= section.offsetTop && scrollPosition < (section.offsetTop + section.offsetHeight)) {
          setActiveSection(section.id);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openModal = (prototype) => {
    setSelectedPrototype(prototype);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Enhanced Header Section */}
      <header className="sticky top-0 z-50 bg-white shadow-md py-3 border-b-4 border-[#800000]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <img 
                src={psnLogo} 
                alt="PSN Attorneys Logo" 
                className="h-14 md:h-16 w-auto object-contain" 
              />
            </div>
            <nav className="hidden md:flex space-x-6 items-center">
              <a 
                href="#hero" 
                className={`font-medium transition-colors ${activeSection === 'hero' ? 'text-[#800000]' : 'text-gray-600 hover:text-[#800000]'}`}
              >
                Home
              </a>
              <a 
                href="#solutions" 
                className={`font-medium transition-colors ${activeSection === 'solutions' ? 'text-[#800000]' : 'text-gray-600 hover:text-[#800000]'}`}
              >
                Solutions
              </a>
              <a 
                href="#benefits" 
                className={`font-medium transition-colors ${activeSection === 'benefits' ? 'text-[#800000]' : 'text-gray-600 hover:text-[#800000]'}`}
              >
                Benefits
              </a>
              <a 
                href="#prototypes" 
                className={`font-medium transition-colors ${activeSection === 'prototypes' ? 'text-[#800000]' : 'text-gray-600 hover:text-[#800000]'}`}
              >
                Prototypes
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#800000]/90 to-black/70 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Legal background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Digital Solutions for <span className="text-white">PSN Attorneys</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Modernizing legal processes with innovative digital prototypes.
            </p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a 
                href="#prototypes" 
                className="flex items-center justify-center bg-white text-[#800000] font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition group"
              >
                View Prototypes 
                <HiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#benefits" 
                className="flex items-center justify-center border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white"
        >
          <a href="#solutions" aria-label="Scroll down">
            <HiOutlineChevronDown className="h-8 w-8 animate-bounce" />
          </a>
        </motion.div>
      </section>
      
      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Innovative Legal Tech Solutions
            </h2>
            <p className="text-lg text-gray-600">
              My digital solutions aim to streamline legal processes, enhance communication, and improve the client experience at PSN Attorneys.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Streamlined Workflows",
                icon: <HiOutlineLightBulb className="h-8 w-8 text-[#800000]" />,
                description: "Automate repetitive tasks and free up valuable time for more important legal work."
              },
              {
                title: "Enhanced Client Experience",
                icon: <HiOutlineKey className="h-8 w-8 text-[#800000]" />,
                description: "Provide clients with modern tools for seamless communication and case tracking."
              },
              {
                title: "Data-Driven Insights",
                icon: <HiOutlineDocument className="h-8 w-8 text-[#800000]" />,
                description: "Gain valuable insights from legal data to make more informed decisions."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center text-center"
              >
                <div className="bg-gray-50 p-4 rounded-full mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section with Animated Stats */}
      <section id="benefits" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-transparent"></div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Benefits of Digital Transformation
            </h2>
            <p className="text-lg text-gray-600">
              Embracing digital solutions offers significant advantages for your legal practice and clients.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { value: "35%", label: "Increase in Productivity" },
              { value: "50%", label: "Faster Document Processing" },
              { value: "24/7", label: "Client Access to Information" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-50 rounded-xl p-8 text-center shadow-lg border border-gray-100"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#800000] mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="md:w-1/2"
            >
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                alt="Legal professionals using technology" 
                className="rounded-xl shadow-xl w-full h-auto"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="md:w-1/2"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Why Modernize Your Legal Practice?</h3>
              <ul className="space-y-4">
                {[
                  "Improved client satisfaction and retention",
                  "Reduced administrative overhead and costs",
                  "Enhanced information security and compliance",
                  "Better work-life balance for legal professionals",
                  "Competitive advantage in the legal market"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start"
                  >
                    <div className="bg-[#800000] rounded-full p-1 mt-1 mr-3">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Prototypes Grid - Enhanced */}
      <section id="prototypes" className="py-20 bg-gray-50 relative">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Digital Solutions Prototypes
            </h2>
            <p className="text-lg text-gray-600">
              Explore my interactive prototypes demonstrating how digital tools can transform legal practice at PSN Attorneys.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {prototypes.map((prototype, index) => (
                <motion.div
                  key={prototype.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <PrototypeCard 
                    prototype={prototype} 
                    onDetailsClick={() => openModal(prototype)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-[#800000] to-[#500000] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Legal Practice?
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              These prototypes showcase how digital solutions can streamline workflows and enhance client services at PSN Attorneys.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="inline-block"
            >
              <a 
                href="#prototypes" 
                className="bg-white text-[#800000] font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition inline-block"
              >
                Explore All Prototypes
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-6 md:mb-0">
              <img 
                src={psnLogo} 
                alt="PSN Attorneys Logo" 
                className="h-12 w-auto object-contain invert opacity-90" 
              />
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">© 2025 PSN Attorneys - Digital Solutions Prototype</p>
              <p className="text-sm mt-1 text-gray-500">
                Designed and developed as demonstration prototypes
              </p>
            </div>
          </div>
          
          {/* Creator's mark and contact info */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="pt-6 border-t border-gray-800 mt-4"
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-[#800000] to-[#500000] rounded-full h-12 w-12 flex items-center justify-center mr-3 shadow-lg"
                >
                  {/* Replace with your initials or personal logo */}
                  <span className="text-white font-bold text-lg">SN</span>
                </motion.div>
                <div>
                  <p className="text-white font-medium">Designed & Developed by <span className="text-[#800000]">Siphamandla Ngcepe</span></p>
                  <p className="text-gray-400 text-sm">Full Stack Developer</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <a href="mailto:sphashepherd@gmail.com" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  sphashepherd@gmail.com
                </a>
                <a href="tel:+27718171153" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  +27 71 817 1153
                </a>
              </div>
            </div>
            
            <div className="flex justify-center mt-6 space-x-5">
              <a href="https://github.com/Doc012" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/siphamandla-ngcepe-a690ab20b" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://mr-sn.netlify.app/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.32 35.32 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Prototype Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPrototype && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={selectedPrototype.image} 
                    alt={selectedPrototype.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <div className={`p-3 rounded-lg text-white inline-flex items-center justify-center ${selectedPrototype.color}`}>
                        {selectedPrototype.icon}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mt-3">{selectedPrototype.title}</h2>
                    </div>
                  </div>
                  <button 
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full text-white transition-colors"
                    onClick={closeModal}
                    aria-label="Close modal"
                  >
                    <HiX className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                {/* About section */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[#800000] mb-4 flex items-center">
                    <HiInformationCircle className="mr-2 h-6 w-6" />
                    About this Prototype
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedPrototype.fullDescription}
                  </p>
                </div>
                
                {/* Features and Technologies */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-[#800000]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Key Features
                    </h4>
                    <ul className="space-y-2 pl-2">
                      {selectedPrototype.features.map((feature, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + idx * 0.05 }}
                          className="flex items-start text-gray-700"
                        >
                          <span className="inline-block h-5 w-5 rounded-full bg-gray-100 flex-shrink-0 mr-2 mt-1 border border-gray-200">
                            <span className="block h-2 w-2 rounded-full bg-[#800000] relative top-[6px] left-[6px]"></span>
                          </span>
                          <span className="leading-tight">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-[#800000]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPrototype.technologies.map((tech, idx) => (
                        <motion.span 
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + idx * 0.05 }}
                          className={`px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-200 flex items-center`}
                        >
                          <span className={`w-2 h-2 rounded-full mr-1.5 ${selectedPrototype.color.replace('bg-gradient-to-br', 'bg')}`}></span>
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                    
                    <h4 className="font-bold text-lg mt-6 mb-3 text-gray-800 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-[#800000]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Key Benefits
                    </h4>
                    <ul className="space-y-2 pl-2">
                      {selectedPrototype.benefits.map((benefit, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + idx * 0.05 }}
                          className="flex items-start text-gray-700"
                        >
                          <svg className="w-5 h-5 mr-2 text-[#800000] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{benefit}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
                
                {/* Demo implementation note */}
                <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
                  <h4 className="font-bold text-base mb-2 text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Implementation Note
                  </h4>
                  <p className="text-gray-600 text-sm">
                    I've created this prototype to demonstrate my technical skills and understanding of PSN Attorneys' needs. The demo showcases the user interface and key interactions, while a full implementation would include backend integration and additional features.
                  </p>
                </div>
                
                {/* Call to action */}
                <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <Link 
                    to={selectedPrototype.path}
                    className="inline-flex items-center justify-center bg-[#800000] text-white py-2 px-6 rounded-lg hover:bg-[#600000] transition-colors duration-300 group font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Launch Live Demo
                    <HiOutlineExternalLink className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Prototype Card Component
const PrototypeCard = ({ prototype, onDetailsClick }) => {
  const { title, description, image, path, icon, color, benefits } = prototype;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 h-full flex flex-col hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="p-4 text-white">
            <div className={`p-2 rounded-lg text-white inline-flex items-center justify-center ${color}`}>
              {icon}
            </div>
            <h3 className="text-xl font-bold mt-2">{title}</h3>
          </div>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="mt-auto">
          <h4 className="font-semibold text-sm text-gray-500 mb-2">KEY BENEFITS:</h4>
          <ul className="space-y-1 mb-5">
            {benefits.map((benefit, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex-shrink-0 mr-2 mt-1">
                  <span className="block h-1.5 w-1.5 rounded-full bg-[#800000] relative top-[5px] left-[5px]"></span>
                </span>
                {benefit}
              </li>
            ))}
          </ul>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onDetailsClick}
              className="flex items-center justify-center bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-300 text-sm font-medium"
            >
              View Details
              <HiInformationCircle className="ml-1 h-4 w-4" />
            </button>
            
            <Link 
              to={path} 
              className="inline-flex items-center group justify-center bg-[#800000] text-white py-2 px-4 rounded-lg hover:bg-[#600000] transition-colors duration-300 text-sm font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
              <HiArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
