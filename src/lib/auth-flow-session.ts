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

// State for the navigation-based auth flow. The auth request is a top-level
// browser navigation to the Authenticator that 302-redirects to /callback, so
// the SPA fully reloads between hops and in-memory (Pinia) state is lost.
// sessionStorage survives those reloads (same tab/origin) and is cleared when
// the tab closes — the right place to drive a multi-card flow across callbacks.

export interface AuthFlowCard {
  // 'HBA' | 'SMC-B' (OFFICIAL_CARD_TYPE values).
  cardType: string
  // Per-card OAuth `state`, validated on the callback to correlate the response.
  state: string
  // Callback query params collected for this card (code, state, …).
  params?: Record<string, string>
}

export interface AuthFlowSession {
  flowId: string
  // Original `?cardType=` ('multi' | 'HBA' | 'SMC-B') — used for legacy fallback.
  cardTypeParam: string
  cards: AuthFlowCard[]
  // Index of the card currently being processed (0-based).
  cursor: number
  redirectAutomatically: boolean
}

const KEY = 'authenticator.flow'

export function readFlowSession(): AuthFlowSession | null {
  if (typeof sessionStorage === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as AuthFlowSession) : null
  } catch {
    return null
  }
}

export function writeFlowSession(session: AuthFlowSession): void {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.setItem(KEY, JSON.stringify(session))
  } catch {
    // ignore
  }
}

export function clearFlowSession(): void {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

export function isFlowActive(session: AuthFlowSession | null): session is AuthFlowSession {
  return !!session && session.cursor < session.cards.length
}
