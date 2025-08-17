<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  stremioAPIBase: {
    type: String,
    required: true
  }
});

const authKey = ref('');
const email = ref('');
const password = ref('');
const loggedIn = ref(false);
const emits = defineEmits(['auth-key']);

async function loginUserPassword() {
  try {
    fetch(`${props.stremioAPIBase}login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        authKey: null,
        email: email.value,
        password: password.value
      })
    }).then((resp) => {
      resp.json().then((data) => {
        authKey.value = data.result.authKey;
        loggedIn.value = true;
        emitAuthKey();
      });
    });
  } catch (err) {
    console.error(err);
    alert(t('login_failed') + ': ' + err.message);
  }
}

function emitAuthKey() {
  emits('auth-key', authKey.value.replaceAll('"', '').trim());
}
</script>

<template>
  <legend>{{ $t('step0_authenticate') }}</legend>
  <div>
    <label class="grouped">
      <input type="text" v-model="email" :placeholder="$t('stremio_email')" />
      <input
        type="password"
        v-model="password"
        :placeholder="$t('stremio_password')"
      />
      <button class="button primary" @click="loginUserPassword">
        {{ loggedIn ? $t('logged_in') : $t('login') }}
      </button>
    </label>
  </div>

  <div class="text-center vertical-margin">
    <strong>{{ $t('or') }}</strong>
  </div>

  <div>
    <label>
      <input
        type="password"
        v-model="authKey"
        v-on:input="emitAuthKey"
        :placeholder="$t('paste_authkey')"
      />
      <a href="#how">{{ $t('how_to_get_authkey') }}</a>
    </label>
  </div>
</template>
<style scoped>
.sortable-list .item {
  list-style: none;
  display: flex;
  cursor: move;
  align-items: center;
  border-radius: 5px;
  padding: 10px 13px;
  margin-bottom: 11px;
  /* box-shadow: 0 2px 4px rgba(0,0,0,0.06); */
  border: 1px solid #ccc;
  justify-content: space-between;
}

.dark .sortable-list .item {
  border: 1px solid #434242;
}

.item .details {
  display: flex;
  align-items: center;
}

.item .details img {
  height: 60px;
  width: 60px;
  pointer-events: none;
  margin-right: 12px;
  object-fit: contain;
  object-position: center;
  border-radius: 30%;
  background-color: #262626;
}

.vertical-margin {
  margin: 5px 0;
}
</style>
