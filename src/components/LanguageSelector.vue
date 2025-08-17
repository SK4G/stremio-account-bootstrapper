<script setup>
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n();
const savedLang = localStorage.getItem('language') || locale.value;
const language = ref(savedLang);

const languageOptions = computed(() => [
  { value: 'en', label: t('english'), flag: '🇺🇸' },
  { value: 'es', label: t('spanish'), flag: '🇪🇸' },
  { value: 'pt', label: t('portuguese'), flag: '🇧🇷' },
  { value: 'fr', label: t('french'), flag: '🇫🇷' },
  { value: 'it', label: t('italian'), flag: '🇮🇹' },
  { value: 'de', label: t('german'), flag: '🇩🇪' }
]);

watch(language, (val) => {
  locale.value = val;
  localStorage.setItem('language', val);
});
</script>

<template>
  <select id="language-select" v-model="language" class="language-select">
    <option v-for="opt in languageOptions" :key="opt.value" :value="opt.value">
      {{ opt.flag }} {{ opt.label }}
    </option>
  </select>
</template>

<style scoped>
.language-select {
  font-size: 1em;
  padding: 6px 16px;
  border-radius: 4px;
  min-width: 90px;
  width: auto;
  max-width: 140px;
  margin: 0 8px;
}
</style>
