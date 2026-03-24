import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCheckIn, CheckInRequest } from '../contexts/CheckInContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Smartphone,
  QrCode,
  Bell,
  Filter,
  Search,
  TrendingUp,
  Users,
  AlertCircle,
  History,
  Settings,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

export function StaffCheckInDashboard() {
  const { activeRequests, approveRequest, denyRequest, tokenTTL, setTokenTTL } = useCheckIn();
  const { user } = useAuth();
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'denied' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [customTTL, setCustomTTL] = useState(tokenTTL.toString());
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [previousPendingCount, setPreviousPendingCount] = useState(0);

  // Get filtered requests
  const filteredRequests = activeRequests.filter(req => {
    if (filter !== 'all' && req.status !== filter) return false;
    if (searchQuery && !req.tableName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Count by status
  const pendingCount = activeRequests.filter(r => r.status === 'pending').length;
  const approvedCount = activeRequests.filter(r => r.status === 'approved').length;
  const deniedCount = activeRequests.filter(r => r.status === 'denied').length;

  // Play notification sound on new pending request
  useEffect(() => {
    if (soundEnabled && pendingCount > previousPendingCount) {
      // In production: play notification sound
      console.log('🔔 New check-in request!');
    }
    setPreviousPendingCount(pendingCount);
  }, [pendingCount]);

  const handleApprove = (requestId: string) => {
    if (user) {
      approveRequest(requestId, user.id, user.name);
    }
  };

  const handleDeny = (requestId: string) => {
    if (user) {
      denyRequest(requestId, user.id, user.name, 'Staff denied');
    }
  };

  const handleSaveSettings = () => {
    const newTTL = parseInt(customTTL);
    if (newTTL >= 10 && newTTL <= 120) {
      setTokenTTL(newTTL);
      setShowSettings(false);
    }
  };

  const getTimeRemaining = (expiresAt: number) => {
    const remaining = Math.ceil((expiresAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white shadow-lg">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black">Check-In Dashboard</h1>
                <p className="text-sm text-[#e4dbc4]">Manage table check-in requests</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
              >
                <Settings className="w-5 h-5" />
              </button>
              {pendingCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white font-black flex items-center gap-2"
                >
                  <Bell className="w-5 h-5" />
                  {pendingCount} Pending
                </motion.div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <div className="text-2xl font-black">{pendingCount}</div>
                  <div className="text-xs text-[#e4dbc4]">Pending</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <div className="text-2xl font-black">{approvedCount}</div>
                  <div className="text-xs text-[#e4dbc4]">Approved</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-300" />
                </div>
                <div>
                  <div className="text-2xl font-black">{deniedCount}</div>
                  <div className="text-xs text-[#e4dbc4]">Denied</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <div className="text-2xl font-black">{activeRequests.length}</div>
                  <div className="text-xs text-[#e4dbc4]">Total Today</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto p-6">
              <h3 className="text-lg font-black text-gray-800 mb-4">Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Token TTL (Time to Live)
                  </label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={customTTL}
                      onChange={(e) => setCustomTTL(e.target.value)}
                      min="10"
                      max="120"
                      className="w-32"
                    />
                    <span className="text-sm text-gray-500">seconds (10-120)</span>
                    <Button onClick={handleSaveSettings} size="sm" className="bg-[#667c67]">
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {tokenTTL} seconds
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Notifications
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                        soundEnabled
                          ? 'bg-[#667c67] text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      Sound {soundEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              {(['all', 'pending', 'approved', 'denied', 'expired'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                    filter === status
                      ? 'bg-[#667c67] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No Requests</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'No check-in requests yet'
                  : `No ${filter} requests`
                }
              </p>
            </div>
          ) : (
            filteredRequests.map((request, index) => (
              <RequestCard
                key={request.id}
                request={request}
                index={index}
                onApprove={handleApprove}
                onDeny={handleDeny}
                getTimeRemaining={getTimeRemaining}
                formatTimestamp={formatTimestamp}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface RequestCardProps {
  request: CheckInRequest;
  index: number;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
  getTimeRemaining: (expiresAt: number) => number;
  formatTimestamp: (timestamp: number) => string;
}

function RequestCard({ 
  request, 
  index, 
  onApprove, 
  onDeny, 
  getTimeRemaining,
  formatTimestamp 
}: RequestCardProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(request.expiresAt));

  useEffect(() => {
    if (request.status === 'pending') {
      const interval = setInterval(() => {
        setTimeLeft(getTimeRemaining(request.expiresAt));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [request.status, request.expiresAt]);

  const getStatusBadge = () => {
    switch (request.status) {
      case 'pending':
        return <Badge variant="warning" className="font-bold">⏳ Pending</Badge>;
      case 'approved':
        return <Badge variant="success" className="font-bold">✓ Approved</Badge>;
      case 'denied':
        return <Badge className="bg-red-500 text-white font-bold">✕ Denied</Badge>;
      case 'expired':
        return <Badge className="bg-gray-400 text-white font-bold">⌛ Expired</Badge>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white rounded-2xl shadow-md overflow-hidden ${
        request.status === 'pending' ? 'ring-2 ring-yellow-400' : ''
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {/* Table Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#667c67] to-[#526250] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-xl">{request.tableId}</span>
            </div>

            {/* Request Info */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-black text-gray-800">{request.tableName}</h3>
                {getStatusBadge()}
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Requested at {formatTimestamp(request.requestedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="font-mono text-xs">{request.deviceId.slice(0, 20)}...</span>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  <span>via {request.deviceId.includes('manual') ? 'Manual Selection' : request.deviceId.includes('nfc') ? 'NFC Tap' : 'QR Code'}</span>
                </div>
              </div>

              {/* Approved/Denied Info */}
              {request.approvedBy && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approved by {request.approvedBy} at {formatTimestamp(request.approvedAt!)}</span>
                </div>
              )}
              {request.deniedBy && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                  <XCircle className="w-4 h-4" />
                  <span>Denied by {request.deniedBy} at {formatTimestamp(request.deniedAt!)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timer for Pending */}
          {request.status === 'pending' && (
            <div className="text-right">
              <div className="text-3xl font-black text-[#667c67]">{timeLeft}s</div>
              <div className="text-xs text-gray-500">remaining</div>
              <div className="mt-2 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#667c67] to-[#526250]"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / 45) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions - Only for Pending */}
        {request.status === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 pt-4 border-t border-gray-100"
          >
            <Button
              onClick={() => onApprove(request.id)}
              className="flex-1 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Approve Check-In
            </Button>
            <Button
              onClick={() => onDeny(request.id)}
              variant="outline"
              className="flex-1 h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 font-bold"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Deny
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}