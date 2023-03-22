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
    <div v-if="error">
      <h1 class="text-2xl font-normal leading-normal mt-0 mb-2 text-red-700">The authentication was unsuccessful.</h1>
    </div>
    <div v-else>
      <h1 class="text-center text-2xl font-normal leading-normal mt-0 mb-2 text-indigo-800">
        Response from IDP in exchange with grant code
        <br />
        Status: <strong> received Authorization Code</strong>
      </h1>
    </div>

    <div class="flex justify-center">
      <table>
        <tr>
          <th class="border border-green-200">Key</th>
          <th class="border border-green-200">Value</th>
        </tr>
        <tr v-for="(value, name) in queryParams" v-bind:key="value">
          <td class="border border-green-200">{{ name }}</td>
          <td class="border border-green-200">
            {{ value }}
          </td>
        </tr>
      </table>
    </div>

    <a href="/" class="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded" v-if="error"> Home </a>

    <button
      v-else
      class="bg-green-500 hover:bg-green-800 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
      @click="proceed"
    >
      to Secure Pages
    </button>
  </div>
</template>

<script>
export default {
  name: 'Callback',
  computed: {
    error() {
      return this.$route.query.error;
    },
    queryParams() {
      return this.$route.query;
    },
  },
  methods: {
    async proceed() {
      await this.$store.dispatch('getAuthData', this.$route.query);
      return this.$router.push('/profile');
    },
  },
};
</script>
