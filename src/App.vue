<script setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
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
import Authentication from './components/Authentication.vue';
import Backup from './components/Backup.vue';

const { t } = useI18n();

const stremioAuthKey = ref('');

function setAuthKey(key) {
  stremioAuthKey.value = key;
}
</script>

<template>
  <header>
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
      "
    >
      <LanguageSelector />
      <DarkModeToggle />
    </div>
    <Header
      addonName="Stremio Account Bootstrapper"
      :addonSummary="t('addon_summary')"
      addonLogo="logo.png"
    />
  </header>
  <main>
    <Summary />
    <Authentication @auth-key="setAuthKey" />
    <Backup :stremioAuthKey="stremioAuthKey" />
    <Configuration :stremioAuthKey="stremioAuthKey" />
    <How />
    <FAQ />
    <ThankYou />
  </main>
  <footer>
    <Footer />
  </footer>
</template>
