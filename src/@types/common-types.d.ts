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

type TIdpEncJwk = {
  crv: string
  kid: string
  kty: string
  use: string
  x: string
  y: string
}

type TWellKnown = {
  authorization_endpoint: string
  auth_pair_endpoint: string
  sso_endpoint: string
  uri_pair: string
  token_endpoint: string
  third_party_authorization_endpoint: string
  uri_disc: string
  issuer: string
  jwks_uri: string
  exp: number
  iat: number
  uri_puk_idp_enc: string
  uri_puk_idp_sig: string
  subject_types_supported: string[]
  id_token_signing_alg_values_supported: string[]
  response_types_supported: string[]
  scopes_supported: string[]
  response_modes_supported: string[]
  grant_types_supported: string[]
  acr_values_supported: string[]
  token_endpoint_auth_methods_supported: string[]
  code_challenge_methods_supported: string[]
  kk_app_list_uri: string
}
