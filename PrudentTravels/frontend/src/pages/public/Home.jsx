import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  useEffect(() => {
    fetchFeaturedDestinations();
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
    <div className="min-h-screen bg-sky-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
        </div>

        <div className="relative z-10 container-custom section-padding py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-center lg:text-left space-y-6"
            >
              <span className="inline-flex items-center px-4 py-2 text-sm font-semibold bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                Seamless access for travelers & admins
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                Discover Your Next Adventure
              </h1>
              <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto lg:mx-0">
                Explore breathtaking destinations around the world and manage every journey from a single login.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link to="/destinations" className="btn-primary text-lg px-8 py-4">
                  Explore Destinations
                  <FaArrowRight className="ml-2 inline" />
                </Link>
                <Link
                  to="/register"
                  className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4"
                >
                  Create Traveler Account
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="w-full max-w-md mx-auto lg:mx-0"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                      Portal Login
                    </p>
                    <p className="text-sm text-gray-600">
                      Travelers, admins and support teams sign in below
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {['Traveler', 'Admin', 'Support'].map((role) => (
                      <span
                        key={role}
                        className="px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-primary-50 text-primary-700 rounded-full"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <LoginForm />
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
