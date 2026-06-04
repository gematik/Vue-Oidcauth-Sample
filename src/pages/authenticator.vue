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
  <div class="text-center">
    <div v-if="loading" class="pointer-events-none select-none" aria-busy="true" aria-live="polite">
      <h1 class="text-3xl tracking-tight text-black sm:text-4xl drop-shadow">
        {{ phase === 'signing' ? 'Anmeldung im Authenticator bestätigen...' : 'Authenticator wird gestartet...' }}
      </h1>
      <p class="mt-4" style="font-size: 18px">
        {{
          phase === 'signing'
            ? 'Bitte PIN eingeben und die Karte bestätigen. Diese Seite wird automatisch weitergeleitet.'
            : 'Bitte warten, die Verbindung zum Authenticator wird aufgebaut.'
        }}
      </p>
      <p v-if="totalCards > 1" class="mt-2" style="font-size: 16px">
        Karte {{ cardIndex }} von {{ totalCards }}
      </p>
      <br />
      <span class="loader" />
    </div>
    <div v-else-if="redirectAutomatically">
      <div v-if="!authFlowFailed">
        <h1 style="font-size: 32px">Auth Flow is in progress</h1>
        <p class="mt-4" style="font-size: 18px">Do not close this tab and wait until it redirects!</p>
        <br />
        <span class="loader" />
      </div>
      <div v-else>
        <div style="font-size: 100px">⚠</div>
        <h1 class="mt-4" style="font-size: 32px">Auth Flow has failed. Please restart!</h1>
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
      <h1 class="text-3xl tracking-tight text-black sm:text-4xl drop-shadow">Auth Flow has started!</h1>
      <br />
      <nuxt-link class="text-blue-500 font-normal cursor-pointer" @click="$router.back()"> Go Back </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import Swal from 'sweetalert2'

import { AUTHENTICATOR_HANDSHAKE, CARD_TYPE, CONFIG_KEYS, LOCAL_STORAGE_KEYS, OFFICIAL_CARD_TYPE } from '@/constants'
import { getConfig } from '@/config'
import {
  createAuthenticatorPort,
  createCodeChallenge,
  createRandomString,
  generateHandshakeId,
  serializeQuery
} from '~/utils'
import { useAuthStore } from '~/stores/authStore'
import { buildAuthRequestUrl, buildAuthenticatorDeeplink, probeAuthenticator } from '~/lib/authenticator-handshake'
import {
  type AuthFlowSession,
  clearFlowSession,
  isFlowActive,
  readFlowSession,
  writeFlowSession
} from '~/lib/auth-flow-session'

const { PROBE_DEADLINE_MS, PROBE_INTERVAL_MS } = AUTHENTICATOR_HANDSHAKE

function buildOAuthChallengeQuery(opts: {
  state: string
  cardType: string
  codeChallenge: string
  withDirectCallback: boolean
}): Record<string, string> {
  const query: Record<string, string> = {
    client_id: getConfig(CONFIG_KEYS.CLIENT_ID) as string,
    response_type: 'code',
    redirect_uri: getConfig(CONFIG_KEYS.REDIRECT_URI) as string,
    state: opts.state,
    code_challenge: opts.codeChallenge,
    code_challenge_method: 'S256',
    scope: 'openid gem-auth',
    nonce: createRandomString(16),
    cardType: opts.cardType
  }
  if (opts.withDirectCallback) {
    query.callback = 'DIRECT'
  }
  return query
}

