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

const supported = ['en', 'es', 'fr', 'it', 'de', 'pt'];
let savedLang = localStorage.getItem('language');
if (!savedLang) {
  const nav =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    'en';
  const primary = String(nav).split('-')[0];
  savedLang = supported.includes(primary) ? primary : 'en';
  localStorage.setItem('language', savedLang);
}

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  messages: { en, es, fr, it, de, pt }
});

createApp(App).use(i18n).mount('#app');
