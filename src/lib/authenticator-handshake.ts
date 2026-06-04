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

// Two-phase handshake with the gematik Authenticator desktop app:
//   1. RP fires an `authenticator://` deeplink with `server_port` — the
//      Authenticator spins up a local HTTP server answering GET /status.
//   2. Once readiness is confirmed, the RP NAVIGATES the browser to GET /authorize with
//      the auth request; the Authenticator answers with a 302 to the
//      IDP-registered redirect_uri (the code is delivered to redirect_uri by
//      the user-agent, never returned as data the caller can read).
// On phase-1 timeout, the caller falls back to the legacy deeplink-only flow.

import { AUTHENTICATOR_HANDSHAKE } from '~/constants'

const { QUERY_PARAMS, PROBE_INTERVAL_MS, DEEPLINK_PROTOCOL } = AUTHENTICATOR_HANDSHAKE

/**
 * Builds the v4.17 deeplink. The challenge URL is fully baked into
 * `challenge_path`; `server_port` and `handshake_id` are appended at the
 * deeplink level (also kept embedded inside the challenge URL by the caller
 * for backward compatibility — see `RP-INTEGRATION.html`).
 *
 * `challengePath` is URL-encoded so the `?`/`&`/`=`/`#` characters inside
 * the IDP URL don't bleed into the top-level deeplink query (a `#` would
 * otherwise truncate `server_port`/`handshake_id` into a URL fragment and
 * break parsing on the Authenticator side).
 */
export function buildAuthenticatorDeeplink(challengePath: string, port: number, handshakeId: string): string {
  return (
    DEEPLINK_PROTOCOL +
    '?' +
    QUERY_PARAMS.CHALLENGE_PATH +
    '=' +
    encodeURIComponent(challengePath) +
    '&' +
    QUERY_PARAMS.SERVER_PORT +
    '=' +
    port +
    '&' +
    QUERY_PARAMS.HANDSHAKE_ID +
    '=' +
    handshakeId
  )
}

export type ProbeResult = { ready: true } | { ready: false; reason: 'timeout' | 'aborted' }

export interface ProbeOptions {
  port: number
  // Absolute deadline (ms, `Date.now()` clock); probe loop gives up at/after this.
  deadlineMs: number
  intervalMs?: number
  signal: AbortSignal
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    const onAbort = () => {
      clearTimeout(timer)
      signal.removeEventListener('abort', onAbort)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    signal.addEventListener('abort', onAbort, { once: true })
  })
}

export async function probeAuthenticator(options: ProbeOptions): Promise<ProbeResult> {
  const { port, deadlineMs, signal } = options
  const intervalMs = options.intervalMs ?? PROBE_INTERVAL_MS

  if (signal.aborted) {
    return { ready: false, reason: 'aborted' }
  }

  while (Date.now() < deadlineMs) {
    if (signal.aborted) {
      return { ready: false, reason: 'aborted' }
    }

    const remaining = Math.max(0, deadlineMs - Date.now())
    const requestController = new AbortController()
    const onOuterAbort = () => requestController.abort()
    signal.addEventListener('abort', onOuterAbort, { once: true })
    // Bound a single request to the overall deadline.
    const requestTimeout = setTimeout(() => requestController.abort(), remaining)

    try {
      const response = await fetch(`http://localhost:${port}/status`, {
        method: 'GET',
        mode: 'cors',
        signal: requestController.signal
      })
      if (response.ok) {
        return { ready: true }
      }
    } catch {
      // ignore — outer deadline / signal decides whether to retry
    } finally {
      clearTimeout(requestTimeout)
      signal.removeEventListener('abort', onOuterAbort)
    }

    if (signal.aborted) {
      return { ready: false, reason: 'aborted' }
    }
    if (Date.now() >= deadlineMs) {
      break
    }

    try {
      await sleep(intervalMs, signal)
    } catch {
      return { ready: false, reason: 'aborted' }
    }
  }

  return { ready: false, reason: 'timeout' }
}

/**
 * Builds the auth-request URL the browser NAVIGATES to (top-level, not fetch).
 *
 * The Authenticator holds this navigation open for the whole flow (~120 s incl.
 * PIN entry) and finally answers with a 302 to the IDP-registered redirect_uri.
 * Because the code is delivered to redirect_uri by the user-agent — never
 * returned as readable data — a party that merely triggered the flow cannot
 * read it. The handshake_id must match the value put in the deeplink.
 */
export function buildAuthRequestUrl(port: number, challengePath: string, handshakeId: string): string {
  const url = new URL(`http://localhost:${port}/authorize`)
  url.searchParams.set(QUERY_PARAMS.CHALLENGE_PATH, challengePath)
  if (handshakeId) {
    url.searchParams.set(QUERY_PARAMS.HANDSHAKE_ID, handshakeId)
  }
  return url.toString()
}
