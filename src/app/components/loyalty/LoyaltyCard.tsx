import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Gift, Award } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface LoyaltyCardProps {
  points: number;
  tier: 'bronze' | 'silver' | 'gold';
  nextTierPoints?: number;
  userName: string;
  memberId: string;
}

const tierConfig = {
  bronze: {
    name: 'Bronze',
    color: 'from-amber-700 to-amber-900',
    textColor: 'text-amber-100',
    badgeColor: 'bg-amber-100 text-amber-900',
    icon: Award,
    benefits: ['5% off orders', 'Birthday reward', 'Early access'],
  },
  silver: {
    name: 'Silver',
    color: 'from-gray-400 to-gray-600',
    textColor: 'text-gray-100',
    badgeColor: 'bg-gray-100 text-gray-900',
    icon: Sparkles,
    benefits: ['10% off orders', 'Free delivery', 'Priority support'],
  },
  gold: {
    name: 'Gold',
    color: 'from-yellow-400 to-yellow-600',
    textColor: 'text-yellow-100',
    badgeColor: 'bg-yellow-100 text-yellow-900',
    icon: TrendingUp,
    benefits: ['15% off orders', 'VIP events', 'Exclusive menu items'],
  },
};

export function LoyaltyCard({
  points,
  tier,
  nextTierPoints,
  userName,
  memberId,
}: LoyaltyCardProps) {
  const config = tierConfig[tier];
  const Icon = config.icon;
  const progressToNext = nextTierPoints
    ? (points / nextTierPoints) * 100
    : 100;

  return (
    <div className="space-y-4">
      {/* Main Card */}
      <motion.div
        initial={{ rotateY: 0 }}
        whileHover={{ rotateY: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="perspective-1000"
      >
        <Card className={`relative overflow-hidden bg-gradient-to-br ${config.color} text-white shadow-2xl`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
          </div>

          <div className="relative p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">{config.name} Member</h3>
                </div>
                <p className="text-sm opacity-90">{userName}</p>
              </div>
              
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <Gift className="w-8 h-8" />
              </motion.div>
            </div>

            {/* Points Display */}
            <div className="text-center py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div className="text-6xl font-bold tracking-tight">
                  {points.toLocaleString()}
                </div>
                <p className="text-sm opacity-90 mt-1">Total Points</p>
              </motion.div>
            </div>

            {/* Progress to Next Tier */}
            {nextTierPoints && progressToNext < 100 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-90">Next tier</span>
                  <span className="font-semibold">
                    {nextTierPoints - points} pts to go
                  </span>
                </div>
                <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Member ID */}
            <div className="pt-4 border-t border-white/20">
              <p className="text-xs opacity-70">Member ID</p>
              <p className="text-sm font-mono">{memberId}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Benefits */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Your Benefits
        </h4>
        <div className="space-y-2">
          {config.benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 text-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>{benefit}</span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Points Converter */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Points Value</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              1 point = $0.01
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              ${(points * 0.01).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">Available</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
