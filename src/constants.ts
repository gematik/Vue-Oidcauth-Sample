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

const runtimeConfig = useRuntimeConfig()

export enum CARD_TYPE {
  HBA = 'HBA',
  SMCB = 'SMC-B'
}

export enum SCOPE_TYPES {
  'HBA' = 'openid gem-auth Person_ID',
  'SMC-B' = 'openid gem-auth Institutions_ID'
}

/**
 * localStorage keys
 */
export const LOCAL_STORAGE_KEYS = {
  CODE_VERIFIER: 'de.gematik.authenticator.clientsample.codeVerifier',
  CONFIGS_LOCAL_STORAGE: 'de.gematik.authenticator.clientsample.configs'
}

export const CONFIG_KEYS = {
  IDP_HOST: 'IDP_HOST',
  SCOPE: 'SCOPE',
  CLIENT_ID: 'CLIENT_ID',
  REDIRECT_URI: 'REDIRECT_URI',
  AUTHENTICATOR_HOST_KEY: 'AUTHENTICATOR_HOST_KEY',
  CARD_TYPE_KEY: 'CARD_TYPE_KEY',
  REDIRECT_AUTOMATICALLY_KEY: 'REDIRECT_AUTOMATICALLY_KEY'
}

// see the readme file to see more about the default configs
export const DEFAULT_CONFIG = {
  ...runtimeConfig?.public?.defaultConfigs?.DEFAULT_CONFIG
}

export const DEFAULT_CONFIG_BY_TYPES: Record<string, Record<string, string>> = {
  ...runtimeConfig?.public?.defaultConfigs?.DEFAULT_CONFIG_BY_TYPES
}

/**
 * Options types for FormInput DropDown element.
 * If you implement anything, please also add types in the FormInput element
 */
export type TFormInputDropDownOptionType = 'boolean'

/**
 * If option list is not suitable with OptionsType we can give a custom option list for the dropdown
 */
export type TFormInputDropDownOptions = { text: string; value: string | boolean | number }

/**
 * If option list is not suitable with OptionsType we can give a custom option list for the dropdown
 */
export enum TFormInputColumnTypes {
  input = 'input',
  number = 'number',
  email = 'email',
  text = 'text',
  dropDown = 'drop-down'
}

export type TConfig = {
  label: string
  key: string
  type: TFormInputColumnTypes
  required?: boolean
  iterable?: boolean
  placeholder?: string
  optionsType?: TFormInputDropDownOptionType
  options?: TFormInputDropDownOptions[]
  hide?: boolean
  validationRegex?: RegExp
  onChange?: (...args: any[]) => void
  infoText?: string
}
