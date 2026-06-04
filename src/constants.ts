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

import { version } from '../package.json'
export const VERSION: string = version

const runtimeConfig = useRuntimeConfig()

/**
 * Client-side surface of the two-phase handshake with the gematik Authenticator
 * desktop app. The protocol and the query-param names below are part of the
 * v4.17 wire contract and must match what the Authenticator's local HTTP server
 * expects (see `LOCAL_HTTP_SERVER` in the Authenticator's `src/constants.ts`).
 */
export const AUTHENTICATOR_HANDSHAKE = {
  // Narrower band than the Authenticator allows (any non-privileged port);
  // kept small so probes are predictable.
  PORT_RANGE: {
    MIN: 28500,
    MAX: 29500
  },
  // Overall budget for the deeplink-then-probe-until-ready loop.
  PROBE_DEADLINE_MS: 10_000,
  // Delay between successive `GET /status` probe attempts.
  PROBE_INTERVAL_MS: 500,
  DEEPLINK_PROTOCOL: 'authenticator://',
  QUERY_PARAMS: {
    CHALLENGE_PATH: 'challenge_path',
    SERVER_PORT: 'server_port',
    HANDSHAKE_ID: 'handshake_id'
  }
} as const

export enum CARD_TYPE {
  HBA = 'HBA',
  SMCB = 'SMC-B',
  MULTI = 'multi'
}

export enum OFFICIAL_CARD_TYPE {
  HBA = 'HBA',
  SMCB = 'SMC-B'
}

/**
 * localStorage keys
 */
export const LOCAL_STORAGE_KEYS = {
  CODE_VERIFIER: 'de.gematik.authenticator.clientsample.codeVerifier',
  CONFIGS_LOCAL_STORAGE: 'de.gematik.authenticator.clientsample.configs',
  CARD_TYPE: 'de.gematik.authenticator.currentFlow.cardType' // only for server variant
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
  ...runtimeConfig?.public?.defaultConfigs?.DEFAULT_CONFIG,
  ...runtimeConfig?.public?.defaultConfigs?.DEFAULT_CONFIG_BY_TYPES.CENTRAL_IDP
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
