<script setup>
import { useI18n } from 'vue-i18n';
import './assets/main.css';
import Header from './components/Header.vue';
import DarkModeToggle from './components/DarkModeToggle.vue';
import LanguageSelector from './components/LanguageSelector.vue';
import Summary from './components/Summary.vue';
import Configuration from './components/Configuration.vue';
import How from './components/How.vue';
import FAQ from './components/FAQ.vue';
import ThankYou from './components/ThankYou.vue';
import Footer from './components/Footer.vue';

const { t } = useI18n();
</script>

<template>
  <header>
    <DarkModeToggle />
    <LanguageSelector />
    <Header
      addonName="Stremio Account Bootstrapper"
      :addonSummary="t('addon_summary')"
      addonLogo="logo.png"
    />
  </header>
  <main>
    <Summary />
    <Configuration />
    <How />
    <FAQ />
    <ThankYou />
  </main>
  <footer>
    <Footer />
  </footer>
</template>
