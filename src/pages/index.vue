<!--
  - Copyright 2025, gematik GmbH
  -
  - Licensed under the EUPL, Version 1.2 or - as soon they will be approved by the
  - European Commission – subsequent versions of the EUPL (the "Licence").
  - You may not use this work except in compliance with the Licence.
  -
  - You find a copy of the Licence in the "Licence" file or at
  - https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
  -
  - Unless required by applicable law or agreed to in writing,
  - software distributed under the Licence is distributed on an "AS IS" basis,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
  - In case of changes by gematik find details in the "Readme" file.
  -
  - See the Licence for the specific language governing permissions and limitations under the Licence.
  -
  - *******
  -
  - For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
  -->
<template>
  <div class="flex flex-col items-center">
    <h1 class="text-2xl font-normal leading-normal mt-0 mb-2 text-indigo-800">
      Welcome to the Authenticator Example Application
    </h1>
    <div>
      You are currently: <b>{{ isLoggedIn ? 'Logged in' : 'Logged out' }}</b>
    </div>
    <div>
      Protected route:
      <router-link to="/profile"> Profile </router-link>
    </div>
    <div>
      Settings:
      <router-link to="/settings"> Settings </router-link>
    </div>
    <div class="mt-8">
      <button
        v-if="isLoggedIn"
        class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="logout"
      >
        Logout
      </button>
      <button v-else class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="login">
        Login
      </button>
    </div>
    <div>
      <div class="text-center">The Login button will open the resource server.<code>(GET /login)</code></div>
      <div class="text-center">The resource server will redirect to the IdP</div>
      <div class="text-center">The IdP will redirect to the local authenticator</div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '~/stores/authStore'

export default defineComponent({
  name: 'Home',
  computed: {
    isLoggedIn: function () {
      return useAuthStore().accessData?.access_token
    }
  },
  methods: {
    logout() {
      useAuthStore().logout()
    },
    login() {
      this.$router.push({ name: 'authenticator' })
    }
  }
})
</script>
