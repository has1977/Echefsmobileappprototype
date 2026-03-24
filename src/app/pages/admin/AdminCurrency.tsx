/**
 * eChefs Currency Management
 * Comprehensive currency settings for store and loyalty program
 * Supports RTL (Arabic) and multiple languages
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  Save, 
  Globe2, 
  TrendingUp, 
  Coins, 
  CheckCircle2, 
  AlertCircle,
  Info,
  Eye
} from 'lucide-react';
import { db } from '../../lib/database';
import { getAllCurrencies } from '../../hooks/useCurrency';
import type { CurrencyConfig } from '../../hooks/useCurrency';
import { formatCurrency } from '../../utils/currency';

export function AdminCurrency() {
  // State for currency settings
  const [storeCurrency, setStoreCurrency] = useState<string>('USD');
  const [storeSymbol, setStoreSymbol] = useState<string>('$');
  const [storePosition, setStorePosition] = useState<'before' | 'after'>('before');
  
  const [loyaltyCurrency, setLoyaltyCurrency] = useState<string>('KGS');
  const [loyaltySymbol, setLoyaltySymbol] = useState<string>('с');
  const [earningRate, setEarningRate] = useState<number>(100); // Default value to prevent undefined
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [showPreview, setShowPreview] = useState(false);

  // Load current settings
  useEffect(() => {
    const settings = db.getSettings();
    
    // Store currency
    setStoreCurrency(settings.currency.code || 'USD');
    setStoreSymbol(settings.currency.symbol || '$');
    setStorePosition(settings.currency.position || 'before');
    
    // Loyalty currency
    setLoyaltyCurrency(settings.loyalty.currency || 'KGS');
    setLoyaltySymbol(settings.loyalty.currencySymbol || 'с');
    setEarningRate(settings.loyalty.amountPerPoint || 100);
  }, []);

  // Get all available currencies
  const currencies = getAllCurrencies();

  // Handle store currency change
  const handleStoreCurrencyChange = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency) {
      setStoreCurrency(currency.code);
      setStoreSymbol(currency.symbol);
      // Auto-determine position based on currency
      const beforeSymbols = ['$', '€', '£'];
      setStorePosition(beforeSymbols.includes(currency.symbol) ? 'before' : 'after');
    }
  };

  // Handle loyalty currency change
  const handleLoyaltyCurrencyChange = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency) {
      setLoyaltyCurrency(currency.code);
      setLoyaltySymbol(currency.symbol);
    }
  };

  // Save settings
  const handleSave = async () => {
    setSaveStatus('saving');
    
    try {
      // Update store currency
      db.updateSettings({
        currency: {
          code: storeCurrency,
          symbol: storeSymbol,
          position: storePosition,
        },
      });

      // Update loyalty currency
      db.updateSettings({
        loyalty: {
          ...db.getSettings().loyalty,
          currency: loyaltyCurrency,
          currencySymbol: loyaltySymbol,
          amountPerPoint: earningRate,
        },
      });

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save currency settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Get current currency object for display
  const currentStoreCurrency = currencies.find(c => c.code === storeCurrency);
  const currentLoyaltyCurrency = currencies.find(c => c.code === loyaltyCurrency);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667c67] to-[#546352] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <DollarSign className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Currency Management</h1>
              <p className="text-white/80 mt-1">
                Configure store and loyalty program currencies
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Store Currency Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#667c67] to-[#546352] px-6 py-4">
                <div className="flex items-center gap-3">
                  <Globe2 className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">Store Currency</h2>
                </div>
                <p className="text-white/80 text-sm mt-1">
                  Main currency for product pricing and payments
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Currency Selection Grid */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Currency
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {currencies.map((currency) => (
                      <motion.button
                        key={currency.code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStoreCurrencyChange(currency.code)}
                        className={`relative p-4 rounded-2xl border-2 transition-all ${
                          storeCurrency === currency.code
                            ? 'border-[#667c67] bg-[#667c67]/5 shadow-md'
                            : 'border-gray-200 bg-white hover:border-[#667c67]/30'
                        }`}
                      >
                        <div className="text-3xl mb-2">{currency.flag}</div>
                        <div className="text-sm font-bold text-gray-900">{currency.code}</div>
                        <div className="text-xs text-gray-600 mt-1">{currency.symbol}</div>
                        {storeCurrency === currency.code && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 bg-[#667c67] rounded-full flex items-center justify-center"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Symbol Position */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Symbol Position
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setStorePosition('before')}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        storePosition === 'before'
                          ? 'border-[#667c67] bg-[#667c67]/5'
                          : 'border-gray-200 hover:border-[#667c67]/30'
                      }`}
                    >
                      <div className="text-lg font-bold text-gray-900">
                        {storeSymbol}100.00
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Before Amount</div>
                    </button>
                    <button
                      onClick={() => setStorePosition('after')}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        storePosition === 'after'
                          ? 'border-[#667c67] bg-[#667c67]/5'
                          : 'border-gray-200 hover:border-[#667c67]/30'
                      }`}
                    >
                      <div className="text-lg font-bold text-gray-900">
                        100.00 {storeSymbol}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">After Amount</div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Loyalty Currency Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#667c67] to-[#546352] px-6 py-4">
                <div className="flex items-center gap-3">
                  <Coins className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">Loyalty Currency</h2>
                </div>
                <p className="text-white/80 text-sm mt-1">
                  Currency for loyalty points earning calculation
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Currency Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Loyalty Currency
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {currencies.map((currency) => (
                      <motion.button
                        key={currency.code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleLoyaltyCurrencyChange(currency.code)}
                        className={`relative p-4 rounded-2xl border-2 transition-all ${
                          loyaltyCurrency === currency.code
                            ? 'border-[#667c67] bg-[#667c67]/5 shadow-md'
                            : 'border-gray-200 bg-white hover:border-[#667c67]/30'
                        }`}
                      >
                        <div className="text-3xl mb-2">{currency.flag}</div>
                        <div className="text-sm font-bold text-gray-900">{currency.code}</div>
                        <div className="text-xs text-gray-600 mt-1">{currency.symbol}</div>
                        {loyaltyCurrency === currency.code && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 bg-[#667c67] rounded-full flex items-center justify-center"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Earning Rate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Earning Rate (Amount per Point)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={earningRate}
                      onChange={(e) => setEarningRate(Number(e.target.value))}
                      min="1"
                      step="1"
                      className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#667c67] focus:outline-none text-lg font-semibold text-gray-900 bg-white transition-all"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <span className="text-2xl">{loyaltySymbol}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-900">
                        <span className="font-semibold">Customers earn 1 point</span> for every{' '}
                        <span className="font-bold text-[#667c67]">
                          {earningRate} {loyaltyCurrency}
                        </span>{' '}
                        they spend
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Rate Presets */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Quick Presets
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[50, 100, 200].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setEarningRate(rate)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          earningRate === rate
                            ? 'border-[#667c67] bg-[#667c67]/5'
                            : 'border-gray-200 hover:border-[#667c67]/30'
                        }`}
                      >
                        <div className="text-sm font-bold text-gray-900">{rate} {loyaltySymbol}</div>
                        <div className="text-xs text-gray-600 mt-1">= 1 point</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`w-full py-4 rounded-2xl font-bold text-white text-lg shadow-lg transition-all ${
                saveStatus === 'saving'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : saveStatus === 'success'
                  ? 'bg-green-500 hover:bg-green-600'
                  : saveStatus === 'error'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gradient-to-r from-[#667c67] to-[#546352] hover:shadow-xl'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                {saveStatus === 'saving' ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Save className="w-6 h-6" />
                    </motion.div>
                    Saving...
                  </>
                ) : saveStatus === 'success' ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    Saved Successfully!
                  </>
                ) : saveStatus === 'error' ? (
                  <>
                    <AlertCircle className="w-6 h-6" />
                    Error Saving
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    Save Currency Settings
                  </>
                )}
              </div>
            </motion.button>
          </div>

          {/* Right Column - Preview & Info */}
          <div className="space-y-6">
            {/* Live Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden sticky top-6"
            >
              <div className="bg-gradient-to-r from-[#667c67] to-[#546352] px-6 py-4">
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-white" />
                  <h3 className="text-lg font-bold text-white">Live Preview</h3>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Store Currency Preview */}
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Store Pricing
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-600">Product Price</span>
                      <span className="text-lg font-bold text-[#667c67]">
                        {formatCurrency(25.99, storeSymbol, storePosition, 2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-600">Cart Total</span>
                      <span className="text-xl font-bold text-[#667c67]">
                        {formatCurrency(156.50, storeSymbol, storePosition, 2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-200" />

                {/* Loyalty Preview */}
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Loyalty Earning
                  </div>
                  <div className="p-4 bg-gradient-to-br from-[#667c67]/5 to-[#e4dbc4]/30 rounded-xl border border-[#667c67]/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#667c67] rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">You'll earn</div>
                        <div className="text-2xl font-bold text-[#667c67]">
                          {Math.floor(500 / earningRate)} Points
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Purchase Amount:</span>
                        <span className="font-semibold">500 {loyaltySymbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Earning Rate:</span>
                        <span className="font-semibold">{earningRate} {loyaltySymbol} = 1 pt</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-200" />

                {/* Current Settings Summary */}
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Active Settings
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-gray-600">Store:</span>
                      <span className="font-semibold text-gray-900">
                        {currentStoreCurrency?.flag} {storeCurrency}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-gray-600">Loyalty:</span>
                      <span className="font-semibold text-gray-900">
                        {currentLoyaltyCurrency?.flag} {loyaltyCurrency}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-semibold text-gray-900">
                        {earningRate} {loyaltySymbol} = 1 pt
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-6 border border-blue-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-blue-900">Important Notes</h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>All prices will update automatically across the platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Each branch has its own loyalty program with separate points</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Existing customer points remain valid</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Changes take effect immediately after saving</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}