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

import { DEFAULT_CONFIG, LOCAL_STORAGE_KEYS } from '@/constants'

// the single source of truth for all config values
let CONFIG_DATA: Record<string, unknown> = {}

// get configs
export function getConfigs(): Record<string, unknown> {
  // if there is no config data, load it
  if (Object.keys(CONFIG_DATA).length === 0) {
    loadConfigs()
  }

  return CONFIG_DATA
}

export function getConfig(key: string, parseJson = false): unknown {
  // if there is no config data, load it
  if (Object.keys(CONFIG_DATA).length === 0) {
    loadConfigs()
  }

  const value = CONFIG_DATA[key]

  if (!parseJson) {
    return value
  }

  try {
    return JSON.parse(value as string)
  } catch (e) {
    return ''
  }
}

export function loadConfigs() {
  // config already loaded, return cached data
  if (Object.keys(CONFIG_DATA).length > 0) {
    return
  }

  const localDataPlain = localStorage.getItem(LOCAL_STORAGE_KEYS.CONFIGS_LOCAL_STORAGE)

  // load config from local storage
  if (localDataPlain) {
    try {
      const configValues = JSON.parse(localDataPlain || '{}')

      CONFIG_DATA = {
        ...DEFAULT_CONFIG,
        ...configValues
      }
      return
    } catch (e) {
      CONFIG_DATA = DEFAULT_CONFIG
      return
    }
  }

  // load default config
  CONFIG_DATA = DEFAULT_CONFIG
}

export function saveConfig(configs: { [string: string]: unknown }) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.CONFIGS_LOCAL_STORAGE, JSON.stringify(configs))
  CONFIG_DATA = configs
}
