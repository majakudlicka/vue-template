<template>
  <div class="text-right mb-2">
    <span>
      <v-btn
        size="small"
        class="mr-1"
        @click="emailSelection.markRead(selectedEmails)"
        :disabled="selectedEmails.every((e) => e.read)"
      >
        Mark Read
      </v-btn>
      <v-btn
        size="small"
        class="mr-1"
        @click="emailSelection.markUnread(selectedEmails)"
        :disabled="selectedEmails.every((e) => !e.read)"
      >
        Mark Unread
      </v-btn>
      <v-btn
        size="small"
        v-if="selectedScreen === 'inbox'"
        @click="emailSelection.archive(selectedEmails)"
        :disabled="numberSelected === 0"
      >
        Archive
      </v-btn>
      <v-btn
        outlined
        size="small"
        v-else
        @click="emailSelection.moveToInbox(selectedEmails)"
        :disabled="numberSelected === 0"
      >
        Move to Inbox
      </v-btn>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api";
import { useEmailUtils } from "../composables/use-email-utils";
import { IEmail } from "../types/email";

export default defineComponent({
  setup() {
    const emailSelection = useEmailUtils();
    return {
      emailSelection,
    };
  },
  props: {
    emails: {
      type: Array as PropType<IEmail[]>,
      required: true,
    },
    selectedScreen: {
      type: String,
      required: true,
    },
    selectedEmails: {
      type: Array as PropType<IEmail[]>,
      required: true,
    },
  },
  computed: {
    numberSelected(): number {
      return this.selectedEmails.length;
    },
    allAreSelected(): boolean {
      return (
        this.emails.length === this.numberSelected && this.numberSelected !== 0
      );
    },
    partialSelection(): boolean {
      return this.numberSelected > 0 && !this.allAreSelected;
    },
  },
  methods: {},
});
</script>
