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

import base64url from 'base64url'
import * as JWE from 'node-jose/lib/jwe/index.js'
import * as JWK from 'node-jose/lib/jwk/index.js'
import got from 'got'
import { HttpsProxyAgent } from 'https-proxy-agent'

import { createRandomString } from '~/utils'
import { idpDevAuthHeaders } from '~/server/utils/idp-auth'

type TBody = {
  clientId: string
  codeVerifier: string
  params: {
    code: string
    state: string
    ssotoken: string
  }
  redirectUri: string
  wellKnownData: TWellKnown
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const body = (await readBody(event)) as TBody
    const wellKnownData = body.wellKnownData as TWellKnown

    // get idp_enc jwk
    let agentOption = undefined
    if (typeof config.proxyUrl === 'string' && config.proxyUrl) {
      agentOption = { https: new HttpsProxyAgent<string>(config.proxyUrl) }
    }
    const idpEncJwk: TIdpEncJwk = await got(wellKnownData.uri_puk_idp_enc, {
      agent: agentOption,
      headers: idpDevAuthHeaders(wellKnownData.uri_puk_idp_enc, config.idpDevApiKey)
    }).json<TIdpEncJwk>()

    // get request parameters
    const { tokenKey, params } = await getRequestParameter(body, idpEncJwk)

    // get tokens
    return await getTokens(params, tokenKey, wellKnownData, agentOption, config.idpDevApiKey)
  } catch (err) {
    // return http error
    return createError({
      statusCode: 400,
      message: err.message
    })
  }
})

/**
 * Get request parameters
 * @param data
 * @param idpEncJwk
 */
async function getRequestParameter(data: TBody, idpEncJwk: TIdpEncJwk) {
  const rndTokenKey = createRandomString(32)
  const tokenKey = base64url.encode(rndTokenKey)
  const keyVerifier = await buildKeyVerifier(data.codeVerifier, tokenKey, idpEncJwk)
  const params = new URLSearchParams()
  params.append('grant_type', 'authorization_code')
  params.append('client_id', data.clientId)
  params.append('code_verifier', data.codeVerifier)
  params.append('key_verifier', keyVerifier)
  params.append('code', data.params.code)
  params.append('redirect_uri', data.redirectUri)
  return { tokenKey, params }
}

/**
 * Build key verifier
 * @param codeVerifier
 * @param tokenKey
 * @param idpEncJwk
 */
const buildKeyVerifier = async (codeVerifier: string, tokenKey: string, idpEncJwk: TIdpEncJwk) => {
  const keyVerifier = {
    token_key: tokenKey,
    code_verifier: codeVerifier
  }
  const keyVerifierJson = JSON.stringify(keyVerifier)
  return await createJwe(keyVerifierJson, idpEncJwk)
}

/**
 * Get tokens
 * @param params
 * @param tokenKey
 * @param wellKnownData
 * @param agentOption
 * @param apiKey
 */
const getTokens = async (
  params: URLSearchParams,
  tokenKey: string,
  wellKnownData: TWellKnown,
  agentOption?: { https: HttpsProxyAgent<string> },
  apiKey = ''
) => {
  try {
    // send with got
    const response = await got(wellKnownData.token_endpoint, {
      method: 'POST',
      body: params.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...idpDevAuthHeaders(wellKnownData.token_endpoint, apiKey)
      },
      agent: agentOption
    }).json<{ access_token: string; id_token: string; expires_in: number; error?: any }>()

    if (response.error) {
      throw response
    }

    const accessToken = await decryptTokenSymmetric(response.access_token, tokenKey)
    const idToken = await decryptTokenSymmetric(response.id_token, tokenKey)

    return {
      access_token: accessToken,
      id_token: idToken,
      expires_in: response.expires_in
    }
  } catch (err) {
    throw new Error(err.gematik_error_text || err.message)
  }
}

/**
 * Create JWE
 * @param inputPlain
 * @param idpEncJwk
 */
async function createJwe(inputPlain: string, idpEncJwk: TIdpEncJwk) {
  const key = {
    kid: idpEncJwk.kid,
    kty: idpEncJwk.kty,
    crv: idpEncJwk.crv,
    x: idpEncJwk.x,
    y: idpEncJwk.y
  }
  const opts = {
    fields: {
      exp: Date.now(),
      epk: {
        crv: key.crv
      },
      cty: 'NJWT'
    }
  }

  const jwe = JWE.default.createEncrypt(opts, key)
  jwe.update(Buffer.from(inputPlain))
  const finalJwe = await jwe.final()

  return finalJwe.protected + '..' + finalJwe.iv + '.' + finalJwe.ciphertext + '.' + finalJwe.tag
}

async function decryptTokenSymmetric(tokenJwe: string, tokenKey: string) {
  let key = {
    kty: 'oct',
    kid: 'accesstoken-decryption-test',
    k: tokenKey,
    alg: 'A256GCM'
  }
  key = await JWK.default.asKey(key)

  const arrayBuffer = await JWE.default.createDecrypt(key).decrypt(tokenJwe)
  const message = Buffer.from(arrayBuffer.plaintext).toString()
  return JSON.parse(message).njwt
}
