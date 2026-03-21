import { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const retry = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
        >
          <div className="p-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`mx-auto max-w-md rounded-xl shadow-2xl pointer-events-auto ${
                isOnline
                  ? 'bg-success text-white'
                  : 'bg-destructive text-white'
              }`}
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={isOnline ? {} : { rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    {isOnline ? (
                      <Wifi className="w-6 h-6" />
                    ) : (
                      <WifiOff className="w-6 h-6" />
                    )}
                  </motion.div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">
                      {isOnline ? 'Back Online!' : 'You are offline'}
                    </h4>
                    <p className="text-xs opacity-90 mt-0.5">
                      {isOnline
                        ? 'Your connection has been restored'
                        : 'Your order will sync when connection is restored'}
                    </p>
                  </div>

                  {!isOnline && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={retry}
                      className="flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Persistent indicator when offline */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-20 right-4 z-40"
        >
          <Badge
            variant="destructive"
            className="shadow-lg flex items-center gap-2 py-2 px-3"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <WifiOff className="w-4 h-4" />
            </motion.div>
            <span className="text-xs font-medium">Offline</span>
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
