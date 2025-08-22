<script setup>
import { ref } from 'vue';
import {
  getAddonCollection,
  setAddonCollection
} from '../composables/useStremioApi';
import { format } from 'date-fns';
import { useI18n } from 'vue-i18n';

const { stremioAuthKey } = defineProps({
  stremioAuthKey: { type: String }
});

const { t } = useI18n();
const loadingBackup = ref(false);
const loadingRestore = ref(false);
const error = ref(null);
const fileInputRef = ref(null);

function backupConfig() {
  loadingBackup.value = true;
  error.value = null;

  getAddonCollection(stremioAuthKey)
    .then((data) => {
      console.log('Backup data:', data);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stremio-addons-config-${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      alert(t('backup_saved'));
    })
    .catch((e) => {
      error.value = e?.message || String(e);
      alert(`${error.value || t('backup_failed')}`);
    })
    .finally(() => {
      loadingBackup.value = false;
    });
}

function openFilePicker() {
  if (!stremioAuthKey) return;
  fileInputRef.value?.click();
}

async function restoreConfigFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!stremioAuthKey) {
    event.target.value = '';
    return;
  }

  loadingRestore.value = true;
  error.value = null;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);

    const addonsPayload = parsed?.result?.addons;

    if (!addonsPayload) {
      alert(t('invalid_backup_file'));
      throw new Error(t('invalid_backup_file'));
    }

    await setAddonCollection(addonsPayload, stremioAuthKey).then(() => {
      alert(t('restore_successful'));
    });
  } catch (e) {
    error.value = e?.message || String(e);
    alert(`${error.value || t('restore_failed')}`);
  } finally {
    loadingRestore.value = false;
    event.target.value = '';
  }
}
</script>

<template>
  <section id="backup">
    <h2>{{ $t('backup_restore') }}</h2>
    <fieldset style="padding: 0 20px; padding-top: 10px">
      <div class="row">
        <div class="col-6">
          <button
            class="button primary"
            @click="backupConfig"
            :disabled="!stremioAuthKey || loadingBackup"
          >
            {{ loadingBackup ? $t('backing_up') : $t('backup_config') }}
          </button>
        </div>
        <div class="col-6">
          <button
            class="button secondary"
            @click="openFilePicker"
            :disabled="!stremioAuthKey || loadingRestore"
            style="display: inline-flex; align-items: center"
          >
            {{ loadingRestore ? $t('restoring') : $t('restore_config') }}
          </button>

          <input
            ref="fileInputRef"
            type="file"
            accept=".json,application/json"
            @change="restoreConfigFile"
            style="display: none"
            :disabled="!stremioAuthKey || loadingRestore"
          />
        </div>
      </div>
    </fieldset>
  </section>
</template>
