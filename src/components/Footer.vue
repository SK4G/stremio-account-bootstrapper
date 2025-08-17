<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <div class="is-horizontal-align footer">
    <p>{{ t('footer_credit') }}</p>
    <a
      href="https://github.com/DryKillLogic/stremio-account-bootstrapper"
      target="_blank"
      >{{ t('footer_source_code') }}</a
    >
  </div>
</template>

<style scoped>
.footer {
  gap: 5px;
}
</style>
