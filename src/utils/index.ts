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

import cryptoJS from 'crypto-js'
import base64url from 'base64url'
import { AUTHENTICATOR_HANDSHAKE } from '~/constants'

/**
 * URL-encodes an object as a query string, skipping entries whose value is
 * falsy (empty string, undefined, null). `URLSearchParams` would keep them.
 */
export function serializeQuery(obj: Record<string, string | undefined>): string {
  const parts: string[] = []
  for (const key in obj) {
    const value = obj[key]
    if (value) {
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
    }
  }
  return parts.join('&')
}

/**
 * UUID v4 string. Uses `crypto.randomUUID` in secure contexts; falls back to
 * a `Math.random`-based generator for plain-HTTP non-localhost deployments
 * (e.g. Citrix) where the WebCrypto API is unavailable.
 */
export function generateHandshakeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Fresh random loopback port for a single auth flow, within the band the
 * Authenticator accepts. Generated per flow and never persisted, so a finished
 * flow can't be resumed and each flow rebinds the Authenticator's local server.
 */
export function createAuthenticatorPort(): number {
  const { MIN, MAX } = AUTHENTICATOR_HANDSHAKE.PORT_RANGE
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN
}

/**
 * creates random string
 * @param size
 */
export function createRandomString(size = 50) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
  let randomstring = ''
  for (let i = 0; i < size; i++) {
    const rNum = Math.floor(Math.random() * chars.length)
    randomstring += chars.substring(rNum, rNum + 1)
  }
  return randomstring
}

export function createCodeChallenge(codeVerifier: string) {
  const base64Digest = cryptoJS.SHA256(codeVerifier).toString(cryptoJS.enc.Base64)

  return base64url.fromBase64(base64Digest)
}

export function parseJwt(token: string) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}
