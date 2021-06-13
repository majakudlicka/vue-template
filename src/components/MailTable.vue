<template>
  <div>
    <table class="mail-table">
      <tbody>
        <tr
          v-for="email in emails"
          :key="email.id"
          :class="[email.read ? 'read' : '', 'clickable']"
        >
          <td>
            <v-checkbox
              class="ml-2"
              color="indigo"
              :value="emailSelection.emails.includes(email)"
              @click="emailSelection.toggle(email)"
            ></v-checkbox>
          </td>
          <td @click="openEmail(email)">{{ email.from }}</td>
          <td @click="openEmail(email)">
            <p>
              <strong>{{ email.subject }}</strong> - {{ email.body }}
            </p>
          </td>
          <td class="date" @click="openEmail(email)">
            {{ format(new Date(email.sentAt), "MMM do yyyy") }}
          </td>
          <td>
            <v-btn size="x-small" @click="archiveEmail(email)">Archive</v-btn>
          </td>
        </tr>
      </tbody>
    </table>
    <ModalView
      v-if="openedEmail"
      :closeModal="
        () => {
          openedEmail = null;
        }
      "
    >
      <MailView
        :email="openedEmail"
        :changeEmail="(args) => changeEmail(openedEmail, args)"
      />
    </ModalView>
  </div>
</template>

<script lang="ts">
import { IEmail } from "../types/email";
import { defineComponent, PropType, ref } from "@vue/composition-api";
import { format } from "date-fns";
import MailView from "../components/MailView.vue";
import ModalView from "../components/ModalView.vue";
import { useEmailSelection } from "../composables/use-email-selection";
import axios from "axios";
export default defineComponent({
  setup() {
    let openedEmail = ref<null | IEmail>(null);
    return {
      format,
      openedEmail,
      emailSelection: useEmailSelection(),
    };
  },
  components: {
    MailView,
    ModalView,
  },
  methods: {
    openEmail(email: IEmail) {
      this.openedEmail = email;
      if (email) {
        email.read = true;
        axios.put(`http://localhost:3000/emails/${email.id}`, email);
      }
    },
    archiveEmail(email: IEmail) {
      email.archived = true;
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    },
    changeEmail(
      email: IEmail,
      {
        indexChange,
        toggleArchive,
        toggleRead,
        save,
        closeModal,
      }: {
        indexChange: number;
        toggleArchive: boolean;
        toggleRead: boolean;
        save: boolean;
        closeModal: boolean;
      }
    ) {
      if (toggleArchive) {
        email.archived = !email.archived;
      }
      if (toggleRead) {
        email.read = !email.read;
      }
      if (save) {
        axios.put(`http://localhost:3000/emails/${email.id}`, email);
      }
      if (closeModal) {
        this.openedEmail = null;
        return null;
      }
      if (indexChange) {
        const index = this.emails.findIndex((e) => e === email);
        this.openEmail(this.emails[index + indexChange]);
      }
    },
  },
  props: {
    emails: {
      type: Array as PropType<IEmail[]>,
      required: true,
    },
  },
});
</script>
