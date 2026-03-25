import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { QrCode, ChevronLeft, Camera, Hash, Table2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function WaiterScanTable() {
  const navigate = useNavigate();
  const [manualTable, setManualTable] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleManualEntry = () => {
    if (!manualTable.trim()) {
      toast.error('Please enter a table number');
      return;
    }
    toast.success(`Table ${manualTable} selected`);
    navigate(`/waiter/new-order/${manualTable}`);
  };

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const randomTable = Math.floor(Math.random() * 20) + 1;
      toast.success(`Table ${randomTable} scanned successfully!`);
      navigate(`/waiter/new-order/${randomTable}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e4dbc4] to-[#d4c9b0] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/waiter/dashboard')}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Scan Table</h1>
            <p className="text-sm text-gray-600 font-semibold">Scan QR code or enter manually</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* QR Scanner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-2xl mb-6"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#667c67] to-[#546352] mx-auto mb-4 flex items-center justify-center">
                <QrCode size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Scan QR Code</h2>
              <p className="text-gray-600 font-semibold">Point your camera at the table QR code</p>
            </div>

            {isScanning ? (
              <div className="aspect-square bg-gradient-to-br from-[#667c67]/10 to-[#667c67]/20 rounded-2xl flex items-center justify-center mb-6">
                <div className="text-center">
                  <Camera size={64} className="text-[#667c67] mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-700 font-bold">Scanning...</p>
                </div>
              </div>
            ) : (
              <button
                onClick={simulateScan}
                className="w-full aspect-square bg-gradient-to-br from-[#667c67]/10 to-[#667c67]/20 rounded-2xl flex items-center justify-center mb-6 hover:from-[#667c67]/20 hover:to-[#667c67]/30 transition-all border-4 border-dashed border-[#667c67]"
              >
                <div className="text-center">
                  <Camera size={64} className="text-[#667c67] mx-auto mb-4" />
                  <p className="text-gray-700 font-bold">Tap to Start Scanning</p>
                </div>
              </button>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm font-bold text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Manual Entry */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Hash size={16} />
                Enter Table Number
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={manualTable}
                  onChange={(e) => setManualTable(e.target.value)}
                  placeholder="e.g., 12"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#667c67] focus:ring-0 font-bold text-lg text-center"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleManualEntry();
                    }
                  }}
                />
                <button
                  onClick={handleManualEntry}
                  className="px-6 py-3 rounded-xl bg-[#667c67] text-white font-bold hover:bg-[#556856] transition-colors shadow-lg"
                >
                  Go
                </button>
              </div>
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex gap-3"
          >
            <AlertCircle size={24} className="text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Quick Tip</h3>
              <p className="text-sm text-blue-700 font-semibold">
                Each table has a unique QR code. Scan it to automatically start a new order for that table.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
