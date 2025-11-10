import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QrService {
  constructor(private configService: ConfigService) {}

  async generateQR(petId: string): Promise<string> {
    const baseUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const qrData = `${baseUrl}/pet/${petId}`;
    
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 2,
      });
      
      return qrCodeDataUrl;
    } catch (error) {
      throw new Error('Error generando código QR');
    }
  }

  async generateQRBuffer(petId: string): Promise<Buffer> {
    const baseUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const qrData = `${baseUrl}/pet/${petId}`;
    
    try {
      return await QRCode.toBuffer(qrData, {
        errorCorrectionLevel: 'H',
        type: 'png',
        width: 300,
      });
    } catch (error) {
      throw new Error('Error generando código QR');
    }
  }
}
