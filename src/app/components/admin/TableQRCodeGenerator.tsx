import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Download, QrCode, Printer, X, Package } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface Table {
  id: string;
  number: string;
  seats: number;
  nfcId?: string;
  photo?: string;
  status?: string;
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

interface QRCodeData {
  branchId: string;
  branchName: string;
  regionId: string;
  regionName: string;
  tableId: string;
  tableNumber: string;
  seats: number;
  nfcId?: string;
  timestamp: string;
  url: string;
}

interface TableQRCodeGeneratorProps {
  branch: Branch;
  region: Region;
  table: Table;
  onClose: () => void;
}

export function TableQRCodeGenerator({ branch, region, table, onClose }: TableQRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // Generate comprehensive QR data
  const qrData: QRCodeData = {
    branchId: branch.id,
    branchName: branch.name,
    regionId: region.id,
    regionName: region.name,
    tableId: table.id,
    tableNumber: table.number,
    seats: table.seats,
    nfcId: table.nfcId,
    timestamp: new Date().toISOString(),
    url: `${window.location.origin}/branch/${branch.id}/region-selection?tableId=${table.id}&regionId=${region.id}&tableNumber=${table.number}`
  };

  const qrDataString = JSON.stringify(qrData);

  const downloadQRCode = async (format: 'png' | 'svg' = 'png') => {
    if (!qrRef.current) return;
    
    setDownloading(true);
    try {
      if (format === 'png') {
        const canvas = await html2canvas(qrRef.current, {
          backgroundColor: '#ffffff',
          scale: 3,
        });
        
        const link = document.createElement('a');
        link.download = `QR_${branch.name}_${region.name}_Table_${table.number}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        // SVG download
        const svg = qrRef.current.querySelector('svg');
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const blob = new Blob([svgData], { type: 'image/svg+xml' });
          const link = document.createElement('a');
          link.download = `QR_${branch.name}_${region.name}_Table_${table.number}.svg`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        }
      }
      
      toast.success(`QR Code downloaded successfully!`);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    } finally {
      setDownloading(false);
    }
  };

  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !qrRef.current) return;

    const qrContent = qrRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${branch.name} - Table ${table.number}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .qr-container {
              text-align: center;
              page-break-inside: avoid;
            }
            @media print {
              body {
                margin: 0;
              }
              .qr-container {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            ${qrContent}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const copyQRData = () => {
    navigator.clipboard.writeText(qrDataString);
    toast.success('QR data copied to clipboard!');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <QrCode className="w-6 h-6 text-[#667c67]" />
            Table QR Code Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Display */}
          <div 
            ref={qrRef}
            className="bg-white p-8 rounded-xl border-4 border-[#667c67] shadow-2xl"
          >
            <div className="text-center space-y-6">
              {/* Branch Logo */}
              {branch.logo && (
                <div className="flex justify-center">
                  <img 
                    src={branch.logo} 
                    alt={branch.name}
                    className="h-16 object-contain"
                  />
                </div>
              )}

              {/* Branch Info */}
              <div>
                <h2 className="text-2xl font-bold text-[#667c67]">{branch.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{branch.address}</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center bg-white p-6 rounded-xl">
                <QRCodeSVG
                  value={qrDataString}
                  size={280}
                  level="H"
                  includeMargin={true}
                  fgColor="#667c67"
                  bgColor="#ffffff"
                  imageSettings={{
                    src: branch.logo || '',
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </div>

              {/* Table Info */}
              <div className="bg-[#e4dbc4] p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-xs text-gray-600">Region</p>
                    <p className="font-bold text-[#667c67]">{region.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Table Number</p>
                    <p className="font-bold text-[#667c67] text-2xl">{table.number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Seats</p>
                    <p className="font-bold text-[#667c67]">{table.seats} persons</p>
                  </div>
                  {table.nfcId && (
                    <div>
                      <p className="text-xs text-gray-600">NFC ID</p>
                      <p className="font-bold text-[#667c67] text-xs">{table.nfcId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="border-t-2 border-[#667c67]/20 pt-4">
                <p className="text-sm font-semibold text-[#667c67]">Scan to Order</p>
                <p className="text-xs text-gray-600 mt-1">
                  Point your camera at the QR code to browse menu and place orders
                </p>
              </div>

              {/* Footer */}
              <div className="text-xs text-gray-500">
                <p>eChefs Restaurant Ordering System</p>
                <p className="text-[10px] mt-1">Generated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-sm">QR Code Data (JSON)</h3>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto max-h-40">
                {JSON.stringify(qrData, null, 2)}
              </pre>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 w-full"
                onClick={copyQRData}
              >
                Copy QR Data
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => downloadQRCode('png')}
              disabled={downloading}
              variant="default"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PNG
            </Button>
            
            <Button
              onClick={() => downloadQRCode('svg')}
              disabled={downloading}
              variant="secondary"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download SVG
            </Button>
            
            <Button
              onClick={printQRCode}
              variant="outline"
              size="lg"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print QR Code
            </Button>
            
            <Button
              onClick={onClose}
              variant="ghost"
              size="lg"
            >
              <X className="w-5 h-5 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Bulk QR Code Generator for all tables in a region
interface BulkQRCodeGeneratorProps {
  branch: Branch;
  region: Region;
  onClose: () => void;
}

export function BulkQRCodeGenerator({ branch, region, onClose }: BulkQRCodeGeneratorProps) {
  const [downloading, setDownloading] = useState(false);

  const downloadAllQRCodes = async () => {
    setDownloading(true);
    
    try {
      for (const table of region.tables) {
        await new Promise(resolve => setTimeout(resolve, 300)); // Delay between downloads
        
        const qrData: QRCodeData = {
          branchId: branch.id,
          branchName: branch.name,
          regionId: region.id,
          regionName: region.name,
          tableId: table.id,
          tableNumber: table.number,
          seats: table.seats,
          nfcId: table.nfcId,
          timestamp: new Date().toISOString(),
          url: `${window.location.origin}/branch/${branch.id}/region-selection?tableId=${table.id}&regionId=${region.id}&tableNumber=${table.number}`
        };

        // Create a temporary container
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.background = 'white';
        container.style.padding = '40px';
        
        container.innerHTML = `
          <div style="text-align: center; background: white; padding: 30px; width: 400px;">
            <h2 style="color: #667c67; font-size: 24px; margin-bottom: 10px;">${branch.name}</h2>
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">${branch.address}</p>
            <div id="qr-${table.id}" style="display: flex; justify-content: center; margin: 20px 0;"></div>
            <div style="background: #e4dbc4; padding: 20px; border-radius: 8px; margin-top: 20px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: left;">
                <div>
                  <p style="font-size: 12px; color: #666;">Region</p>
                  <p style="font-weight: bold; color: #667c67; font-size: 16px;">${region.name}</p>
                </div>
                <div>
                  <p style="font-size: 12px; color: #666;">Table Number</p>
                  <p style="font-weight: bold; color: #667c67; font-size: 24px;">${table.number}</p>
                </div>
                <div>
                  <p style="font-size: 12px; color: #666;">Seats</p>
                  <p style="font-weight: bold; color: #667c67; font-size: 16px;">${table.seats} persons</p>
                </div>
                ${table.nfcId ? `
                  <div>
                    <p style="font-size: 12px; color: #666;">NFC ID</p>
                    <p style="font-weight: bold; color: #667c67; font-size: 12px;">${table.nfcId}</p>
                  </div>
                ` : ''}
              </div>
            </div>
            <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid rgba(102, 124, 103, 0.2);">
              <p style="font-size: 14px; font-weight: bold; color: #667c67;">Scan to Order</p>
              <p style="font-size: 12px; color: #666; margin-top: 5px;">Point your camera at the QR code</p>
            </div>
          </div>
        `;
        
        document.body.appendChild(container);

        // Generate QR code in the container
        const qrContainer = container.querySelector(`#qr-${table.id}`);
        if (qrContainer) {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('width', '280');
          svg.setAttribute('height', '280');
          qrContainer.appendChild(svg);

          // Use QRCode library
          const QRCode = (await import('qrcode')).default;
          const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
            width: 280,
            margin: 2,
            color: {
              dark: '#667c67',
              light: '#ffffff'
            }
          });

          const img = document.createElement('img');
          img.src = qrDataUrl;
          img.style.width = '280px';
          img.style.height = '280px';
          qrContainer.innerHTML = '';
          qrContainer.appendChild(img);
        }

        // Convert to image
        const canvas = await html2canvas(container, {
          backgroundColor: '#ffffff',
          scale: 2,
        });

        // Download
        const link = document.createElement('a');
        link.download = `QR_${branch.name}_${region.name}_Table_${table.number}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Cleanup
        document.body.removeChild(container);
      }

      toast.success(`Successfully downloaded ${region.tables.length} QR codes!`);
      onClose();
    } catch (error) {
      console.error('Error generating bulk QR codes:', error);
      toast.error('Failed to generate QR codes');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Package className="w-6 h-6 text-[#667c67]" />
            Bulk QR Code Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-[#e4dbc4] p-6 rounded-xl">
            <h3 className="font-bold text-lg text-[#667c67] mb-2">Region: {region.name}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Generate and download QR codes for all tables in this region
            </p>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Tables:</span>
                <span className="text-2xl font-bold text-[#667c67]">{region.tables.length}</span>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-semibold mb-2">📦 What will be generated:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Individual PNG file for each table</li>
              <li>✓ Professional branded design with logo</li>
              <li>✓ Complete table information (region, number, seats)</li>
              <li>✓ High-resolution print-ready QR codes</li>
              <li>✓ JSON data embedded in each QR code</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={downloadAllQRCodes}
              disabled={downloading}
              variant="default"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              {downloading ? 'Generating...' : 'Download All'}
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}