export default defineComponent({
  data() {
    return {
      redirectAutomatically: getConfig(CONFIG_KEYS.REDIRECT_AUTOMATICALLY_KEY, true),
      authFlowFailed: false,
      loading: false,
      // 'starting' = waiting for GET /status; 'signing' = navigated to GET / (PIN entry on the Authenticator).
      phase: 'starting' as 'starting' | 'signing',
      // 1-based. Drives the "Karte X von N" hint.
      cardIndex: 1,
      totalCards: 1,
      abortController: null as null | AbortController,
      probeAbortController: null as null | AbortController
    }
  },
  async created() {
    try {
      // first clear store
      useAuthStore().removeData()

      await useAuthStore().readWellKnown()
      await this.startOrResumeFlow()
    } catch (e) {
      console.error('starting auth flow failed!', e.message)
      this.loading = false
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
    // abort in-flight probe / legacy polling if the user leaves the page
    this.abortController?.abort()
    this.probeAbortController?.abort()
  },

  methods: {
    // Fresh entry (?cardType=…) starts a new flow; ?resume=1 continues the
    // multi-card flow persisted in sessionStorage after the previous card's
    // 302 → /callback round-trip (the SPA fully reloads in between).
    async startOrResumeFlow() {
      const existing = readFlowSession()
      const resume = this.$route.query.resume === '1' && isFlowActive(existing)

      let session: AuthFlowSession
      if (resume) {
        session = existing as AuthFlowSession
      } else {
        clearFlowSession()
        const cardTypeParam = this.$route.query.cardType as string
        // 'multi' → HBA + SMC-B sequentially; otherwise a single card.
        const cardTypes: string[] =
          cardTypeParam === CARD_TYPE.MULTI ? [OFFICIAL_CARD_TYPE.HBA, OFFICIAL_CARD_TYPE.SMCB] : [cardTypeParam]

        // ONE codeVerifier shared across cards — matches what /get-access-token expects.
        const codeVerifier = createRandomString(64)
        localStorage.setItem(LOCAL_STORAGE_KEYS.CODE_VERIFIER, codeVerifier)
        localStorage.setItem(LOCAL_STORAGE_KEYS.CARD_TYPE, cardTypeParam)

        session = {
          flowId: generateHandshakeId(),
          cardTypeParam,
          cards: cardTypes.map((ct) => ({ cardType: ct, state: createRandomString(16) })),
          cursor: 0,
          redirectAutomatically: Boolean(this.redirectAutomatically)
        }
        writeFlowSession(session)
      }

      this.totalCards = session.cards.length
      this.cardIndex = session.cursor + 1
      this.loading = true
      this.phase = 'starting'

      await this.startCard(session)
    },

    // Fires the deeplink, probes /status until ready, then NAVIGATES the browser
    // to GET /authorize (the page unloads; the result returns as a 302 → /callback).
    // Fresh (port, handshake_id) per card — each card is its own transport flow.
    async startCard(session: AuthFlowSession) {
      const slot = session.cards[session.cursor]
      const codeVerifier = localStorage.getItem(LOCAL_STORAGE_KEYS.CODE_VERIFIER) as string
      const codeChallenge = createCodeChallenge(codeVerifier)

      // The FIRST request carries the original cardType (e.g. 'multi'), so the
      // deeplink is the market-standard legacy challenge: an old Authenticator
      // starts the full flow straight from it, a new one ignores it and waits
      // for GET /authorize. Subsequent cards address the specific remaining card.
      const cardType = session.cursor === 0 ? session.cardTypeParam : slot.cardType

      const challengeQuery = buildOAuthChallengeQuery({
        state: slot.state,
        cardType,
        codeChallenge,
        // Keep the deeplink byte-for-byte backward compatible: same callback the
        // legacy flow uses. Inert for the server flow (it answers via 302).
        withDirectCallback: session.redirectAutomatically
      })
      const authorizationEndpoint = useAuthStore().wellKnownData?.authorization_endpoint
      const challengePath = authorizationEndpoint + '?' + serializeQuery(challengeQuery)

      // Fresh random port + handshake_id per card → nothing is listening yet.
      const port = createAuthenticatorPort()
      const handshakeId = generateHandshakeId()

      // Fire the deeplink. On an OLD Authenticator this single deeplink already
      // starts the flow (it parses challenge_path); on a NEW one it only starts
      // the HTTP server and waits for the GET /authorize navigation below.
      location.href = buildAuthenticatorDeeplink(challengePath, port, handshakeId)

      this.probeAbortController = new AbortController()
      const probeResult = await probeAuthenticator({
        port,
        deadlineMs: Date.now() + PROBE_DEADLINE_MS,
        intervalMs: PROBE_INTERVAL_MS,
        signal: this.probeAbortController.signal
      })

      if (!probeResult.ready) {
        if (probeResult.reason === 'aborted') {
          return
        }
        // Old Authenticator (no server mode): the deeplink above ALREADY started
        // the legacy flow — do not fire a second one, just await its result.
        this.fallbackToLegacy(session, slot.state)
        return
      }

      // Ready → top-level navigation. The Authenticator holds it open through
      // card + PIN and finally answers with a 302 to redirect_uri (→ /callback).
      this.phase = 'signing'
      window.location.assign(buildAuthRequestUrl(port, challengePath, handshakeId))
    },

    fallbackToLegacy(session: AuthFlowSession, state: string) {
      // No server mode: the deeplink fired in startCard was the market-standard
      // legacy challenge, so the flow ALREADY started there. Firing a second
      // deeplink would start a duplicate flow — instead just abandon the server
      // state machine and await the legacy result (DIRECT polling when auto).
      clearFlowSession()
      this.loading = false
      if (session.redirectAutomatically) {
        this.startAutoRedirectAwaitForToken(state, session.cardTypeParam)
      }
    },

    startAutoRedirectAwaitForToken(state: string, cardTypeParam: string) {
      // Wait for the auth flow result via DIRECT-callback polling (legacy path).
      if (this.redirectAutomatically) {
        this.abortController = new AbortController()
        const signal = this.abortController.signal

        fetch('/api/check-auth-code' + '?state=' + state + '&cardType=' + cardTypeParam, { signal })
          .then((response) => {
            if (response.ok) {
              return response.json()
            } else {
              this.authFlowFailed = true
              console.log('No token received from authenticator:', response)
            }
          })
          .then((data) => {
            useRouter().push('/callback?' + serializeQuery(data))
          })
          .catch((err) => {
            this.authFlowFailed = true
            console.log('No token received from authenticator:', err)
          })
      }
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
