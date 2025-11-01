import React from 'react';
import { motion } from 'framer-motion';
import { HiX, HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiExclamation } from 'react-icons/hi';

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  dismissible = true,
  className = '' 
}) => {
  const alertStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: HiCheckCircle,
      iconColor: 'text-green-400',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: HiExclamationCircle,
      iconColor: 'text-red-400',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: HiExclamation,
      iconColor: 'text-yellow-400',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: HiInformationCircle,
      iconColor: 'text-blue-400',
    },
  };

  const style = alertStyles[type] || alertStyles.info;
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${style.bg} ${style.border} ${style.text} border rounded-lg p-4 ${className}`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${style.iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          {message && (
            <div className="text-sm">{message}</div>
          )}
        </div>
        {dismissible && onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.text} hover:bg-opacity-20`}
            >
              <HiX className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Alert;
