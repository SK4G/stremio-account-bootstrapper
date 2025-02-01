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
let isSyncButtonEnabled = ref(false);
let language = ref('en');
const debridServiceInfo = {
  realdebrid: {
    name: 'RD',
    url: 'https://real-debrid.com/apitoken'
  },
  alldebrid: {
    name: 'AD',
    url: 'https://alldebrid.com/apikeys'
  },
  premiumize: {
    name: 'PM',
    url: 'https://www.premiumize.me/account'
  },
  debridlink: {
    name: 'DL',
    url: 'https://debrid-link.com/webapp/apikey'
  },
  torbox: {
    name: 'TB',
    url: 'https://torbox.app/settings'
  },
  easydebrid: {
    name: 'ED',
    url: 'https://paradise-cloud.com/guides/easydebrid-api-key'
  }
};
let debridService = ref('realdebrid');
let debridApiKey = ref(null);
let debridApiUrl = ref(debridServiceInfo.realdebrid.url);
let debridServiceName = '';
// TODO: Move configs to the preset.
let torrentioConfig = '';
let rpdbKey = ref('');
let isEditModalVisible = ref(false);
let currentManifest = ref({});
let currentEditIdx = ref(null);
let isPasteModalOpen = ref(false);
let customJsonUrl = ref('');
let advancedVisible = ref(false);
let isLoading = ref(false);
let traktCatalogSelection = ref('default');
let traktCatalogOptions = ref({});
let traktListInfo = ref({});
let traktShowCatalogs = ref({});

fetch('/presets/trakt-presets.json')
  .then((response) => response.json())
  .then((data) => {
    traktCatalogOptions.value = data;
    traktListInfo.value = Object.keys(data).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});
    traktShowCatalogs.value = Object.keys(data).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});

    parseTraktListOptions();
  })
  .catch((error) => {
    console.error('Failed to fetch Trakt presets: ', error);
  });

function parseTraktListOptions() {
  Object.keys(traktCatalogOptions.value).forEach((key) => {
    fetch(traktCatalogOptions.value[key])
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.catalogs) {
          traktListInfo.value[key] = data.catalogs.map(catalog => ({
            id: catalog.id,
            name: catalog.name,
            user: catalog.id.split(':')[1],
            list_id: catalog.id.split(':')[2],
            sort: catalog.id.split(':')[3].split(',')
          }));
          // console.log(`Trakt data for ${key} loaded: `, traktListInfo.value[key]);
        } else {
          console.error(`No catalogs found for ${key}`);
        }
      })
      .catch((error) => {
        console.error(`Failed to fetch Trakt data for ${key}: `, error);
      });
  });
}

parseTraktListOptions();

