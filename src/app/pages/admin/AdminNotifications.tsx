import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { motion } from 'motion/react';
import {
  Bell, ArrowLeft, Plus, Search, AlertTriangle,
  Info, CheckCircle, XCircle, Trash2, Eye,
  Send, Calendar, Users
} from 'lucide-react';
import { notifications, getUnreadNotifications } from '../../services/adminData';
import type { Notification } from '../../services/adminData';

export function AdminNotifications() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch = 
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesSeverity = filterSeverity === 'all' || notif.severity === filterSeverity;
    return matchesSearch && matchesType && matchesSeverity;
  });

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    critical: notifications.filter(n => n.severity === 'error').length,
  };

  const getSeverityColor = (severity: Notification['severity']) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      success: 'bg-green-100 text-green-800',
    };
    return colors[severity];
  };

  const getSeverityIcon = (severity: Notification['severity']) => {
    const icons = {
      info: Info,
      warning: AlertTriangle,
      error: XCircle,
      success: CheckCircle,
    };
    const Icon = icons[severity];
    return <Icon className="w-4 h-4" />;
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
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold drop-shadow-sm">Notifications</h1>
                <p className="text-sm text-white/80">Manage system notifications</p>
              </div>
            </div>

            <Button
              size="sm"
              className="bg-white text-[#667c67] hover:bg-white/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.unread}</div>
                  <div className="text-sm text-gray-600">Unread</div>
                </div>
                <Eye className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
                  <div className="text-sm text-gray-600">Critical</div>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">All Types</option>
                <option value="order">Order</option>
                <option value="system">System</option>
                <option value="promotion">Promotion</option>
                <option value="alert">Alert</option>
                <option value="inventory">Inventory</option>
              </select>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">All Severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="success">Success</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`hover:shadow-lg transition-shadow ${!notif.read ? 'border-l-4 border-[#667c67]' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getSeverityColor(notif.severity)}`}>
                          {getSeverityIcon(notif.severity)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold">{notif.title}</h3>
                              {!notif.read && (
                                <Badge className="bg-[#667c67] text-white text-xs mt-1">New</Badge>
                              )}
                            </div>
                            <Badge className={`capitalize ${getSeverityColor(notif.severity)}`}>
                              {notif.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(notif.created_at).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span className="capitalize">{notif.recipient_type}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notif.read && (
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
