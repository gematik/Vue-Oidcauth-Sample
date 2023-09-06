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
