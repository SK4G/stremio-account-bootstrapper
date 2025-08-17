<template>
  <section id="thanks">
    <h2>{{ t('credits_title') }}</h2>
    <p v-html="t('credits_text')"></p>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
