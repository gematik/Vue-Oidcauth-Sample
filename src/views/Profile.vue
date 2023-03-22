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
      <p class="text-blue-800">"Fachdienst"</p>
      to login into secure Pages in receiving access token after a successfully authentication!
    </h1>
    <div v-if="isLoggedIn">
      <div class="shadow-2xl text-center bg-indigo-100 py-2 px-4 text-black rounded-t-2xl mb-5">
        <h2
          class="bg-gradient-to-r from-indigo-800 to-blue-800 text-center text-3xl font-semibold leading-normal rounded-t-2xl -mt-2 mb-0 -ml-4 -mr-4 text-white"
        >
          Person Profile
        </h2>
        <h3 class="py-2 px-4 text-black text-left">
          logged in as :
          <div class="b py-2 px-4 text-blue-800 text-center font-bold">{{ userDisplay.Name }}</div>
          with access expired in :
          <div class="b py-2 px-4 text-blue-800 text-center font-bold">{{ expiredIn }} seconds</div>
          More Information:
          <div class="flex justify-center mt-8">
            <table class="b py-2 px-4 text-blue-800 text-left font-bold">
              <tr v-for="(value, name) in userDisplay" v-bind:key="value">
                <td class="border overflow-auto">{{ name }}</td>
                <td class="border lg:max-w-max" align="center justify">
                  {{ value }}
                </td>
              </tr>
            </table>
          </div>
        </h3>
      </div>
      <div class="shadow-2xl text-center bg-indigo-100 py-2 px-4 text-black rounded-t-2xl mb-5">
        <h2
          class="bg-gradient-to-r from-indigo-800 to-blue-800 text-center text-3xl font-semibold leading-normal rounded-t-2xl -mt-2 mb-0 -ml-4 -mr-4 text-white"
        >
          You have access to those Resources:
        </h2>
        <div class="flex justify-center py-2 px-4">
          <div v-for="(value, name) in claimsDisplay" v-bind:key="value">
            <div class="border mt-10" v-if="name == 'azp'">
              <button
                :disabled="false"
                class="shadow-2xl bg-pink-900 hover:bg-green-600 text-white font-bold py-14 px-14 mb-2.5 mb-2.5 mr-2 rounded h-250 w-125 hover:scale-150"
                @click="value"
              >
                {{ value }}
              </button>
              <button
                :disabled="false"
                class="shadow-2xl bg-gray-500 hover:bg-green-600 text-white font-bold py-14 px-14 mb-2.5 mb-2.5 rounded h-250 w-125 hover:scale-150"
                @click="value"
              >
                Example Application
              </button>
            </div>
          </div>
        </div>
        <h2
          class="bg-gradient-to-r from-indigo-800 to-blue-800 text-center text-3xl font-semibold leading-normal mt-10 mb-0 -ml-4 -mr-4 text-white"
        >
          Scope
        </h2>
        <div class="flex justify-center py-2 px-4">
          <div class="b py-2 px-4 text-blue-800 font-b text-2xl">{{ scopeDisplay }}</div>
        </div>
      </div>
      <div class="shadow-2xl text-center bg-indigo-100 py-2 px-4 text-black rounded-t-2xl mb-5">
        <h2
          class="bg-gradient-to-r from-indigo-800 to-blue-800 text-center text-3xl font-semibold leading-normal rounded-t-2xl -mt-2 mb-0 -ml-4 -mr-4 text-white"
        >
          with Claims
        </h2>
        <div class="flex justify-center py-2 px-4 text-blue-800 font-b text-left">
          <table class="">
            <tr v-for="(value, name) in claimsDisplay" v-bind:key="value">
              <td class="border">{{ name }}</td>
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
        :disabled="false"
        class="bg-red-500 hover:bg-pink-900 text-white font-bold h-10 py-30 px-10 ml-4 mr-4 rounded"
        @click="logOut"
      >
        logout
      </button>

      <button
        :disabled="false"
        class="bg-blue-500 hover:bg-blue-800 text-white font-bold h-10 py-30 px-10 rounded"
        @click="home"
      >
        home
      </button>
    </div>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode';
import store from '@/store/AccessDataStore';

export default {
  name: 'profile',
  data() {
    return {
      signedIn: false,
    };
  },
  async created() {
    try {
      await this.$store.dispatch('getAccessData');
    } catch (e) {
      console.log(e);
    }
  },
  computed: {
    isLoggedIn: function () {
      return !!store.state.accessData.access_token;
    },
    expiredIn: function () {
      return this.$store.state.accessData.expires_in;
    },
    userDisplay: function () {
      const accessToken = jwt_decode(this.$store.state.accessData.id_token);
      return {
        Name: accessToken.family_name,
        GivenName: accessToken.given_name,
        ProfessionOID: accessToken.professionOID || accessToken.profession_oid_hba,
        OrganizationName: accessToken.organizationName,
        IdNummer: accessToken.idNummer || accessToken.id_number,
        Fachdienst: accessToken.azp,
      };
    },
    claimsDisplay: function () {
      const claims = jwt_decode(this.$store.state.accessData.id_token);
      console.log('claims ', claims);
      const username = 'preferred_username';
      delete claims[username];
      return claims;
    },
    scopeDisplay: function () {
      return jwt_decode(this.$store.state.accessData.access_token).scope;
    },
  },
  methods: {
    logOut() {
      this.$store.commit('clearAccessData', '');
      return this.$router.push('/');
    },
    home() {
      return this.$router.push('/');
    },
  },
};
</script>
