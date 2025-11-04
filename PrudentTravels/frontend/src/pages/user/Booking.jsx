import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import BookingForm from '../../components/booking/BookingForm';
import BookingSummary from '../../components/booking/BookingSummary';
import BookingCalendar from '../../components/booking/BookingCalendar';
import Loader from '../../components/common/Loader';
import api, { apiEndpoints } from '../../services/api';
import toast from 'react-hot-toast';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    checkInDate: null,
    checkOutDate: null,
    adults: 1,
    children: 0,
    infants: 0,
    promoCode: '',
    promoDiscount: 0,
  });
  const [currentStep, setCurrentStep] = useState(1); // 1: Dates, 2: Details, 3: Payment

  useEffect(() => {
    fetchDestination();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchDestination = async () => {
    try {
      const response = await api.get(apiEndpoints.destinations.getOne(id));
      setDestination(response.data.data);
    } catch (error) {
      console.error('Error fetching destination:', error);
      toast.error('Failed to load destination');
      navigate('/destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (checkIn, checkOut) => {
    setBookingData({
      ...bookingData,
      checkInDate: checkIn,
      checkOutDate: checkOut,
    });
    setCurrentStep(2);
  };

  const handleBookingSubmit = async (formData) => {
    const fullBookingData = {
      ...bookingData,
      ...formData,
      destinationId: id,
      userId: user?.id,
    };

    try {
      const response = await api.post(apiEndpoints.bookings.create, fullBookingData);

      if (response.data.success) {
        toast.success('Booking created successfully!');
        navigate(`/user/bookings`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <Loader fullScreen />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-custom section-padding py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Destination Not Found</h2>
          <button onClick={() => navigate('/destinations')} className="btn-primary">
            Back to Destinations
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50">
      <Header />

      <div className="container-custom section-padding py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Select Dates</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Booking Details</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${currentStep >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {currentStep === 1 && 'Select Your Dates'}
                {currentStep === 2 && 'Booking Details'}
              </h2>

              {currentStep === 1 && (
                <div>
                  <BookingCalendar
                    destination={destination}
                    onDateSelect={handleDateSelect}
                  />
                  {bookingData.checkInDate && bookingData.checkOutDate && (
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="mt-6 w-full btn-primary py-3"
                    >
                      Continue to Details
                    </button>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="mb-4 text-primary-600 hover:text-primary-700 flex items-center gap-2"
                  >
                    ← Back to Dates
                  </button>
                  <BookingForm
                    destination={destination}
                    onSubmit={handleBookingSubmit}
                    initialData={{
                      firstName: user?.firstName || '',
                      lastName: user?.lastName || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <BookingSummary
              booking={bookingData}
              destination={destination}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;
