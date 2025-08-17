<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <section id="how">
    <h2>{{ t('how_to_get_authkey') }}</h2>
    <ol>
      <li>
        {{ t('how_step1') }}
        <a href="https://web.stremio.com" target="_blank"
          >https://web.stremio.com</a
        >
        {{ t('how_step1_end') }}
      </li>
      <li>
        {{ t('how_step2') }}
        <a href="#faq">(?)</a>
        {{ t('how_step2_middle') }}
        <div class="code-container">
          <code>JSON.parse(localStorage.getItem("profile")).auth.key</code>
        </div>
      </li>
      <li>{{ t('how_step3') }}</li>
    </ol>
  </section>
</template>

<style scoped>
.code-container {
  overflow-x: auto;
  padding: 10px;
  border-radius: 4px;
}

code {
  white-space: nowrap;
  font-family: monospace;
  font-size: 0.9em;
  color: #b93334;
}

@media (max-width: 600px) {
  .code-container {
    padding: 5px;
  }
  code {
    font-size: 0.8em;
  }
}
</style>
