/*
 * Copyright 2023 gematik GmbH
 *
 * The Authenticator App is licensed under the European Union Public Licence (EUPL); every use of the Authenticator App
 * Sourcecode must be in compliance with the EUPL.
 *
 * You will find more details about the EUPL here: https://joinup.ec.europa.eu/collection/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the EUPL is distributed on an "AS
 * IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the EUPL for the specific
 * language governing permissions and limitations under the License.ee the Licence for the specific language governing
 * permissions and limitations under the Licence.
 */

import { defineStore } from 'pinia'
import { getConfig } from '~/config'
import { CONFIG_KEYS } from '~/constants'

type IAuthStoreState = {
  userData: Record<string, string>
  accessData: {
    access_token: string
    id_token: string
    expires_in: number
  }
  wellKnownData: null | TWellKnown
}

const InitialAccessDataState = {
  access_token: '',
  id_token: '',
  expires_in: 0
}

export const useAuthStore = defineStore({
  id: 'authStore',
  state: () =>
    ({
      wellKnownData: null,
      accessData: { ...InitialAccessDataState },
      userData: {}
    } as IAuthStoreState),
  actions: {
    logout() {
      this.accessData = { ...InitialAccessDataState }
      this.userData = {}
    },
    async readWellKnown() {
      try {
        const idpHost = getConfig(CONFIG_KEYS.IDP_HOST)

        // get data with fetch api
        const response = await fetch('/api/get-idp-well-known', {
          method: 'POST',
          body: JSON.stringify({ idpHost }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.status !== 200) {
          throw new Error('Error on reading well known data')
        }

        this.wellKnownData = parseJwt(await response.text())
      } catch (err) {
        console.log('err on reading jwt', err)
        throw err
      }
    },
    async getAccessData({ codeVerifier, params, redirectUri, clientId }: Record<string, unknown>) {
      if (!this.wellKnownData) {
        await this.readWellKnown()
      }

      const postData = {
        params,
        wellKnownData: this.wellKnownData,
        codeVerifier,
        redirectUri,
        clientId
      }

      this.accessData = await fetch('/api/get-access-data', {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => res.json())
    }
  },
  getters: {}
})
