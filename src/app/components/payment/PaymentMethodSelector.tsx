import { CreditCard, Wallet, QrCode, Banknote, Check } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';

export type PaymentMethod = 'cash' | 'card' | 'pos' | 'qr';

interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: React.ElementType;
  popular?: boolean;
  processingTime: string;
}

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  language?: string;
}

const paymentMethods: PaymentMethodOption[] = [
  {
    id: 'cash',
    name: 'Cash',
    description: 'Pay with waiter',
    icon: Banknote,
    popular: true,
    processingTime: 'Instant',
  },
  {
    id: 'card',
    name: 'Card',
    description: 'Credit/Debit card',
    icon: CreditCard,
    processingTime: '~30 sec',
  },
  {
    id: 'qr',
    name: 'QR Pay',
    description: 'Scan & pay',
    icon: QrCode,
    processingTime: 'Instant',
  },
  {
    id: 'pos',
    name: 'POS',
    description: 'At terminal',
    icon: Wallet,
    processingTime: '~1 min',
  },
];

export function PaymentMethodSelector({
  selected,
  onSelect,
  language = 'en',
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-muted-foreground">Select Payment Method</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {paymentMethods.map((method) => {
          const isSelected = selected === method.id;
          const Icon = method.icon;

          return (
            <motion.button
              key={method.id}
              onClick={() => onSelect(method.id)}
              whileTap={{ scale: 0.97 }}
              className="relative"
            >
              <Card
                className={`p-4 transition-all h-full ${
                  isSelected
                    ? 'border-2 border-primary bg-primary/5 shadow-md'
                    : 'border-2 border-transparent hover:border-muted-foreground/20 hover:shadow-sm'
                }`}
              >
                {/* Popular Badge */}
                {method.popular && !isSelected && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 text-xs"
                  >
                    Popular
                  </Badge>
                )}

                {/* Selected Check */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-primary rounded-full p-1 shadow-lg"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}

                <div className="flex flex-col items-center gap-3 text-center">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Text */}
                  <div>
                    <h4
                      className={`font-semibold text-sm ${
                        isSelected ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {method.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {method.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {method.processingTime}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
