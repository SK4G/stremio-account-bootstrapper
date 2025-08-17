import './assets/main.css';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { inject } from '@vercel/analytics';
import App from './App.vue';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import de from './locales/de.json';
import pt from './locales/pt.json';

inject();

const savedLang = localStorage.getItem('language') || 'en';

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  messages: { en, es, fr, it, de, pt }
});

createApp(App).use(i18n).mount('#app');
