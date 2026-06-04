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
  <div style="flex-direction: column; display: flex">
    <div class="shadow-xl text-center bg-indigo-100 py-2 px-4 text-black rounded-t-2xl mb-5">
      <h2
        class="bg-gradient-to-r from-indigo-800 to-blue-800 text-center text-3xl font-semibold leading-normal rounded-t-2xl -mt-2 mb-0 -ml-4 -mr-4 text-white"
      >
        Person Profile {{ cardType }}
      </h2>
      <h3 class="py-2 px-4 text-black text-left">
        <div>
          logged in as :
          <span class="text-blue-800 font-bold"> {{ userDisplay.GivenName }} {{ userDisplay.Name }} </span>
        </div>
        <div>
          with access expired in :
          <span class="GivenName">{{ expiredIn }} seconds</span>
        </div>
        <hr />
        <div class="flex justify-center">
          <table class="b py-2 px-4 text-blue-800 text-left font-bold">
            <tr v-for="(value, name) in userDisplay" :key="value">
              <td class="border overflow-auto">
                {{ name }}
              </td>
              <td class="border lg:max-w-max">
                {{ value }}
              </td>
            </tr>
          </table>
        </div>
      </h3>
    </div>
    <div class="shadow-xl text-center bg-indigo-100 py-2 px-4 text-black rounded-t-2xl mb-5">
      <h2
        class="bg-gradient-to-r from-indigo-800 to-blue-800 text-center text-3xl font-semibold leading-normal rounded-t-2xl -mt-2 mb-0 -ml-4 -mr-4 text-white"
      >
        You have access to those Resources:
      </h2>
      <div class="flex justify-center py-2 px-4">
        <div v-for="(value, name) in claimsDisplay" :key="value">
          <div v-if="name == 'azp'" class="border mt-10">
            <button
              :disabled="false"
              class="shadow-xl bg-pink-900 hover:bg-green-600 text-white font-bold py-14 px-14 mb-2.5 mb-2.5 mr-2 rounded h-250 w-125 hover:scale-150"
              @click="value"
            >
              {{ value }}
            </button>
            <button
              :disabled="false"
              class="shadow-xl bg-gray-500 hover:bg-green-600 text-white font-bold py-14 px-14 mb-2.5 mb-2.5 rounded h-250 w-125 hover:scale-150"
              @click="value"
            >
              Example Application
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="shadow-xl text-center bg-indigo-100 py-2 px-4 text-black rounded-t-2xl mb-5">
      <h2
        class="bg-gradient-to-r from-indigo-800 to-blue-800 text-center text-3xl font-semibold leading-normal rounded-t-2xl -mt-2 mb-0 -ml-4 -mr-4 text-white"
      >
        Scope
      </h2>
      <div class="flex justify-center py-2 px-4">
        <div class="b py-2 px-4 text-blue-800 font-b text-2xl">
          {{ scopeDisplay }}
        </div>
      </div>
    </div>
    <div class="shadow-xl text-center bg-indigo-100 py-2 px-4 text-black rounded-t-2xl mb-5">
      <h2
        class="bg-gradient-to-r from-indigo-800 to-blue-800 text-center text-3xl font-semibold leading-normal rounded-t-2xl -mt-2 mb-0 -ml-4 -mr-4 text-white"
      >
        with Claims
      </h2>
      <div class="flex justify-center py-2 px-4 text-blue-800 font-b text-left">
        <table class="">
          <tr v-for="(value, name) in claimsDisplay" :key="value">
            <td class="border">
              {{ name }}
            </td>
            <td class="border justify-center">
              {{ value }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '~/stores/authStore'
import { OFFICIAL_CARD_TYPE } from '~/constants'

export default {
  name: 'ProfileDetails',
  props: {
    cardType: {
      type: String as () => OFFICIAL_CARD_TYPE,
      required: true
    }
  },
  computed: {
    accessData(): Record<string, any> {
      return useAuthStore().accessData[this.cardType as OFFICIAL_CARD_TYPE]
    },
    expiredIn: function (): number {
      return this.accessData.expires_in
    },
    userDisplay: function () {
      const parsedIdToken = parseJwt(this.accessData.id_token)
      return {
        Name: parsedIdToken.family_name,
        GivenName: parsedIdToken.given_name,
        ProfessionOID: parsedIdToken.professionOID || parsedIdToken.profession_oid_hba,
        OrganizationName: parsedIdToken.organizationName,
        IdNummer: parsedIdToken.idNummer || parsedIdToken.id_number,
        Fachdienst: parsedIdToken.azp
      }
    },
    claimsDisplay: function () {
      const claims = parseJwt(this.accessData.id_token)
      const username = 'preferred_username'
      delete claims[username]
      return claims
    },
    scopeDisplay: function () {
      return parseJwt(this.accessData.access_token).scope
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
