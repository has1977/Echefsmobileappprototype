import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Save, Plus, Building2, MapPin, Phone, Mail, Clock, 
  Edit2, Trash2, Users, Grid3x3, Eye, EyeOff, Languages,
  ChevronDown, ChevronUp, Table as TableIcon, QrCode, Wifi,
  Check, X, AlertCircle, Globe
} from 'lucide-react';
import { db } from '../../lib/database';
import type { Branch, Region, Table, MenuType } from '../../lib/types';

type RegionType = 'mainHall' | 'smoking' | 'nonSmoking' | 'outdoor' | 'vip' | 'terrace' | 'bar';

const REGION_TYPES: { value: RegionType; label: string; icon: string }[] = [
  { value: 'mainHall', label: 'Main Hall', icon: '🏛️' },
  { value: 'smoking', label: 'Smoking Area', icon: '🚬' },
  { value: 'nonSmoking', label: 'Non-Smoking', icon: '🚭' },
  { value: 'outdoor', label: 'Outdoor', icon: '🌳' },
  { value: 'vip', label: 'VIP Section', icon: '👑' },
  { value: 'terrace', label: 'Terrace', icon: '🏖️' },
  { value: 'bar', label: 'Bar Area', icon: '🍺' },
];

const MENU_TYPES: { value: MenuType; label: string }[] = [
  { value: 'main', label: 'Main Menu' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'drinks', label: 'Drinks' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'business', label: 'Business Lunch' },
  { value: 'kids', label: 'Kids Menu' },
];

