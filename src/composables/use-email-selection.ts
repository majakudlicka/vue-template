import { reactive, ref } from "@vue/composition-api";
import axios from "axios";
import _ from 'lodash';
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
    emails.pop();
    emails.pop();
    emails.pop();
    emails.pop();
    console.log('emails afet clear ', emails);
  };
  const toggle = (id: IEmail) => {
    if (emails.includes(id)) {
      _.remove(emails, id);
      // emails.delete(id);
    } else {
      emails.push(id);
    }
  };
  const addMultiple = (newEmails: IEmail[]) => {
    console.log('in add multiple');
    newEmails.forEach((email) => {
      emails.push(email);
    });
    console.log(newEmails);
    console.log('emails ', emails);
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
    emails: reactive(emails),
    clear,
    toggle,
    addMultiple,
    markRead,
    markUnread,
    archive,
    moveToInbox,
  };
};
