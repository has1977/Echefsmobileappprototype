import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Gift, Clock, MapPin, ChevronRight, Bell, Filter } from 'lucide-react';
import { GlassCard, motion } from '../../design-system';
import { Logo } from '../../components/shared/Logo';

interface Notification {
  id: string;
  type: 'promotion' | 'points' | 'reward';
  title: string;
  message: string;
  branchName: string;
  branchId: string;
  timestamp: string;
  isRead: boolean;
  actionType: 'promotion' | 'branch';
  actionId: string;
  status: 'active' | 'expiring';
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | string>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'promotion',
      title: '🎉 New Promotion Available',
      message: 'Buy 1 Get 1 Free on all main courses!',
      branchName: 'eChefs Downtown',
      branchId: '1',
      timestamp: '2 hours ago',
      isRead: false,
      actionType: 'promotion',
      actionId: '1',
      status: 'active',
    },
    {
      id: '2',
      type: 'points',
      title: '✨ Points Earned',
      message: 'You earned 50 points from your recent order',
      branchName: 'eChefs Plaza',
      branchId: '2',
      timestamp: 'Yesterday',
      isRead: false,
      actionType: 'branch',
      actionId: '2',
      status: 'active',
    },
    {
      id: '3',
      type: 'promotion',
      title: '⏰ Promotion Expiring Soon',
      message: 'Free Coffee promotion expires in 2 days',
      branchName: 'eChefs Downtown',
      branchId: '1',
      timestamp: 'Yesterday',
      isRead: true,
      actionType: 'promotion',
      actionId: '2',
      status: 'expiring',
    },
    {
      id: '4',
      type: 'reward',
      title: '🎁 Reward Available',
      message: 'You have enough points to redeem a free dessert',
      branchName: 'eChefs Downtown',
      branchId: '1',
      timestamp: '2 days ago',
      isRead: true,
      actionType: 'branch',
      actionId: '1',
      status: 'active',
    },
    {
      id: '5',
      type: 'promotion',
      title: '🍰 Dessert Special',
      message: '20% off all desserts this week',
      branchName: 'eChefs Mall',
      branchId: '3',
      timestamp: '3 days ago',
      isRead: true,
      actionType: 'promotion',
      actionId: '3',
      status: 'active',
    },
  ]);

  const branches = Array.from(new Set(notifications.map(n => n.branchName)));

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.branchName === filter);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n))
    );

    // Navigate to appropriate page
    if (notification.actionType === 'promotion') {
      navigate(`/loyalty-additions/promotion/${notification.actionId}`);
    } else {
      navigate(`/loyalty-additions/branch/${notification.actionId}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'promotion':
        return '🎉';
      case 'points':
        return '✨';
      case 'reward':
        return '🎁';
      default:
        return '📢';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F7F3] via-white to-[#FBF8F4] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#667c67]/10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1F2933]" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#1F2933]">Notifications</h1>
              <p className="text-sm text-[#6B7280]">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
            <div className="relative">
              <Bell className="w-6 h-6 text-[#667c67]" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{unreadCount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-[#667c67] to-[#546352] text-white shadow-md'
                  : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
              }`}
            >
              All
            </button>
            {branches.map((branch) => (
              <button
                key={branch}
                onClick={() => setFilter(branch)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  filter === branch
                    ? 'bg-gradient-to-r from-[#667c67] to-[#546352] text-white shadow-md'
                    : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
                }`}
              >
                {branch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-6 space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-24 h-24 rounded-full bg-[#E4DBC4]/30 flex items-center justify-center mb-6">
              <Bell className="w-12 h-12 text-[#667c67]" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2933] mb-2">No Notifications</h3>
            <p className="text-[#6B7280]">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard
                variant={notification.isRead ? 'default' : 'elevated'}
                className={`p-5 cursor-pointer group hover:shadow-xl transition-all ${
                  !notification.isRead ? 'border-2 border-[#667c67]/20' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E4DBC4] to-[#E4DBC4]/60 flex items-center justify-center text-2xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3
                        className={`text-base font-bold ${
                          notification.isRead ? 'text-[#6B7280]' : 'text-[#1F2933]'
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#667c67] to-[#546352] flex-shrink-0 mt-1" />
                      )}
                    </div>

                    <p
                      className={`text-sm mb-3 ${
                        notification.isRead ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                      }`}
                    >
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-[#667c67]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="font-medium">{notification.branchName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#6B7280]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{notification.timestamp}</span>
                      </div>
                      {notification.status === 'expiring' && (
                        <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">
                          Expiring Soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-[#667c67] group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>

      {/* Mark All as Read */}
      {unreadCount > 0 && (
        <div className="fixed bottom-6 left-6 right-6 z-30">
          <button
            onClick={() =>
              setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            }
            className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-[#667c67] text-[#667c67] font-bold hover:bg-[#667c67] hover:text-white transition-all shadow-lg"
          >
            Mark All as Read
          </button>
        </div>
      )}
    </div>
  );
}
