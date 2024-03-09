import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Usermail } from 'src/users/entities/usermail.entity';
import { SENDGRID_HOST_MAIL } from 'src/environments';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendTestMail(token: string) {
    await this.mailerService
      .sendMail({
        to: 'starkdevmljp@gmail.com', // List of receivers email address
        from: 'user@outlook.com', // Senders email address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: `<b>${token}</b>`, // HTML body content
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async sendVerifyMail(
    name: string,
    email: string,
    url: string,
  ): Promise<boolean> {
    console.log(url);
    await this.mailerService
      .sendMail({
        to: email,
        from: SENDGRID_HOST_MAIL,
        subject:
          'visualee.aiをご利用いただきありがとうございます。メールを確認してください。',
        template: './verifyMail',
        context: {
          name: name,
          url: url,
        },
      })
      .then((success) => {
        console.log(success);
        console.log('success');
        return true;
      })
      .catch((error) => {
        console.log(error);
        console.log('error');
        return false;
      });
    console.log('error');

    return false;
  }

  async forgotpasswordMail(
    name: string,
    email: string,
    url: string,
  ): Promise<boolean> {
    await this.mailerService
      .sendMail({
        to: email,
        from: SENDGRID_HOST_MAIL,
        subject:
          'visualee.aiをご利用いただきありがとうございます。 下のリンクをクリックしてパスワードをリセットしてください。',
        template: './forgotpasswordMail',
        context: {
          name: name,
          url: url,
        },
      })
      .then((success) => {
        console.log(success);
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    return false;
  }

  async sendUserConfirmation(
    user: Usermail,
    confirmNumber: string,
  ): Promise<boolean> {
    await this.mailerService
      .sendMail({
        to: user.email,
        from: SENDGRID_HOST_MAIL,
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './forgotpasswordMail',
        context: {
          name: user.name,
          confirmNumber,
        },
      })
      .then((success) => {
        console.log(success);
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });

    return false;
  }
}
