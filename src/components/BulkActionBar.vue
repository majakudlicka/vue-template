<template>
  <div class="bulk-action-bar">
    <!--		Checkboxes are not available in Vuetify alpha :( -->
    <span class="checkbox">
      <input
        type="checkbox"
        :checked="allAreSelected"
        :class="[partialSelection ? 'partial-check' : '']"
        @click="bulkSelect"
      />
    </span>
    <span class="buttons">
      <v-btn
        outlined
        size="small"
        class="mr-1"
        @click="emailSelection.markRead()"
        :disabled="Array.from(emailSelection.emails).every((e) => e.read)"
      >
        Mark Read
      </v-btn>
      <v-btn
        outlined
        size="small"
        class="mr-1"
        @click="emailSelection.markUnread()"
        :disabled="Array.from(emailSelection.emails).every((e) => !e.read)"
      >
        Mark Unread
      </v-btn>
      <v-btn
        outlined
        size="small"
        v-if="selectedScreen === 'inbox'"
        @click="emailSelection.archive()"
        :disabled="numberSelected === 0"
      >
        Archive
      </v-btn>
      <v-btn
        outlined
        size="small"
        v-else
        @click="emailSelection.moveToInbox()"
        :disabled="numberSelected === 0"
      >
        Move to Inbox
      </v-btn>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api";
import { useEmailSelection } from "../composables/use-email-selection";
import { IEmail } from "../types/email";

export default defineComponent({
  setup() {
    const emailSelection = useEmailSelection();
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
  },
  computed: {
    numberSelected(): number {
      return this.emailSelection.emails.length;
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
  methods: {
    bulkSelect(): void {
      if (this.allAreSelected) {
        this.emailSelection.clear();
      } else {
        this.emailSelection.addMultiple(this.emails);
      }
    },
  },
});
</script>