export function AdminBranchEditor() {
  const navigate = useNavigate();
  const { branchId } = useParams<{ branchId: string }>();
  const { currentLanguage, languages, refreshData } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  
  // Operating hours state
  const [is24Hours, setIs24Hours] = useState(false);
  const [sameHoursAllDays, setSameHoursAllDays] = useState(false);
  const [closedDays, setClosedDays] = useState<Set<string>>(new Set());

  const isEditing = branchId && branchId !== 'new';
  const isRTL = currentLanguage === 'ar';

  // Branch form state
  const [branchData, setBranchData] = useState<Partial<Branch>>({
    translations: {},
    location: { latitude: 0, longitude: 0 },
    phone: '',
    email: '',
    hours: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '22:00' },
      saturday: { open: '09:00', close: '22:00' },
      sunday: { open: '10:00', close: '20:00' },
    },
    regions: [],
    enabledMenuTypes: ['main'],
    imageUrl: '',
    enabled: true,
  });

  // Load existing branch data if editing
  useEffect(() => {
    if (isEditing) {
      const branch = db.getBranch(branchId);
      if (branch) {
        setBranchData(branch);
      } else {
        setError('Branch not found');
      }
    }
  }, [branchId, isEditing]);

  const handleSaveBranch = () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validation
      if (!branchData.phone || !branchData.email) {
        throw new Error('Phone and email are required');
      }

      const hasTranslations = languages.some(lang => 
        branchData.translations?.[lang.code]?.name
      );
      if (!hasTranslations) {
        throw new Error('At least one language translation is required');
      }

      if (isEditing) {
        db.updateBranch(branchId!, branchData as Branch);
        setSuccess('Branch updated successfully!');
      } else {
        db.addBranch(branchData as Omit<Branch, 'id'>);
        setSuccess('Branch created successfully!');
        setTimeout(() => navigate('/admin/branches'), 1500);
      }
      refreshData();
    } catch (err: any) {
      setError(err.message || 'Failed to save branch');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRegion = () => {
    const newRegion: Region = {
      id: `region_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      translations: {},
      type: 'mainHall',
      tables: [],
      capacity: 0,
    };
    setBranchData({
      ...branchData,
      regions: [...(branchData.regions || []), newRegion],
    });
    setExpandedRegions(new Set([...expandedRegions, newRegion.id]));
  };

  const handleUpdateRegion = (regionId: string, updates: Partial<Region>) => {
    setBranchData({
      ...branchData,
      regions: branchData.regions?.map(r => 
        r.id === regionId ? { ...r, ...updates } : r
      ),
    });
  };

  const handleDeleteRegion = (regionId: string) => {
    if (confirm('Delete this region and all its tables?')) {
      setBranchData({
        ...branchData,
        regions: branchData.regions?.filter(r => r.id !== regionId),
      });
      const newExpanded = new Set(expandedRegions);
      newExpanded.delete(regionId);
      setExpandedRegions(newExpanded);
    }
  };

  const handleAddTable = (regionId: string) => {
    const region = branchData.regions?.find(r => r.id === regionId);
    if (!region) return;

    const existingNumbers = region.tables.map(t => t.number);
    const nextNumber = existingNumbers.length > 0 
      ? Math.max(...existingNumbers) + 1 
      : 1;

    const newTable: Table = {
      id: `table_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      number: nextNumber,
      seats: 4,
      qrCode: `QR-${branchData.id || 'NEW'}-${regionId}-${nextNumber}`,
      status: 'available',
    };

    handleUpdateRegion(regionId, {
      tables: [...region.tables, newTable],
      capacity: region.capacity + newTable.seats,
    });
  };

  const handleUpdateTable = (regionId: string, tableId: string, updates: Partial<Table>) => {
    const region = branchData.regions?.find(r => r.id === regionId);
    if (!region) return;

    const updatedTables = region.tables.map(t => 
      t.id === tableId ? { ...t, ...updates } : t
    );

    const newCapacity = updatedTables.reduce((sum, t) => sum + t.seats, 0);

    handleUpdateRegion(regionId, {
      tables: updatedTables,
      capacity: newCapacity,
    });
  };

  const handleDeleteTable = (regionId: string, tableId: string) => {
    if (confirm('Delete this table?')) {
      const region = branchData.regions?.find(r => r.id === regionId);
      if (!region) return;

      const updatedTables = region.tables.filter(t => t.id !== tableId);
      const newCapacity = updatedTables.reduce((sum, t) => sum + t.seats, 0);

      handleUpdateRegion(regionId, {
        tables: updatedTables,
        capacity: newCapacity,
      });
    }
  };

  const toggleRegionExpand = (regionId: string) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(regionId)) {
      newExpanded.delete(regionId);
    } else {
      newExpanded.add(regionId);
    }
    setExpandedRegions(newExpanded);
  };

  const totalTables = branchData.regions?.reduce((sum, r) => sum + r.tables.length, 0) || 0;
  const totalCapacity = branchData.regions?.reduce((sum, r) => sum + r.capacity, 0) || 0;

  return (
    <div className="min-h-screen bg-background pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white p-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/admin/branches')}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Building2 className="w-8 h-8" />
                {isEditing ? 'Edit Branch' : 'Create New Branch'}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                {isEditing ? 'Update branch details, regions, and tables' : 'Set up a new restaurant location'}
              </p>
            </div>
            <Button
              onClick={handleSaveBranch}
              disabled={loading}
              size="lg"
              variant="light"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Saving...' : 'Save Branch'}
            </Button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-6 pt-4"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-6 pt-4"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-900">Success</p>
                <p className="text-sm text-green-700">{success}</p>
              </div>
              <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#667c67]" />
              Basic Information
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Translations */}
            <div>
              <label className="block font-semibold mb-3 flex items-center gap-2">
                <Languages className="w-5 h-5 text-[#667c67]" />
                Branch Names & Addresses (All Languages)
              </label>
              <div className="space-y-4">
                {languages.map(lang => (
                  <div key={lang.code} className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-semibold">{lang.nativeName}</span>
                      <span className="text-sm text-muted-foreground">({lang.name})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Branch Name</label>
                        <input
                          type="text"
                          value={branchData.translations?.[lang.code]?.name || ''}
                          onChange={(e) => setBranchData({
                            ...branchData,
                            translations: {
                              ...branchData.translations,
                              [lang.code]: {
                                ...branchData.translations?.[lang.code],
                                name: e.target.value,
                                address: branchData.translations?.[lang.code]?.address || '',
                              },
                            },
                          })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67]"
                          placeholder={`Branch name in ${lang.name}`}
                          dir={lang.direction}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <input
                          type="text"
                          value={branchData.translations?.[lang.code]?.address || ''}
                          onChange={(e) => setBranchData({
                            ...branchData,
                            translations: {
                              ...branchData.translations,
                              [lang.code]: {
                                ...branchData.translations?.[lang.code],
                                name: branchData.translations?.[lang.code]?.name || '',
                                address: e.target.value,
                              },
                            },
                          })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67]"
                          placeholder={`Address in ${lang.name}`}
                          dir={lang.direction}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#667c67]" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={branchData.phone}
                  onChange={(e) => setBranchData({ ...branchData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67]"
                  placeholder="+1234567890"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#667c67]" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={branchData.email}
                  onChange={(e) => setBranchData({ ...branchData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67]"
                  placeholder="branch@echefs.com"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#667c67]" />
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={branchData.location?.latitude || 0}
                  onChange={(e) => setBranchData({
                    ...branchData,
                    location: {
                      ...branchData.location!,
                      latitude: parseFloat(e.target.value) || 0,
                    },
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67]"
                  placeholder="40.7128"
                />
              </div>
              <div>
                <label className="block font-medium mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#667c67]" />
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={branchData.location?.longitude || 0}
                  onChange={(e) => setBranchData({
                    ...branchData,
                    location: {
                      ...branchData.location!,
                      longitude: parseFloat(e.target.value) || 0,
                    },
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67]"
                  placeholder="-74.0060"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block font-medium mb-2">Branch Image URL</label>
              <input
                type="url"
                value={branchData.imageUrl}
                onChange={(e) => setBranchData({ ...branchData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67]"
                placeholder="https://example.com/branch-image.jpg"
              />
            </div>

            {/* Enabled Menu Types */}
            <div>
              <label className="block font-medium mb-3">Enabled Menu Types</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {MENU_TYPES.map(menuType => (
                  <label
                    key={menuType.value}
                    className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={branchData.enabledMenuTypes?.includes(menuType.value)}
                      onChange={(e) => {
                        const current = branchData.enabledMenuTypes || [];
                        setBranchData({
                          ...branchData,
                          enabledMenuTypes: e.target.checked
                            ? [...current, menuType.value]
                            : current.filter(m => m !== menuType.value),
                        });
                      }}
                      className="w-4 h-4 text-[#667c67] focus:ring-[#667c67]"
                    />
                    <span className="text-sm font-medium">{menuType.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={branchData.enabled}
                  onChange={(e) => setBranchData({ ...branchData, enabled: e.target.checked })}
                  className="w-5 h-5 text-[#667c67] focus:ring-[#667c67]"
                />
                <div>
                  <span className="font-semibold">Branch Active</span>
                  <p className="text-sm text-muted-foreground">Enable this branch for customer orders</p>
                </div>
              </label>
              <Badge className={branchData.enabled ? 'bg-green-500' : 'bg-red-500'}>
                {branchData.enabled ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#667c67]" />
              Operating Hours
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Set opening hours for each day of the week
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 24 Hours Toggle */}
              <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <input
                  type="checkbox"
                  id="24hours"
                  checked={is24Hours}
                  onChange={(e) => {
                    setIs24Hours(e.target.checked);
                    if (e.target.checked) {
                      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
                      const newHours: any = {};
                      days.forEach(day => {
                        newHours[day] = { open: '00:00', close: '23:59' };
                      });
                      setBranchData({ ...branchData, hours: newHours });
                    }
                  }}
                  className="w-5 h-5 text-[#667c67] focus:ring-[#667c67] cursor-pointer"
                />
                <label htmlFor="24hours" className="cursor-pointer flex-1">
                  <div className="font-semibold">Open 24 Hours</div>
                  <div className="text-sm text-muted-foreground">Branch operates around the clock</div>
                </label>
                {is24Hours && (
                  <Badge className="bg-[#667c67]">24/7</Badge>
                )}
              </div>

              {/* Same Hours All Days */}
              <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <input
                  type="checkbox"
                  id="sameHours"
                  checked={sameHoursAllDays}
                  onChange={(e) => {
                    setSameHoursAllDays(e.target.checked);
                  }}
                  disabled={is24Hours}
                  className="w-5 h-5 text-[#667c67] focus:ring-[#667c67] cursor-pointer disabled:opacity-50"
                />
                <label htmlFor="sameHours" className={`cursor-pointer flex-1 ${is24Hours ? 'opacity-50' : ''}`}>
                  <div className="font-semibold">Same Hours All Week</div>
                  <div className="text-sm text-muted-foreground">Apply Monday hours to all days</div>
                </label>
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="space-y-3">
              <label className="block font-semibold text-sm">Weekly Schedule</label>
              {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => {
                const isClosed = closedDays.has(day);
                const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);
                
                return (
                  <div key={day} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                    {/* Day Name */}
                    <div className="w-32 flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`closed-${day}`}
                        checked={!isClosed}
                        onChange={(e) => {
                          const newClosed = new Set(closedDays);
                          if (e.target.checked) {
                            newClosed.delete(day);
                          } else {
                            newClosed.add(day);
                          }
                          setClosedDays(newClosed);
                        }}
                        className="w-4 h-4 text-[#667c67] focus:ring-[#667c67]"
                      />
                      <label htmlFor={`closed-${day}`} className="font-medium cursor-pointer">
                        {dayLabel}
                      </label>
                    </div>

                    {/* Time Inputs */}
                    {!isClosed ? (
                      <>
                        <div className="flex-1 flex items-center gap-3">
                          <div className="flex-1">
                            <label className="block text-xs text-muted-foreground mb-1">Opening</label>
                            <input
                              type="time"
                              value={branchData.hours?.[day]?.open || '09:00'}
                              onChange={(e) => {
                                const newHours = { ...branchData.hours };
                                newHours[day] = {
                                  ...newHours[day],
                                  open: e.target.value,
                                };
                                
                                // Apply to all days if "Same Hours All Week" is checked
                                if (sameHoursAllDays && day === 'monday') {
                                  const days = ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
                                  days.forEach(d => {
                                    if (!closedDays.has(d)) {
                                      newHours[d] = {
                                        open: e.target.value,
                                        close: newHours[day].close,
                                      };
                                    }
                                  });
                                }
                                
                                setBranchData({ ...branchData, hours: newHours });
                              }}
                              disabled={is24Hours}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67] disabled:opacity-50 disabled:bg-muted"
                            />
                          </div>
                          
                          <div className="text-muted-foreground">—</div>
                          
                          <div className="flex-1">
                            <label className="block text-xs text-muted-foreground mb-1">Closing</label>
                            <input
                              type="time"
                              value={branchData.hours?.[day]?.close || '22:00'}
                              onChange={(e) => {
                                const newHours = { ...branchData.hours };
                                newHours[day] = {
                                  ...newHours[day],
                                  close: e.target.value,
                                };
                                
                                // Apply to all days if "Same Hours All Week" is checked
                                if (sameHoursAllDays && day === 'monday') {
                                  const days = ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
                                  days.forEach(d => {
                                    if (!closedDays.has(d)) {
                                      newHours[d] = {
                                        open: newHours[day].open,
                                        close: e.target.value,
                                      };
                                    }
                                  });
                                }
                                
                                setBranchData({ ...branchData, hours: newHours });
                              }}
                              disabled={is24Hours}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67] disabled:opacity-50 disabled:bg-muted"
                            />
                          </div>
                        </div>

                        {is24Hours && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Open 24h
                          </Badge>
                        )}
                      </>
                    ) : (
                      <div className="flex-1 text-center">
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          Closed
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hours Preview */}
            <div className="p-4 bg-muted/30 rounded-lg border-2 border-dashed">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Hours Preview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => {
                  const isClosed = closedDays.has(day);
                  const hours = branchData.hours?.[day];
                  const dayShort = day.substring(0, 3).toUpperCase();
                  
                  return (
                    <div key={day} className="flex items-center justify-between p-2 bg-white rounded border">
                      <span className="font-medium">{dayShort}</span>
                      <span className="text-xs text-muted-foreground">
                        {isClosed ? (
                          <span className="text-red-600">Closed</span>
                        ) : is24Hours ? (
                          <span className="text-green-600">24h</span>
                        ) : (
                          `${hours?.open || '09:00'}-${hours?.close || '22:00'}`
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regions & Tables */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#667c67]" />
                  Regions & Tables
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {branchData.regions?.length || 0} regions • {totalTables} tables • {totalCapacity} seats
                </p>
              </div>
              <Button onClick={handleAddRegion} className="bg-[#667c67]">
                <Plus className="w-5 h-5 mr-2" />
                Add Region
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {branchData.regions && branchData.regions.length > 0 ? (
              <div className="space-y-3">
                {branchData.regions.map((region, index) => (
                  <RegionCard
                    key={region.id}
                    region={region}
                    index={index}
                    languages={languages}
                    isExpanded={expandedRegions.has(region.id)}
                    onToggleExpand={() => toggleRegionExpand(region.id)}
                    onUpdate={(updates) => handleUpdateRegion(region.id, updates)}
                    onDelete={() => handleDeleteRegion(region.id)}
                    onAddTable={() => handleAddTable(region.id)}
                    onUpdateTable={(tableId, updates) => handleUpdateTable(region.id, tableId, updates)}
                    onDeleteTable={(tableId) => handleDeleteTable(region.id, tableId)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No regions yet</h3>
                <p className="text-muted-foreground mb-4">Add regions to organize your restaurant layout</p>
                <Button onClick={handleAddRegion} className="bg-[#667c67]">
                  <Plus className="w-5 h-5 mr-2" />
                  Add First Region
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Region Card Component
interface RegionCardProps {
  region: Region;
  index: number;
  languages: any[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updates: Partial<Region>) => void;
  onDelete: () => void;
  onAddTable: () => void;
  onUpdateTable: (tableId: string, updates: Partial<Table>) => void;
  onDeleteTable: (tableId: string) => void;
}

function RegionCard({
  region,
  index,
  languages,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
  onAddTable,
  onUpdateTable,
  onDeleteTable,
}: RegionCardProps) {
  const regionTypeData = REGION_TYPES.find(rt => rt.value === region.type) || REGION_TYPES[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border rounded-lg overflow-hidden"
    >
      {/* Region Header */}
      <div className="bg-muted/30 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleExpand}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          
          <div className="text-3xl">{regionTypeData.icon}</div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-lg">
                {region.translations.en || regionTypeData.label}
              </span>
              <Badge variant="outline">{regionTypeData.label}</Badge>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <TableIcon className="w-4 h-4" />
                {region.tables.length} tables
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {region.capacity} seats
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onAddTable}
            className="text-[#667c67] border-[#667c67]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Table
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 space-y-4 border-t">
              {/* Region Type Selection */}
              <div>
                <label className="block font-medium mb-2">Region Type</label>
                <select
                  value={region.type}
                  onChange={(e) => onUpdate({ type: e.target.value as RegionType })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67]"
                >
                  {REGION_TYPES.map(rt => (
                    <option key={rt.value} value={rt.value}>
                      {rt.icon} {rt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region Names */}
              <div>
                <label className="block font-medium mb-2">Region Names (All Languages)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {languages.map(lang => (
                    <div key={lang.code}>
                      <label className="block text-sm mb-1 flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </label>
                      <input
                        type="text"
                        value={region.translations[lang.code] || ''}
                        onChange={(e) => onUpdate({
                          translations: {
                            ...region.translations,
                            [lang.code]: e.target.value,
                          },
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67]"
                        placeholder={`Region name in ${lang.name}`}
                        dir={lang.direction}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tables */}
              <div>
                <label className="block font-medium mb-3">Tables in this Region</label>
                {region.tables.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {region.tables.map((table) => (
                      <TableCard
                        key={table.id}
                        table={table}
                        onUpdate={(updates) => onUpdateTable(table.id, updates)}
                        onDelete={() => onDeleteTable(table.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <TableIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No tables in this region</p>
                    <Button
                      onClick={onAddTable}
                      size="sm"
                      variant="outline"
                      className="mt-3"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Table
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Table Card Component
interface TableCardProps {
  table: Table;
  onUpdate: (updates: Partial<Table>) => void;
  onDelete: () => void;
}

function TableCard({ table, onUpdate, onDelete }: TableCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const statusColors = {
    available: 'bg-green-100 text-green-800 border-green-200',
    occupied: 'bg-red-100 text-red-800 border-red-200',
    reserved: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cleaning: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <div className="border rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-[#667c67] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
            {table.number}
          </div>
          <div>
            <div className="font-semibold">Table {table.number}</div>
            <div className="text-xs text-muted-foreground">{table.seats} seats</div>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 hover:bg-muted rounded"
          >
            <Edit2 className="w-4 h-4 text-[#667c67]" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2 pt-2 border-t">
          <div>
            <label className="block text-xs font-medium mb-1">Table Number</label>
            <input
              type="number"
              value={table.number}
              onChange={(e) => onUpdate({ number: parseInt(e.target.value) || 1 })}
              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#667c67]"
              min="1"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Seats</label>
            <input
              type="number"
              value={table.seats}
              onChange={(e) => onUpdate({ seats: parseInt(e.target.value) || 1 })}
              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#667c67]"
              min="1"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">NFC ID (Optional)</label>
            <input
              type="text"
              value={table.nfcId || ''}
              onChange={(e) => onUpdate({ nfcId: e.target.value })}
              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#667c67]"
              placeholder="NFC-12345"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <QrCode className="w-3 h-3" />
            <code className="bg-muted px-1 rounded text-[10px]">{table.qrCode}</code>
          </div>
          {table.nfcId && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Wifi className="w-3 h-3" />
              <code className="bg-muted px-1 rounded text-[10px]">{table.nfcId}</code>
            </div>
          )}
        </div>
      )}
    </div>
  );
}