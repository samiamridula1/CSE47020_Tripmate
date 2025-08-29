import { useState, useEffect } from 'react';

let notificationId = 0;

// Global notification manager
const NotificationManager = {
  listeners: [],
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  },
  emit(notification) {
    this.listeners.forEach(listener => listener(notification));
  },
  show(message, type = 'info', duration = 3000) {
    const id = ++notificationId;
    this.emit({
      id,
      message,
      type,
      duration,
      timestamp: Date.now()
    });
    return id;
  },
  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  },
  error(message, duration = 4000) {
    return this.show(message, 'error', duration);
  },
  warning(message, duration = 3500) {
    return this.show(message, 'warning', duration);
  },
  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }
};

// Individual notification component
function NotificationItem({ notification, onRemove }) {
  const { id, message, type, duration } = notification;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onRemove]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-600';
      case 'error':
        return 'bg-red-500 text-white border-red-600';
      case 'warning':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'info':
      default:
        return 'bg-blue-500 text-white border-blue-600';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={`
      flex items-center p-4 mb-3 rounded-lg shadow-lg border-l-4 
      transform transition-all duration-300 ease-in-out
      animate-slideInRight max-w-sm
      ${getTypeStyles()}
    `}>
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium break-words">{message}</p>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 ml-3 hover:opacity-70 transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Main notification container component
export function NotificationContainer() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = NotificationManager.subscribe((notification) => {
      setNotifications(prev => [...prev, notification]);
    });

    return unsubscribe;
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
}

// Hook for using notifications in components
export function useNotification() {
  return {
    showSuccess: (message, duration) => NotificationManager.success(message, duration),
    showError: (message, duration) => NotificationManager.error(message, duration),
    showWarning: (message, duration) => NotificationManager.warning(message, duration),
    showInfo: (message, duration) => NotificationManager.info(message, duration),
    show: (message, type, duration) => NotificationManager.show(message, type, duration)
  };
}

// Export the manager for direct access
export { NotificationManager };

// CSS for animations (to be added to main CSS file)
export const notificationStyles = `
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slideInRight {
  animation: slideInRight 0.3s ease-out;
}
`;
