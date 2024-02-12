import { EmailMessage, SendEmailResult } from './email.type';

//TODO: should be separated service!! we should move this one to shared folder
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendGridEmailWithDynamicTemplate = (
  emailMessage: EmailMessage,
): Promise<SendEmailResult> => {
  const { from, to, dynamicTemplateData, templateId, subject, attachment } =
    emailMessage;

  //TODO: I think we should use logging service in whole project

  dynamicTemplateData.subject = subject.replace(/<[^>]*>/g, ' ');

  const sendGridMessage: any = {
    from,
    personalizations: [
      {
        to,
        dynamic_template_data: dynamicTemplateData,
      },
    ],
    template_id: templateId,
    subject: subject.replace(/<[^>]*>/g, ' '),
  };

  if (attachment?.content) {
    sendGridMessage.attachments = [
      {
        content: attachment.content,
        filename: attachment.filename,
        type: attachment.type,
      },
    ];
  }

  return sgMail.send(sendGridMessage);
};
