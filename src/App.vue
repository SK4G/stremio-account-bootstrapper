<script setup>
import './assets/main.css';
import Header from './components/Header.vue';
import DarkModeToggle from './components/DarkModeToggle.vue';
import Summary from './components/Summary.vue';
import Configuration from './components/Configuration.vue';
import How from './components/How.vue';
import FAQ from './components/FAQ.vue';
import ThankYou from './components/ThankYou.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <header>
    <DarkModeToggle />
    <Header
      addonName="Stremio Account Bootstrapper"
      addonSummary="Set up your Stremio account with just a few clicks."
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
