/*
 * Copyright 2026, gematik GmbH
 *
 * Licensed under the EUPL, Version 1.2 or - as soon they will be approved by the
 * European Commission – subsequent versions of the EUPL (the "Licence").
 * You may not use this work except in compliance with the Licence.
 *
 * You find a copy of the Licence in the "Licence" file or at
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * In case of changes by gematik find details in the "Readme" file.
 *
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 *
 * ******
 *
 * For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
 */

import { defineStore } from 'pinia'
import { getConfig } from '~/config'
import { CONFIG_KEYS, OFFICIAL_CARD_TYPE } from '~/constants'

export type IAuthStoreState = {
  userData: Record<string, string>
  accessData: {
    [OFFICIAL_CARD_TYPE.HBA]: {
      access_token: string
      id_token: string
      expires_in: number
    }
    [OFFICIAL_CARD_TYPE.SMCB]: {
      access_token: string
      id_token: string
      expires_in: number
    }
  }
  wellKnownData: null | TWellKnown
}

const InitialAccessDataState = {
  [OFFICIAL_CARD_TYPE.HBA]: {
    access_token: '',
    id_token: '',
    expires_in: 0
  },
  [OFFICIAL_CARD_TYPE.SMCB]: {
    access_token: '',
    id_token: '',
    expires_in: 0
  }
}

export const useAuthStore = defineStore('authStore', {
  state: (): IAuthStoreState => {
    return {
      wellKnownData: null,
      accessData: { ...InitialAccessDataState },
      userData: {}
    }
  },
  actions: {
    removeData() {
      this.accessData = { ...InitialAccessDataState }
      this.userData = {}
    },
    async readWellKnown() {
      try {
        const idpHost = getConfig(CONFIG_KEYS.IDP_HOST)

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
    async getAccessData(
      cardType: OFFICIAL_CARD_TYPE,
      { codeVerifier, params, redirectUri, clientId }: Record<string, unknown>
    ) {
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

      this.accessData[cardType] = await fetch('/api/get-access-data', {
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
