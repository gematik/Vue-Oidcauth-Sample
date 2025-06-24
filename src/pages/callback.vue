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
        <thead>
          <tr>
            <th class="border border-gray-300">Key</th>
            <th class="border border-gray-300">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, name) in queryParams" :key="value">
            <td class="p-1 border border-gray-300 align-top text-center" style="width: 100px">
              <strong>{{ name }}:</strong>
            </td>
            <td class="p-1 border border-gray-300 break-all">{{ value }}</td>
          </tr>
        </tbody>
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
