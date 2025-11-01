import React, { useState } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const ImageGallery = ({ images = [] }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyPress = (e) => {
    if (selectedImageIndex === null) return;
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') closeLightbox();
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedImageIndex]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  // Single image
  if (images.length === 1) {
    return (
      <div className="relative rounded-lg overflow-hidden">
        <img
          src={images[0]}
          alt="Destination"
          className="w-full h-96 object-cover cursor-pointer"
          onClick={() => openLightbox(0)}
        />
      </div>
    );
  }

  // Multiple images grid
  const mainImage = images[0];
  const sideImages = images.slice(1, 5);

  return (
    <>
      <div className="grid grid-cols-4 gap-2 rounded-lg overflow-hidden h-96">
        {/* Main Image */}
        <div className="col-span-2 row-span-2 relative group cursor-pointer" onClick={() => openLightbox(0)}>
          <img src={mainImage} alt="Main" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
        </div>

        {/* Side Images */}
        {sideImages.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => openLightbox(index + 1)}
          >
            <img src={image} alt={`View ${index + 2}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
            
            {/* Show More Button on last image */}
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  +{images.length - 5} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <ChevronLeftIcon className="h-8 w-8" />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={selectedImageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={images[selectedImageIndex]}
              alt={`View ${selectedImageIndex + 1}`}
              className="max-w-7xl max-h-screen object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <ChevronRightIcon className="h-8 w-8" />
              </button>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;
