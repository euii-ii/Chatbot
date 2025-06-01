import toast from 'react-hot-toast';

// Custom toast utility with fallbacks for different methods
export const showToast = {
  success: (message) => {
    try {
      return toast.success(message);
    } catch (error) {
      console.error('Toast success error:', error);
      return toast(message, { icon: '✅' });
    }
  },

  error: (message) => {
    try {
      return toast.error(message);
    } catch (error) {
      console.error('Toast error error:', error);
      return toast(message, { icon: '❌' });
    }
  },

  info: (message) => {
    try {
      // Try toast.info first
      if (typeof toast.info === 'function') {
        return toast.info(message);
      }
      // Fallback to custom styled toast
      return toast(message, {
        icon: 'ℹ️',
        style: {
          borderRadius: '10px',
          background: '#3b82f6',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('Toast info error:', error);
      return toast(message, { icon: 'ℹ️' });
    }
  },

  loading: (message) => {
    try {
      return toast.loading(message);
    } catch (error) {
      console.error('Toast loading error:', error);
      return toast(message, { icon: '⏳' });
    }
  },

  regenerate: (message = 'Regenerating response...') => {
    return toast(message, {
      icon: '🔄',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        border: '1px solid #555',
      },
      duration: 2000,
    });
  },

  custom: (message, options = {}) => {
    return toast(message, options);
  }
};

export default showToast;