function loadUserAddons() {
  const key = stremioAuthKey.value;
  if (!key) {
    console.error('No auth key provided');
    return;
  }

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
          debridServiceName = debridServiceInfo[debridService.value].name;

          // Torrentio Debrid
          torrentioConfig = `|sort=qualitysize|debridoptions=nocatalog|${debridService.value}=${debridApiKey.value}`;

          // Comet
          const cometIndex = getAddonIndex(presetConfig, 'comet.elfhosted.com');
          const cometTransportUrl = getDataTransportUrl(
            presetConfig[cometIndex].transportUrl
          );
          presetConfig[cometIndex].manifest.name += ` | ${debridServiceName}`;
          presetConfig[cometIndex].transportUrl = getUrlTransportUrl(cometTransportUrl, {
            ...cometTransportUrl.data,
            debridApiKey: debridApiKey.value,
            debridService: debridService.value
          });

          // Jackettio
          const jackettioIndex = getAddonIndex(presetConfig, 'jackettio.elfhosted.com');
          if (debridService.value !== 'torbox') {
            const jackettioTransportUrl = getDataTransportUrl(
              presetConfig[jackettioIndex].transportUrl
            );
            presetConfig[jackettioIndex].manifest.name += ` ${debridServiceName}`;
            presetConfig[jackettioIndex].transportUrl = getUrlTransportUrl(jackettioTransportUrl, {
              ...jackettioTransportUrl.data,
              debridApiKey: debridApiKey.value,
              debridId: debridService.value
            });
          } else {
            removePresetAddon(presetConfig, 'jackettio.elfhosted.com');
          }

          // Remove MediaFusion / KnightCrawler / TPB+
          removePresetAddon(presetConfig, 'stremio.addons.mediafusion|elfhosted', 'Community-knightcrawler.elfhosted.com', 'com.stremio.thepiratebay.plus');
        } else {
          debridServiceName = '';

          // Remove Jackettio
          removePresetAddon(presetConfig, 'jackettio.elfhosted.com');
        }

        // Update preset Trakt catalog to user selection
        if (language.value === 'en') {
          updatePresetAddon(presetConfig, 2, traktCatalogOptions.value[traktCatalogSelection.value]);
        }

        if (!!rpdbKey.value) {
          // Trakt TV
          const traktIndex = getAddonIndex(presetConfig, 'community.trakt-tv');
          const traktTransportUrl = getDataTransportUrl(
            presetConfig[traktIndex].transportUrl
          );

          presetConfig[traktIndex].transportUrl = getUrlTransportUrl(traktTransportUrl, {
            ...traktTransportUrl.data,
            RPDBkey: {
              key: rpdbKey.value,
              valid: true,
              poster: 'poster-default',
              posters: [
                {
                  name: 'poster-default'
                },
                { name: 'textless-default' }
              ],
              tier: rpdbKey.value.charAt(1)
            }
          });

          // TMDB
          const tmdbIndex = getAddonIndex(presetConfig, 'tmdb-addon');
          const tmdbTransportUrl = getDataTransportUrl(
            presetConfig[tmdbIndex].transportUrl,
            false
          );

          presetConfig[tmdbIndex].transportUrl = getUrlTransportUrl(
            tmdbTransportUrl,
            {
              ...tmdbTransportUrl.data,
              ratings: 'on',
              rpdbkey: rpdbKey.value
            },
            false
          );
        }

        if (language.value !== 'factory') {
          if (debridServiceName === 'ED') {
            // StremThru(Torrentio) - ED
            const stWrapTorrentioIndex = getAddonIndex(presetConfig, 'st:wrap:com.stremio.torrentio.addon');
            let easydebridData = {
              "manifest_url": "https://torrentio.strem.fun/providers=yts,eztv,rarbg,1337x,thepiratebay,kickasstorrents,torrentgalaxy,magnetdl%7Csort=qualitysize%7Cqualityfilter=brremux,dolbyvisionwithhdr,480p,other,scr,cam,unknown%7Climit=10/manifest.json",
              "store": "easydebrid",
              "token": debridApiKey.value,
              "cached": false
            }

            presetConfig[stWrapTorrentioIndex].transportUrl = Sqrl.render(
              presetConfig[stWrapTorrentioIndex].transportUrl,
              { transportUrl: encodeDataFromTransportUrl(easydebridData) }
            );
            presetConfig[stWrapTorrentioIndex].manifest.name += ` - ${debridServiceName}`;

            // Debridio
            const debridioIndex = getAddonIndex(presetConfig, 'org.adobotec.debridio');
            const debridioTransportUrl = getDataTransportUrl(
              presetConfig[debridioIndex].transportUrl,
            );
            presetConfig[debridioIndex].transportUrl = getUrlTransportUrl(
              debridioTransportUrl,
              {
                ...debridioTransportUrl.data,
                "apiKey": debridApiKey.value
              },
            );

            // Remove Torrentio / Comet / Jackettio / Stremify
            removePresetAddon(presetConfig, 'com.stremio.torrentio.addon', 'comet.elfhosted.com', 'jackettio.elfhosted.com', 'com.stremify');
          }
          else {
            // Torrentio
            const torrentioIndex = getAddonIndex(presetConfig, 'com.stremio.torrentio.addon');
            presetConfig[torrentioIndex].transportUrl = Sqrl.render(
              presetConfig[torrentioIndex].transportUrl,
              { transportUrl: torrentioConfig }
            );
            presetConfig[torrentioIndex].manifest.name += ` ${debridServiceName}`;
            // Remove StremThru(Torrentio) / Debridio
            removePresetAddon(presetConfig, 'st:wrap:com.stremio.torrentio.addon', 'org.adobotec.debridio');
          }
        }

        addons.value = presetConfig;
      });
    })
    .catch((error) => {
      console.error('Error fetching presets', error);
    })
    .finally(() => {
      isSyncButtonEnabled.value = true;
    });
}

function getAddonIndex(presetConfig, target) {
  const targetIndex = presetConfig.findIndex(addon => addon.manifest && addon.manifest.id === target);
  return targetIndex;
}

function removePresetAddon(presetConfig, ...addonIDs) {
  addonIDs.forEach((addonId) => {
    const indexToRemove = getAddonIndex(presetConfig, addonId);

    if (indexToRemove !== -1) {
      presetConfig.splice(indexToRemove, 1);

      console.log(`${addonId} removed successfully.`);
    } else {
      console.error(`${addonId} not found.`);
    }
  });
}

