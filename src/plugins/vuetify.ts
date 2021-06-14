import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  // Example of Vuetify theme customisation
  theme: {
    themes: {
      light: {
        anchor: '#3f51b5',
      },
    },
  },
});
