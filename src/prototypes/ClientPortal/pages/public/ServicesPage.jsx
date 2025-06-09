import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { HiOutlineArrowRight, HiOutlineScale, HiOutlineHome, HiOutlineOfficeBuilding, HiOutlineBriefcase, HiOutlineDatabase, HiOutlineUserGroup, HiOutlineGlobe } from 'react-icons/hi';

const ServicesPage = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
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
      transition: {
        duration: 0.5
      }
    }
  };

  // Intersection observer refs for sections
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [servicesRef, servicesInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [approachRef, approachInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Main service offerings
  const services = [
    {
      title: "Family Law",
      description: "We handle divorces, child custody arrangements, adoptions, and other family-related legal matters with compassion and understanding.",
      icon: <HiOutlineUserGroup className="h-8 w-8 text-[#800000]" />,
      link: "#"
    },
    {
      title: "Corporate Law",
      description: "Our corporate services include company formations, mergers and acquisitions, shareholder agreements, and corporate governance advice.",
      icon: <HiOutlineOfficeBuilding className="h-8 w-8 text-[#800000]" />,
      link: "#"
    },
    {
      title: "Property Law",
      description: "We assist with property transactions, leases, boundary disputes, and all real estate legal matters.",
      icon: <HiOutlineHome className="h-8 w-8 text-[#800000]" />,
      link: "#"
    },
    {
      title: "Litigation",
      description: "Our experienced litigation team represents clients in court proceedings across a wide range of legal disputes.",
      icon: <HiOutlineScale className="h-8 w-8 text-[#800000]" />,
      link: "#"
    },
    {
      title: "Commercial Law",
      description: "We provide advice on contracts, business transactions, intellectual property rights, and commercial dispute resolution.",
      icon: <HiOutlineBriefcase className="h-8 w-8 text-[#800000]" />,
      link: "#"
    },
    {
      title: "Estate Planning",
      description: "Our estate planning services include wills, trusts, estate administration, and succession planning.",
      icon: <HiOutlineDatabase className="h-8 w-8 text-[#800000]" />,
      link: "#"
    }
  ];

  // Our approach steps
  const approachSteps = [
    {
      title: "Initial Consultation",
      description: "We begin with a thorough consultation to understand your specific legal needs and objectives."
    },
    {
      title: "Custom Strategy",
      description: "Our team develops a tailored legal strategy designed to achieve the best possible outcome for your situation."
    },
    {
      title: "Dedicated Representation",
      description: "You'll have a dedicated attorney who will represent your interests and keep you informed throughout the process."
    },
    {
      title: "Ongoing Support",
      description: "We provide continuous support and guidance, adapting our approach as your case evolves."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero section */}
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
            src="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Legal services"
          />
          <div className="absolute inset-0 bg-[#800000] mix-blend-multiply opacity-70" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Our Legal Services
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-100">
            Comprehensive legal solutions tailored to your specific needs, delivered with expertise and dedication.
          </p>
        </div>
      </motion.div>

      {/* Services grid section */}
      <motion.div 
        ref={servicesRef}
        initial="hidden"
        animate={servicesInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemFadeIn} className="text-center">
            <h2 className="text-base text-[#800000] font-semibold tracking-wide uppercase">Expertise Areas</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Comprehensive Legal Services
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our team of specialized attorneys provides a wide range of legal services to meet your personal and business needs.
            </p>
          </motion.div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <motion.div 
                  key={index} 
                  variants={itemFadeIn}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-xl border border-gray-100"
                >
                  <div className="px-6 py-8">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-100 text-white">
                          {service.icon}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{service.title}</h3>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-base text-gray-500">{service.description}</p>
                    </div>
                    <div className="mt-6">
                      <a 
                        href="#"
                        className="inline-flex items-center text-[#800000] hover:text-[#600000] transition-colors duration-300"
                        onClick={(e) => e.preventDefault()}
                      >
                        Learn more
                        <HiOutlineArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Our approach section */}
      <motion.div 
        ref={approachRef}
        initial="hidden"
        animate={approachInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemFadeIn} className="text-center">
            <h2 className="text-base text-[#800000] font-semibold tracking-wide uppercase">Our Approach</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How We Work With You
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We believe in a client-centered approach that prioritizes your needs and objectives.
            </p>
          </motion.div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {approachSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  variants={itemFadeIn}
                  className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-lg p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#800000]/10 text-[#800000] mx-auto mb-4">
                    <span className="text-xl font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 text-center mb-2">{step.title}</h3>
                  <p className="text-base text-gray-500 text-center">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Global services section */}
      <motion.div 
        initial="hidden"
        animate={servicesInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <motion.div variants={itemFadeIn}>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                International Legal Services
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Our firm also offers international legal services, helping clients navigate complex cross-border matters with confidence.
              </p>
              <div className="mt-8 sm:flex">
                <div className="rounded-md shadow">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] transition-colors duration-300"
                  >
                    Learn more
                    <HiOutlineGlobe className="ml-2 h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>
            <motion.div 
              variants={itemFadeIn}
              className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2"
            >
              <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                <p className="text-gray-500 font-medium">Europe</p>
              </div>
              <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                <p className="text-gray-500 font-medium">Asia Pacific</p>
              </div>
              <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                <p className="text-gray-500 font-medium">North America</p>
              </div>
              <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                <p className="text-gray-500 font-medium">Africa</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* CTA section */}
      <motion.div 
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="bg-[#800000]"
      >
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-gray-200">Contact us today for a consultation.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/client-portal/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#800000] bg-white hover:bg-gray-50 transition-colors duration-300"
              >
                Contact Us
                <HiOutlineArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServicesPage;