<!--
  - Copyright 2026, gematik GmbH
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
  <div class="container mx-auto bg-white p-5">
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

    <h2 v-if="accessTokenHBA.access_token" class="text-center my-3 text-3xl">HBA</h2>
    <table v-if="accessTokenHBA.access_token" class="table" style="margin-bottom: 50px">
      <thead>
        <tr>
          <th class="border border-gray-300">Key</th>
          <th class="border border-gray-300">Value</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(value, name) in accessTokenHBA" :key="value">
          <td class="p-1 border border-gray-300 align-top text-center" style="width: 100px">
            <strong>{{ name }}:</strong>
          </td>
          <td class="p-1 border border-gray-300 break-all">{{ value }}</td>
        </tr>
      </tbody>
    </table>

    <h2 v-if="accessTokenSMCB.access_token" class="text-center my-3 text-3xl">SMC-B</h2>
    <table v-if="accessTokenSMCB.access_token" class="table">
      <thead>
        <tr>
          <th class="border border-gray-300">Key</th>
          <th class="border border-gray-300">Value</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(value, name) in accessTokenSMCB" :key="value">
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
import { CARD_TYPE, CONFIG_KEYS, LOCAL_STORAGE_KEYS, OFFICIAL_CARD_TYPE } from '~/constants'
import { getConfig } from '~/config'

export default defineComponent({
  name: 'Callback',
  data() {
    return {
      OFFICIAL_CARD_TYPE
    }
  },
  computed: {
    error() {
      return this.$route.query.error
    },
    accessTokenHBA() {
      return useAuthStore().accessData[OFFICIAL_CARD_TYPE.HBA]
    },
    accessTokenSMCB() {
      return useAuthStore().accessData[OFFICIAL_CARD_TYPE.SMCB]
    }
  },
  created() {
    if (this.$route.query[OFFICIAL_CARD_TYPE.HBA] && typeof this.$route.query[OFFICIAL_CARD_TYPE.HBA] === 'string') {
      this.getAccessToken(OFFICIAL_CARD_TYPE.HBA, JSON.parse(this.$route.query[OFFICIAL_CARD_TYPE.HBA]))
    }

    if (this.$route.query[OFFICIAL_CARD_TYPE.SMCB] && typeof this.$route.query[OFFICIAL_CARD_TYPE.SMCB] === 'string') {
      this.getAccessToken(OFFICIAL_CARD_TYPE.SMCB, JSON.parse(this.$route.query[OFFICIAL_CARD_TYPE.SMCB]))
    }
  },
  methods: {
    async getAccessToken(cardType: OFFICIAL_CARD_TYPE, cardData: Record<string, string>) {
      const data = {
        params: { ...cardData },
        codeVerifier: localStorage.getItem(LOCAL_STORAGE_KEYS.CODE_VERIFIER),
        redirectUri: getConfig(CONFIG_KEYS.REDIRECT_URI),
        clientId: getConfig(CONFIG_KEYS.CLIENT_ID)
      }

      try {
        await useAuthStore().getAccessData(cardType, data)
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
