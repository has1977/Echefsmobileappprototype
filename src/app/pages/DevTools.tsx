import { useState } from 'react';
import { useNavigate } from 'react-router';
import { db } from '../lib/database';
import { toast } from 'sonner';
import { ArrowLeft, Database, RefreshCw, Trash2, CheckCircle } from 'lucide-react';
import { GlassCard } from '../design-system';
import { Button } from '../design-system';

/**
 * Developer Tools Page
 * This page provides utilities for managing sample data
 * Useful during development and testing
 */
export function DevTools() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRefreshOrders = async () => {
    if (!confirm('⚠️ This will replace all existing orders with fresh sample data. Continue?')) {
      return;
    }

    setLoading(true);
    try {
      db.refreshSampleOrders();
      toast.success('Sample orders refreshed successfully! 🎉');
    } catch (error) {
      toast.error('Failed to refresh orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearOrders = async () => {
    if (!confirm('⚠️ This will delete ALL orders permanently. Continue?')) {
      return;
    }

    setLoading(true);
    try {
      db.clearOrders();
      toast.success('All orders cleared!');
    } catch (error) {
      toast.error('Failed to clear orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeOrders = async () => {
    setLoading(true);
    try {
      db.initializeSampleOrders();
      toast.success('Sample orders initialized!');
    } catch (error) {
      toast.error('Failed to initialize orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentOrders = db.getOrders();
  const dineInOrders = currentOrders.filter(o => o.type === 'dine-in');
  const takeawayOrders = currentOrders.filter(o => o.type === 'takeaway');
  const deliveryOrders = currentOrders.filter(o => o.type === 'delivery');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#FBF8F4] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-5 pb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Developer Tools</h1>
            <p className="text-sm text-white/80 mt-1">Manage sample data & testing</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Current Data Stats */}
        <GlassCard variant="elevated" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1F2933]">Current Database</h2>
              <p className="text-sm text-gray-600">Orders in database</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
              <div className="text-3xl font-bold text-purple-700">{currentOrders.length}</div>
              <div className="text-sm text-purple-600 mt-1">Total Orders</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
              <div className="text-3xl font-bold text-blue-700">{dineInOrders.length}</div>
              <div className="text-sm text-blue-600 mt-1">Dine-in</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
              <div className="text-3xl font-bold text-green-700">{takeawayOrders.length}</div>
              <div className="text-sm text-green-600 mt-1">Takeaway</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
              <div className="text-3xl font-bold text-orange-700">{deliveryOrders.length}</div>
              <div className="text-sm text-orange-600 mt-1">Delivery</div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Status Breakdown</h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Pending:</span>
                <span className="font-semibold">{currentOrders.filter(o => o.status === 'pending').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Confirmed:</span>
                <span className="font-semibold">{currentOrders.filter(o => o.status === 'confirmed').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Preparing:</span>
                <span className="font-semibold">{currentOrders.filter(o => o.status === 'preparing').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ready:</span>
                <span className="font-semibold">{currentOrders.filter(o => o.status === 'ready').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-semibold">{currentOrders.filter(o => o.status === 'completed').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cancelled:</span>
                <span className="font-semibold">{currentOrders.filter(o => o.status === 'cancelled').length}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Actions */}
        <GlassCard variant="elevated" className="p-6">
          <h2 className="text-lg font-bold text-[#1F2933] mb-4">Data Management</h2>
          
          <div className="space-y-3">
            {/* Initialize Sample Orders */}
            <button
              onClick={handleInitializeOrders}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5" />
              <div className="text-left flex-1">
                <div>Initialize Sample Orders</div>
                <div className="text-xs text-white/80 font-normal">Add sample orders if database is empty</div>
              </div>
            </button>

            {/* Refresh Sample Orders */}
            <button
              onClick={handleRefreshOrders}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <div className="text-left flex-1">
                <div>Refresh Sample Orders</div>
                <div className="text-xs text-white/80 font-normal">Replace all orders with fresh samples</div>
              </div>
            </button>

            {/* Clear All Orders */}
            <button
              onClick={handleClearOrders}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
              <div className="text-left flex-1">
                <div>Clear All Orders</div>
                <div className="text-xs text-white/80 font-normal">Delete all orders permanently</div>
              </div>
            </button>
          </div>
        </GlassCard>

        {/* Sample Data Info */}
        <GlassCard variant="elevated" className="p-6">
          <h2 className="text-lg font-bold text-[#1F2933] mb-4">Sample Data Info</h2>
          
          <div className="space-y-3 text-sm">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h3 className="font-semibold text-blue-900 mb-2">📦 What's Included</h3>
              <ul className="space-y-1 text-blue-800 text-xs">
                <li>• 15+ sample orders with realistic data</li>
                <li>• Mix of dine-in, takeaway, and delivery orders</li>
                <li>• Various order statuses (pending, preparing, ready, completed)</li>
                <li>• Different timestamps (active, recent, historical)</li>
                <li>• Multiple customers and branches</li>
                <li>• Varied menu items with modifiers</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <h3 className="font-semibold text-purple-900 mb-2">🍽️ Order Types</h3>
              <div className="space-y-1 text-purple-800 text-xs">
                <div className="flex justify-between">
                  <span>Dine-in:</span>
                  <span className="font-semibold">Orders with table numbers</span>
                </div>
                <div className="flex justify-between">
                  <span>Takeaway:</span>
                  <span className="font-semibold">Pickup orders</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="font-semibold">Orders with delivery addresses</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <h3 className="font-semibold text-amber-900 mb-2">⚠️ Important Notes</h3>
              <ul className="space-y-1 text-amber-800 text-xs">
                <li>• Sample data is stored in localStorage</li>
                <li>• Timestamps are dynamically generated</li>
                <li>• Active orders update every 10 seconds</li>
                <li>• All prices use store currency settings</li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}