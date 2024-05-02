/*
 * Copyright 2024 gematik GmbH
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

import awaitingTokenSessions from '~/server/awaiting-token-sessions'

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
      if (typeof state === 'string') {
        awaitingTokenSessions[state] = resolve
      }

      setTimeout(() => {
        // after 30 seconds no request received from the authenticator. We throw an error!
        if (typeof state === 'string' && awaitingTokenSessions[state]) {
          // delete the reply object in any case and save memory
          delete awaitingTokenSessions[state]

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
