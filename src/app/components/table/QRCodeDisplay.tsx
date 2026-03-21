import { QRCodeSVG } from 'qrcode.react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Download, Share2, Printer } from 'lucide-react';
import { Logo } from '../shared/Logo';
import { toast } from 'sonner';

interface QRCodeDisplayProps {
  tableNumber: number;
  branchId: string;
  branchName: string;
  size?: number;
  showActions?: boolean;
}

export function QRCodeDisplay({
  tableNumber,
  branchId,
  branchName,
  size = 256,
  showActions = true,
}: QRCodeDisplayProps) {
  const qrValue = `https://echefs.app/table/${branchId}/${tableNumber}`;

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg') as HTMLElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `eChefs_Table_${tableNumber}_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      toast.success('QR Code downloaded!');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `eChefs - Table ${tableNumber}`,
          text: `Scan to order at ${branchName}`,
          url: qrValue,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(qrValue);
      toast.success('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  return (
    <div className="space-y-4">
      <Card className="p-8 flex flex-col items-center gap-6">
        {/* Logo */}
        <Logo size="md" showText />

        {/* QR Code */}
        <div className="bg-white p-4 rounded-2xl shadow-inner">
          <QRCodeSVG
            id="qr-code-svg"
            value={qrValue}
            size={size}
            level="H"
            includeMargin
            imageSettings={{
              src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667c67"%3E%3Cpath d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/%3E%3C/svg%3E',
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>

        {/* Table Info */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-primary">Table #{tableNumber}</h3>
          <p className="text-sm text-muted-foreground mt-1">{branchName}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Scan to view menu & order
          </p>
        </div>

        {/* URL Display */}
        <div className="w-full">
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground font-mono break-all">
              {qrValue}
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      {showActions && (
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex-col h-auto py-3 gap-2"
          >
            <Download className="w-5 h-5" />
            <span className="text-xs">Download</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleShare}
            className="flex-col h-auto py-3 gap-2"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs">Share</span>
          </Button>

          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex-col h-auto py-3 gap-2"
          >
            <Printer className="w-5 h-5" />
            <span className="text-xs">Print</span>
          </Button>
        </div>
      )}

      {/* Instructions */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="font-semibold text-sm mb-2">📱 How to use:</h4>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Print and place this QR code on the table</li>
          <li>Customers scan with their phone camera</li>
          <li>They can browse menu and order instantly</li>
          <li>No app download required!</li>
        </ol>
      </Card>
    </div>
  );
}
