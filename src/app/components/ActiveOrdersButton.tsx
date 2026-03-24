import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/database';
import { motion, AnimatePresence } from 'motion/react';
import { Package, X, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import type { Order } from '../lib/types';

export function ActiveOrdersButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load active orders
  useEffect(() => {
    if (!user) {
      setActiveOrders([]);
      return;
    }

    const loadActiveOrders = () => {
      const allOrders = db.getOrders();
      const userActiveOrders = allOrders.filter(
        order => order.userId === user.id && 
        !['completed', 'cancelled'].includes(order.status)
      );
      setActiveOrders(userActiveOrders);
    };

    loadActiveOrders();

    // Refresh every 10 seconds
    const interval = setInterval(loadActiveOrders, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Don't show on certain pages
  const hiddenPaths = [
    '/order/',
    '/my-orders',
    '/checkout',
    '/sign-in',
    '/sign-up',
    '/admin',
    '/manager',
    '/control-panel',
  ];

  const shouldHide = hiddenPaths.some(path => location.pathname.includes(path));

  if (!user || activeOrders.length === 0 || shouldHide) {
    return null;
  }

  const latestOrder = activeOrders[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-purple-500';
      case 'ready': return 'bg-green-500';
      case 'delivering': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready';
      case 'delivering': return 'Delivering';
      default: return status;
    }
  };

  return (
    <AnimatePresence>
      {!isExpanded ? (
        // Collapsed Button (FAB)
        <motion.button
          key="fab"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-br from-[#667c67] to-[#526250] text-white rounded-full shadow-2xl flex items-center justify-center"
        >
          <div className="relative">
            <Package className="w-6 h-6" />
            {activeOrders.length > 1 && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                {activeOrders.length}
              </div>
            )}
          </div>
          {/* Pulsing animation */}
          <span className="absolute inset-0 rounded-full bg-[#667c67] animate-ping opacity-30" />
        </motion.button>
      ) : (
        // Expanded Card
        <motion.div
          key="card"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border-2 border-[#667c67]/20 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span className="font-bold">Active Orders</span>
                {activeOrders.length > 1 && (
                  <Badge className="bg-white/20 text-white border-0">
                    {activeOrders.length}
                  </Badge>
                )}
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Order Info */}
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-mono font-bold text-sm text-gray-900">
                  #{latestOrder.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {latestOrder.items.length} items • {latestOrder.type}
                </p>
              </div>
              <div className={`${getStatusColor(latestOrder.status)} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                {getStatusText(latestOrder.status)}
              </div>
            </div>

            {/* Items Preview */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-700 line-clamp-2">
                {latestOrder.items.map(item => `${item.quantity}x ${item.menuItem.name}`).join(', ')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigate(`/order/${latestOrder.id}/tracking`);
                  setIsExpanded(false);
                }}
                className="flex-1 bg-gradient-to-r from-[#667c67] to-[#526250] text-white py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
              >
                Track Order
                <ChevronRight className="w-4 h-4" />
              </button>
              {activeOrders.length > 1 && (
                <button
                  onClick={() => {
                    navigate('/my-orders');
                    setIsExpanded(false);
                  }}
                  className="px-4 py-2.5 border-2 border-[#667c67] text-[#667c67] rounded-lg font-semibold text-sm hover:bg-[#667c67]/5 transition-colors"
                >
                  All
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
