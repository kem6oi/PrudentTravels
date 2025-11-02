import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { FaGlobe, FaHeart, FaUsers, FaAward } from 'react-icons/fa';

const About = () => {
  const stats = [
    { value: '10K+', label: 'Happy Travelers' },
    { value: '500+', label: 'Destinations' },
    { value: '50+', label: 'Countries' },
    { value: '4.9', label: 'Average Rating' },
  ];

  const values = [
    {
      icon: FaGlobe,
      title: 'Global Reach',
      description: 'We connect you to amazing destinations across the world',
    },
    {
      icon: FaHeart,
      title: 'Passion for Travel',
      description: 'We love what we do and it shows in our service',
    },
    {
      icon: FaUsers,
      title: 'Community First',
      description: 'Building a community of passionate travelers',
    },
    {
      icon: FaAward,
      title: 'Excellence',
      description: 'Committed to providing the best travel experiences',
    },
  ];

  return (
    <div className="min-h-screen bg-sky-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="container-custom section-padding text-center">
          <h1 className="text-5xl font-bold mb-4">About PrudentTravels</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your trusted partner in creating unforgettable travel experiences around the globe
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom section-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Founded in 2020, PrudentTravels began with a simple mission: to make world-class
                  travel experiences accessible to everyone. What started as a small team of travel
                  enthusiasts has grown into a global platform connecting thousands of travelers
                  with their dream destinations.
                </p>
                <p>
                  We believe that travel is more than just visiting new places—it's about creating
                  memories, experiencing different cultures, and broadening your perspective on life.
                  That's why we carefully curate every destination and ensure the highest standards
                  of service.
                </p>
                <p>
                  Today, we're proud to serve travelers from all walks of life, offering everything
                  from budget-friendly adventures to luxury escapes. Our commitment to excellence
                  and customer satisfaction has made us one of the most trusted names in travel.
                </p>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800"
                alt="Our Team"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container-custom section-padding">
          <h2 className="text-4xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <value.icon className="text-3xl text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container-custom section-padding text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of travelers and discover amazing destinations
          </p>
          <a href="/destinations" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3">
            Explore Destinations
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
