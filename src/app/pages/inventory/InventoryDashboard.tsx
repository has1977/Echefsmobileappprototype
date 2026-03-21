import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { motion } from 'motion/react';
import {
  Package, TrendingDown, AlertTriangle, Calendar,
  ShoppingCart, RefreshCw, BarChart3, DollarSign,
  TrendingUp, Clock, CheckCircle, XCircle, ArrowLeft, FileText,
  Truck, Play, AlertCircle, CheckCircle2, Download
} from 'lucide-react';
import {
  getInventoryStats,
  getRiskItems,
  purchaseOrders,
  inventoryAlerts,
  incomingOrders,
} from '../../services/inventoryData';

export function InventoryDashboard() {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  // Get real data from service
  const stats = getInventoryStats();
  const riskItems = getRiskItems();
  const activeAlerts = inventoryAlerts.filter(a => !a.acknowledged);
  const draftPOs = purchaseOrders.filter(po => po.status === 'draft');
  const activePOs = purchaseOrders.filter(po => ['approved', 'sent'].includes(po.status));

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStockLevelColor = (days: number) => {
    if (days < 2) return 'text-red-600';
    if (days < 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] to-[#fafaf8] pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white sticky top-0 z-40 shadow-xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => navigate('/control-panel')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold drop-shadow-sm">Inventory Dashboard</h1>
                <p className="text-sm text-white/80">Branch: Downtown</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4" />
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
              title: 'Inventory Value',
              value: `$${stats.totalInventoryValue.toLocaleString()}`,
              icon: DollarSign,
              color: 'from-green-500 to-emerald-600',
              change: '+5.2%',
            },
            {
              title: 'Low Stock Items',
              value: stats.lowStockItems,
              icon: AlertTriangle,
              color: 'from-yellow-500 to-orange-600',
              change: `-${stats.stockoutRisk} critical`,
            },
            {
              title: 'Stock Coverage',
              value: `${stats.avgStockCoverage} days`,
              icon: Calendar,
              color: 'from-blue-500 to-indigo-600',
              change: 'Average',
            },
            {
              title: 'Pending Orders',
              value: stats.pendingIncoming,
              icon: Truck,
              color: 'from-purple-500 to-purple-600',
              change: `$${stats.totalPOValue.toLocaleString()}`,
            },
          ].map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color} opacity-10 rounded-full -mr-16 -mt-16`} />
                  <CardContent className="p-4 relative">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{metric.change}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-[#667c67]" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                onClick={() => navigate(`/admin/inventory/po-drafts`)}
                className="h-auto py-4 flex-col bg-gradient-to-br from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67]"
              >
                <ShoppingCart className="w-6 h-6 mb-2" />
                <span className="text-sm">Approve POs</span>
                <Badge variant="secondary" className="mt-1 bg-white/20">
                  {stats.draftPOs} pending
                </Badge>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/inventory/auto-reorder`)}
                className="h-auto py-4 flex-col border-2 border-[#667c67] text-[#667c67] hover:bg-[#667c67] hover:text-white"
              >
                <RefreshCw className="w-6 h-6 mb-2" />
                <span className="text-sm">Run Reorder</span>
                <span className="text-xs opacity-70 mt-1">Calculate now</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate(`/admin/inventory/ingredients`)}
                className="h-auto py-4 flex-col"
              >
                <Package className="w-6 h-6 mb-2" />
                <span className="text-sm">View All Items</span>
                <span className="text-xs opacity-70 mt-1">{stats.lowStockItems} need attention</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate(`/admin/inventory/reports`)}
                className="h-auto py-4 flex-col"
              >
                <BarChart3 className="w-6 h-6 mb-2" />
                <span className="text-sm">Analytics</span>
                <span className="text-xs opacity-70 mt-1">View reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Risk Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Active Alerts
              </CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:shadow-md transition-all"
                  >
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(alert.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* High Risk Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Stock Risk Items
              </CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {riskItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/inventory/ingredients/${item.id}`)}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className="text-xs text-gray-600">
                        On hand: {item.on_hand_qty} {item.uom} • Usage: {item.avg_daily_usage} {item.uom}/day
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-lg ${getStockLevelColor(item.days_of_stock!)}`}>
                        {item.days_of_stock?.toFixed(1)} days
                      </div>
                      <div className="text-xs text-gray-500">stock left</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Purchase Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#667c67]" />
              Incoming Purchase Orders
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate(`/admin/inventory/po-drafts`)}>
              Manage POs
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activePOs.map((po) => (
                <div
                  key={po.id}
                  className="flex items-center gap-4 p-4 rounded-xl border hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/admin/inventory/po/${po.id}`)}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {po.id?.split('-')[1]}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{po.supplier_name}</div>
                    <div className="text-sm text-gray-600">
                      ETA: {new Date(po.eta!).toLocaleDateString()} • {po.items?.length || 0} items
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">${po.total_cost?.toLocaleString()}</div>
                    <Badge variant="outline" className="capitalize">
                      {po.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}