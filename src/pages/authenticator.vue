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
        <span class="loader" />
      </div>
      <div v-else>
        <div style="font-size: 100px">⚠</div>
        <h1 style="font-size: 32px">Auth Flow has failed. Please restart!</h1>
        <br />
        <button
          class="shadow-xl bg-blue-500 hover:bg-green-600 text-white font-bold py-3 px-3 rounded"
          @click="$router.back()"
        >
          Go Back
        </button>
      </div>
    </div>
    <div v-else>
      <h1 style="font-size: 32px">Auth Flow has started!</h1>
      <p style="font-size: 18px">The Authenticator App will open a new tab. You can close this tab safely.</p>
      <button
        class="shadow-xl bg-blue-500 hover:bg-green-600 text-white font-bold py-3 px-3 rounded my-5 min-w-[200px]"
        @click="window.close()"
      >
        Close
      </button>
      <br />
      <nuxt-link class="text-blue-500 font-normal cursor-pointer" @click="$router.back()"> Go Back </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import Swal from 'sweetalert2'

import { CONFIG_KEYS, LOCAL_STORAGE_KEYS } from '@/constants'
import { getConfig } from '@/config'
import { createCodeChallenge, createRandomString } from '~/utils'
import { useAuthStore } from '~/stores/authStore'

export default defineComponent({
  data() {
    return {
      redirectAutomatically: getConfig(CONFIG_KEYS.REDIRECT_AUTOMATICALLY_KEY, true),
      authFlowFailed: false,
      abortController: null as null | AbortController
    }
  },
  async created() {
    try {
      // first clear store
      useAuthStore().logout()

      await useAuthStore().readWellKnown()
      await this.startAuthFlow()
    } catch (e) {
      console.log('starting auth flow failed!', e.message)
      if (this.redirectAutomatically) {
        this.authFlowFailed = true
      } else {
        await Swal.fire({
          title: 'Auth Flow has failed!',
          text: 'Please try again!',
          icon: 'error',
          confirmButtonText: 'Ok'
        })
        this.$router.back()
      }
    }
  },
  unmounted() {
    // abort fetch request if user leaves page
    this.abortController?.abort()
  },
  methods: {
    startAuthFlow() {
      const codeVerifier = createRandomString(64)
      const codeChallenge = createCodeChallenge(codeVerifier)

      // save verifier and codeChallenge in local storage
      localStorage.setItem(LOCAL_STORAGE_KEYS.CODE_VERIFIER, codeVerifier)

      const _query = {
        client_id: getConfig(CONFIG_KEYS.CLIENT_ID) as string,
        response_type: 'code',
        redirect_uri: getConfig(CONFIG_KEYS.REDIRECT_URI) as string,
        state: createRandomString(16),
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        scope: getConfig(CONFIG_KEYS.SCOPE) as string,
        nonce: createRandomString(16)
      } as Record<string, string>

      // if redirect_automatically exists in request.query, add it to _query
      if (getConfig(CONFIG_KEYS.REDIRECT_AUTOMATICALLY_KEY, true)) {
        _query.callback = 'DIRECT'
      }

      const authorizationEndpoint = useAuthStore().wellKnownData?.authorization_endpoint
      const challengePath = 'challenge_path=' + authorizationEndpoint + '?' + this.serialize(_query)

      const HOST = getConfig(CONFIG_KEYS.AUTHENTICATOR_HOST_KEY)
      const href = HOST + '?' + challengePath

      // redirect to authenticator with following query params
      console.info('Query parameters: ', _query)
      location.href = href

      if (this.redirectAutomatically) {
        console.log('waiting for redirect automatically...')
        this.startAutoRedirectAwaitForToken(_query.state)
      }
    },
    startAutoRedirectAwaitForToken(state: string) {
      // Start waiting for the result of the auth flow process
      if (this.redirectAutomatically) {
        this.abortController = new AbortController()
        const signal = this.abortController.signal

        fetch('/api/check-auth-code' + '?state=' + state, { signal })
          .then((response) => {
            if (response.ok) {
              return response.json()
            } else {
              this.authFlowFailed = true
              console.log('No token received from authenticator:', err)
            }
          })
          .then((data) => {
            useRouter().push('/callback?' + this.serialize(data))
          })
          .catch((err) => {
            this.authFlowFailed = true
            console.log('No token received from authenticator:', err)
          })
      }
    },
    serialize(obj: Record<string, string>) {
      const str = []
      for (const p in obj) {
        if (obj[p]) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
        }
      }
      return str.join('&')
    }
  }
})
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