function updatePresetAddon(presetConfig, idx, addonTransportUrl) {
  presetConfig[idx].transportUrl = addonTransportUrl;
  fetch(addonTransportUrl)
    .then((response) => response.json())
    .then((traktData) => {
      presetConfig[idx].manifest = traktData;
    })
    .catch((error) => {
      console.error('Failed to fetch addon data: ', error);
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

function decodeDataFromTransportUrl(data) {
  return JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
}

function encodeDataFromTransportUrl(data) {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

function urlSafeEncodeDataFromTransportUrl(data) {
  const buffer = Buffer.from(data, 'utf-8');

  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function urlSafeDecodeDataFromTransportUrl(data) {
  let padding = '='.repeat((4 - data.length % 4) % 4);
  let base64 = data.replace(/-/g, '+').replace(/_/g, '/');

  return Buffer.from(base64 + padding, 'base64').toString('utf-8');
}

function getDataTransportUrl(url, base64 = true) {
  const parsedUrl = url.match(/(https?:\/\/[^\/]+\/)([^\/]+)(\/[^\/]+)$/);

  return {
    domain: parsedUrl[1],
    data: base64
      ? decodeDataFromTransportUrl(parsedUrl[2])
      : JSON.parse(decodeURIComponent(parsedUrl[2])),
    manifest: parsedUrl[3]
  };
}

function getUrlTransportUrl(url, data, base64 = true) {
  return (
    url.domain +
    (base64
      ? encodeDataFromTransportUrl(data)
      : encodeURIComponent(JSON.stringify(data))) +
    url.manifest
  );
}

function updateDebridApiUrl() {
  debridApiUrl.value = debridServiceInfo[debridService.value].url;
}

function isValidApiKey() {
  if (!!debridApiKey.value) {
    //const keyLength = debridService.value === 'realdebrid' ? 52 : 20;

    return /^[a-zA-Z0-9-]+$/.test(debridApiKey.value) /*&&
      debridApiKey.value.length === keyLength*/;
  }

  return false;
}

function openPasteModal() {
  isPasteModalOpen.value = true;
}

function closePasteModal() {
  isPasteModalOpen.value = false;
  customJsonUrl.value = '';
}

async function addCustomJsonAddon() {
  isLoading.value = true;
  try {
    const response = await fetch(customJsonUrl.value);
    const parsedJson = await response.json();

    // Validate the parsed JSON
    if (!parsedJson.id || !parsedJson.name || !parsedJson.version) {
      throw new Error('Invalid JSON structure');
    }

    addons.value.push({
      transportUrl: customJsonUrl.value,
      manifest: parsedJson
    });
    closePasteModal();
  } catch (error) {
    alert('Invalid JSON URL or JSON content: ' + error.message);
  } finally {
    isLoading.value = false;
  }
}

function toggleAllCatalogs() {
  const showAll = Object.values(traktShowCatalogs.value).every((shown) => shown);
  Object.keys(traktShowCatalogs.value).forEach((key) => {
    traktShowCatalogs.value[key] = !showAll;
  });
}
</script>

<template>
  <section id="configure">
    <h2>Configure</h2>
    <form onsubmit="return false;">
      <fieldset>
        <Authentication :stremioAPIBase="stremioAPIBase" @auth-key="setAuthKey" />
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
            <input type="radio" value="pt" v-model="language" />
            Portuguese
          </label>
          <label>
            <input type="radio" value="factory" v-model="language" />
            Factory
          </label>
        </div>
      </fieldset>
      <fieldset id="form_step2" :disabled="language !== 'en'">
        <legend>Step 2: Select a Trakt Catalog</legend>
        <div>
            <div class="radio-buttons-flex">
            <label v-for="(url, key) in traktCatalogOptions" :key="key">
              <input type="radio" :value="key" v-model="traktCatalogSelection"/>
              {{ key.charAt(0).toUpperCase() + key.slice(1) }}
            </label>
            </div>
          <div class="catalog-buttons">
            <button v-for="(url, key) in traktCatalogOptions" :key="key" type="button" @click="traktShowCatalogs[key] = !traktShowCatalogs[key]">
              {{ traktShowCatalogs[key] ? 'Hide' : 'Show' }} <br> {{ key.charAt(0).toUpperCase() + key.slice(1) }}
            </button>
            <button type="button" @click="toggleAllCatalogs">
              {{ Object.values(traktShowCatalogs).every(shown => shown) ? 'Hide' : 'Show' }} All Catalogs
            </button>
          </div>
          <div class="catalogs">
            <div v-for="(catalogs, key) in traktListInfo" :key="key">
              <ol v-if="traktShowCatalogs[key]">
                <h4><a :href="traktCatalogOptions[key].replace('=/manifest.json', '=/configure')" target="_blank">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</a></h4>
                <li v-for="catalog in catalogs" :key="catalog.id">
                    <a 
                      :href="`https://trakt.tv/users/${catalog.user}/lists/${catalog.list_id}/?sort=${catalog.sort}`" 
                      target="_blank" style="color: inherit;">{{ catalog.name }}
                    </a>
                    ({{ catalog.user }})
                </li>
              </ol>
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset id="form_step3">
        <legend>
          Step 3: Enter Debrid API Key (optional) <a href="#faq">(?)</a>
        </legend>
        <div>
          <label>
            <input type="radio" value="realdebrid" v-model="debridService" @change="updateDebridApiUrl" />
            RealDebrid
          </label>
          <label>
            <input type="radio" value="alldebrid" v-model="debridService" @change="updateDebridApiUrl" />
            AllDebrid
          </label>
          <label>
            <input type="radio" value="premiumize" v-model="debridService" @change="updateDebridApiUrl" />
            Premiumize
          </label>
          <label>
            <input type="radio" value="debridlink" v-model="debridService" @change="updateDebridApiUrl" />
            Debrid-Link
          </label>
          <label>
            <input type="radio" value="torbox" v-model="debridService" @change="updateDebridApiUrl" />
            TorBox
          </label>
          <label>
            <input type="radio" value="easydebrid" v-model="debridService" @change="updateDebridApiUrl" />
            EasyDebrid
          </label>
          <label>
            <input v-model="debridApiKey" />
            <a target="_blank" :href="`${debridApiUrl}`">Get it from here</a>
          </label>
        </div>
      </fieldset>
      <fieldset id="form_step4">
        <legend>
          Step 4: Enter RPDB key (optional)
          <a target="_blank" href="https://ratingposterdb.com">(?)</a>
        </legend>
        <div>
          <label>
            <input v-model="rpdbKey" />
          </label>
        </div>
      </fieldset>
      <fieldset id="form_step5">
        <legend>Step 5: Load preset</legend>
        <button class="button primary" @click="loadUserAddons">
          Load Addons Preset
        </button>
      </fieldset>
  <fieldset id="form_step6">
    <legend>Step 6: Customize Addons (optional)</legend>
    <draggable :list="addons" item-key="transportUrl" class="sortable-list" ghost-class="ghost"
      @start="dragging = true" @end="dragging = false">
      <template #item="{ element, index }">
        <AddonItem :name="element.manifest.name" :idx="index" :manifestURL="element.transportUrl"
          :logoURL="element.manifest.logo" :isDeletable="!getNestedObjectProperty(element, 'flags.protected', false)"
          :isConfigurable="getNestedObjectProperty(element, 'manifest.behaviorHints.configurable', false)"
          @delete-addon="removeAddon" @edit-manifest="openEditModal" />
      </template>
    </draggable>
    <div>
      <button :disabled="!isSyncButtonEnabled" @click="advancedVisible = !advancedVisible">
        {{ advancedVisible ? 'Hide Advanced Options' : 'Show Advanced Options' }}
      </button>
      <div v-if="advancedVisible">
        <input v-model="customJsonUrl" placeholder="Paste your addon's manifest URL here" />
        <button @click="addCustomJsonAddon">Add Addon</button>
      </div>
    </div>
  </fieldset>
      <fieldset id="form_step7">
        <legend>Step 7: Bootstrap account</legend>
        <button type="button" class="button primary icon" :disabled="!isSyncButtonEnabled" @click="syncUserAddons">
          Sync to Stremio
          <img src="https://icongr.am/feather/loader.svg?size=16&amp;color=ffffff" alt="icon" />
        </button>
      </fieldset>
    </form>
  </section>

  <div v-if="isEditModalVisible" class="modal" @click.self="closeEditModal">
    <div class="modal-content">
      <h3>Edit manifest</h3>
      <DynamicForm :manifest="currentManifest" @update-manifest="saveManifestEdit" />
    </div>
  </div>

  <div v-if="isLoading" class="loading-screen">
    <div class="spinner"></div>
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
  background-color: #7b5bf5;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.spinner {
  border: 16px solid #f3f3f3;
  border-top: 16px solid gray;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.catalog-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.catalog-buttons button {
  flex: 1;
  text-align: center;
}

.catalogs {
  display: flex;
  margin-top: 10px;
}

.catalogs > div {
  flex: inherit;
}

.radio-buttons-flex {
  display: flex;
}

@media (max-width: 600px) {
  .catalogs {
    flex-flow: row wrap;
  }
  .catalog-buttons {
    flex-flow: row wrap;
  }
  .radio-buttons-flex {
  display: flex;
  justify-content: space-between;
  margin-right: 15px;
  }
}

</style>
