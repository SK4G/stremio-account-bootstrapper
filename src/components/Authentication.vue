<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { loginUser, createUser } from '../composables/useStremioApi';

const { t } = useI18n();

const authKey = ref('');
const email = ref('');
const password = ref('');
const loggedIn = ref(false);
const emits = defineEmits(['auth-key']);

function loginUserPassword() {
  loginUser(email.value, password.value)
    .then((data) => {
      if (data?.result?.authKey) {
        authKey.value = data.result.authKey;
        loggedIn.value = true;
        emitAuthKey();
      } else {
        alert(data?.error.message || t('login_failed'));
      }
    })
    .catch((err) => {
      console.error(err);
      alert(err?.message || t('login_failed'));
    });
}

function createAccount() {
  createUser(email.value, password.value)
    .then((data) => {
      if (data?.result?.authKey) {
        authKey.value = data.result.authKey;
        loggedIn.value = true;
        emitAuthKey();
        alert(t('register_successful'));
      } else {
        alert(data?.error.message || t('register_failed'));
      }
    })
    .catch((err) => {
      console.error(err);
      alert(err?.message || t('register_failed'));
    });
}

function emitAuthKey() {
  emits('auth-key', authKey.value.replaceAll('"', '').trim());
}
</script>

<template>
  <h2>{{ $t('authentication') }}</h2>
  <fieldset style="padding: 10px 20px">
    <div class="row">
      <div class="col-12">
        <input type="text" v-model="email" :placeholder="$t('stremio_email')" />
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <input
          type="password"
          v-model="password"
          :placeholder="$t('stremio_password')"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <button
          class="button primary"
          @click="loginUserPassword"
          :disabled="!email || !password"
        >
          {{ loggedIn ? $t('logged_in') : $t('login') }}
        </button>
      </div>
      <div class="col-6">
        <button
          class="button secondary"
          @click="createAccount"
          :disabled="!email || !password"
        >
          {{ $t('signup') }}
        </button>
      </div>
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
  </fieldset>
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
