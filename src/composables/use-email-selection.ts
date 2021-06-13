import { reactive } from "@vue/composition-api";
import axios from "axios";
import _ from "lodash";
import { IEmail } from "../types/email";

const emailSet: Array<IEmail> = [];

type voidFunc = () => void;

export const useEmailSelection = function (): {
  emails: Array<IEmail>;
  clear: voidFunc;
  toggle: (id: IEmail) => void;
  addMultiple: (newEmails: IEmail[]) => void;
  markRead: voidFunc;
  markUnread: voidFunc;
  archive: voidFunc;
  moveToInbox: voidFunc;
} {
  const emails: Array<IEmail> = reactive(emailSet);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const forSelected = (fn: Function) => {
    emails.forEach((email: IEmail) => {
      fn(email);
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    });
  };
  const clear = () => {
    emails.splice(0, emails.length);
  };
  const toggle = (email: IEmail) => {
    if (emails.includes(email)) {
      const index = _.findIndex(emails, email);
      emails.splice(index, 1);
    } else {
      emails.push(email);
    }
  };
  const addMultiple = (newEmails: IEmail[]) => {
    newEmails.forEach((email) => {
      emails.push(email);
    });
  };
  const markRead = () => {
    forSelected((e: IEmail) => (e.read = true));
  };
  const markUnread = () => {
    forSelected((e: IEmail) => (e.read = false));
  };
  const archive = () => {
    forSelected((e: IEmail) => (e.archived = true));
    clear();
  };
  const moveToInbox = () => {
    forSelected((e: IEmail) => (e.archived = false));
    clear();
  };

  return {
    emails,
    clear,
    toggle,
    addMultiple,
    markRead,
    markUnread,
    archive,
    moveToInbox,
  };
};
