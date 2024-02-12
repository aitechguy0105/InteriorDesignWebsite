export type EmailAddress = {
  name?: string;
  email: string;
};

export type EmailDynamicTemplate = {
  CTA?: string;
  subject: string;
  body?: string;
  items?: {
    imageURL: string;
    formattedText: string;
  }[];
  ctaText?: string;

  companyAddress: string;
  emailverify?: string;
  isVendo?: boolean;
  logoURL?: string;
  showButton?: boolean;
};

export type EmailAttachmentType = {
  content: string;
  filename: string;
  type: string;
};

export type EmailMessage = {
  subject: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  templateId: string;
  dynamicTemplateData: EmailDynamicTemplate;
  attachment?: EmailAttachmentType;
};

export type SendEmailResult = { headers: { 'x-message-id': string } }[];
