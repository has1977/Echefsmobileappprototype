import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ChevronLeft, Save, Settings, DollarSign, Coins,
  Award, Info, Check, AlertCircle
} from 'lucide-react';
import { db } from '../../lib/database';
import type { SystemSettings } from '../../lib/types';
import { GlassCard, GradientButton, Chip } from '../../design-system';

export function AdminLoyaltySettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SystemSettings>(db.getSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Currency options for loyalty program
  const currencyOptions = [
    { code: 'KGS', name: 'Kyrgyzstan Som', symbol: 'с', flag: '🇰🇬' },
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
    { code: 'KZT', name: 'Kazakhstan Tenge', symbol: '₸', flag: '🇰🇿' },
    { code: 'UZS', name: 'Uzbekistan Som', symbol: 'soʻm', flag: '🇺🇿' },
  ];

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = currencyOptions.find(c => c.code === currencyCode);
    if (currency) {
      setSettings({
        ...settings,
        loyalty: {
          ...settings.loyalty,
          currency: currency.code,
          currencySymbol: currency.symbol,
        },
      });
    }
  };

  const handleAmountPerPointChange = (value: number) => {
    setSettings({
      ...settings,
      loyalty: {
        ...settings.loyalty,
        amountPerPoint: value,
      },
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      // Simulate async save operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      db.updateSettings(settings);
      setSaveStatus('success');
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCurrency = currencyOptions.find(c => c.code === settings.loyalty.currency);
  const pointsExample = 500;
  const earnedPoints = Math.floor(pointsExample / settings.loyalty.amountPerPoint);

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-[#f8f5ef] to-[#fafaf8]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white shadow-xl sticky top-0 z-40">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold drop-shadow-sm flex items-center gap-2">
                  <Settings className="w-7 h-7" />
                  Loyalty Settings
                </h1>
                <p className="text-sm text-white/80 mt-1">
                  Configure earning rates and currency for loyalty program
                </p>
              </div>
            </div>

            <GradientButton
              onClick={handleSave}
              disabled={isSaving}
              variant="secondary"
              className="bg-white text-[#667c67] hover:bg-white/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </GradientButton>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Save Status */}
        {saveStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl flex items-center gap-3 ${
              saveStatus === 'success'
                ? 'bg-green-50 text-green-800 border-2 border-green-200'
                : 'bg-red-50 text-red-800 border-2 border-red-200'
            }`}
          >
            {saveStatus === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-semibold">
              {saveStatus === 'success'
                ? 'Settings saved successfully!'
                : 'Failed to save settings. Please try again.'}
            </span>
          </motion.div>
        )}

        {/* Currency Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard variant="elevated" className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-white">
                  <h2 className="text-xl font-bold mb-1">Loyalty Currency</h2>
                  <p className="text-white/90 text-sm">Select the currency for your loyalty program</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currencyOptions.map((currency) => {
                  const isSelected = settings.loyalty.currency === currency.code;
                  return (
                    <motion.button
                      key={currency.code}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCurrencyChange(currency.code)}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'border-[#667c67] bg-[#667c67]/10 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-[#667c67]/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{currency.flag}</div>
                      <div className="font-bold text-gray-900">{currency.code}</div>
                      <div className="text-xs text-gray-600 mt-1">{currency.symbol}</div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Selected Currency</p>
                    <p>
                      {selectedCurrency?.name} ({selectedCurrency?.symbol}) - {selectedCurrency?.flag}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Earning Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="elevated" className="overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-white">
                  <h2 className="text-xl font-bold mb-1">Points Earning Rate</h2>
                  <p className="text-white/90 text-sm">Set how much customers need to spend to earn 1 point</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Amount per 1 Point ({selectedCurrency?.symbol})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={settings.loyalty.amountPerPoint}
                    onChange={(e) => handleAmountPerPointChange(Number(e.target.value))}
                    className="w-full px-6 py-4 text-2xl font-bold bg-white border-2 border-gray-300 rounded-2xl focus:border-[#667c67] focus:ring-4 focus:ring-[#667c67]/20 transition-all outline-none"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
                    {selectedCurrency?.symbol}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Customers will earn 1 point for every {settings.loyalty.amountPerPoint} {selectedCurrency?.symbol} they spend
                </p>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Quick Presets for {selectedCurrency?.code}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {selectedCurrency?.code === 'KGS' ? (
                    <>
                      <QuickPresetButton value={50} symbol={selectedCurrency.symbol} currentValue={settings.loyalty.amountPerPoint} onClick={handleAmountPerPointChange} />
                      <QuickPresetButton value={100} symbol={selectedCurrency.symbol} currentValue={settings.loyalty.amountPerPoint} onClick={handleAmountPerPointChange} />
                      <QuickPresetButton value={200} symbol={selectedCurrency.symbol} currentValue={settings.loyalty.amountPerPoint} onClick={handleAmountPerPointChange} />
                    </>
                  ) : selectedCurrency?.code === 'USD' ? (
                    <>
                      <QuickPresetButton value={1} symbol={selectedCurrency.symbol} currentValue={settings.loyalty.amountPerPoint} onClick={handleAmountPerPointChange} />
                      <QuickPresetButton value={5} symbol={selectedCurrency.symbol} currentValue={settings.loyalty.amountPerPoint} onClick={handleAmountPerPointChange} />
                      <QuickPresetButton value={10} symbol={selectedCurrency.symbol} currentValue={settings.loyalty.amountPerPoint} onClick={handleAmountPerPointChange} />
                    </>
                  ) : selectedCurrency?.code === 'RUB' ? (
                    <>
                      <QuickPresetButton value={50} symbol={selectedCurrency.symbol} currentValue={settings.loyalty.amountPerPoint} onClick={handleAmountPerPointChange} />
                      <QuickPresetButton value={100} symbol={selectedCurrency.symbol} currentValue={settings.loyalty.amountPerPoint} onClick={handleAmountPerPointChange} />
                      <QuickPresetButton value={200} symbol={selectedCurrency.symbol} currentValue={settings.loyalty.amountPerPoint} onClick={handleAmountPerPointChange} />
                    </>
                  ) : (
                    <>
                      <QuickPresetButton value={1} symbol={selectedCurrency?.symbol || ''} currentValue={settings.loyalty.amountPerPoint} onClick={handleAmountPerPointChange} />
                      <QuickPresetButton value={10} symbol={selectedCurrency?.symbol || ''} currentValue={settings.loyalty.amountPerPoint} onClick={handleAmountPerPointChange} />
                      <QuickPresetButton value={100} symbol={selectedCurrency?.symbol || ''} currentValue={settings.loyalty.amountPerPoint} onClick={handleAmountPerPointChange} />
                    </>
                  )}
                </div>
              </div>

              {/* Preview Example */}
              <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                <div className="flex items-start gap-3 mb-3">
                  <Award className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-green-900 mb-1">Example</h3>
                    <p className="text-sm text-green-800">
                      If a customer spends <span className="font-bold">{pointsExample} {selectedCurrency?.symbol}</span>, they will earn:
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center p-6 bg-white rounded-xl border-2 border-green-300">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-green-700 mb-2">
                      {earnedPoints}
                    </div>
                    <div className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                      Points Earned
                    </div>
                  </div>
                </div>
                <p className="text-xs text-green-700 mt-3 text-center">
                  {pointsExample} {selectedCurrency?.symbol} ÷ {settings.loyalty.amountPerPoint} {selectedCurrency?.symbol} = {earnedPoints} points
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard variant="elevated">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900">Important Notes</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-[#667c67] font-bold mt-0.5">•</span>
                      <span>The loyalty currency can be different from your main store currency</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#667c67] font-bold mt-0.5">•</span>
                      <span>Lower amounts mean customers earn points faster (e.g., 1 KGS per point)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#667c67] font-bold mt-0.5">•</span>
                      <span>Higher amounts mean points are more valuable (e.g., 100 KGS per point)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#667c67] font-bold mt-0.5">•</span>
                      <span>Changes will apply to all future purchases immediately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#667c67] font-bold mt-0.5">•</span>
                      <span>Each branch can have separate loyalty programs with branch-specific points</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

// Helper component for quick preset buttons
function QuickPresetButton({ 
  value, 
  symbol, 
  currentValue, 
  onClick 
}: { 
  value: number; 
  symbol: string; 
  currentValue: number; 
  onClick: (value: number) => void;
}) {
  const isActive = currentValue === value;
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(value)}
      className={`p-3 rounded-xl font-bold transition-all ${
        isActive
          ? 'bg-[#667c67] text-white shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {value} {symbol}
    </motion.button>
  );
}
