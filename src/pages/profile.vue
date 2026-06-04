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
  <div class="flex flex-col items-center">
    <h1 class="text-center text-2xl font-normal leading-normal mt-0 mb-4 text-black">
      This is an example application to simulate relying party as
      <span class="text-blue-800">"Fachdienst"</span>
      to login into secure Pages in receiving access token after a successfully authentication!
    </h1>
    <div style="display: flex; flex-direction: row; gap: 50px">
      <ProfileDetails v-if="accessData[OFFICIAL_CARD_TYPE.HBA].access_token" :card-type="OFFICIAL_CARD_TYPE.HBA" />
      <ProfileDetails v-if="accessData[OFFICIAL_CARD_TYPE.SMCB].access_token" :card-type="OFFICIAL_CARD_TYPE.SMCB" />
    </div>
    <div class="flex justify-center mt-4 mb-0 mb-5">
      <button
        v-if="isLoggedIn"
        class="bg-red-500 hover:bg-pink-900 text-white font-bold py-2 px-12 ml-4 mr-4 rounded"
        @click="logOut"
      >
        Logout
      </button>

      <nuxt-link
        :disabled="false"
        class="block bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-12 rounded"
        to="/"
      >
        Home
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '~/stores/authStore'
import { OFFICIAL_CARD_TYPE } from '~/constants'

export default {
  name: 'Profile',
  data() {
    return {
      signedIn: false,
      OFFICIAL_CARD_TYPE
    }
  },
  computed: {
    isLoggedIn: function () {
      const hbaAccessData = useAuthStore().accessData[OFFICIAL_CARD_TYPE.HBA]
      const smcbAccessData = useAuthStore().accessData[OFFICIAL_CARD_TYPE.SMCB]

      return hbaAccessData.access_token || smcbAccessData.access_token
    },
    accessData: function () {
      return useAuthStore().accessData
    }
  },
  methods: {
    logOut(): void {
      useAuthStore().removeData()
      useRouter().push('/')
    }
  }
}
</script>
