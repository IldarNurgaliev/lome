// import Vue from "vue";
// import Vuetify from "vuetify/lib";

// Vue.use(Vuetify);

// export default new Vuetify({});

import Vue from "vue";
import Vuetify, { VSnackbar, VBtn, VIcon } from "vuetify/lib";
import VuetifyToast from "vuetify-toast-snackbar-ng";

Vue.use(Vuetify, {
  components: {
    VSnackbar
  }
});
const opts = {}; // your options

const vueObj = new Vuetify(opts);

export default vueObj;

Vue.use(VuetifyToast, { $vuetify: vueObj.framework });