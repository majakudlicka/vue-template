<template>
  <div id="app">
    <MailScreen />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import MailScreen from "../components/MailScreen.vue";

export default defineComponent({
  name: "Home",
  components: {
    MailScreen,
  },
});
</script>
