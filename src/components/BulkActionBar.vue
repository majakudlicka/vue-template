<template>
  <div class="text-right mb-2">
    <span>
      <v-btn
        size="small"
        class="mr-1"
        :disabled="selectedEmails.every((e) => e.read)"
        @click="emailUtils.markRead(selectedEmails)"
      >
        Mark Read
      </v-btn>
      <v-btn
        size="small"
        class="mr-1"
        :disabled="selectedEmails.every((e) => !e.read)"
        @click="emailUtils.markUnread(selectedEmails)"
      >
        Mark Unread
      </v-btn>
      <v-btn
        v-if="selectedScreen === 'inbox'"
        size="small"
        :disabled="numberSelected === 0"
        @click="emailUtils.archive(selectedEmails)"
      >
        Archive
      </v-btn>
      <v-btn
        v-else
        size="small"
        :disabled="numberSelected === 0"
        @click="emailUtils.moveToInbox(selectedEmails)"
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
    // Use of composition api for code reuse
    const emailUtils = useEmailUtils();
    return {
      emailUtils,
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
  },
});
</script>
