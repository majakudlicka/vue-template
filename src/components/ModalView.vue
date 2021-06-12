<template>
  <div class="modal">
    <div class="overlay" @click="closeModal"></div>
    <div class="modal-card">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api";
import { useKeydown } from "../composables/use-keydown";

export default defineComponent({
  setup(props) {
    useKeydown([{ key: "Escape", fn: props.closeModal }]);
  },
  props: {
    closeModal: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
});
</script>
