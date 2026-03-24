import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useCheckIn } from '../contexts/CheckInContext';
import { useApp } from '../contexts/AppContext';
import { 
  QrCode, 
  Smartphone, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Phone,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';

export function TableCheckInPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentRequest, requestCheckIn, cancelRequest, retryRequest, tokenTTL } = useCheckIn();
  const { selectedBranch, selectTable } = useApp();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(tokenTTL);
  const [method, setMethod] = useState<'qr' | 'nfc'>('qr');

  // Get table ID from URL params
  const tableIdParam = searchParams.get('table');
  const tableNameParam = searchParams.get('tableName');
  const methodParam = searchParams.get('method') as 'qr' | 'nfc' | 'manual' | null;

  useEffect(() => {
    if (methodParam) {
      setMethod(methodParam === 'manual' ? 'qr' : methodParam);
    }
  }, [methodParam]);

  // Auto-request check-in when page loads with table ID
  useEffect(() => {
    if (tableIdParam && selectedBranch && !currentRequest && !isProcessing) {
      handleRequestCheckIn(tableIdParam, tableNameParam || `Table ${tableIdParam}`);
    }
  }, [tableIdParam, selectedBranch]);

  // Countdown timer
  useEffect(() => {
    if (currentRequest && currentRequest.status === 'pending') {
      const interval = setInterval(() => {
        const remaining = Math.ceil((currentRequest.expiresAt - Date.now()) / 1000);
        setTimeLeft(remaining > 0 ? remaining : 0);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentRequest]);

  const handleRequestCheckIn = async (tableId: string, tableName: string) => {
    if (!selectedBranch) return;
    
    setIsProcessing(true);
    try {
      await requestCheckIn(
        tableId,
        tableName,
        selectedBranch.id,
        selectedBranch.name,
        methodParam === 'manual' ? 'qr' : (methodParam || 'qr')
      );
    } catch (error) {
      console.error('Check-in request failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproved = () => {
    if (currentRequest) {
      // Set table in context
      selectTable({
        id: currentRequest.tableId,
        number: currentRequest.tableName,
        seats: 4,
        status: 'occupied',
      });
      
      // Navigate to menu
      navigate('/menu');
    }
  };

  const handleRetry = () => {
    retryRequest();
  };

  const handleCancel = () => {
    cancelRequest();
    navigate(-1);
  };

  const handleCallStaff = () => {
    // In production: trigger call staff feature
    alert('Calling staff for assistance...');
  };

  // Auto-redirect on approval
  useEffect(() => {
    if (currentRequest?.status === 'approved') {
      setTimeout(() => handleApproved(), 1500);
    }
  }, [currentRequest?.status]);

  if (!tableIdParam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Invalid QR Code</h2>
          <p className="text-gray-600 mb-6">Table information not found</p>
          <Button onClick={() => navigate('/branches')} className="bg-[#667c67]">
            Back to Branches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white p-6 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            {method === 'qr' ? (
              <QrCode className="w-8 h-8" />
            ) : (
              <Smartphone className="w-8 h-8" />
            )}
            <div>
              <h1 className="text-2xl font-black">Table Check-In</h1>
              <p className="text-sm text-[#e4dbc4]">{selectedBranch?.name}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {/* Pending - Waiting for Approval */}
          {currentRequest?.status === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl p-8 text-center"
            >
              {/* Animated Loader */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-24 h-24 mx-auto mb-6 relative"
              >
                <div className="absolute inset-0 rounded-full border-4 border-[#e4dbc4]" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#667c67] border-r-[#667c67]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock className="w-10 h-10 text-[#667c67]" />
                </div>
              </motion.div>

              <h2 className="text-2xl font-black text-gray-800 mb-3">
                Waiting for Staff Confirmation
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                A staff member will confirm your table shortly. This may take 10–45 seconds.
              </p>

              {/* Table Info */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-br from-[#667c67]/10 to-[#e4dbc4]/20 px-6 py-4 rounded-2xl border-2 border-[#e4dbc4] mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#667c67] flex items-center justify-center">
                  <span className="text-white font-black text-xl">{tableIdParam}</span>
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-500">Table Number</div>
                  <div className="font-bold text-gray-800">Table {tableIdParam}</div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mb-8">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e4dbc4"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#667c67"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - timeLeft / tokenTTL)}`}
                      strokeLinecap="round"
                      transition={{ duration: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-black text-[#667c67]">{timeLeft}</div>
                      <div className="text-xs text-gray-500">seconds</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-200 hover:border-gray-300"
                >
                  Cancel Request
                </Button>
                <button
                  onClick={handleCallStaff}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-[#667c67] hover:text-[#526250] transition-colors py-2"
                >
                  <Phone className="w-4 h-4" />
                  Need Help? Call Staff
                </button>
              </div>
            </motion.div>
          )}

          {/* Approved */}
          {currentRequest?.status === 'approved' && (
            <motion.div
              key="approved"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={3} />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-black text-gray-800 mb-3"
              >
                Check-In Approved!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-2"
              >
                Welcome to Table {tableIdParam}
              </motion.p>

              {currentRequest.approvedBy && (
                <p className="text-sm text-gray-500 mb-6">
                  Approved by {currentRequest.approvedBy}
                </p>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-2 text-[#667c67] mb-6"
              >
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Redirecting to menu...</span>
              </motion.div>

              <Button
                onClick={handleApproved}
                className="bg-gradient-to-r from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67] h-12 px-8"
              >
                Continue to Menu →
              </Button>
            </motion.div>
          )}

          {/* Denied */}
          {currentRequest?.status === 'denied' && (
            <motion.div
              key="denied"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center"
              >
                <XCircle className="w-14 h-14 text-white" strokeWidth={3} />
              </motion.div>

              <h2 className="text-2xl font-black text-gray-800 mb-3">
                Request Denied
              </h2>
              <p className="text-gray-600 mb-6">
                Your check-in request was not approved. Please contact staff for assistance.
              </p>

              {currentRequest.deniedBy && (
                <p className="text-sm text-gray-500 mb-6">
                  Denied by {currentRequest.deniedBy}
                </p>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleRetry}
                  className="w-full h-12 bg-gradient-to-r from-[#667c67] to-[#526250]"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={handleCallStaff}
                  variant="outline"
                  className="w-full h-12 border-2"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Staff
                </Button>
              </div>
            </motion.div>
          )}

          {/* Expired */}
          {currentRequest?.status === 'expired' && (
            <motion.div
              key="expired"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center"
              >
                <Clock className="w-14 h-14 text-white" strokeWidth={3} />
              </motion.div>

              <h2 className="text-2xl font-black text-gray-800 mb-3">
                Request Expired
              </h2>
              <p className="text-gray-600 mb-6">
                Your check-in request timed out. Please try again or contact staff.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleRetry}
                  className="w-full h-12 bg-gradient-to-r from-[#667c67] to-[#526250]"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Request Again
                </Button>
                <Button
                  onClick={handleCallStaff}
                  variant="outline"
                  className="w-full h-12 border-2"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Staff
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Method Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-sm text-gray-600">
            {method === 'qr' ? (
              <>
                <QrCode className="w-4 h-4 text-[#667c67]" />
                <span>Scanned via QR Code</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-[#667c67]" />
                <span>Tapped via NFC</span>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}