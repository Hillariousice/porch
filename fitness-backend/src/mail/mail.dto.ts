export type MailPayload = {
  email: string;
  firstName: string;
  token: string;
};

export type MailOptions = {
  to: string;
  subject: string;
  text: string;
};

export type MailResponse = {
  accepted: string[];
  rejected: string[];
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: { from: string; to: string };
  messageId: string;
};
