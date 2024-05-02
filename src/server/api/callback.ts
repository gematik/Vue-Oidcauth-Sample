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

export default defineEventHandler((event) => {
  try {
    const query = getQuery(event)
    const state = query.state || ''

    if (typeof state === 'string') {
      // response the client for awaiting check-auth-token request and return data
      const resolveFnFromCheckAuthCodeEndpointForState = awaitingTokenSessions[state]

      // if it is not null, we have a reply object for this state
      if (resolveFnFromCheckAuthCodeEndpointForState) {
        resolveFnFromCheckAuthCodeEndpointForState(query)

        delete awaitingTokenSessions[state]
      }
    } else {
      console.error('missing state in query')
    }

    return true
  } catch (err) {
    // return http error
    return createError({
      statusCode: 400,
      message: err.message
    })
  }
})
