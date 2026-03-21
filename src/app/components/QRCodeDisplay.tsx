import { QrCode } from 'lucide-react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeDisplay({ value, size = 200, className = '' }: QRCodeDisplayProps) {
  // Generate QR code URL using a free service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;

  return (
    <div className={`inline-block ${className}`}>
      <img
        src={qrCodeUrl}
        alt={`QR Code for ${value}`}
        className="w-full h-auto border-2 border-muted rounded-lg"
        loading="lazy"
      />
    </div>
  );
}

interface QRCodeButtonProps {
  qrCode: string;
  onShowQR?: () => void;
}

export function QRCodeButton({ qrCode, onShowQR }: QRCodeButtonProps) {
  return (
    <button
      onClick={onShowQR}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
      title="Show QR Code"
    >
      <QrCode className="w-4 h-4" />
      <code className="text-xs">{qrCode}</code>
    </button>
  );
}
