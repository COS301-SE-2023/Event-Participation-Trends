import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
      this.transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env['ADMIN_EMAIL'], 
          pass: process.env['APP_KEY'],  
        },
        tls: {
            rejectUnauthorized: false
          }
      });
    }
  
    async sendEmail(toEmail: string, subjectStr: string, content: string): Promise<void> {
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env['ADMIN_EMAIL'],
        to: toEmail,
        subject: subjectStr,
        text: content,
      };
      await this.transporter.sendMail(mailOptions);
    }

}