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
  <div class="container mx-auto">
    <div v-if="processing" class="bg-white py-20 text-center">
      <h1 class="text-2xl font-normal leading-normal text-indigo-800">Anmeldung wird verarbeitet …</h1>
    </div>
    <template v-else>
      <div class="bg-white py-20">
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
      <div class="flex justify-around bg-white flex-col max-w py-5">
        <div class="text-center">
          <nuxt-link
            v-if="error"
            to="/"
            class="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded no-underline"
          >
            Home
          </nuxt-link>
          <nuxt-link
            v-else
            class="no-underline inline-flex bg-green-500 hover:bg-green-800 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
            :to="{ name: 'get-access-token', query: queryParams }"
          >
            Get Access & ID Token
          </nuxt-link>
        </div>
      </div>
    </div>

    <div
      v-if="$route.fullPath.includes('error')"
      class="flex justify-around bg-white/50 flex-col max-w-screen-md mx-auto my-12"
    >
      <CheckList :steps="checkList" />
    </div>
    </template>
  </div>
</template>

<script lang="ts">
import CheckList from '~/components/CheckList.vue'
import { CARD_TYPE, LOCAL_STORAGE_KEYS } from '~/constants'
import {
  type AuthFlowSession,
  clearFlowSession,
  isFlowActive,
  readFlowSession,
  writeFlowSession
} from '~/lib/auth-flow-session'

export default defineComponent({
  name: 'Callback',
  components: { CheckList },
  data: () => ({
    checkList: [] as TCheckListItem[],
    // True while the navigation-flow state machine is advancing to the next
    // card / to token exchange — suppresses the intermediate code display.
    processing: false
  }),
  computed: {
    error() {
      return this.$route.query.error
    },
    queryParams() {
      if (this.$route.query[CARD_TYPE.HBA] || this.$route.query[CARD_TYPE.SMCB]) {
        return this.$route.query as Record<string, string>
      } else {
        // this contains a workaround for the server variant
        const cardType =
          (this.$route.query.cardType as string) || (localStorage.getItem(LOCAL_STORAGE_KEYS.CARD_TYPE) as string)
        return {
          [cardType]: JSON.stringify(this.$route.query)
        }
      }
    }
  },
  methods: {
    serialize(obj: Record<string, string>) {
      const str = []
      for (const p in obj) {
        if (obj[p]) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
        }
      }
      return str.join('&')
    },
    // Drives the navigation-based multi-card flow: stash this card's callback
    // params, then either start the next card or hand all results to the
    // token-exchange page. Runs once per card (one 302 → /callback per card).
    advanceFlow(session: AuthFlowSession) {
      const slot = session.cards[session.cursor]
      const query = { ...this.$route.query } as Record<string, string>

      // CSRF: the returned state must match what we sent for this card.
      if (slot.state && query.state && query.state !== slot.state) {
        clearFlowSession()
        window.location.assign('/callback?error=state_mismatch')
        return
      }

      slot.params = query
      session.cursor += 1
      writeFlowSession(session)

      if (session.cursor < session.cards.length) {
        // More cards remain → resume the flow for the next card.
        this.$router.push('/authenticator?resume=1')
        return
      }

      // All cards done → hand the per-card params to the token-exchange page,
      // in the `?HBA=<json>&SMC-B=<json>` shape it already consumes.
      const combined: Record<string, string> = {}
      for (const card of session.cards) {
        combined[card.cardType] = JSON.stringify(card.params ?? {})
      }
      clearFlowSession()
      this.$router.push({ path: '/get-access-token', query: combined })
    }
  },
  created() {
    const session = readFlowSession()
    if (isFlowActive(session)) {
      if (this.$route.query.error) {
        // Auth error came back mid-flow → stop the state machine, show the error.
        clearFlowSession()
        return
      }
      this.processing = true
      this.advanceFlow(session)
    }
  },
  mounted() {
    if (this.processing) {
      return
    }
    if (this.error) {
      this.checkList = [
        {
          type: 'error',
          title: 'Authorization Code not received',
          text: 'The authorization code was not received from the IDP.'
        }
      ]
      return
    }
    this.checkList = [
      {
        type: 'success',
        title: 'Response from IDP',
        text: 'The response from the IDP was successfully received.'
      },
      {
        type: 'success',
        title: 'Authorization Code received',
        text: 'The authorization code was successfully received from the IDP.'
      },
      {
        type: 'error',
        title: 'Authorization Code not received',
        text: 'The authorization code was not received from the IDP.'
      }
    ]
  }
})
</script>
