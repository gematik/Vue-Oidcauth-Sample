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

import awaitingTokenSessions from '~/server/awaiting-token-sessions'
import type { CARD_TYPE } from '~/constants'

/**
 * Relying-Party (Client) checks if there is a token specified for the processing state.
 *
 * We save reply HTTP Object for the state. When we receive the callback request from the authenticator,
 * this reply object will return callback query parameters to client.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const state = query.state || ''

  try {
    // We save the resolve object in the awaitingTokenSessions object. When we receive the callback request from the
    // authenticator, we will resolve this promise.
    return await new Promise((resolve, reject) => {
      if (state) {
        awaitingTokenSessions[state as string] = {
          cardType: query.cardType as CARD_TYPE,
          resolve: resolve as typeof Promise.resolve
        }
      }

      setTimeout(() => {
        // after 30 seconds no request received from the authenticator. We throw an error!
        if (state && awaitingTokenSessions[state as string]) {
          // delete the reply object in any case and save memory
          delete awaitingTokenSessions[state as string]

          // resolve this promise with reject
          return reject(new Error('No request received from the authenticator!'))
        }

        // flow has been completed already. Resolve this promise to clean-up memory.
        resolve(false)
      }, 30000)
    })
  } catch (err) {
    // return http error
    return createError({
      statusCode: 400,
      message: err.message
    })
  }
})
