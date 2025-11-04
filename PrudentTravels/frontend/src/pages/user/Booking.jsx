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

  // Debug: Log bookingData changes
  useEffect(() => {
    console.log('[Booking] bookingData updated:', bookingData);
  }, [bookingData]);

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
    console.log('[Booking] Date selected:', { checkIn, checkOut });

    setBookingData({
      ...bookingData,
      checkInDate: checkIn,
      checkOutDate: checkOut,
    });

    // Only advance to step 2 if BOTH dates are selected
    if (checkIn && checkOut) {
      console.log('[Booking] Both dates selected, advancing to step 2');
      setCurrentStep(2);
    }
  };

  // Helper function to safely format date to YYYY-MM-DD using local timezone
  const formatDateToYYYYMMDD = (date) => {
    if (!date) return null;

    // If it's already a string in the right format, return it
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    // Convert to Date object if needed
    const dateObj = date instanceof Date ? date : new Date(date);

    // Validate the date
    if (isNaN(dateObj.getTime())) {
      console.error('[Booking] Invalid date:', date);
      return null;
    }

    // Format using local timezone (not UTC) to avoid date shifting
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleBookingSubmit = async (formData) => {
    // Validate dates are selected
    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      setCurrentStep(1);
      return;
    }

    // Format dates safely
    const checkInDateFormatted = formatDateToYYYYMMDD(bookingData.checkInDate);
    const checkOutDateFormatted = formatDateToYYYYMMDD(bookingData.checkOutDate);

    // Validate formatted dates
    if (!checkInDateFormatted || !checkOutDateFormatted) {
      toast.error('Invalid dates selected. Please try again.');
      setCurrentStep(1);
      return;
    }

    console.log('[Booking] Formatted dates:', {
      checkIn: {
        original: bookingData.checkInDate,
        formatted: checkInDateFormatted
      },
      checkOut: {
        original: bookingData.checkOutDate,
        formatted: checkOutDateFormatted
      }
    });

    const fullBookingData = {
      // Use destination.id (UUID) not the route param id (slug)
      destinationId: destination.id,
      // Dates in YYYY-MM-DD format for DATEONLY type
      checkInDate: checkInDateFormatted,
      checkOutDate: checkOutDateFormatted,
      // Ensure guest counts are integers
      adults: parseInt(formData.adults) || 1,
      children: parseInt(formData.children) || 0,
      infants: parseInt(formData.infants) || 0,
      // Contact information
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      specialRequests: formData.specialRequests || '',
      promoCode: formData.promoCode || '',
    };

    console.log('[Booking] Submitting booking data:', fullBookingData);

    try {
      const response = await api.post(apiEndpoints.bookings.create, fullBookingData);

      if (response.data.success) {
        toast.success('Booking created successfully!');
        navigate(`/user/bookings`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      // Log detailed validation errors if available
      if (error.response?.data?.errors) {
        console.error('Validation errors:', JSON.stringify(error.response.data.errors, null, 2));
      }

      // Extract detailed error message
      let errorMessage = 'Failed to create booking';

      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Show the first validation error in detail
        const firstError = error.response.data.errors[0];
        if (typeof firstError === 'string') {
          errorMessage = firstError;
        } else if (firstError?.message) {
          errorMessage = firstError.message;
        } else if (firstError?.msg) {
          errorMessage = firstError.msg;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error(errorMessage);
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

                  {/* Debug info */}
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <p className="font-semibold">Debug Info:</p>
                    <p>Check-in: {bookingData.checkInDate ? bookingData.checkInDate.toString() : 'Not selected'}</p>
                    <p>Check-out: {bookingData.checkOutDate ? bookingData.checkOutDate.toString() : 'Not selected'}</p>
                    <p>Both dates selected: {(bookingData.checkInDate && bookingData.checkOutDate) ? 'YES' : 'NO'}</p>
                  </div>

                  {bookingData.checkInDate && bookingData.checkOutDate ? (
                    <button
                      onClick={() => {
                        console.log('[Booking] Continue button clicked');
                        setCurrentStep(2);
                      }}
                      className="mt-6 w-full btn-primary py-3"
                    >
                      Continue to Details
                    </button>
                  ) : (
                    <div className="mt-6 p-4 bg-gray-100 rounded text-center text-gray-600">
                      Please select both check-in and check-out dates to continue
                    </div>
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
