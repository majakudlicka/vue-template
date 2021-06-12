export interface IEmail {
  id: number;
  from: string;
  subject: string;
  body: string;
  sentAt: Date;
  archived: boolean;
  read: boolean;
}
