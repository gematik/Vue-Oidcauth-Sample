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

import got from 'got'
import { isError } from 'h3'
import { validateUrl, buildWellKnownUrl } from '~/server/utils/ssrf-validator';
import { HttpsProxyAgent } from 'https-proxy-agent'

import { idpDevAuthHeaders } from '~/server/utils/idp-auth'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const idpHost = validateUrl(body.idpHost)

    let agentOption = undefined
    if (typeof config.proxyUrl === 'string' && config.proxyUrl) {
      agentOption = { https: new HttpsProxyAgent(config.proxyUrl) }
    }
    const wellKnownUrl = buildWellKnownUrl(idpHost)
    const wellKnown = await got(wellKnownUrl, {
      agent: agentOption,
      headers: idpDevAuthHeaders(wellKnownUrl, config.idpDevApiKey)
    })

    return wellKnown.body
  } catch (e) {
    // SSRF validation (validateUrl) rejects the configured host with a 403 H3Error.
    // Propagate it unchanged so the real status/message reaches the client instead
    // of being flattened into a generic 500 below.
    if (isError(e) && e.statusCode === 403) {
      console.error('get-idp-well-known failed:', e.statusCode, e.statusMessage)
      return e
    }

    const err = e as { message?: string; response?: { statusCode?: number; body?: unknown } }
    // got errors carry a circular agent ref — log the reason, never JSON.stringify the raw error.
    console.error(
      'get-idp-well-known failed:',
      err.response?.statusCode ?? '',
      err.message ?? String(e),
      err.response?.body ?? ''
    )
    return {
      statusCode: 500,
      body: err.message ?? String(e)
    }
  }
})
