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
    <h1 class="text-center text-2xl font-normal leading-normal mt-0 mb-4 text-black">
      This is an example application to simulate relying party as
      <span class="text-blue-800">"Fachdienst"</span>
      to login into secure Pages in receiving access token after a successfully authentication!
    </h1>
    <div v-if="isLoggedIn">
      <div class="shadow-xl text-center bg-indigo-100 py-2 px-4 text-black rounded-t-2xl mb-5">
        <h2
          class="bg-gradient-to-r from-indigo-800 to-blue-800 text-center text-3xl font-semibold leading-normal rounded-t-2xl -mt-2 mb-0 -ml-4 -mr-4 text-white"
        >
          Person Profile
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

export default {
  name: 'Profile',
  data() {
    return {
      signedIn: false
    }
  },
  computed: {
    isLoggedIn: function () {
      return useAuthStore().accessData?.access_token
    },
    expiredIn: function () {
      return useAuthStore().accessData?.expires_in
    },
    userDisplay: function () {
      const parsedIdToken = parseJwt(useAuthStore().accessData.id_token)
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
      const claims = parseJwt(useAuthStore().accessData.id_token)
      const username = 'preferred_username'
      delete claims[username]
      return claims
    },
    scopeDisplay: function () {
      return parseJwt(useAuthStore().accessData.access_token).scope
    }
  },
  methods: {
    logOut(): void {
      useAuthStore().logout()
      useRouter().push('/')
    }
  }
}
</script>
