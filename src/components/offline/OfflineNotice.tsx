import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineNotice = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (!online) {
        setShowNotice(true);
      } else if (showNotice) {
        // Show reconnection message briefly
        setTimeout(() => setShowNotice(false), 3000);
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [showNotice]);

  if (!showNotice) return null;

  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-lg transition-all duration-300 ${
      isOnline 
        ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
        : 'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700'
    }`}>
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
          isOnline ? 'bg-green-500' : 'bg-yellow-500'
        }`}>
          {isOnline ? (
            <Wifi className="h-4 w-4 text-white" />
          ) : (
            <WifiOff className="h-4 w-4 text-white" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium">
            {isOnline ? 'Back online!' : 'You are currently offline'}
          </p>
          <p className="text-xs opacity-75">
            {isOnline ? 'All features are available' : 'Some features may be limited'}
          </p>
        </div>
      </div>
    </div>
  );
};