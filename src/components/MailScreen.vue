<template>
  <div>
    <div class="mt-3 mb-3">
      <v-btn
        @click="selectScreen('inbox')"
        :dark="selectedScreen === 'inbox'"
        class="mr-2"
      >
        Inbox View
      </v-btn>
      <v-btn
        @click="selectScreen('archive')"
        :dark="selectedScreen === 'archive'"
      >
        Archived View
      </v-btn>
    </div>
    <h1 class="mb-4">VMail {{ capitalize(selectedScreen) }}</h1>

    <MailTable :emails="filteredEmails">
      <template v-slot:default="slotProps">
        <BulkActionBar
          :emails="filteredEmails"
          :selected-screen="selectedScreen"
          :selected-emails="slotProps.selected"
        />
      </template>
    </MailTable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import axios from "axios";
import _ from "lodash";
import { IEmail } from "../types/email";
import MailTable from "../components/MailTable.vue";
import BulkActionBar from "../components/BulkActionBar.vue";
import { useEmailUtils } from "../composables/use-email-utils";

export default defineComponent({
  setup() {
    const emailSelection = useEmailUtils();
    return {
      emailSelection,
    };
  },
  data() {
    return {
      selectedScreen: "inbox",
      emails: [],
    };
  },
  async mounted() {
    const res = await axios.get("http://localhost:3000/emails");
    this.emails = res.data;
  },
  components: {
    BulkActionBar,
    MailTable,
  },
  computed: {
    sortedEmails(): IEmail[] {
      return _.sortBy(this.emails, "sendAt");
    },
    unarchivedEmails(): IEmail[] {
      return this.sortedEmails.filter((e: IEmail) => !e.archived);
    },
    archivedEmails(): IEmail[] {
      return this.sortedEmails.filter((e) => e.archived);
    },
    filteredEmails(): IEmail[] {
      const filters: {
        [key: string]: IEmail[];
      } = {
        inbox: this.unarchivedEmails,
        archive: this.archivedEmails,
      };
      return filters[this.selectedScreen];
    },
  },
  methods: {
    selectScreen(newScreen: string) {
      this.selectedScreen = newScreen;
    },
    capitalize(word: string) {
      if (!word || !word.length) {
        return;
      }
      return word[0].toUpperCase() + word.slice(1);
    },
  },
});
</script>
