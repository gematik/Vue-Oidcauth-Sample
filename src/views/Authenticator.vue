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
  <div class="text-center">
    <div v-if="redirectAutomatically">
      <div v-if="!authFlowFailed">
        <h1 style="font-size: 32px">Auth Flow is in progress</h1>
        <p style="font-size: 18px">Do not close this tab and wait until it redirects!</p>
        <br />
        <span class="loader"></span>
      </div>
      <div v-else>
        <div style="font-size: 100px">⚠</div>
        <h1 style="font-size: 32px">Auth Flow has failed. Please restart!</h1>
        <br />
        <button
          @click="$router.back()"
          class="shadow-xl bg-blue-500 hover:bg-green-600 text-white font-bold py-3 px-3 rounded"
        >
          Go Back
        </button>
      </div>
    </div>
    <div v-else>
      <h1 style="font-size: 32px">Auth Flow has started!</h1>
      <p style="font-size: 18px">The Authenticator App will open a new tab. You can close this tab safely.</p>
    </div>
  </div>
</template>

<script>
import {
  CONFIG_AUTH_TOKEN_CHECK_ENDPOINT_KEY,
  CONFIG_AUTHENTICATOR_HOST_KEY,
  CONFIG_REDIRECT_AUTOMATICALLY_KEY,
} from '@/constants';
import { getConfig } from '@/config';
import axios from 'axios';

export default {
  data() {
    return {
      redirectAutomatically: getConfig(CONFIG_REDIRECT_AUTOMATICALLY_KEY, true),
      authFlowFailed: false,
    };
  },
  async created() {
    const HOST = getConfig(CONFIG_AUTHENTICATOR_HOST_KEY);
    const routeParams = {
      ...this.$route.query,
      redirect_automatically: this.redirectAutomatically,
    };

    this.awaitForAuthFlowRequest(routeParams); // wait for the redirect automatically at the end of the flow

    location.href = HOST + '?' + this.serialize(routeParams);
  },
  methods: {
    awaitForAuthFlowRequest(routeParams) {
      const resourceServerCheckTokenEndpoint = getConfig(CONFIG_AUTH_TOKEN_CHECK_ENDPOINT_KEY);

      // Start waiting for the result of the auth flow process
      if (this.redirectAutomatically) {
        axios
          .get(resourceServerCheckTokenEndpoint + '?state=' + routeParams['state'])
          .then(({ data }) => {
            if (data.code) {
              location.href = '/callback?' + this.serialize(data);
            }
          })
          .catch(() => {
            this.authFlowFailed = true;
            console.log('something went really wrong!');
          });
      }
    },
    serialize(obj) {
      const str = [];
      for (let p in obj)
        if (obj[p]) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
      return str.join('&');
    },
  },
};
</script>

<style>
.loader {
  display: inline-block;
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
