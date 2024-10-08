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
  <div class="container mx-auto">
    <div v-if="error">
      <h1 class="text-2xl font-normal leading-normal mt-0 mb-2 text-red-700">The authentication was unsuccessful.</h1>
    </div>
    <div v-else>
      <h1 class="text-center text-2xl font-normal leading-normal mt-0 mb-2 text-indigo-800">
        Response from IDP in exchange with grant code
        <br />
        Status: <strong> received Access Token</strong>
      </h1>
    </div>

    <table v-if="accessData.access_token" class="table">
      <thead>
        <tr>
          <th class="border border-gray-300">Key</th>
          <th class="border border-gray-300">Value</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(value, name) in accessData" :key="value">
          <td class="p-1 border border-gray-300 align-top text-center" style="width: 100px">
            <strong>{{ name }}:</strong>
          </td>
          <td class="p-1 border border-gray-300 break-all">{{ value }}</td>
        </tr>
      </tbody>
    </table>

    <div class="text-center">
      <nuxt-link v-if="error" to="/" class="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded">Home</nuxt-link>
      <nuxt-link
        v-else
        class="inline-flex bg-green-500 hover:bg-green-800 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
        to="/profile"
      >
        Profile
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import Swal from 'sweetalert2'
import { useAuthStore } from '~/stores/authStore'
import { CONFIG_KEYS, LOCAL_STORAGE_KEYS } from '~/constants'
import { getConfig } from '~/config'

export default defineComponent({
  name: 'Callback',
  computed: {
    error() {
      return this.$route.query.error
    },
    accessData() {
      return useAuthStore().accessData
    }
  },
  created() {
    this.getAccessToken()
  },
  methods: {
    async getAccessToken() {
      const data = {
        params: { ...this.$route.query },
        codeVerifier: localStorage.getItem(LOCAL_STORAGE_KEYS.CODE_VERIFIER),
        redirectUri: getConfig(CONFIG_KEYS.REDIRECT_URI),
        clientId: getConfig(CONFIG_KEYS.CLIENT_ID)
      }

      try {
        await useAuthStore().getAccessData(data)
      } catch (e) {
        await Swal.fire({
          title: 'Error',
          text: e?.response?.data?.message || 'Something went wrong',
          icon: 'error',
          confirmButtonText: 'Ok'
        })

        this.$router.push('/')
      }
    }
  }
})
</script>
