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

import {
  CONFIG_AUTH_TOKEN_CHECK_ENDPOINT_KEY,
  CONFIG_AUTHENTICATOR_HOST_KEY,
  CONFIG_CARD_TYPE_KEY,
  CONFIG_LOGIN_URL_KEY,
  CONFIG_PROFILE_URL_KEY,
  CONFIG_REDIRECT_AUTOMATICALLY_KEY,
  CONFIG_SHOW_ALERT_KEY,
  CONFIG_USER_INFO_URL_KEY,
  CONFIGS_LOCAL_STORAGE_KEY,
} from '@/constants';

const DEFAULT_CONFIGS = {
  [CONFIG_LOGIN_URL_KEY]: 'http://localhost:3500/gem-cidp-login',
  [CONFIG_AUTHENTICATOR_HOST_KEY]: 'authenticator://',
  [CONFIG_PROFILE_URL_KEY]: 'http://localhost:3500/secure-gem-cidp-profile',
  [CONFIG_USER_INFO_URL_KEY]: 'http://localhost:3500/secure/userinfo',
  [CONFIG_CARD_TYPE_KEY]: 'HBA',
  [CONFIG_SHOW_ALERT_KEY]: 'false',
  [CONFIG_AUTH_TOKEN_CHECK_ENDPOINT_KEY]: 'http://localhost:3500/check-auth-code',
  [CONFIG_REDIRECT_AUTOMATICALLY_KEY]: 'false',
};

export function loadConfigs(): { [string: string]: string } {
  const localDataPlain = localStorage.getItem(CONFIGS_LOCAL_STORAGE_KEY);
  if (localDataPlain) {
    const configValues = JSON.parse(localDataPlain || '{}');

    return {
      ...DEFAULT_CONFIGS,
      ...configValues,
    };
  }

  return DEFAULT_CONFIGS;
}

export function getConfig(key: string, parseJson = false): string {
  const value = loadConfigs()[key];

  if (!parseJson) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (e) {
    return '';
  }
}

export function saveConfig(configs: { [string: string]: string }) {
  localStorage.setItem(CONFIGS_LOCAL_STORAGE_KEY, JSON.stringify(configs));
}

export function debugAlert(message?: any) {
  if (JSON.parse(getConfig(CONFIG_SHOW_ALERT_KEY))) {
    alert(message);
  }
}
