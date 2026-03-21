import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { motion } from 'motion/react';
import {
  ArrowLeft, Package, TrendingUp, TrendingDown, DollarSign,
  Calendar, AlertTriangle, Edit2, Save, X, Plus, Minus,
  Truck, Clock, BarChart3, Settings, RefreshCw, Download
} from 'lucide-react';
import type { Ingredient, IncomingOrder, ForecastUsage } from '../../types/inventory';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  ingredients,
  suppliers,
  incomingOrders as allIncomingOrders,
  forecastUsage,
} from '../../services/inventoryData';

export function IngredientDetail() {
  const navigate = useNavigate();
  const { ingredientId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [adjustmentQty, setAdjustmentQty] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');

  // Get real ingredient data
  const ingredient = ingredients.find(i => i.id === ingredientId);
  
  if (!ingredient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] to-[#fafaf8] flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-xl font-bold mb-4">Ingredient Not Found</h2>
          <Button onClick={() => navigate('/admin/inventory/ingredients')}>
            Back to Ingredients
          </Button>
        </Card>
      </div>
    );
  }

  const supplier = suppliers.find(s => s.id === ingredient.supplier_id);
  const incomingOrders = allIncomingOrders.filter(io => io.ingredient_id === ingredientId);
  const usageHistory = forecastUsage.filter(u => u.ingredient_id === ingredientId);

  // Calculation: Days of stock remaining
  const totalIncoming = incomingOrders.reduce((sum, order) => sum + order.qty, 0);
  const projectedStock = ingredient.on_hand_qty + totalIncoming;
  const daysOfStock = ingredient.avg_daily_usage! > 0 
    ? ingredient.on_hand_qty / ingredient.avg_daily_usage!
    : 0;
  const projectedDaysOfStock = ingredient.avg_daily_usage! > 0
    ? projectedStock / ingredient.avg_daily_usage!
    : 0;

  // Calculation: Reorder Point (ROP)
  const lead_time_days = 3; // would come from supplier
  const rop_calculated = (lead_time_days * ingredient.avg_daily_usage!) + ingredient.safety_stock;
  const needsReorder = ingredient.on_hand_qty < rop_calculated;

  // Calculation: Suggested order quantity
  const forecast_days = 7;
  const forecast_qty = ingredient.avg_daily_usage! * forecast_days;
  const required_qty = Math.max(0, forecast_qty + ingredient.safety_stock - projectedStock);
  const pack_size = 5;
  const suggested_order_qty = Math.ceil(required_qty / pack_size) * pack_size;
  const expected_cost = suggested_order_qty * ingredient.unit_cost;

  const chartData = usageHistory.map((u) => ({
    date: new Date(u.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    actual: u.used_qty,
    forecast: u.forecasted_qty,
  }));

  const getStatusColor = (days: number) => {
    if (days < 2) return 'text-red-600';
    if (days < 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleAdjustment = () => {
    // Would call API to record adjustment
    console.log('Adjustment:', adjustmentQty, adjustmentReason);
    setAdjustmentQty(0);
    setAdjustmentReason('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] to-[#fafaf8] pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white sticky top-0 z-40 shadow-xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => navigate(`/admin/inventory/ingredients`)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold drop-shadow-sm">{ingredient.name}</h1>
                <p className="text-sm text-white/80">{ingredient.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {needsReorder && (
                <Badge className="bg-red-500 text-white animate-pulse">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Reorder Now
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                className="bg-white text-[#667c67] hover:bg-white/90"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-7xl mx-auto space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'On Hand',
              value: `${ingredient.on_hand_qty} ${ingredient.uom}`,
              subtext: `${daysOfStock.toFixed(1)} days`,
              icon: Package,
              color: getStatusColor(daysOfStock),
            },
            {
              label: 'Incoming',
              value: `${totalIncoming} ${ingredient.uom}`,
              subtext: incomingOrders.length > 0 ? `ETA: ${new Date(incomingOrders[0].eta).toLocaleDateString()}` : 'None',
              icon: Truck,
              color: 'text-blue-600',
            },
            {
              label: 'Daily Usage',
              value: `${ingredient.avg_daily_usage} ${ingredient.uom}`,
              subtext: 'Average',
              icon: TrendingUp,
              color: 'text-purple-600',
            },
            {
              label: 'Stock Value',
              value: `$${(ingredient.on_hand_qty * ingredient.unit_cost).toFixed(2)}`,
              subtext: `@$${ingredient.unit_cost}/${ingredient.uom}`,
              icon: DollarSign,
              color: 'text-green-600',
            },
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{metric.subtext}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Auto-Reorder Calculation */}
        <Card className={needsReorder ? 'border-2 border-red-500' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#667c67]" />
              Auto-Reorder Calculation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Calculation Breakdown */}
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">Calculation Breakdown</div>
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Daily Usage:</span>
                      <span className="font-semibold">{ingredient.avg_daily_usage} {ingredient.uom}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Forecast Window:</span>
                      <span className="font-semibold">{forecast_days} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Forecasted Need:</span>
                      <span className="font-semibold">{forecast_qty.toFixed(1)} {ingredient.uom}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Safety Stock:</span>
                      <span className="font-semibold">{ingredient.safety_stock} {ingredient.uom}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span className="text-gray-600">Total Required:</span>
                      <span className="font-semibold">{(forecast_qty + ingredient.safety_stock).toFixed(1)} {ingredient.uom}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current + Incoming:</span>
                      <span className="font-semibold">-{projectedStock} {ingredient.uom}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span className="text-gray-600">Need to Order:</span>
                      <span className="font-semibold text-orange-600">{required_qty.toFixed(1)} {ingredient.uom}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pack Size:</span>
                      <span className="font-semibold">{pack_size} {ingredient.uom}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t-2 pt-2">
                      <span>Suggested Order:</span>
                      <span className="text-[#667c67]">{suggested_order_qty} {ingredient.uom}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Reorder Details */}
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">Reorder Point Analysis</div>
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Lead Time:</span>
                      <span className="font-semibold">{lead_time_days} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Usage During Lead Time:</span>
                      <span className="font-semibold">{(lead_time_days * ingredient.avg_daily_usage!).toFixed(1)} {ingredient.uom}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Safety Stock:</span>
                      <span className="font-semibold">{ingredient.safety_stock} {ingredient.uom}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t-2 pt-2">
                      <span>Reorder Point (ROP):</span>
                      <span className="text-orange-600">{rop_calculated.toFixed(1)} {ingredient.uom}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-4">
                      <span className="text-gray-600">Current Stock:</span>
                      <span className={`font-bold ${ingredient.on_hand_qty < rop_calculated ? 'text-red-600' : 'text-green-600'}`}>
                        {ingredient.on_hand_qty} {ingredient.uom}
                      </span>
                    </div>
                    {needsReorder && (
                      <Badge className="w-full justify-center bg-red-500 text-white mt-2">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Below Reorder Point!
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <div className="text-sm font-semibold mb-2">Suggested Purchase Order</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span className="font-bold">{suggested_order_qty} {ingredient.uom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Cost:</span>
                      <span className="font-bold">${expected_cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ETA:</span>
                      <span className="font-semibold">
                        {new Date(Date.now() + lead_time_days * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full mt-3 bg-[#667c67] hover:bg-[#526250]">
                    Create Purchase Order
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage History Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#667c67]" />
              Usage History (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667c67" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#667c67" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip />
                  <Area
                    key="area-actual"
                    type="monotone"
                    dataKey="actual"
                    stroke="#667c67"
                    strokeWidth={2}
                    fill="url(#actualGradient)"
                    name="Actual Usage"
                  />
                  <Line
                    key="line-forecast"
                    type="monotone"
                    dataKey="forecast"
                    stroke="#e4dbc4"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Forecast"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stock Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#667c67]" />
              Stock Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Par Level</label>
                <Input
                  type="number"
                  value={ingredient.par_level}
                  disabled={!isEditing}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Target maximum stock level</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Reorder Point</label>
                <Input
                  type="number"
                  value={ingredient.reorder_point}
                  disabled={!isEditing}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Trigger auto-reorder</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Safety Stock</label>
                <Input
                  type="number"
                  value={ingredient.safety_stock}
                  disabled={!isEditing}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Buffer for uncertainties</p>
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={() => setIsEditing(false)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Adjustment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-[#667c67]" />
              Manual Stock Adjustment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Adjustment Quantity
                </label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setAdjustmentQty(Math.max(adjustmentQty - 1, -999))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={adjustmentQty}
                    onChange={(e) => setAdjustmentQty(parseFloat(e.target.value) || 0)}
                    className="text-center"
                    placeholder="0"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setAdjustmentQty(adjustmentQty + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Reason</label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select reason...</option>
                  <option value="spoilage">Spoilage</option>
                  <option value="waste">Waste</option>
                  <option value="correction">Inventory Correction</option>
                  <option value="transfer">Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <Button
              className="mt-4"
              disabled={adjustmentQty === 0 || !adjustmentReason}
              onClick={handleAdjustment}
            >
              Record Adjustment
            </Button>
          </CardContent>
        </Card>

        {/* Incoming Orders */}
        {incomingOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#667c67]" />
                Incoming Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {incomingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">
                        {order.qty} {order.uom}
                      </div>
                      <div className="text-sm text-gray-600">
                        PO: {order.po_id} • ETA: {new Date(order.eta).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className="capitalize">{order.status.replace('_', ' ')}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}