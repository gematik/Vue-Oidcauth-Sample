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
      <h1 class="text-2xl text-center font-normal leading-normal mt-0 mb-2 text-red-700">
        The authentication was unsuccessful.
      </h1>
    </div>
    <div v-else>
      <h1 class="text-center text-2xl font-normal leading-normal mt-0 mb-2 text-indigo-800">
        Response from IDP in exchange with grant code
        <br />
        Status: <strong> received Authorization Code</strong>
      </h1>
    </div>

    <div class="flex justify-center my-5">
      <table class="table">
        <tr>
          <th class="border border-gray-300">Key</th>
          <th class="border border-gray-300">Value</th>
        </tr>
        <tr v-for="(value, name) in queryParams" :key="value">
          <td class="p-1 border border-gray-300 align-top text-center" style="width: 100px">
            <strong>{{ name }}:</strong>
          </td>
          <td class="p-1 border border-gray-300 break-all">{{ value }}</td>
        </tr>
      </table>
    </div>

    <div class="text-center">
      <nuxt-link v-if="error" to="/" class="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded">
        Home
      </nuxt-link>
      <nuxt-link
        v-else
        class="inline-flex bg-green-500 hover:bg-green-800 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
        :to="{
          name: 'get-access-token',
          query: queryParams
        }"
      >
        Get Access & ID Token
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'Callback',
  computed: {
    error() {
      return this.$route.query.error
    },
    queryParams() {
      return this.$route.query
    }
  }
})
</script>
