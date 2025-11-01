import React, { useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SearchBar = ({ onSearch, className = '' }) => {
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: null,
    checkOut: null,
    guests: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(searchData);
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Destination */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Where to?"
              value={searchData.destination}
              onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Check-in Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <DatePicker
              selected={searchData.checkIn}
              onChange={(date) => setSearchData({ ...searchData, checkIn: date })}
              minDate={new Date()}
              placeholderText="Select date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <DatePicker
              selected={searchData.checkOut}
              onChange={(date) => setSearchData({ ...searchData, checkOut: date })}
              minDate={searchData.checkIn || new Date()}
              placeholderText="Select date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
          <div className="relative">
            <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              min="1"
              value={searchData.guests}
              onChange={(e) => setSearchData({ ...searchData, guests: parseInt(e.target.value) })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full md:w-auto mt-4 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        <span>Search</span>
      </button>
    </form>
  );
};

export default SearchBar;
