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
    <h1 class="text-2xl font-normal leading-normal mt-0 mb-2 text-red-700">The authentication was unsuccessful.</h1>
    <h1 class="text-2xl font-normal leading-normal mt-0 mb-2 text-red-700">Error: {{ error }}</h1>
    <div class="mt-3.5">
      <a href="/" class="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded"> Home </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: decodeURIComponent(this.$route.query.error || ''),
    };
  },
};
</script>
