import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  subtitle?: string;
  color?: 'primary' | 'success' | 'warning' | 'destructive' | 'info';
  delay?: number;
}

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
  info: 'bg-info/10 text-info',
};

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
  subtitle,
  color = 'primary',
  delay = 0,
}: StatCardProps) {
  const showChange = change !== undefined;
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
          </div>

          {showChange && (
            <Badge
              variant={isPositive ? 'default' : 'destructive'}
              className="gap-1 text-xs"
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(change).toFixed(1)}%
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.1, type: 'spring' }}
            className="text-3xl font-bold tracking-tight"
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
