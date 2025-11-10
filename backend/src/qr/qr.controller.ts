import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { QrService } from './qr.service';

@Controller('qr')
export class QrController {
  constructor(private qrService: QrService) {}

  @Get(':petId')
  async getQR(@Param('petId') petId: string, @Res() res: Response) {
    const qrBuffer = await this.qrService.generateQRBuffer(petId);
    res.setHeader('Content-Type', 'image/png');
    res.send(qrBuffer);
  }

  @Get(':petId/data')
  async getQRData(@Param('petId') petId: string) {
    const qrDataUrl = await this.qrService.generateQR(petId);
    return { qrCode: qrDataUrl };
  }
}
