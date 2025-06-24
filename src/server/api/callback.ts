/*
 * Copyright 2025, gematik GmbH
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
