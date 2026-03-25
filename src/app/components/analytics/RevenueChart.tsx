import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useId } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  title?: string;
  period?: string;
  totalRevenue?: number;
  growth?: number;
  chartType?: 'line' | 'area';
}

export function RevenueChart({
  data = [],
  title = 'Revenue Overview',
  period = 'Last 7 days',
  totalRevenue,
  growth,
  chartType = 'area',
}: RevenueChartProps) {
  const isPositiveGrowth = growth !== undefined && growth >= 0;
  const gradientId = `gradient-${useId()}`; // Generate unique ID for gradient with prefix

  // Ensure data is always an array
  const chartData = Array.isArray(data) ? data : [];
  const hasData = chartData.length > 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 shadow-lg border-primary/20">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {payload[0].payload.date}
            </p>
            <p className="font-semibold text-primary">
              ${payload[0].value.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              {payload[0].payload.orders} orders
            </p>
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{period}</p>
        </div>

        {growth !== undefined && (
          <Badge
            variant={isPositiveGrowth ? 'default' : 'destructive'}
            className="gap-1"
          >
            {isPositiveGrowth ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(growth).toFixed(1)}%
          </Badge>
        )}
      </div>

      {/* Total Revenue */}
      {totalRevenue !== undefined && (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold text-primary">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667c67" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#667c67" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#667c67"
                strokeWidth={2}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#667c67"
                strokeWidth={3}
                dot={{ fill: '#667c67', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div>
          <p className="text-xs text-muted-foreground">Avg. Daily</p>
          <p className="text-lg font-semibold">
            {hasData
              ? (
                  chartData.reduce((sum, d) => sum + d.revenue, 0) /
                  chartData.length
                ).toFixed(0)
              : '0'}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Orders</p>
          <p className="text-lg font-semibold">
            {hasData
              ? chartData.reduce((sum, d) => sum + d.orders, 0)
              : '0'}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Avg. Order</p>
          <p className="text-lg font-semibold">
            {hasData
              ? `$${(
                  chartData.reduce((sum, d) => sum + d.revenue, 0) /
                  chartData.reduce((sum, d) => sum + d.orders, 0)
                ).toFixed(2)}`
              : '0'}
          </p>
        </div>
      </div>
    </Card>
  );
}