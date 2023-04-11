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
