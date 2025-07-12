import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import i18n from "./i18n";

import "./style.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(createPinia());
app.use(vuetify);
app.use(VueQueryPlugin);
app.use(i18n);

app.mount("#app");
