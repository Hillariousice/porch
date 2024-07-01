import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;
  private readonly logger = new Logger(MailService.name);
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.MAIL_USER || 'hillariousice@gmail.com',
        pass: process.env.MAIL_PASS || 'stjxcnvjveokwegd',
      },
    });
  }

  async sendEmail(
    emailContent: { to: string; subject: string; body: string },
    sendDate: Date,
  ) {
    try {
      const sendMail = async () => {
        await this.transporter.sendMail({
          from: process.env.MAIL_USER,
          to: emailContent.to,
          subject: emailContent.subject,
          text: emailContent.body,
        });
      };

      const now = new Date();
      const delay = sendDate.getTime() - now.getTime();

      if (delay > 0) {
        setTimeout(sendMail, delay);
      } else {
        await sendMail();
      }
      this.logger.log(`Email successfully sent to ${emailContent.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${emailContent.to}`, error);
      throw new Error('Failed to send email. Please try again later.');
    }
  }
}
