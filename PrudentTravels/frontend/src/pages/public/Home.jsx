import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../../components/auth/LoginForm';

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Beautiful travel-themed background images
  const backgroundImages = [
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80', // Mountain road
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80', // Beach sunset
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', // Mountain lake
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80', // City skyline
    'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1920&q=80', // Northern lights
  ];

  useEffect(() => {
    // Change background image every 5 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Full Screen Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="fixed inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Minimal Brand/Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center lg:text-left space-y-4"
          >
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-white text-shadow-xl">
              PrudentTravels
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-light tracking-wide">
              Your journey begins here
            </p>
          </motion.div>

          {/* Transparent Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <LoginForm transparent={true} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slideshow Indicators */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentImageIndex
                ? 'w-8 bg-white'
                : 'w-1.5 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
