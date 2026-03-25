import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  MessageSquare, User, Calendar, Package, Truck, ShoppingBag, Phone,
  Search, ArrowLeft, Mail, Trash2, AlertCircle, CheckCircle, Clock,
  DollarSign, X, Send
} from 'lucide-react';
import { GlassCard, motion, AnimatePresence } from '../../design-system';

interface SupportMessage {
  id: string;
  orderId: string;
  branchId: string;
  branchName: string;
  subject: string;
  message: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  timestamp: string;
  status: 'new' | 'replied' | 'resolved';
  orderType: string;
  orderTotal: number;
}

export function AdminSupport() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { selectedBranch } = useApp();

  const [messages, setMessages] = useState<Record<string, SupportMessage>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'replied' | 'resolved'>('all');
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const savedMessages = localStorage.getItem('echefs_support_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  };

  const updateMessageStatus = (messageId: string, status: 'new' | 'replied' | 'resolved') => {
    const updatedMessages = {
      ...messages,
      [messageId]: {
        ...messages[messageId],
        status,
      },
    };
    setMessages(updatedMessages);
    localStorage.setItem('echefs_support_messages', JSON.stringify(updatedMessages));
  };

  const deleteMessage = (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    const updatedMessages = { ...messages };
    delete updatedMessages[messageId];
    setMessages(updatedMessages);
    localStorage.setItem('echefs_support_messages', JSON.stringify(updatedMessages));
    
    if (selectedMessage?.id === messageId) {
      setShowDetailModal(false);
      setSelectedMessage(null);
    }
  };

  const allMessages = Object.values(messages)
    .filter(msg => {
      // Filter by branch if selectedBranch exists
      if (selectedBranch && msg.branchId !== selectedBranch.id) return false;
      
      // Filter by status
      if (filterStatus !== 'all' && msg.status !== filterStatus) return false;
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          msg.customerName.toLowerCase().includes(query) ||
          msg.orderId.toLowerCase().includes(query) ||
          msg.subject.toLowerCase().includes(query) ||
          msg.message.toLowerCase().includes(query) ||
          msg.branchName.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort: new first, then by timestamp descending
      if (a.status === 'new' && b.status !== 'new') return -1;
      if (a.status !== 'new' && b.status === 'new') return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const stats = {
    total: Object.values(messages).filter(m => !selectedBranch || m.branchId === selectedBranch.id).length,
    new: Object.values(messages).filter(m => (!selectedBranch || m.branchId === selectedBranch.id) && m.status === 'new').length,
    replied: Object.values(messages).filter(m => (!selectedBranch || m.branchId === selectedBranch.id) && m.status === 'replied').length,
    resolved: Object.values(messages).filter(m => (!selectedBranch || m.branchId === selectedBranch.id) && m.status === 'resolved').length,
  };

  const getSubjectLabel = (subject: string) => {
    const labels: Record<string, string> = {
      wrong_order: 'Wrong Order',
      missing_items: 'Missing Items',
      quality_issue: 'Quality Issue',
      delivery_delay: 'Delivery Delay',
      refund_request: 'Refund Request',
      other: 'Other',
    };
    return labels[subject] || subject;
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'dine-in':
        return <Package className="w-4 h-4" />;
      case 'takeaway':
        return <ShoppingBag className="w-4 h-4" />;
      case 'delivery':
        return <Truck className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-red-500 text-white">New</Badge>;
      case 'replied':
        return <Badge className="bg-blue-500 text-white">Replied</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500 text-white">Resolved</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#FBF8F4] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-[#667c67] to-[#526250] text-white shadow-lg">
        <div className="px-5 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/admin')}
                variant="outline"
                size="sm"
                className="text-white border-white/30 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Support Messages</h1>
                <p className="text-sm text-white/80">
                  {selectedBranch 
                    ? `${selectedBranch.translations[i18n.language]?.name || 'Branch'}`
                    : 'All Branches'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <div className="text-white/70 text-xs mb-1">Total</div>
              <div className="text-xl font-bold">{stats.total}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <div className="text-white/70 text-xs mb-1">New</div>
              <div className="text-xl font-bold flex items-center justify-center gap-1">
                {stats.new > 0 && <AlertCircle className="w-4 h-4 text-red-300" />}
                {stats.new}
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <div className="text-white/70 text-xs mb-1">Replied</div>
              <div className="text-xl font-bold">{stats.replied}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <div className="text-white/70 text-xs mb-1">Resolved</div>
              <div className="text-xl font-bold">{stats.resolved}</div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Search and Filters */}
        <GlassCard variant="elevated" className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer, order ID, subject, or message..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="flex gap-2">
            {['all', 'new', 'replied', 'resolved'].map((status) => (
              <motion.button
                key={status}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(status as any)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filterStatus === status
                    ? 'bg-[#667c67] text-white shadow-md'
                    : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E5E7EB]'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </motion.button>
            ))}
          </div>
        </GlassCard>

        {/* Messages List */}
        <div className="space-y-3">
          {allMessages.length === 0 ? (
            <GlassCard variant="default" className="p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto text-[#9CA3AF] mb-4" />
              <h3 className="text-lg font-bold text-[#374151] mb-2">No messages found</h3>
              <p className="text-sm text-[#6B7280]">
                {filterStatus !== 'all' ? 'Try changing your filter' : 'Support messages will appear here'}
              </p>
            </GlassCard>
          ) : (
            allMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard 
                  variant="default" 
                  className={`p-5 cursor-pointer hover:shadow-lg transition-all ${
                    msg.status === 'new' ? 'border-2 border-red-200' : ''
                  }`}
                  onClick={() => {
                    setSelectedMessage(msg);
                    setShowDetailModal(true);
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      msg.status === 'new' ? 'bg-red-100' :
                      msg.status === 'replied' ? 'bg-blue-100' :
                      'bg-green-100'
                    }`}>
                      <MessageSquare className={`w-6 h-6 ${
                        msg.status === 'new' ? 'text-red-600' :
                        msg.status === 'replied' ? 'text-blue-600' :
                        'text-green-600'
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-[#1F2933] truncate">
                            {getSubjectLabel(msg.subject)}
                          </h4>
                          <p className="text-sm text-[#6B7280]">
                            {msg.customerName} • {new Date(msg.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {getStatusBadge(msg.status)}
                      </div>

                      {/* Branch and Order Info */}
                      <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-[#6B7280]">
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          <span>Order #{msg.orderId.slice(-6)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getOrderTypeIcon(msg.orderType)}
                          <span className="capitalize">{msg.orderType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>${msg.orderTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">{msg.branchName}</span>
                        </div>
                      </div>

                      {/* Message Preview */}
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <p className="text-sm text-[#374151] line-clamp-2">
                          {msg.message}
                        </p>
                      </div>

                      {/* Contact Info */}
                      <div className="flex gap-3 mt-3 text-xs">
                        {msg.customerPhone && (
                          <div className="flex items-center gap-1 text-[#6B7280]">
                            <Phone className="w-3 h-3" />
                            <span>{msg.customerPhone}</span>
                          </div>
                        )}
                        {msg.customerEmail && (
                          <div className="flex items-center gap-1 text-[#6B7280]">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{msg.customerEmail}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-5"
            onClick={() => {
              setShowDetailModal(false);
              setSelectedMessage(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedMessage.status === 'new' ? 'bg-red-100' :
                      selectedMessage.status === 'replied' ? 'bg-blue-100' :
                      'bg-green-100'
                    }`}>
                      <MessageSquare className={`w-6 h-6 ${
                        selectedMessage.status === 'new' ? 'text-red-600' :
                        selectedMessage.status === 'replied' ? 'text-blue-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1F2933]">
                        {getSubjectLabel(selectedMessage.subject)}
                      </h3>
                      <p className="text-sm text-[#6B7280]">
                        {new Date(selectedMessage.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedMessage(null);
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-[#F9FAFB] flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5 text-[#6B7280]" />
                  </button>
                </div>

                {/* Customer Info */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-600 mb-3">Customer Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-[#1F2933]">{selectedMessage.customerName}</span>
                    </div>
                    {selectedMessage.customerPhone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <a 
                          href={`tel:${selectedMessage.customerPhone}`}
                          className="text-sm text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {selectedMessage.customerPhone}
                        </a>
                      </div>
                    )}
                    {selectedMessage.customerEmail && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <a 
                          href={`mailto:${selectedMessage.customerEmail}`}
                          className="text-sm text-blue-600 hover:underline truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {selectedMessage.customerEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Info */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <h4 className="text-sm font-semibold text-purple-600 mb-3">Order Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-[#6B7280]">Order ID:</span>
                      <p className="font-medium text-[#1F2933]">#{selectedMessage.orderId.slice(-8)}</p>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Branch:</span>
                      <p className="font-medium text-[#1F2933]">{selectedMessage.branchName}</p>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Order Type:</span>
                      <p className="font-medium text-[#1F2933] capitalize">{selectedMessage.orderType}</p>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Order Total:</span>
                      <p className="font-medium text-[#1F2933]">${selectedMessage.orderTotal.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-[#374151] mb-2">Message</h4>
                  <div className="bg-[#F9FAFB] rounded-xl p-4 border-2 border-[#E5E7EB]">
                    <p className="text-sm text-[#374151] whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-[#374151] mb-3">Update Status</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => {
                        updateMessageStatus(selectedMessage.id, 'new');
                        setSelectedMessage({ ...selectedMessage, status: 'new' });
                      }}
                      size="sm"
                      variant={selectedMessage.status === 'new' ? 'default' : 'outline'}
                      className={selectedMessage.status === 'new' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-red-200 text-red-600'}
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      New
                    </Button>
                    <Button
                      onClick={() => {
                        updateMessageStatus(selectedMessage.id, 'replied');
                        setSelectedMessage({ ...selectedMessage, status: 'replied' });
                      }}
                      size="sm"
                      variant={selectedMessage.status === 'replied' ? 'default' : 'outline'}
                      className={selectedMessage.status === 'replied' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-blue-200 text-blue-600'}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Replied
                    </Button>
                    <Button
                      onClick={() => {
                        updateMessageStatus(selectedMessage.id, 'resolved');
                        setSelectedMessage({ ...selectedMessage, status: 'resolved' });
                      }}
                      size="sm"
                      variant={selectedMessage.status === 'resolved' ? 'default' : 'outline'}
                      className={selectedMessage.status === 'resolved' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-green-200 text-green-600'}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolved
                    </Button>
                  </div>
                </div>

                {/* Quick Contact Actions */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {selectedMessage.customerPhone && (
                    <a
                      href={`tel:${selectedMessage.customerPhone}`}
                      className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="w-4 h-4" />
                      Call Customer
                    </a>
                  )}
                  {selectedMessage.customerEmail && (
                    <a
                      href={`mailto:${selectedMessage.customerEmail}?subject=Re: ${getSubjectLabel(selectedMessage.subject)} - Order ${selectedMessage.orderId}`}
                      className="flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail className="w-4 h-4" />
                      Email Customer
                    </a>
                  )}
                </div>

                {/* Delete Button */}
                <Button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Message
                </Button>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
