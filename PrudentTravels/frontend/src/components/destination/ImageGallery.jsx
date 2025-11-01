import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const ImageGallery = ({ images = [], title = 'Gallery' }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openLightbox = (index) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 gap-2 h-96">
        {/* Main Image */}
        <div
          className="col-span-2 row-span-2 relative rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <img
            src={images[0]}
            alt={`${title} - Main`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>

        {/* Secondary Images */}
        {images.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(index + 1)}
          >
            <img
              src={image}
              alt={`${title} - ${index + 2}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
            
            {/* Show more overlay on last image */}
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  +{images.length - 5} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <HiX className="w-8 h-8" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
              {selectedIndex + 1} / {images.length}
            </div>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors"
              >
                <HiChevronLeft className="w-12 h-12" />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={images[selectedIndex]}
              alt={`${title} - ${selectedIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={goToNext}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors"
              >
                <HiChevronRight className="w-12 h-12" />
              </button>
            )}

            {/* Thumbnails */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto max-w-screen-lg px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedIndex
                      ? 'border-primary-500'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;
