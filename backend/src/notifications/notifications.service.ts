import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private firebaseEnabled = false;

  constructor(private configService: ConfigService) {
    try {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');
      const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');

      // Solo inicializar si las credenciales son válidas
      if (projectId && privateKey && clientEmail && 
          !privateKey.includes('demo') && !admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            privateKey: privateKey.replace(/\\n/g, '\n'),
            clientEmail,
          }),
        });
        this.firebaseEnabled = true;
        console.log('✅ Firebase inicializado correctamente');
      } else {
        console.log('⚠️  Firebase no configurado - usando modo demo');
      }
    } catch (error) {
      console.log('⚠️  Firebase no disponible - usando modo demo');
    }
  }

  async sendNotification(token: string, title: string, body: string, data?: any) {
    if (!this.firebaseEnabled) {
      console.log('📧 [DEMO] Notificación:', { title, body, token });
      return { success: true, messageId: 'demo-mode', demo: true };
    }

    const message = {
      notification: { title, body },
      data: data || {},
      token,
    };

    try {
      const response = await admin.messaging().send(message);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('Error enviando notificación:', error);
      return { success: false, error: error.message };
    }
  }

  async sendToMultiple(tokens: string[], title: string, body: string, data?: any) {
    if (!this.firebaseEnabled) {
      console.log('📧 [DEMO] Notificaciones múltiples:', { title, body, count: tokens.length });
      return { success: true, successCount: tokens.length, failureCount: 0, demo: true };
    }

    const message = {
      notification: { title, body },
      data: data || {},
      tokens,
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      console.error('Error enviando notificaciones:', error);
      return { success: false, error: error.message };
    }
  }
}
