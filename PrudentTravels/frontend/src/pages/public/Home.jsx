import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { HiShieldCheck, HiCurrencyDollar, HiUserGroup } from 'react-icons/hi';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import DestinationGrid from '../../components/destination/DestinationGrid';
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
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
        </div>

        <div className="relative z-10 container-custom section-padding text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display font-bold mb-6"
          >
            Discover Your Next Adventure
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
          >
            Explore breathtaking destinations around the world with PrudentTravels
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/destinations" className="btn-primary text-lg px-8 py-4">
              Explore Destinations
              <FaArrowRight className="ml-2 inline" />
            </Link>
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
              Get Started
            </Link>
          </motion.div>
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
