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
import { CARD_TYPE } from '~/constants'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const state = query.state || ''
    const cardType: CARD_TYPE = query.cardType as CARD_TYPE

    if (state) {
      // response the client for awaiting check-auth-token request and return data
      const resolveObject = awaitingTokenSessions[state as string]

      // No awaiting session → the browser landed here via the HTTP-port 302 (not
      // the legacy server-side DIRECT callback). Forward to the /callback page so
      // the SPA navigation flow (advanceFlow) can take over.
      if (!resolveObject) {
        return sendRedirect(event, '/callback' + getRequestURL(event).search, 302)
      }

      if (resolveObject.cardType == CARD_TYPE.MULTI) {
        if (cardType === CARD_TYPE.HBA || cardType === CARD_TYPE.SMCB) {
          resolveObject[cardType] = JSON.stringify(query)
        }

        if (resolveObject[CARD_TYPE.HBA] && resolveObject[CARD_TYPE.SMCB]) {
          // resolve the promise with both card types
          await resolveObject.resolve({
            [CARD_TYPE.HBA]: resolveObject[CARD_TYPE.HBA],
            [CARD_TYPE.SMCB]: resolveObject[CARD_TYPE.SMCB]
          })
        } else {
          return
        }
      } else {
        await resolveObject.resolve({
          [resolveObject.cardType]: JSON.stringify(query)
        })
      }

      delete awaitingTokenSessions[state as string]
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
