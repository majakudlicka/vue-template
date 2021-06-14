<template>
  <div class="MailTable">
    <slot :selected="selected"> </slot>
    <!-- data table example -->
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="emails"
      show-select
      :item-class="(item) => (item.read ? '' : 'unread')"
      @click:row="openEmail"
    >
      <template v-slot:item.sentAt="{ item }">
        {{ format(new Date(item.sentAt), "MMM do yyyy") }}
      </template>
      <!-- Example of how to pass custom data to the table -->
      <template v-slot:item.archive="{ item }">
        <v-btn
          v-if="!item.archived"
          plain
          size="x-small"
          @click.stop="emailUtils.archive([item])"
          >Archive</v-btn
        >
        <v-btn
          v-else
          plain
          size="x-small"
          @click.stop="emailUtils.moveToInbox([item])"
          >Move to Inbox</v-btn
        >
      </template>
    </v-data-table>
    <v-dialog v-if="openedEmail" v-model="modalOpen">
      <MailView
        :email="openedEmail"
        :change-email="(args) => changeEmail(openedEmail, args)"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { IEmail } from "../types/email";
import { defineComponent, PropType, ref } from "@vue/composition-api";
import { format } from "date-fns";
import MailView from "../components/MailView.vue";
import { useEmailUtils } from "../composables/use-email-utils";
import axios from "axios";

export default defineComponent({
  setup() {
    // Use of composition api for code reuse
    const emailUtils = useEmailUtils();
    return {
      emailUtils,
    };
  },
  data() {
    return {
      selected: [],
      modalOpen: false,
      headers: [
        { value: "from", text: "From" },
        { value: "subject", text: "Title" },
        { value: "sentAt", text: "Date" },
        { value: "archive", text: "" },
      ],
      openedEmail: null as null | IEmail,
    };
  },
  components: {
    MailView,
  },
  methods: {
    format,
    openEmail(email: IEmail) {
      this.modalOpen = true;
      this.openedEmail = email;
      if (email) {
        email.read = true;
        axios.put(`http://localhost:3000/emails/${email.id}`, email);
      }
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
        this.modalOpen = false;
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

<style lang="scss">
.MailTable {
  cursor: pointer;

  tr.unread {
    font-weight: bold;
  }
}
.v-dialog {
  background-color: white;
  padding: 25px;
}
</style>
