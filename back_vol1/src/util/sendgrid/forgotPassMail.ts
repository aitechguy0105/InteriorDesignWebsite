import { UserEntity } from 'src/users/entities/user.entity';
import { SENDGRID_HOST_MAIL } from 'src/environments';

export const forgotPassMail = (
  userInfo: UserEntity,
  url: string,
): Promise<boolean> => {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: userInfo.email, // Change to your recipient
    from: SENDGRID_HOST_MAIL, // Change to your verified sender
    subject: '【Beondly;AIサービス】パスワード再設定のご連絡',
    text: 'パスワードをリセットするには、下のリンクをクリックしてください',
    html: `<h4>このたびは、”Beondly;AIサービス”にご登録いただきまして
    まことにありがとうございます。</h4>
    <h4 style="margin-top: 20px;">以下の”確認ボタン”をクリックして、パスワードを再設定してください。</h4>
    <div style="margin: 20px 200px">
  <a href="${url}" style="margin: auto; background-color: #666cff; padding: 10px 40px; border-radius: 5px; color: white; text-decoration: none; ">確認する</a>
    </div> 
  <h4 style="margin-top: 20px;">このメールに見覚えがない、当サービスにご登録されていない場合は
  お手数ですが、以下のアドレスまでご報告ください。</h4>
    <a style="text-decoration: none; margin-top: 20px;" href="mailto:news@trestyle.co">~~~~~~~~~~~~~~~~~news@trestyle.co~~~~~~~~~~~~~~~~~</a>`,
  };

  return sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);

      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};
