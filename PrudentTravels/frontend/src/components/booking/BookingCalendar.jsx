import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import 'react-datepicker/dist/react-datepicker.css';

const BookingCalendar = ({ 
  selectedDates = [], 
  onDateSelect, 
  blockedDates = [],
  minDate = new Date(),
  maxDate,
  selectsRange = false
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const isDateBlocked = (date) => {
    return blockedDates.some(blocked => 
      date.toDateString() === new Date(blocked).toDateString()
    );
  };

  const handleMonthChange = (increment) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => handleMonthChange(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        
        <h3 className="text-lg font-semibold text-gray-900">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        
        <button
          type="button"
          onClick={() => handleMonthChange(1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Date Picker */}
      <DatePicker
        selected={selectsRange ? selectedDates[0] : selectedDates[0]}
        onChange={onDateSelect}
        startDate={selectsRange ? selectedDates[0] : null}
        endDate={selectsRange ? selectedDates[1] : null}
        selectsRange={selectsRange}
        inline
        minDate={minDate}
        maxDate={maxDate}
        monthsShown={1}
        calendarStartDay={0}
        filterDate={(date) => !isDateBlocked(date)}
        dayClassName={(date) => {
          if (isDateBlocked(date)) {
            return 'blocked-date';
          }
          return '';
        }}
      />

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-gray-600">Unavailable</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 border-2 border-blue-600 rounded"></div>
          <span className="text-gray-600">Today</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
