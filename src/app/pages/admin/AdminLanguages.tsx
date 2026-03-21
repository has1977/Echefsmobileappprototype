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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { ChevronLeft, Plus, Edit, Trash2, Globe, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[#667c67] text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/admin')}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Language Management</h1>
              <p className="text-sm text-white/80">Configure available languages</p>
            </div>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Language
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Language</DialogTitle>
                <DialogDescription>
                  Choose from popular presets or create a custom language
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Language Presets */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#667c67]" />
                    <Label>Quick Select Popular Languages</Label>
                  </div>
                  <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg bg-gray-50">
                    {LANGUAGE_PRESETS.map((preset) => {
                      const alreadyExists = languages.some(l => l.code === preset.code);
                      return (
                        <button
                          key={preset.code}
                          onClick={() => !alreadyExists && handlePresetSelect(preset.code)}
                          disabled={alreadyExists}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            formData.code === preset.code
                              ? 'border-[#667c67] bg-[#667c67]/10'
                              : alreadyExists
                              ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                              : 'border-gray-200 hover:border-[#667c67] hover:bg-white'
                          }`}
                        >
                          <div className="text-2xl mb-1">{preset.flag}</div>
                          <div className="text-xs font-medium text-gray-700">{preset.name}</div>
                          {alreadyExists && (
                            <Badge variant="outline" className="mt-1 text-xs">Added</Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or enter manually</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="code">Language Code *</Label>
                  <Input
                    id="code"
                    placeholder="en, ar, ru, etc."
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    disabled={usePreset}
                  />
                </div>
                
                <div>
                  <Label htmlFor="name">English Name *</Label>
                  <Input
                    id="name"
                    placeholder="English"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="nativeName">Native Name *</Label>
                  <Input
                    id="nativeName"
                    placeholder="English"
                    value={formData.nativeName}
                    onChange={(e) => setFormData({ ...formData, nativeName: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="flag">Flag Emoji</Label>
                  <Input
                    id="flag"
                    placeholder="🇬🇧"
                    value={formData.flag}
                    onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="direction">Text Direction</Label>
                  <Select
                    value={formData.direction}
                    onValueChange={(value: 'ltr' | 'rtl') => setFormData({ ...formData, direction: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ltr">Left to Right (LTR)</SelectItem>
                      <SelectItem value="rtl">Right to Left (RTL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAdd} className="flex-1 bg-green-600 text-white hover:bg-green-700 font-semibold">
                    Add Language
                  </Button>
                  <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }} className="hover:bg-gray-100">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 text-[#667c67]" />
                <div>
                  <div className="text-2xl font-bold">{languages.length}</div>
                  <div className="text-sm text-muted-foreground">Total Languages</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-success rounded-full"></div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">
                    {languages.filter(l => l.enabled).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Enabled</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-muted-foreground rounded-full"></div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-muted-foreground">
                    {languages.filter(l => !l.enabled).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Disabled</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Languages Table */}
        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
            <CardDescription>Manage application languages and translations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flag</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Native Name</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {languages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No languages configured
                    </TableCell>
                  </TableRow>
                ) : (
                  languages.map((lang) => (
                    <TableRow key={lang.code}>
                      <TableCell className="text-2xl">{lang.flag}</TableCell>
                      <TableCell className="font-mono">{lang.code}</TableCell>
                      <TableCell>{lang.name}</TableCell>
                      <TableCell>{lang.nativeName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {lang.direction.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={lang.enabled}
                          onCheckedChange={(checked) => handleToggle(lang.code, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog open={editingLang?.code === lang.code} onOpenChange={(open) => !open && resetForm()}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startEdit(lang)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Language</DialogTitle>
                                <DialogDescription>
                                  Update language settings
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="edit-name">English Name *</Label>
                                  <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="edit-nativeName">Native Name *</Label>
                                  <Input
                                    id="edit-nativeName"
                                    value={formData.nativeName}
                                    onChange={(e) => setFormData({ ...formData, nativeName: e.target.value })}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="edit-flag">Flag Emoji</Label>
                                  <Input
                                    id="edit-flag"
                                    value={formData.flag}
                                    onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="edit-direction">Text Direction</Label>
                                  <Select
                                    value={formData.direction}
                                    onValueChange={(value: 'ltr' | 'rtl') => setFormData({ ...formData, direction: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="ltr">Left to Right (LTR)</SelectItem>
                                      <SelectItem value="rtl">Right to Left (RTL)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="flex gap-2 pt-4">
                                  <Button onClick={handleUpdate} className="flex-1 bg-orange-600 text-white hover:bg-orange-700 font-semibold">
                                    Update Language
                                  </Button>
                                  <Button variant="outline" onClick={() => { setEditingLang(null); resetForm(); }} className="hover:bg-gray-100">
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(lang.code)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}