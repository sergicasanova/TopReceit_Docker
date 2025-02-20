import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class NotificationService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }

  async sendPushNotification(
    token: string,
    title: string,
    body: string,
  ): Promise<void> {
    const message: admin.messaging.Message = {
      notification: {
        title: title,
        body: body,
      },
      token: token,
    };

    await admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log('Successfully sent notification:', response);
      })
      .catch((error) => {
        console.log('Error sending notification:', error);
      });
  }
}
