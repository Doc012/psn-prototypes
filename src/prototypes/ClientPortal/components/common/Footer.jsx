import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineHome } from 'react-icons/hi';
import logoImage from '../../../../assets/PSN-removebg-preview.png';

const Footer = () => {
  return (
      <footer className="bg-gray-900 text-white">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company info and logo */}
            <div className="space-y-4">
              <img src={logoImage} alt="PSN Attorneys" className="h-10 w-auto" />
              <p className="text-gray-300 text-sm">
                PSN Attorneys is committed to providing exceptional legal services with integrity, 
                professionalism, and personalized attention to each client's needs.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-300">About Us</Link>
                </li>
                <li>
                  <Link to="/practice-areas" className="text-gray-300 hover:text-white transition-colors duration-300">Practice Areas</Link>
                </li>
                <li>
                  <Link to="/attorneys" className="text-gray-300 hover:text-white transition-colors duration-300">Our Attorneys</Link>
                </li>
                <li>
                  <Link to="/resources" className="text-gray-300 hover:text-white transition-colors duration-300">Legal Resources</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">Contact Us</Link>
                </li>
                <li>
                  <a href="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                    <HiOutlineHome className="h-4 w-4 mr-1" />
                    Return to Main App
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Portal Links */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Client Portal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors duration-300">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-300 hover:text-white transition-colors duration-300">Register</Link>
                </li>
                <li>
                  <Link to="/forgot-password" className="text-gray-300 hover:text-white transition-colors duration-300">Reset Password</Link>
                </li>
                <li>
                  <Link to="/portal-guide" className="text-gray-300 hover:text-white transition-colors duration-300">Portal Guide</Link>
                </li>
                <li>
                  <Link to="/security" className="text-gray-300 hover:text-white transition-colors duration-300">Security Information</Link>
                </li>
              </ul>
            </div>
            
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Contact Us</h3>
              <address className="not-italic text-gray-300">
                <p className="flex items-start mb-2">
                  <svg className="h-5 w-5 mr-2 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    PSN Chambers, cnr Louis Trichardt Boulevard,<br />
                    President Hoffman St, &, Vanderbijlpark
                  </span>
                </p>
                <p className="flex items-center mb-2">
                  <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (555) 123-4567
                </p>
                <p className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@psnattorneys.com
                </p>
                <p className="mt-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mon-Fri: 9AM-5PM
                </p>
              </address>
            </div>
          </div>
        </div>
        
        {/* Bottom footer with copyright and terms */}
        <div className="bg-gray-950 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-sm text-gray-400">
              &copy; {new Date().getFullYear()} PSN Attorneys. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <Link to="/terms" className="hover:text-white transition-colors duration-300">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
              <Link to="/disclaimer" className="hover:text-white transition-colors duration-300">Legal Disclaimer</Link>
              <a href="/" className="hover:text-white transition-colors duration-300 flex items-center">
                <HiOutlineHome className="h-4 w-4 mr-1" />
                Main App
              </a>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;