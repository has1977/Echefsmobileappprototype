import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  QrCode, 
  Users, 
  Hash,
  CreditCard,
  Check,
  X,
  PackageOpen
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { TableQRCodeGenerator, BulkQRCodeGenerator } from './TableQRCodeGenerator';

interface Table {
  id: string;
  number: string;
  seats: number;
  nfcId?: string;
  photo?: string;
  status?: 'available' | 'occupied' | 'reserved' | 'maintenance';
}

interface Region {
  id: string;
  name: string;
  photo?: string;
  tables: Table[];
}

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  logo?: string;
}

interface TableManagerProps {
  branch: Branch;
  region: Region;
  onUpdateRegion: (region: Region) => void;
}

export function TableManager({ branch, region, onUpdateRegion }: TableManagerProps) {
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [selectedQRTable, setSelectedQRTable] = useState<Table | null>(null);
  const [showBulkQR, setShowBulkQR] = useState(false);

  const handleAddTable = () => {
    setEditingTable({
      id: `table-${Date.now()}`,
      number: '',
      seats: 4,
      status: 'available'
    });
    setIsAddingTable(true);
  };

  const handleEditTable = (table: Table) => {
    setEditingTable({ ...table });
    setIsAddingTable(false);
  };

  const handleSaveTable = () => {
    if (!editingTable || !editingTable.number) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedTables = isAddingTable
      ? [...region.tables, editingTable]
      : region.tables.map(t => t.id === editingTable.id ? editingTable : t);

    onUpdateRegion({
      ...region,
      tables: updatedTables
    });

    toast.success(isAddingTable ? 'Table added successfully!' : 'Table updated successfully!');
    setEditingTable(null);
    setIsAddingTable(false);
  };

  const handleDeleteTable = (tableId: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return;

    const updatedTables = region.tables.filter(t => t.id !== tableId);
    onUpdateRegion({
      ...region,
      tables: updatedTables
    });

    toast.success('Table deleted successfully!');
  };

  const handleImageUpload = (file: File, tableId?: string) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      
      if (tableId && editingTable) {
        setEditingTable({ ...editingTable, photo: imageUrl });
      } else {
        // Region photo
        onUpdateRegion({ ...region, photo: imageUrl });
        toast.success('Region photo updated!');
      }
    };
    reader.readAsDataURL(file);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'destructive';
      case 'reserved': return 'warning';
      case 'maintenance': return 'outline';
      default: return 'default';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'available': return <Check className="w-3 h-3" />;
      case 'occupied': return <X className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Region Header with Photo */}
      <Card className="overflow-hidden border-2 border-[#667c67]/20">
        <div className="relative h-48 bg-gradient-to-br from-[#667c67] to-[#526250]">
          {region.photo ? (
            <img 
              src={region.photo} 
              alt={region.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="w-16 h-16 text-white/30" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-bold text-white mb-2">{region.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/90">
                <Users className="w-3 h-3 mr-1" />
                {region.tables.length} Tables
              </Badge>
              <Badge variant="secondary" className="bg-white/90">
                <Users className="w-3 h-3 mr-1" />
                {region.tables.reduce((sum, t) => sum + t.seats, 0)} Total Seats
              </Badge>
            </div>
          </div>

          {/* Upload Photo Button */}
          <label className="absolute top-4 right-4 cursor-pointer">
            <Button variant="light" size="sm" asChild>
              <span>
                <ImageIcon className="w-4 h-4 mr-2" />
                {region.photo ? 'Change Photo' : 'Add Photo'}
              </span>
            </Button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />
          </label>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleAddTable} variant="default" size="lg" className="flex-1">
          <Plus className="w-5 h-5 mr-2" />
          Add Table
        </Button>
        <Button 
          onClick={() => setShowBulkQR(true)} 
          variant="secondary" 
          size="lg"
          disabled={region.tables.length === 0}
        >
          <PackageOpen className="w-5 h-5 mr-2" />
          Bulk QR Export
        </Button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {region.tables.map((table) => (
          <Card key={table.id} className="overflow-hidden hover:shadow-lg transition-all">
            <div className="relative h-32 bg-gradient-to-br from-[#e4dbc4] to-[#d4c9a8]">
              {table.photo ? (
                <img 
                  src={table.photo} 
                  alt={`Table ${table.number}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Hash className="w-12 h-12 text-[#667c67]/30" />
                </div>
              )}
              
              {/* Table Number Overlay */}
              <div className="absolute top-2 left-2">
                <div className="bg-[#667c67] text-white px-3 py-1 rounded-full font-bold text-lg shadow-lg">
                  #{table.number}
                </div>
              </div>

              {/* Status Badge */}
              {table.status && (
                <div className="absolute top-2 right-2">
                  <Badge variant={getStatusColor(table.status)} className="shadow-lg">
                    {getStatusIcon(table.status)}
                    {table.status}
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4 text-[#667c67]" />
                  <span>{table.seats} seats</span>
                </div>
                {table.nfcId && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <CreditCard className="w-4 h-4 text-[#667c67]" />
                    <span className="text-xs truncate">{table.nfcId}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedQRTable(table)}
                >
                  <QrCode className="w-4 h-4 mr-1" />
                  QR Code
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditTable(table)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteTable(table.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {region.tables.length === 0 && (
          <Card className="col-span-full border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Hash className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No tables yet</h3>
              <p className="text-sm text-gray-500 mb-4">Add your first table to get started</p>
              <Button onClick={handleAddTable} variant="default">
                <Plus className="w-4 h-4 mr-2" />
                Add Table
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit/Add Table Dialog */}
      {editingTable && (
        <Dialog open={true} onOpenChange={() => setEditingTable(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {isAddingTable ? 'Add New Table' : 'Edit Table'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Table Photo */}
              <div>
                <Label>Table Photo</Label>
                <div className="mt-2 relative h-48 bg-gradient-to-br from-[#e4dbc4] to-[#d4c9a8] rounded-xl overflow-hidden">
                  {editingTable.photo ? (
                    <img 
                      src={editingTable.photo} 
                      alt="Table preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-16 h-16 text-[#667c67]/30" />
                    </div>
                  )}
                  
                  <label className="absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer">
                    <Button variant="light" size="sm" asChild>
                      <span>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        {editingTable.photo ? 'Change Photo' : 'Upload Photo'}
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, editingTable.id);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Table Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tableNumber">Table Number *</Label>
                  <Input
                    id="tableNumber"
                    value={editingTable.number}
                    onChange={(e) => setEditingTable({ ...editingTable, number: e.target.value })}
                    placeholder="e.g., 1, A1, VIP-1"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="seats">Number of Seats *</Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    max="20"
                    value={editingTable.seats}
                    onChange={(e) => setEditingTable({ ...editingTable, seats: parseInt(e.target.value) || 1 })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="nfcId">NFC ID (Optional)</Label>
                  <Input
                    id="nfcId"
                    value={editingTable.nfcId || ''}
                    onChange={(e) => setEditingTable({ ...editingTable, nfcId: e.target.value })}
                    placeholder="e.g., NFC-001"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={editingTable.status || 'available'}
                    onChange={(e) => setEditingTable({ ...editingTable, status: e.target.value as any })}
                    className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={handleSaveTable} variant="default" size="lg" className="flex-1">
                  <Check className="w-5 h-5 mr-2" />
                  Save Table
                </Button>
                <Button onClick={() => setEditingTable(null)} variant="outline" size="lg">
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* QR Code Generator */}
      {selectedQRTable && (
        <TableQRCodeGenerator
          branch={branch}
          region={region}
          table={selectedQRTable}
          onClose={() => setSelectedQRTable(null)}
        />
      )}

      {/* Bulk QR Generator */}
      {showBulkQR && (
        <BulkQRCodeGenerator
          branch={branch}
          region={region}
          onClose={() => setShowBulkQR(false)}
        />
      )}
    </div>
  );
}
