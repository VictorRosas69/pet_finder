import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PetsModule } from './pets/pets.module';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { QrModule } from './qr/qr.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PetsModule,
    ReportsModule,
    NotificationsModule,
    QrModule,
  ],
})
export class AppModule {}
