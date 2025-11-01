import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, isBefore, startOfDay } from 'date-fns';

const BookingCalendar = ({ 
  onDateSelect, 
  selectedStartDate, 
  selectedEndDate,
  minNights = 1,
  availableDates = [],
  unavailableDates = [] 
}) => {
  const [startDate, setStartDate] = useState(selectedStartDate || null);
  const [endDate, setEndDate] = useState(selectedEndDate || null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    // Reset end date if it's before the new start date
    if (endDate && isBefore(endDate, date)) {
      setEndDate(null);
      onDateSelect?.(date, null);
    } else {
      onDateSelect?.(date, endDate);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onDateSelect?.(startDate, date);
  };

  // Check if a date is available
  const isDateAvailable = (date) => {
    const dateStr = startOfDay(date).toISOString();
    
    // Check if date is in unavailable dates
    if (unavailableDates.some(d => startOfDay(new Date(d)).toISOString() === dateStr)) {
      return false;
    }

    // If available dates are specified, check if date is in the list
    if (availableDates.length > 0) {
      return availableDates.some(d => startOfDay(new Date(d)).toISOString() === dateStr);
    }

    return true;
  };

  // Filter dates that can be selected
  const filterDate = (date) => {
    // Disable past dates
    if (isBefore(date, startOfDay(new Date()))) {
      return false;
    }

    return isDateAvailable(date);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Date */}
        <div>
          <label className="label">Check-in Date *</label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            filterDate={filterDate}
            placeholderText="Select check-in date"
            className="input-field w-full"
            dateFormat="MMM dd, yyyy"
            inline
          />
        </div>

        {/* End Date */}
        <div>
          <label className="label">Check-out Date *</label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate ? addDays(startDate, minNights) : new Date()}
            filterDate={filterDate}
            placeholderText="Select check-out date"
            className="input-field w-full"
            dateFormat="MMM dd, yyyy"
            inline
            disabled={!startDate}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary-600 rounded"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span className="text-gray-600">Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary-600 rounded"></div>
          <span className="text-gray-600">Available</span>
        </div>
      </div>

      {/* Selected Dates Display */}
      {startDate && endDate && (
        <div className="bg-primary-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Selected Dates</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Check-in</p>
              <p className="font-medium">{startDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</p>
            </div>
            <div>
              <p className="text-gray-600">Check-out</p>
              <p className="font-medium">{endDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Total: {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} nights
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
