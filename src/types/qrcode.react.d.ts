declare module 'qrcode.react' {
    import * as React from 'react';
  
    interface QRCodeProps {
      value: string;
      size?: number;
      bgColor?: string;
      fgColor?: string;
      level?: 'L' | 'M' | 'Q' | 'H';
      renderAs?: 'canvas' | 'svg';
      includeMargin?: boolean;
    }
  
    export const QRCodeCanvas: React.FC<QRCodeProps>;
    export const QRCodeSVG: React.FC<QRCodeProps>;
}
  