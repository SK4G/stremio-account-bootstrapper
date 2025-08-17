<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <section id="faq">
    <h2>{{ t('faq_title') }}</h2>
    <details>
      <summary>{{ t('faq_risks_summary') }}</summary>
      <p v-html="t('faq_risks_desc')"></p>
    </details>
    <details>
      <summary>{{ t('faq_credentials_summary') }}</summary>
      <p>{{ t('faq_credentials_desc1') }}</p>
      <p>{{ t('faq_credentials_desc2') }}</p>
    </details>
    <details>
      <summary>{{ t('faq_console_summary') }}</summary>
      <p>{{ t('faq_console_desc1') }}</p>
      <p>
        {{ t('faq_console_desc2_1') }}
        <a
          href="https://balsamiq.com/support/faqs/browserconsole/"
          target="_blank"
          >{{ t('faq_console_guide_link') }}</a
        >
        {{ t('faq_console_desc2_2') }}
      </p>
    </details>
    <details>
      <summary>{{ t('faq_debrid_summary') }}</summary>
      <p>{{ t('faq_debrid_desc1') }}</p>
      <p>{{ t('faq_debrid_desc2') }}</p>
      <ul>
        <li>{{ t('faq_debrid_benefit1') }}</li>
        <li>{{ t('faq_debrid_benefit2') }}</li>
        <li>{{ t('faq_debrid_benefit3') }}</li>
        <li>{{ t('faq_debrid_benefit4') }}</li>
      </ul>
      <p>
        <i>{{ t('faq_debrid_note') }}</i>
      </p>
    </details>
    <details>
      <summary>{{ t('faq_next_summary') }}</summary>
      <p>
        {{ t('faq_next_desc1') }}
        <a href="https://stremio-addons.net" target="_blank">{{
          t('faq_next_addons_link')
        }}</a
        >.
      </p>
    </details>
  </section>
</template>
