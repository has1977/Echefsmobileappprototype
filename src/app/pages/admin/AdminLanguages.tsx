import { useState } from 'react';
import { useNavigate } from 'react-router';
import { db } from '../../lib/database';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { ChevronLeft, Plus, Edit, Trash2, Globe, Sparkles, Check, Languages, ArrowLeftRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Language } from '../../lib/types';

// Popular language presets
const LANGUAGE_PRESETS = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', direction: 'ltr' as const },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl' as const },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', direction: 'ltr' as const },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', flag: '🇰🇬', direction: 'ltr' as const },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr' as const },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr' as const },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr' as const },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', direction: 'ltr' as const },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', direction: 'ltr' as const },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', direction: 'ltr' as const },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', direction: 'ltr' as const },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', direction: 'ltr' as const },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', direction: 'ltr' as const },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', direction: 'ltr' as const },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', direction: 'rtl' as const },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', direction: 'rtl' as const },
];

export function AdminLanguages() {
  const navigate = useNavigate();
  const { refreshData } = useApp();
  const [languages, setLanguages] = useState(db.getLanguages());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLang, setEditingLang] = useState<Language | null>(null);
  const [usePreset, setUsePreset] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    nativeName: '',
    flag: '',
    direction: 'ltr' as 'ltr' | 'rtl',
  });

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      nativeName: '',
      flag: '',
      direction: 'ltr',
    });
    setEditingLang(null);
    setUsePreset(false);
  };

  const handlePresetSelect = (presetCode: string) => {
    const preset = LANGUAGE_PRESETS.find(p => p.code === presetCode);
    if (preset) {
      setFormData(preset);
      setUsePreset(true);
    }
  };

  const handleAdd = () => {
    if (!formData.code || !formData.name || !formData.nativeName) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      db.addLanguage(formData);
      setLanguages(db.getLanguages());
      refreshData();
      toast.success(`Language "${formData.name}" added successfully`);
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to add language');
    }
  };

  const handleUpdate = () => {
    if (!editingLang) return;

    try {
      db.updateLanguage(editingLang.code, formData);
      setLanguages(db.getLanguages());
      refreshData();
      toast.success(`Language "${formData.name}" updated successfully`);
      setEditingLang(null);
      resetForm();
    } catch (error) {
      toast.error('Failed to update language');
    }
  };

  const handleToggle = (code: string, enabled: boolean) => {
    try {
      db.updateLanguage(code, { enabled });
      setLanguages(db.getLanguages());
      refreshData();
      toast.success(enabled ? 'Language enabled' : 'Language disabled');
    } catch (error) {
      toast.error('Failed to update language');
    }
  };

  const handleDelete = (code: string) => {
    if (!confirm('Are you sure you want to delete this language? This action cannot be undone.')) {
      return;
    }

    try {
      db.deleteLanguage(code);
      setLanguages(db.getLanguages());
      refreshData();
      toast.success('Language deleted successfully');
    } catch (error) {
      toast.error('Failed to delete language');
    }
  };

  const startEdit = (lang: Language) => {
    setEditingLang(lang);
    setFormData({
      code: lang.code,
      name: lang.name,
      nativeName: lang.nativeName,
      flag: lang.flag,
      direction: lang.direction,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 transition-colors"
                onClick={() => navigate('/admin')}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Language Management</h1>
                  <p className="text-sm text-white/80">Configure multi-language support for your platform</p>
                </div>
              </div>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-[#667c67] hover:bg-white/90 font-semibold shadow-lg h-11 px-6">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Language
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#667c67]" />
                    Add New Language
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    Choose from our curated list of popular languages or create a custom one
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 pt-4">
                  {/* Language Presets */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#667c67] to-[#526250] rounded-lg flex items-center justify-center">
                        <Languages className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <Label className="text-base font-semibold">Popular Languages</Label>
                        <p className="text-sm text-muted-foreground">Click to quickly add a language</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 p-4 border-2 border-dashed rounded-xl bg-gradient-to-br from-gray-50 to-white max-h-[280px] overflow-y-auto">
                      {LANGUAGE_PRESETS.map((preset) => {
                        const alreadyExists = languages.some(l => l.code === preset.code);
                        const isSelected = formData.code === preset.code;
                        return (
                          <motion.button
                            key={preset.code}
                            whileHover={!alreadyExists ? { scale: 1.05 } : {}}
                            whileTap={!alreadyExists ? { scale: 0.95 } : {}}
                            onClick={() => !alreadyExists && handlePresetSelect(preset.code)}
                            disabled={alreadyExists}
                            className={`relative p-4 rounded-xl border-2 transition-all ${
                              isSelected
                                ? 'border-[#667c67] bg-[#667c67]/10 shadow-md'
                                : alreadyExists
                                ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                                : 'border-gray-200 hover:border-[#667c67]/50 hover:bg-white hover:shadow-md'
                            }`}
                          >
                            <div className="text-3xl mb-2">{preset.flag}</div>
                            <div className="text-sm font-semibold text-gray-900">{preset.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{preset.nativeName}</div>
                            {alreadyExists && (
                              <Badge variant="secondary" className="mt-2 text-xs">
                                <Check className="w-3 h-3 mr-1" />
                                Added
                              </Badge>
                            )}
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-[#667c67] rounded-full flex items-center justify-center shadow-lg"
                              >
                                <Check className="w-4 h-4 text-white" strokeWidth={3} />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-white px-3 py-1 text-muted-foreground font-medium rounded-full border">
                        Or enter custom details
                      </span>
                    </div>
                  </div>

                  {/* Manual Input Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-sm font-semibold flex items-center gap-1">
                        Language Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="code"
                        placeholder="e.g., en, ar, ru"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
                        disabled={usePreset}
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground">ISO 639-1 code (2 letters)</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-1">
                        English Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="e.g., English"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground">Name in English</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nativeName" className="text-sm font-semibold flex items-center gap-1">
                        Native Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nativeName"
                        placeholder="e.g., English"
                        value={formData.nativeName}
                        onChange={(e) => setFormData({ ...formData, nativeName: e.target.value })}
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground">Name in native language</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="flag" className="text-sm font-semibold">
                        Flag Emoji
                      </Label>
                      <Input
                        id="flag"
                        placeholder="e.g., 🇬🇧"
                        value={formData.flag}
                        onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                        className="h-11 text-2xl"
                      />
                      <p className="text-xs text-muted-foreground">Country flag emoji</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="direction" className="text-sm font-semibold flex items-center gap-2">
                      <ArrowLeftRight className="w-4 h-4 text-[#667c67]" />
                      Text Direction
                    </Label>
                    <Select
                      value={formData.direction}
                      onValueChange={(value: 'ltr' | 'rtl') => setFormData({ ...formData, direction: value })}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ltr">
                          <div className="flex items-center gap-2">
                            <span>→</span>
                            <span>Left to Right (LTR)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="rtl">
                          <div className="flex items-center gap-2">
                            <span>←</span>
                            <span>Right to Left (RTL)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-3 pt-6 border-t">
                    <Button 
                      onClick={handleAdd} 
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 font-semibold h-12 shadow-lg"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Language
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => { setIsAddDialogOpen(false); resetForm(); }} 
                      className="hover:bg-gray-100 h-12 px-6"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#667c67] to-[#526250] rounded-xl flex items-center justify-center shadow-md">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{languages.length}</div>
                    <div className="text-sm font-medium text-gray-600">Total Languages</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                    <Check className="w-7 h-7 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-700">
                      {languages.filter(l => l.enabled).length}
                    </div>
                    <div className="text-sm font-medium text-green-600">Active Languages</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-slate-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-md">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-700">
                      {languages.filter(l => !l.enabled).length}
                    </div>
                    <div className="text-sm font-medium text-gray-600">Inactive Languages</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Languages Grid */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Configured Languages</CardTitle>
                <CardDescription className="text-base mt-1">
                  Manage application languages and translation settings
                </CardDescription>
              </div>
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                {languages.length} {languages.length === 1 ? 'Language' : 'Languages'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {languages.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No languages configured</h3>
                <p className="text-gray-600 mb-6">Get started by adding your first language</p>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-[#667c67] hover:bg-[#526250]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Language
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {languages.map((lang, index) => (
                    <motion.div
                      key={lang.code}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`border-2 transition-all hover:shadow-lg ${
                        lang.enabled ? 'border-green-200 bg-gradient-to-br from-white to-green-50/30' : 'border-gray-200 bg-gray-50/50'
                      }`}>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="text-5xl">{lang.flag}</div>
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900">{lang.name}</h3>
                                <p className="text-gray-600">{lang.nativeName}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {lang.code}
                                  </Badge>
                                  <Badge variant={lang.direction === 'rtl' ? 'secondary' : 'outline'} className="text-xs">
                                    {lang.direction === 'rtl' ? '← RTL' : 'LTR →'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={lang.enabled}
                                onCheckedChange={(checked) => handleToggle(lang.code, checked)}
                                className="data-[state=checked]:bg-green-600"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <Badge variant={lang.enabled ? 'default' : 'secondary'} className="font-medium">
                              {lang.enabled ? 'Active' : 'Inactive'}
                            </Badge>
                            <div className="flex gap-2">
                              <Dialog open={editingLang?.code === lang.code} onOpenChange={(open) => !open && resetForm()}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => startEdit(lang)}
                                    className="hover:bg-blue-50 hover:text-blue-700"
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader className="space-y-3">
                                    <DialogTitle className="text-2xl flex items-center gap-2">
                                      <Edit className="w-6 h-6 text-blue-600" />
                                      Edit Language
                                    </DialogTitle>
                                    <DialogDescription className="text-base">
                                      Update language settings and configuration
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="space-y-5 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-name" className="text-sm font-semibold flex items-center gap-1">
                                          English Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                          id="edit-name"
                                          value={formData.name}
                                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                          className="h-11"
                                        />
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-nativeName" className="text-sm font-semibold flex items-center gap-1">
                                          Native Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                          id="edit-nativeName"
                                          value={formData.nativeName}
                                          onChange={(e) => setFormData({ ...formData, nativeName: e.target.value })}
                                          className="h-11"
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-flag" className="text-sm font-semibold">
                                          Flag Emoji
                                        </Label>
                                        <Input
                                          id="edit-flag"
                                          value={formData.flag}
                                          onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                                          className="h-11 text-2xl"
                                        />
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-direction" className="text-sm font-semibold">
                                          Text Direction
                                        </Label>
                                        <Select
                                          value={formData.direction}
                                          onValueChange={(value: 'ltr' | 'rtl') => setFormData({ ...formData, direction: value })}
                                        >
                                          <SelectTrigger className="h-11">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="ltr">Left to Right (LTR)</SelectItem>
                                            <SelectItem value="rtl">Right to Left (RTL)</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    
                                    <div className="flex gap-3 pt-6 border-t">
                                      <Button 
                                        onClick={handleUpdate} 
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-semibold h-12"
                                      >
                                        <Check className="w-5 h-5 mr-2" />
                                        Update Language
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        onClick={() => { setEditingLang(null); resetForm(); }} 
                                        className="hover:bg-gray-100 h-12 px-6"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(lang.code)}
                                className="hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
