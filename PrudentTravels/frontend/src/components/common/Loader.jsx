import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobe } from 'react-icons/fa';

const Loader = ({ size = 'medium', fullScreen = false, text = 'Loading...' }) => {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizes[size]} text-primary-600`}
      >
        <FaGlobe className="w-full h-full" />
      </motion.div>
      {text && (
        <p className="mt-4 text-gray-600 text-sm font-medium">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
        <LoaderContent />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <LoaderContent />
    </div>
  );
};

export default Loader;
