import React, { useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

/**
 * Alert component for displaying messages
 */
const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  autoClose = false, 
  duration = 5000,
  className = '' 
}) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const types = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
      titleColor: 'text-green-800',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: <XCircleIcon className="h-5 w-5 text-red-600" />,
      titleColor: 'text-red-800',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: <ExclamationCircleIcon className="h-5 w-5 text-yellow-600" />,
      titleColor: 'text-yellow-800',
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <InformationCircleIcon className="h-5 w-5 text-blue-600" />,
      titleColor: 'text-blue-800',
    },
  };

  const config = types[type] || types.info;

  return (
    <div className={`rounded-lg border p-4 ${config.container} ${className}`} role="alert">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{config.icon}</div>
        
        <div className="flex-1">
          {title && (
            <h3 className={`font-semibold mb-1 ${config.titleColor}`}>
              {title}
            </h3>
          )}
          {message && (
            <div className="text-sm">
              {typeof message === 'string' ? (
                <p>{message}</p>
              ) : (
                message
              )}
            </div>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close alert"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Inline alert variant
 */
export const InlineAlert = ({ type = 'info', message, className = '' }) => {
  const types = {
    success: 'text-green-600 bg-green-50',
    error: 'text-red-600 bg-red-50',
    warning: 'text-yellow-600 bg-yellow-50',
    info: 'text-blue-600 bg-blue-50',
  };

  return (
    <div className={`text-sm p-2 rounded ${types[type]} ${className}`}>
      {message}
    </div>
  );
};

/**
 * Banner alert for full-width notifications
 */
export const BannerAlert = ({ type = 'info', message, onClose, className = '' }) => {
  const types = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-600 text-white',
  };

  return (
    <div className={`${types[type]} ${className}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{message}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-4 text-white hover:text-gray-200 transition-colors"
              aria-label="Close banner"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;
