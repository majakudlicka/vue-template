<template>
  <div>
    <slot v-bind:selected="selected"> </slot>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="emails"
      show-select
      @click:row="openEmail"
      :item-class="(item) => (item.read ? '' : 'unread')"
    >
      <template v-slot:item.sentAt="{ item }">
        {{ format(new Date(item.sentAt), "MMM do yyyy") }}
      </template>
      <template v-slot:item.archive="{ item }">
        <v-btn plain size="x-small" @click.stop="archiveEmail(item)"
          >Archive</v-btn
        >
      </template>
    </v-data-table>
    <v-dialog v-if="openedEmail" v-model="modalOpen">
      <MailView
        :email="openedEmail"
        :changeEmail="(args) => changeEmail(openedEmail, args)"
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
    let openedEmail = ref<null | IEmail>(null);
    return {
      format,
      openedEmail,
      emailSelection: useEmailUtils(),
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
    };
  },
  components: {
    MailView
  },
  methods: {
    openEmail(email: IEmail) {
      this.modalOpen = true;
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
tr.unread {
  font-weight: bold;
}

.v-dialog {
  background-color: white;
  padding: 25px;
}
</style>
