import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { motion } from 'motion/react';
import {
  Package, Search, Filter, ArrowLeft, Plus,
  TrendingUp, TrendingDown, AlertTriangle, Download,
  Edit2, Trash2, MoreVertical, ArrowUpDown, Calendar
} from 'lucide-react';
import type { Ingredient } from '../../types/inventory';
import { ingredients } from '../../services/inventoryData';

export function IngredientList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'usage' | 'cost'>('name');

  const categories = ['all', ...Array.from(new Set(ingredients.map(i => i.category).filter(Boolean)))];

  const filteredIngredients = ingredients.filter((ing) => {
    const matchesSearch = ing.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || ing.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedIngredients = [...filteredIngredients].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'stock':
        return (a.days_of_stock || 0) - (b.days_of_stock || 0);
      case 'usage':
        return (b.avg_daily_usage || 0) - (a.avg_daily_usage || 0);
      case 'cost':
        return (b.on_hand_qty * b.unit_cost) - (a.on_hand_qty * a.unit_cost);
      default:
        return 0;
    }
  });

  const getStockStatus = (ingredient: Ingredient) => {
    if (!ingredient.days_of_stock) return 'unknown';
    if (ingredient.days_of_stock < 2) return 'critical';
    if (ingredient.days_of_stock < 5) return 'low';
    return 'good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'low':
        return 'bg-yellow-500 text-white';
      case 'good':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStockLevelColor = (days: number | undefined) => {
    if (!days) return 'text-gray-600';
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
                onClick={() => navigate(`/admin/inventory`)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold drop-shadow-sm">Ingredient Inventory</h1>
                <p className="text-sm text-white/80">{filteredIngredients.length} items</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
                onClick={() => navigate(`/admin/inventory/ingredients/new`)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ingredients..."
                className="pl-9 bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="text-gray-900">
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white"
            >
              <option value="name" className="text-gray-900">Sort: Name</option>
              <option value="stock" className="text-gray-900">Sort: Stock Level</option>
              <option value="usage" className="text-gray-900">Sort: Usage</option>
              <option value="cost" className="text-gray-900">Sort: Value</option>
            </select>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-7xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: 'Total Items',
              value: filteredIngredients.length,
              color: 'bg-blue-500',
            },
            {
              label: 'Critical Stock',
              value: filteredIngredients.filter(i => getStockStatus(i) === 'critical').length,
              color: 'bg-red-500',
            },
            {
              label: 'Low Stock',
              value: filteredIngredients.filter(i => getStockStatus(i) === 'low').length,
              color: 'bg-yellow-500',
            },
            {
              label: 'Total Value',
              value: `$${filteredIngredients.reduce((sum, i) => sum + (i.on_hand_qty * i.unit_cost), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
              color: 'bg-green-500',
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ingredients List */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Ingredient
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      On Hand
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Daily Usage
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Days Left
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      ROP
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Value
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sortedIngredients.map((ingredient, i) => {
                    const status = getStockStatus(ingredient);
                    const value = ingredient.on_hand_qty * ingredient.unit_cost;
                    
                    return (
                      <motion.tr
                        key={ingredient.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/admin/inventory/ingredients/${ingredient.id}`)}
                      >
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-semibold text-gray-900">{ingredient.name}</div>
                            <div className="text-sm text-gray-600">{ingredient.category}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold">
                            {ingredient.on_hand_qty} {ingredient.uom}
                          </div>
                          <div className="text-xs text-gray-500">
                            Par: {ingredient.par_level} {ingredient.uom}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium">
                            {ingredient.avg_daily_usage} {ingredient.uom}/day
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className={`font-bold text-lg ${getStockLevelColor(ingredient.days_of_stock)}`}>
                            {ingredient.days_of_stock?.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500">days</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            {ingredient.reorder_point} {ingredient.uom}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold">
                            ${value.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            @${ingredient.unit_cost}/{ingredient.uom}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={getStatusColor(status)}>
                            {status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/inventory/ingredients/${ingredient.id}`);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}