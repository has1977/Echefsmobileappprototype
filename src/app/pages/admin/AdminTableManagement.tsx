import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { 
  ChevronLeft, 
  Building2, 
  MapPin, 
  Phone,
  Grid3x3,
  Image as ImageIcon,
  Save,
  Download,
  Info,
  Mail
} from 'lucide-react';
import { TableManager } from '../../components/admin/TableManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';
import { Badge } from '../../components/ui/badge';
import { db } from '../../lib/database';
import type { Branch, Region, Table } from '../../lib/types';

// Extended types for table management
interface ExtendedTable extends Table {
  photo?: string;
}

interface ExtendedRegion extends Omit<Region, 'tables'> {
  photo?: string;
  tables: ExtendedTable[];
}

interface ExtendedBranch extends Omit<Branch, 'regions'> {
  logo?: string;
  regions: ExtendedRegion[];
}

export function AdminTableManagement() {
  const navigate = useNavigate();
  const { currentLanguage, branches: contextBranches, refreshData } = useApp();
  
  // Get branchId from query params
  const searchParams = new URLSearchParams(window.location.search);
  const queryBranchId = searchParams.get('branchId');
  
  const [selectedBranchId, setSelectedBranchId] = useState(queryBranchId || contextBranches[0]?.id || '');
  const [activeRegionId, setActiveRegionId] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Get the selected branch from context
  const selectedBranch = contextBranches.find(b => b.id === selectedBranchId);

  // Transform branch to extended format with table photos
  const extendedBranch: ExtendedBranch | null = selectedBranch ? {
    ...selectedBranch,
    logo: selectedBranch.imageUrl,
    regions: selectedBranch.regions.map(region => ({
      ...region,
      photo: (region as any).photo,
      tables: region.tables.map(table => ({
        ...table,
        photo: (table as any).photo,
        number: String(table.number) // Convert to string for consistency
      }))
    }))
  } : null;

  // Set active region when branch changes
  useEffect(() => {
    if (extendedBranch && extendedBranch.regions.length > 0 && !activeRegionId) {
      setActiveRegionId(extendedBranch.regions[0].id);
    }
  }, [extendedBranch, activeRegionId]);

  const activeRegion = extendedBranch?.regions.find(r => r.id === activeRegionId);

  const handleUpdateRegion = (updatedRegion: ExtendedRegion) => {
    if (!selectedBranch) return;

    // Update the region in the branch
    const updatedRegions = selectedBranch.regions.map(r => 
      r.id === updatedRegion.id ? {
        ...updatedRegion,
        tables: updatedRegion.tables.map(t => ({
          ...t,
          number: typeof t.number === 'string' ? parseInt(t.number) || 0 : t.number
        }))
      } : r
    );

    // Update branch in database
    db.updateBranch(selectedBranch.id, {
      regions: updatedRegions
    });

    // Refresh context
    refreshData();
    setHasChanges(true);
    toast.success('Changes saved successfully!');
  };

  const handleSaveChanges = () => {
    toast.success('All changes have been saved!');
    setHasChanges(false);
  };

  const exportBranchReport = () => {
    if (!extendedBranch) return;

    const report = {
      branch: {
        id: extendedBranch.id,
        name: extendedBranch.translations[currentLanguage]?.name || 'Unknown',
        address: extendedBranch.translations[currentLanguage]?.address || '',
        phone: extendedBranch.phone,
        email: extendedBranch.email,
        location: extendedBranch.location
      },
      regions: extendedBranch.regions.map(region => ({
        id: region.id,
        name: region.translations[currentLanguage] || 'Unknown',
        type: region.type,
        totalTables: region.tables.length,
        totalSeats: region.tables.reduce((sum, t) => sum + t.seats, 0),
        capacity: region.capacity,
        tables: region.tables.map(table => ({
          id: table.id,
          number: table.number,
          seats: table.seats,
          nfcId: table.nfcId,
          status: table.status,
          qrCode: table.qrCode,
          qrUrl: `${window.location.origin}/branch/${extendedBranch.id}/region-selection?table=${table.id}`,
          scanUrl: table.qrCode
        }))
      })),
      summary: {
        totalRegions: extendedBranch.regions.length,
        totalTables: extendedBranch.regions.reduce((sum, r) => sum + r.tables.length, 0),
        totalSeats: extendedBranch.regions.reduce((sum, r) => sum + r.tables.reduce((s, t) => s + t.seats, 0), 0),
        nfcEnabledTables: extendedBranch.regions.reduce((sum, r) => sum + r.tables.filter(t => t.nfcId).length, 0),
        generatedAt: new Date().toISOString(),
        generatedBy: 'eChefs Admin Dashboard'
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const branchName = extendedBranch.translations[currentLanguage]?.name.replace(/[^a-zA-Z0-9]/g, '_') || 'Branch';
    link.download = `${branchName}_Tables_Report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Branch report exported successfully!');
  };

  if (!extendedBranch) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Branch Selected</h2>
          <p className="text-muted-foreground mb-6">
            Please select a branch from the branches page to manage tables.
          </p>
          <Button onClick={() => navigate('/admin/branches')} variant="default" size="lg">
            <Building2 className="w-5 h-5 mr-2" />
            Go to Branches
          </Button>
        </Card>
      </div>
    );
  }

  const totalTables = extendedBranch.regions.reduce((sum, r) => sum + r.tables.length, 0);
  const totalSeats = extendedBranch.regions.reduce((sum, r) => sum + r.tables.reduce((s, t) => s + t.seats, 0), 0);
  const nfcEnabledTables = extendedBranch.regions.reduce((sum, r) => sum + r.tables.filter(t => t.nfcId).length, 0);
  const availableTables = extendedBranch.regions.reduce((sum, r) => sum + r.tables.filter(t => t.status === 'available').length, 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white sticky top-0 z-20 shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
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
                <Grid3x3 className="w-7 h-7" />
                Table Management
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Manage tables, generate QR codes, and configure regions
              </p>
            </div>
            {hasChanges && (
              <Button
                onClick={handleSaveChanges}
                variant="light"
                size="lg"
              >
                <Save className="w-5 h-5 mr-2" />
                Changes Saved
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Branch Info Card */}
        <Card className="border-2 border-[#667c67]/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#e4dbc4] to-[#f0eadc]">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {extendedBranch.logo && (
                  <div className="bg-white p-2 rounded-lg shadow">
                    <img 
                      src={extendedBranch.logo} 
                      alt={extendedBranch.translations[currentLanguage]?.name}
                      className="h-12 object-contain"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-[#667c67] flex items-center gap-2">
                    <Building2 className="w-6 h-6" />
                    {extendedBranch.translations[currentLanguage]?.name || 'Branch'}
                  </h2>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {extendedBranch.translations[currentLanguage]?.address}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {extendedBranch.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {extendedBranch.email}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={exportBranchReport}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-[#667c67] to-[#526250] text-white p-4 rounded-xl shadow-lg">
                <p className="text-sm opacity-80">Regions</p>
                <p className="text-3xl font-bold mt-1">{extendedBranch.regions.length}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg">
                <p className="text-sm opacity-80">Total Tables</p>
                <p className="text-3xl font-bold mt-1">{totalTables}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg">
                <p className="text-sm opacity-80">Total Seats</p>
                <p className="text-3xl font-bold mt-1">{totalSeats}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg">
                <p className="text-sm opacity-80">Available</p>
                <p className="text-3xl font-bold mt-1">{availableTables}/{totalTables}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-l-4 border-blue-500 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 mb-1">📋 Quick Guide:</p>
                <ul className="text-blue-800 space-y-1">
                  <li>• Add photos to regions and tables for better visualization</li>
                  <li>• Generate individual QR codes or bulk export for entire regions</li>
                  <li>• Each QR code contains: Branch name, Region, Table number, Seats, NFC ID, and scan URL</li>
                  <li>• QR codes are downloadable in PNG or SVG formats - print ready!</li>
                  <li>• Customers scan QR codes to start ordering from their table</li>
                  <li>• NFC IDs enable tap-to-order functionality</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regions Tabs */}
        {extendedBranch.regions.length === 0 ? (
          <Card className="p-12 text-center">
            <Grid3x3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Regions Found</h3>
            <p className="text-muted-foreground mb-6">
              This branch doesn't have any regions yet. Add regions from the branch editor.
            </p>
            <Button onClick={() => navigate(`/admin/branches/${extendedBranch.id}/edit`)} variant="default">
              <Building2 className="w-5 h-5 mr-2" />
              Edit Branch
            </Button>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <Tabs value={activeRegionId} onValueChange={setActiveRegionId}>
                <TabsList className="w-full justify-start p-2 bg-[#e4dbc4]/30 rounded-none border-b-2 border-[#667c67]/20 flex-wrap h-auto gap-2">
                  {extendedBranch.regions.map((region) => (
                    <TabsTrigger 
                      key={region.id} 
                      value={region.id}
                      className="data-[state=active]:bg-[#667c67] data-[state=active]:text-white px-6 py-3 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {region.photo ? (
                          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                            <img 
                              src={region.photo} 
                              alt={region.translations[currentLanguage]}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <ImageIcon className="w-5 h-5" />
                        )}
                        <span className="font-semibold">{region.translations[currentLanguage] || 'Region'}</span>
                        <Badge variant="secondary" className="ml-2">
                          {region.tables.length}
                        </Badge>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {extendedBranch.regions.map((region) => (
                  <TabsContent key={region.id} value={region.id} className="p-6">
                    {activeRegion && (
                      <TableManager
                        branch={{
                          id: extendedBranch.id,
                          name: extendedBranch.translations[currentLanguage]?.name || 'Branch',
                          address: extendedBranch.translations[currentLanguage]?.address || '',
                          phone: extendedBranch.phone,
                          logo: extendedBranch.logo
                        }}
                        region={{
                          id: region.id,
                          name: region.translations[currentLanguage] || 'Region',
                          photo: region.photo,
                          tables: region.tables.map(t => ({
                            id: t.id,
                            number: String(t.number),
                            seats: t.seats,
                            nfcId: t.nfcId,
                            photo: t.photo,
                            status: t.status
                          }))
                        }}
                        onUpdateRegion={handleUpdateRegion}
                      />
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
