import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface TipSelectorProps {
  subtotal: number;
  onTipChange: (tip: number) => void;
  selectedTip: number;
}

const tipPresets = [
  { label: 'No Tip', value: 0 },
  { label: '10%', value: 10 },
  { label: '15%', value: 15 },
  { label: '20%', value: 20 },
];

export function TipSelector({ subtotal, onTipChange, selectedTip }: TipSelectorProps) {
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const calculateTip = (percentage: number) => {
    return (subtotal * percentage) / 100;
  };

  const handlePresetClick = (percentage: number) => {
    setIsCustom(false);
    setCustomAmount('');
    onTipChange(calculateTip(percentage));
  };

  const handleCustomChange = (value: string) => {
    setCustomAmount(value);
    setIsCustom(true);
    const amount = parseFloat(value);
    if (!isNaN(amount) && amount >= 0) {
      onTipChange(amount);
    }
  };

  const selectedPercentage = tipPresets.find(
    preset => Math.abs(calculateTip(preset.value) - selectedTip) < 0.01
  )?.value;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-red-500" />
        <h3 className="font-semibold">Add a Tip?</h3>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {tipPresets.map((preset) => {
          const isSelected = !isCustom && selectedPercentage === preset.value;
          const tipAmount = calculateTip(preset.value);

          return (
            <motion.div key={preset.value} whileTap={{ scale: 0.95 }}>
              <Button
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => handlePresetClick(preset.value)}
                className={`w-full h-auto py-3 flex flex-col gap-1 ${
                  isSelected ? 'bg-primary' : ''
                }`}
              >
                <span className="text-xs font-semibold">{preset.label}</span>
                {preset.value > 0 && (
                  <span className="text-xs opacity-80">
                    ${tipAmount.toFixed(2)}
                  </span>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Custom Amount */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Custom Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            type="number"
            value={customAmount}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="0.00"
            className={`pl-7 ${isCustom ? 'border-primary' : ''}`}
            step="0.01"
            min="0"
          />
        </div>
      </div>

      {/* Tip Summary */}
      {selectedTip > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 rounded-lg p-3 border border-primary/20"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tip amount:</span>
            <span className="font-semibold text-primary">
              ${selectedTip.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Thank you for supporting our staff! 💚
          </p>
        </motion.div>
      )}
    </Card>
  );
}
