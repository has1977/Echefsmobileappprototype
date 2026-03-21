import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { motion } from 'motion/react';
import { 
  ChevronLeft, LayoutDashboard, UtensilsCrossed, Tag, BarChart3,
  Users, Settings, Crown, Gift, TrendingUp, ShoppingCart,
  Clock, DollarSign, Star, Sparkles
} from 'lucide-react';

export function ManagerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentLanguage } = useApp();

  const isRTL = currentLanguage === 'ar';

  // Mock stats - would come from API
  const stats = {
    todayOrders: 47,
    todayRevenue: 2847,
    activePromotions: 3,
    loyaltyMembers: 1247,
    avgOrderValue: 35.50,
    customerSatisfaction: 4.8,
  };

  const quickActions = [
    {
      title: 'Loyalty & Promotions',
      description: 'Manage loyalty programs, promotions & gifts',
      icon: Crown,
      color: 'from-yellow-500 to-amber-600',
      path: '/manager/loyalty-promotions',
      badge: 'New',
      highlighted: true,
    },
    {
      title: 'Menu Management',
      description: 'Update menu items and pricing',
      icon: UtensilsCrossed,
      color: 'from-[#667c67] to-[#526250]',
      path: '/manager/menu',
    },
    {
      title: 'Promotions',
      description: 'View and manage active promotions',
      icon: Tag,
      color: 'from-orange-500 to-red-600',
      path: '/manager/promotions',
    },
    {
      title: 'Reports & Analytics',
      description: 'View performance metrics',
      icon: BarChart3,
      color: 'from-blue-500 to-indigo-600',
      path: '/manager/reports',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white sticky top-0 z-20 shadow-lg">
        <div className="p-4">
          <div className="flex items-center gap-4 mb-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/')}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold">Manager Dashboard</h1>
              <p className="text-sm text-white/80">Welcome back, {user?.name}</p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/profile')}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Today's Stats */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#667c67]" />
            Today's Performance
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-gradient-to-br from-[#667c67] to-[#526250] text-white">
              <ShoppingCart className="w-6 h-6 mb-2 opacity-80" />
              <p className="text-2xl font-bold">{stats.todayOrders}</p>
              <p className="text-sm text-white/80">Orders Today</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-[#e4dbc4] to-[#d4c9a8]">
              <DollarSign className="w-6 h-6 mb-2 text-[#667c67]" />
              <p className="text-2xl font-bold text-[#667c67]">${stats.todayRevenue}</p>
              <p className="text-sm text-[#526250]">Revenue</p>
            </Card>

            <Card className="p-4 border-2 border-[#667c67]/20">
              <Crown className="w-6 h-6 mb-2 text-[#667c67]" />
              <p className="text-2xl font-bold">{stats.loyaltyMembers}</p>
              <p className="text-sm text-muted-foreground">Loyalty Members</p>
            </Card>

            <Card className="p-4 border-2 border-[#667c67]/20">
              <Star className="w-6 h-6 mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{stats.customerSatisfaction}</p>
              <p className="text-sm text-muted-foreground">Satisfaction</p>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`overflow-hidden cursor-pointer transition-all hover:shadow-xl active:scale-98 ${
                    action.highlighted ? 'border-2 border-yellow-400 ring-2 ring-yellow-400/20' : 'border-2 border-transparent hover:border-[#667c67]/20'
                  }`}
                  onClick={() => navigate(action.path)}
                >
                  <div className="p-4 flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg relative`}>
                      <action.icon className="w-7 h-7 text-white" strokeWidth={2} />
                      {action.highlighted && (
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                          className="absolute -top-1 -right-1"
                        >
                          <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-base">{action.title}</h3>
                        {action.badge && (
                          <Badge className="bg-yellow-500 text-white border-none">
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>

                    <ChevronLeft className={`w-5 h-5 text-muted-foreground ${isRTL ? '' : 'rotate-180'}`} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Promotions Summary */}
        <Card className="p-4 bg-gradient-to-br from-[#f0eadc] to-white border-2 border-[#667c67]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#667c67] rounded-full flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{stats.activePromotions} Active Promotions</h3>
              <p className="text-sm text-muted-foreground">Running campaigns</p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate('/manager/loyalty-promotions')}
              className="bg-[#667c67] hover:bg-[#526250]"
            >
              Manage
            </Button>
          </div>
        </Card>

        {/* Quick Tips */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Pro Tip</h3>
              <p className="text-sm text-blue-700">
                Create time-limited promotions to boost sales during slow hours. Happy hour promotions typically increase revenue by 25%!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
