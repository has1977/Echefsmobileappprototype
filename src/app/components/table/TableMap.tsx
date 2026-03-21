import { motion } from 'motion/react';
import { Users, Check } from 'lucide-react';
import { Badge } from '../ui/badge';

interface Table {
  id: string;
  number: number;
  capacity: number;
  region: string;
  status: 'available' | 'occupied' | 'reserved';
  position: { x: number; y: number };
  shape: 'square' | 'round' | 'rectangle';
}

interface TableMapProps {
  tables: Table[];
  selectedTable?: string;
  onTableSelect: (tableId: string) => void;
  region?: string;
}

export function TableMap({ tables, selectedTable, onTableSelect, region }: TableMapProps) {
  const filteredTables = region 
    ? tables.filter(t => t.region === region)
    : tables;

  const getTableColor = (status: Table['status'], isSelected: boolean) => {
    if (isSelected) return 'bg-primary text-white border-primary';
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200';
      case 'occupied': return 'bg-red-100 text-red-700 border-red-300 cursor-not-allowed';
      case 'reserved': return 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTableShape = (shape: Table['shape']) => {
    switch (shape) {
      case 'round': return 'rounded-full';
      case 'rectangle': return 'rounded-lg aspect-[2/1]';
      case 'square': return 'rounded-xl aspect-square';
      default: return 'rounded-xl';
    }
  };

  return (
    <div className="relative w-full bg-muted/30 rounded-2xl border-2 border-dashed border-muted-foreground/20 p-8 min-h-[500px]">
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 space-y-2 z-10">
        <div className="text-xs font-semibold mb-2">Legend</div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-300" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-300" />
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 rounded bg-yellow-100 border-2 border-yellow-300" />
          <span>Reserved</span>
        </div>
      </div>

      {/* Tables */}
      <div className="relative w-full h-full">
        {filteredTables.map((table, index) => {
          const isSelected = selectedTable === table.id;
          const isDisabled = table.status === 'occupied';
          
          return (
            <motion.button
              key={table.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => !isDisabled && onTableSelect(table.id)}
              disabled={isDisabled}
              className={`absolute ${getTableShape(table.shape)} border-2 transition-all ${getTableColor(table.status, isSelected)} ${
                isDisabled ? 'opacity-60' : 'hover:shadow-lg active:scale-95'
              }`}
              style={{
                left: `${table.position.x}%`,
                top: `${table.position.y}%`,
                width: table.shape === 'rectangle' ? '80px' : '60px',
                height: table.shape === 'rectangle' ? '40px' : '60px',
              }}
            >
              <div className="flex flex-col items-center justify-center h-full gap-0.5">
                <div className="font-bold text-sm">#{table.number}</div>
                <div className="flex items-center gap-1 text-xs opacity-80">
                  <Users className="w-3 h-3" />
                  {table.capacity}
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-md"
                  >
                    <Check className="w-3 h-3 text-primary" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Region Badge */}
      {region && (
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="text-sm">
            {region}
          </Badge>
        </div>
      )}

      {/* Empty State */}
      {filteredTables.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto mb-2 opacity-20" />
            <p className="font-medium">No tables available</p>
            <p className="text-sm">Try selecting a different region</p>
          </div>
        </div>
      )}
    </div>
  );
}
