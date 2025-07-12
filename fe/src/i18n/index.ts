import { createI18n } from "vue-i18n";
import en from "./locales/en.json";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("language") || "en",
  fallbackLocale: "en",
  messages: {
    en: en,
  },
});

export default i18n;
