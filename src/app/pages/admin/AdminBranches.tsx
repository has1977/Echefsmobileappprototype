import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Plus, Building2, MapPin, Phone, Mail, Clock, 
  Edit2, Trash2, Users, Grid3x3, Eye, EyeOff, Search, Filter,
  MoreVertical, CheckCircle2, XCircle, Calendar, HelpCircle
} from 'lucide-react';
import { db } from '../../lib/database';
import { BranchGuideTour, useBranchTour } from '../../components/admin/BranchGuideTour';
import type { Branch } from '../../lib/types';

export function AdminBranches() {
  const navigate = useNavigate();
  const { currentLanguage, branches: allBranches, refreshData } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const { showTour, closeTour, openTour } = useBranchTour();

  const isRTL = currentLanguage === 'ar';

  // Filter branches
  const filteredBranches = allBranches.filter(branch => {
    const matchesSearch = branch.translations[currentLanguage]?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         branch.translations[currentLanguage]?.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'enabled' && branch.enabled) ||
                         (filterStatus === 'disabled' && !branch.enabled);
    return matchesSearch && matchesFilter;
  });

  const handleToggleStatus = (branchId: string) => {
    const branch = allBranches.find(b => b.id === branchId);
    if (branch) {
      db.updateBranch(branchId, { enabled: !branch.enabled });
      refreshData();
    }
  };

  const handleDeleteBranch = (branchId: string) => {
    if (confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      db.deleteBranch(branchId);
      refreshData();
    }
  };

  // Calculate statistics
  const stats = {
    total: allBranches.length,
    active: allBranches.filter(b => b.enabled).length,
    inactive: allBranches.filter(b => !b.enabled).length,
    totalTables: allBranches.reduce((sum, b) => sum + b.regions.reduce((rSum, r) => rSum + r.tables.length, 0), 0),
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/admin')}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Building2 className="w-8 h-8" />
                Branch Management
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Manage restaurant locations and settings
              </p>
            </div>
            <Button
              onClick={() => navigate('/admin/branches/new')}
              size="lg"
              variant="light"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Branch
            </Button>
            <Button
              onClick={openTour}
              size="lg"
              variant="secondary"
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              Help
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0 }}
            >
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-4 text-center">
                  <Building2 className="w-8 h-8 mx-auto mb-2 text-white" />
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-xs text-white/80 mt-1">Total Branches</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-300" />
                  <div className="text-2xl font-bold text-white">{stats.active}</div>
                  <div className="text-xs text-white/80 mt-1">Active</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-4 text-center">
                  <XCircle className="w-8 h-8 mx-auto mb-2 text-red-300" />
                  <div className="text-2xl font-bold text-white">{stats.inactive}</div>
                  <div className="text-xs text-white/80 mt-1">Inactive</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-4 text-center">
                  <Grid3x3 className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                  <div className="text-2xl font-bold text-white">{stats.totalTables}</div>
                  <div className="text-xs text-white/80 mt-1">Total Tables</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search branches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? 'bg-[#667c67]' : ''}
              >
                All ({stats.total})
              </Button>
              <Button
                variant={filterStatus === 'enabled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('enabled')}
                className={filterStatus === 'enabled' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Active ({stats.active})
              </Button>
              <Button
                variant={filterStatus === 'disabled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('disabled')}
                className={filterStatus === 'disabled' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Inactive ({stats.inactive})
              </Button>
            </div>
          </div>
        </div>

        {/* Branches Grid */}
        {filteredBranches.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No branches found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first branch'}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/admin/branches/new')} className="bg-[#667c67]">
                <Plus className="w-5 h-5 mr-2" />
                Add First Branch
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBranches.map((branch, index) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-xl transition-shadow overflow-hidden h-full">
                  {/* Branch Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[#667c67] to-[#526250] overflow-hidden">
                    {branch.imageUrl ? (
                      <img
                        src={branch.imageUrl}
                        alt={branch.translations[currentLanguage]?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-20 h-20 text-white/30" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={`${
                          branch.enabled
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        } shadow-lg`}
                      >
                        {branch.enabled ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    {/* Branch Name */}
                    <div>
                      <h3 className="font-bold text-lg line-clamp-1">
                        {branch.translations[currentLanguage]?.name || branch.translations.en?.name}
                      </h3>
                    </div>

                    {/* Branch Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">
                          {branch.translations[currentLanguage]?.address || branch.translations.en?.address}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{branch.phone}</span>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{branch.email}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-[#667c67]" />
                        <span className="font-semibold">{branch.regions.length}</span>
                        <span className="text-muted-foreground">Regions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Grid3x3 className="w-4 h-4 text-[#667c67]" />
                        <span className="font-semibold">
                          {branch.regions.reduce((sum, r) => sum + r.tables.length, 0)}
                        </span>
                        <span className="text-muted-foreground">Tables</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/admin/branches/${branch.id}/edit`)}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/admin/table-management?branchId=${branch.id}`)}
                      >
                        <Grid3x3 className="w-4 h-4 mr-2" />
                        Tables
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(branch.id)}
                        className={branch.enabled ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}
                      >
                        {branch.enabled ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Disable
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Enable
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBranch(branch.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Branch Guide Tour */}
      <AnimatePresence>
        {showTour && (
          <BranchGuideTour onClose={closeTour} />
        )}
      </AnimatePresence>
    </div>
  );
}