<template>
  <div>
    <v-btn
      @click="selectScreen('inbox')"
      :class="[selectedScreen === 'inbox' ? 'selected' : '']"
      class="mr-2"
    >
      Inbox View
    </v-btn>
    <v-btn
      @click="selectScreen('archive')"
      :class="[selectedScreen === 'archive' ? 'selected' : '']"
    >
      Archived View
    </v-btn>
    <h1 class="mt-3">VMail {{ capitalize(selectedScreen) }}</h1>
    <BulkActionBar :emails="filteredEmails" :selectedScreen="selectedScreen" />
    <MailTable :emails="filteredEmails" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import axios from "axios";
import _ from "lodash";
import { IEmail } from "../types/email";
import MailTable from "../components/MailTable.vue";
import BulkActionBar from "../components/BulkActionBar.vue";
import { useEmailSelection } from "../composables/use-email-selection";

export default defineComponent({
  setup() {
    let emails = ref([]);
    onMounted(async () => {
      const res = await axios.get("http://localhost:3000/emails");
      emails.value = res.data;
    });
    const selectedScreen = ref("inbox");
    return {
      emails,
      selectedScreen,
      emailSelection: useEmailSelection(),
    };
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
      this.emailSelection.clear();
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
