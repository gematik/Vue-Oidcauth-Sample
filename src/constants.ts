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

const runtimeConfig = useRuntimeConfig()

export enum CARD_TYPE {
  HBA = 'HBA',
  SMCB = 'SMC-B',
  MULTI = 'multi'
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

export const DEFAULT_CONFIG_BY_TYPES: Record<string, Record<string, unknown>> = {
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
