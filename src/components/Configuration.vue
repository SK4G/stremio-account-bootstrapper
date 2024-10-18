<script setup>
import { ref } from 'vue';
import { Buffer } from 'buffer';
import draggable from 'vuedraggable';
import AddonItem from './AddonItem.vue';
import Authentication from './Authentication.vue';
import DynamicForm from './DynamicForm.vue';

const stremioAPIBase = 'https://api.strem.io/api/';
const dragging = false;
let stremioAuthKey = ref('');
let addons = ref([]);
let loadAddonsButtonText = ref('Load Preset Addons');
let language = ref('en');
let realDebridApiKey = ref(null);
let torrentioValues = {
  name: '',
  transportUrl: ''
};
// TODO: Move this config to the preset.
const cometConfig =
  'eyJpbmRleGVycyI6WyJiaXRzZWFyY2giLCJlenR2IiwidGhlcGlyYXRlYmF5IiwidGhlcmFyYmciLCJ5dHMiXSwibWF4UmVzdWx0cyI6MjAsIm1heFNpemUiOjAsInJlc3VsdEZvcm1hdCI6WyJBbGwiXSwicmVzb2x1dGlvbnMiOlsiNGsiLCIyMTYwcCIsIjE0NDBwIiwiMTA4MHAiLCI3MjBwIiwiNTc2cCIsIjQ4MHAiXSwibGFuZ3VhZ2VzIjpbIkFsbCJdLCJkZWJyaWRTZXJ2aWNlIjoicmVhbGRlYnJpZCIsImRlYnJpZEFwaUtleSI6Int7aXQucmVhbERlYnJpZEFwaUtleX19IiwiZGVicmlkU3RyZWFtUHJveHlQYXNzd29yZCI6IiJ9';

let isEditModalVisible = ref(false);
let currentManifest = ref({});
let currentEditIdx = ref(null);

function loadUserAddons() {
  const key = stremioAuthKey.value;
  if (!key) {
    console.error('No auth key provided');
    return;
  }

  loadAddonsButtonText.value = 'Loading...';
  console.log('Loading addons...');

  const url = `${stremioAPIBase}addonCollectionGet`;
  fetch(`/presets/${language.value}.json`)
    .then((resp) => {
      resp.json().then((data) => {
        console.log(data);
        if (!('result' in data) || data.result == null) {
          console.error('Failed to fetch presets: ', data);
          alert('Failed to fetch presets.');
          return;
        }

        let { addons: presetConfig } = data.result;

        if (isValidApiKey()) {
          // Comet
          const reencodedCometConfig = Buffer.from(
            Sqrl.render(Buffer.from(cometConfig, 'base64').toString('utf-8'), {
              realDebridApiKey: realDebridApiKey.value
            })
          ).toString('base64');

          presetConfig[2].transportUrl = Sqrl.render(
            presetConfig[2].transportUrl,
            { transportUrl: reencodedCometConfig }
          );

          // Torrentio RD
          torrentioValues = {
            name: 'RD',
            transportUrl: `|sort=qualitysize|debridoptions=nodownloadlinks,nocatalog|realdebrid=${realDebridApiKey.value}`
          };
        } else {
          presetConfig.splice(2, 1);
        }

        if (language.value !== 'factory') {
          // Torrentio
          presetConfig[1].transportUrl = Sqrl.render(
            presetConfig[1].transportUrl,
            torrentioValues
          );
          presetConfig[1].manifest.name = Sqrl.render(
            presetConfig[1].manifest.name,
            torrentioValues
          );
        }

        addons.value = presetConfig;
      });
    })
    .catch((error) => {
      console.error('Error fetching presets', error);
    })
    .finally(() => {
      loadAddonsButtonText.value = 'Load Preset Addons';
    });
}

function syncUserAddons() {
  const key = stremioAuthKey.value;
  if (!key) {
    console.error('No auth key provided');
    return;
  }
  console.log('Syncing addons...');

  const url = `${stremioAPIBase}addonCollectionSet`;
  fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      type: 'AddonCollectionSet',
      authKey: key,
      addons: addons.value
    })
  })
    .then((resp) => {
      resp.json().then((data) => {
        if (!('result' in data) || data.result == null) {
          console.error('Sync failed: ', data);
          alert('Sync failed if unknown error');
          return;
        } else if (!data.result.success) {
          alert('Failed to sync addons: ' + data.result.error);
        } else {
          console.log('Sync complete: + ', data);
          alert('Sync complete!');
        }
      });
    })
    .catch((error) => {
      alert('Error syncing addons: ' + error);
      console.error('Error fetching user addons', error);
    });
}

