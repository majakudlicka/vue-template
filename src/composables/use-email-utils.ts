import axios from "axios";
import { IEmail } from "../types/email";

type voidFunc = (emails: Array<IEmail>) => void;

// Various email utilities
export const useEmailUtils = function (): {
  clear: voidFunc;
  markRead: voidFunc;
  markUnread: voidFunc;
  archive: voidFunc;
  moveToInbox: voidFunc;
} {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const forSelected = (emails: Array<IEmail>, fn: Function) => {
    emails.forEach((email: IEmail) => {
      fn(email);
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    });
  };
  const clear = (emails: Array<IEmail>) => {
    emails.splice(0, emails.length);
  };
  const markRead = (emails: Array<IEmail>) => {
    forSelected(emails, (e: IEmail) => (e.read = true));
  };
  const markUnread = (emails: Array<IEmail>) => {
    forSelected(emails, (e: IEmail) => (e.read = false));
  };
  const archive = (emails: Array<IEmail>) => {
    forSelected(emails, (e: IEmail) => (e.archived = true));
    clear(emails);
  };
  const moveToInbox = (emails: Array<IEmail>) => {
    forSelected(emails, (e: IEmail) => (e.archived = false));
    clear(emails);
  };

  return {
    clear,
    markRead,
    markUnread,
    archive,
    moveToInbox,
  };
};
