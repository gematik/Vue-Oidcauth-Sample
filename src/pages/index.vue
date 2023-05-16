<!--
  - Copyright 2023 gematik GmbH
  -
  - The Authenticator App is licensed under the European Union Public Licence (EUPL); every use of the Authenticator App
  - Sourcecode must be in compliance with the EUPL.
  -
  - You will find more details about the EUPL here: https://joinup.ec.europa.eu/collection/eupl
  -
  - Unless required by applicable law or agreed to in writing, software distributed under the EUPL is distributed on an "AS
  - IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the EUPL for the specific
  - language governing permissions and limitations under the License.ee the Licence for the specific language governing
  - permissions and limitations under the Licence.
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