function removeAddon(idx) {
  addons.value.splice(idx, 1);
}

function getNestedObjectProperty(obj, path, defaultValue = null) {
  try {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  } catch (e) {
    return defaultValue;
  }
}

function setAuthKey(authKey) {
  stremioAuthKey.value = authKey;
  console.log('AuthKey set to: ', stremioAuthKey.value);
}

function openEditModal(idx) {
  isEditModalVisible.value = true;
  currentEditIdx.value = idx;
  currentManifest.value = { ...addons.value[idx].manifest };
  document.body.classList.add('modal-open');
}

function closeEditModal() {
  isEditModalVisible.value = false;
  currentManifest.value = {};
  currentEditIdx.value = null;
  document.body.classList.remove('modal-open');
}

function saveManifestEdit(updatedManifest) {
  try {
    addons.value[currentEditIdx.value].manifest = updatedManifest;
    closeEditModal();
  } catch (e) {
    alert('Failed to update manifest');
  }
}

function isValidApiKey() {
  if (!!realDebridApiKey.value) {
    return (
      /^[a-zA-Z0-9]+$/.test(realDebridApiKey.value) &&
      realDebridApiKey.value.length === 52
    );
  }

  return false;
}
</script>

<template>
  <section id="configure">
    <h2>Configure</h2>
    <form onsubmit="return false;">
      <fieldset>
        <Authentication
          :stremioAPIBase="stremioAPIBase"
          @auth-key="setAuthKey"
        />
      </fieldset>
      <fieldset id="form_step1">
        <legend>Step 1: Select language</legend>
        <div>
          <label>
            <input type="radio" value="en" v-model="language" />
            English
          </label>
          <label>
            <input type="radio" value="es" v-model="language" />
            Spanish
          </label>
          <label>
            <input type="radio" value="factory" v-model="language" />
            Factory
          </label>
        </div>
      </fieldset>
      <fieldset id="form_step2">
        <legend>Step 2: Enter RealDebrid API Key (optional)</legend>
        <div>
          <label>
            <input v-model="realDebridApiKey" />
            <a target="_blank" href="https://real-debrid.com/apitoken"
              >Get it from here</a
            >
          </label>
        </div>
      </fieldset>
      <fieldset id="form_step3">
        <legend>Step 3: Load preset</legend>
        <button class="button primary" @click="loadUserAddons">
          {{ loadAddonsButtonText }}
        </button>
      </fieldset>
      <fieldset id="form_step4">
        <legend>Step 4: Customize Addons (optional)</legend>
        <draggable
          :list="addons"
          item-key="transportUrl"
          class="sortable-list"
          ghost-class="ghost"
          @start="dragging = true"
          @end="dragging = false"
        >
          <template #item="{ element, index }">
            <AddonItem
              :name="element.manifest.name"
              :idx="index"
              :manifestURL="element.transportUrl"
              :logoURL="element.manifest.logo"
              :isDeletable="
                !getNestedObjectProperty(element, 'flags.protected', false)
              "
              :isConfigurable="
                getNestedObjectProperty(
                  element,
                  'manifest.behaviorHints.configurable',
                  false
                )
              "
              @delete-addon="removeAddon"
              @edit-manifest="openEditModal"
            />
          </template>
        </draggable>
      </fieldset>
      <fieldset id="form_step5">
        <legend>Step 5: Bootstrap account</legend>
        <button
          type="button"
          class="button primary icon"
          @click="syncUserAddons"
        >
          Sync to Stremio
          <img
            src="https://icongr.am/feather/loader.svg?size=16&amp;color=ffffff"
            alt="icon"
          />
        </button>
      </fieldset>
    </form>
  </section>

  <div v-if="isEditModalVisible" class="modal" @click.self="closeEditModal">
    <div class="modal-content">
      <h3>Edit manifest</h3>
      <DynamicForm
        :manifest="currentManifest"
        @update-manifest="saveManifestEdit"
      />
    </div>
  </div>
</template>

<style scoped>
.sortable-list {
  padding: 25px;
  border-radius: 7px;
  padding: 30px 25px 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.item.dragging {
  opacity: 0.6;
}

.item.dragging :where(.details, i) {
  opacity: 0;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}

.modal-content {
  background: #2e2e2e;
  color: #e0e0e0;
  width: 75vw;
  max-width: 900px;
  max-height: 90vh;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

button {
  padding: 10px 20px;
  border: none;
  background-color: #ffa600;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}
</style>
