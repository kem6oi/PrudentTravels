import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { HiShieldCheck, HiCurrencyDollar, HiUserGroup } from 'react-icons/hi';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import DestinationGrid from '../../components/destination/DestinationGrid';
import LoginForm from '../../components/auth/LoginForm';
import api, { apiEndpoints } from '../../services/api';

const Home = () => {
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Beautiful travel-themed background images
  const backgroundImages = [
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80', // Mountain road
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80', // Beach sunset
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', // Mountain lake
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80', // City skyline
    'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1920&q=80', // Northern lights
  ];

  useEffect(() => {
    fetchFeaturedDestinations();

    // Change background image every 5 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFeaturedDestinations = async () => {
    try {
      const response = await api.get(apiEndpoints.destinations.featured);
      setFeaturedDestinations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching featured destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: HiShieldCheck,
      title: 'Safe & Secure',
      description: 'Your safety is our priority with verified destinations',
    },
    {
      icon: HiCurrencyDollar,
      title: 'Best Prices',
      description: 'Get the best deals with our price match guarantee',
    },
    {
      icon: HiUserGroup,
      title: '24/7 Support',
      description: 'Our team is always here to help you',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Header />

      {/* Hero Section with Slideshow Background */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Slideshow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60"></div>
          </motion.div>
        </AnimatePresence>

        {/* Slideshow Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="relative z-10 container-custom section-padding py-16 lg:py-24 w-full">
          <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] items-center">
            {/* Left Side - Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white text-center lg:text-left space-y-6"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-5 py-2.5 text-sm font-semibold bg-white/10 rounded-full backdrop-blur-md border border-white/20 shadow-lg"
              >
                Your Gateway to Extraordinary Journeys
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-display font-bold leading-tight tracking-tight"
              >
                Discover Your Next
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400">
                  Adventure
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Explore breathtaking destinations, create unforgettable memories, and embark on journeys that inspire.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-4"
              >
                <Link
                  to="/destinations"
                  className="group btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Explore Destinations
                  <FaArrowRight className="ml-2 inline group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="btn bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4 shadow-xl transition-all duration-300"
                >
                  Start Your Journey
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Side - Transparent Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="w-full max-w-md mx-auto lg:mx-0"
            >
              <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
                <div className="mb-6">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg font-bold text-white mb-2 tracking-wide"
                  >
                    Welcome Back
                  </motion.p>
                  <p className="text-sm text-white/80">
                    Sign in to continue your adventure
                  </p>
                </div>
                <LoginForm transparent={true} />
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-xs text-center text-white/70 mb-3">
                    Multiple access levels
                  </p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {['Traveler', 'Admin', 'Support'].map((role) => (
                      <span
                        key={role}
                        className="px-3 py-1 text-xs font-semibold bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <feature.icon className="text-3xl text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="py-16">
        <div className="container-custom section-padding">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Destinations</h2>
            <p className="text-xl text-gray-600">
              Handpicked destinations for your perfect getaway
            </p>
          </div>

          <DestinationGrid
            destinations={featuredDestinations.slice(0, 6)}
            loading={loading}
            columns={3}
          />

          <div className="text-center mt-8">
            <Link to="/destinations" className="btn-outline px-8 py-3">
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container-custom section-padding text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust PrudentTravels for their adventures
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3">
              Sign Up Now
            </Link>
            <Link to="/login" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3">
              Login
            </Link>
            <Link to="/destinations" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3">
              Browse Destinations
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
