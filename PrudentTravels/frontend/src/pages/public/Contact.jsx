import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import toast from 'react-hot-toast';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const contactInfo = [
    {
      icon: HiLocationMarker,
      title: 'Visit Us',
      details: ['123 Travel Street, Suite 100', 'New York, NY 10001'],
    },
    {
      icon: HiPhone,
      title: 'Call Us',
      details: ['+1 (234) 567-890', 'Mon-Fri 9am-6pm EST'],
    },
    {
      icon: HiMail,
      title: 'Email Us',
      details: ['info@prudenttravels.com', 'support@prudenttravels.com'],
    },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="container-custom section-padding text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <info.icon className="text-3xl text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600">
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Contact Form & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card p-8">
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="label">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      {...register('firstName', {
                        required: 'First name is required',
                      })}
                      className="input-field"
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="error-text">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="label">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      {...register('lastName', {
                        required: 'Last name is required',
                      })}
                      className="input-field"
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="error-text">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="label">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className="input-field"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="error-text">{errors.email.message}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="label">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    type="text"
                    {...register('subject', {
                      required: 'Subject is required',
                    })}
                    className="input-field"
                    placeholder="How can we help?"
                  />
                  {errors.subject && (
                    <p className="error-text">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="label">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    {...register('message', {
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'Message must be at least 10 characters',
                      },
                    })}
                    className="input-field resize-none"
                    placeholder="Tell us more..."
                  />
                  {errors.message && (
                    <p className="error-text">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Map & Social */}
            <div className="space-y-6">
              {/* Map Placeholder */}
              <div className="card p-8 h-96 flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Map View</p>
              </div>

              {/* Social Links */}
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="text-xl" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
