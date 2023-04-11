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

import base64url from 'base64url'
import * as JWE from 'node-jose/lib/jwe'
import * as JWK from 'node-jose/lib/jwk'

import { createRandomString } from '~/utils'

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
    const body = (await readBody(event)) as TBody
    const wellKnownData = body.wellKnownData as TWellKnown

    // get idp_enc jwk
    const idpEncJwk: TIdpEncJwk = await fetch(wellKnownData.uri_puk_idp_enc).then((response) => response.json())

    // get request parameters
    const { tokenKey, params } = await getRequestParameter(body, idpEncJwk)

    // get tokens
    const data = await getTokens(params, tokenKey, wellKnownData)
    return data
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
 */
const getTokens = async (params: URLSearchParams, tokenKey: string, wellKnownData: TWellKnown) => {
  try {
    // send with fetch
    const response = await fetch(wellKnownData.token_endpoint, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => response.json())

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
