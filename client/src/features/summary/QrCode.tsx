import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export interface QrCodeProps {
  value: string;
  size?: number;
}

export const QrCode: React.FC<QrCodeProps> = ({ value, size = 180 }) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: {
        dark: '#241B22',
        light: '#FFFFFF',
      },
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error('QR code generation failed', err));
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className="bg-cream border border-plum-soft rounded-xl flex items-center justify-center text-xs text-ink-subtle animate-pulse"
      >
        Generating QR...
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt="Clinician Summary QR Code"
      width={size}
      height={size}
      className="rounded-xl border border-plum-soft shadow-xs"
    />
  );
};
