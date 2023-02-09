/*
 * Copyright (c) 2023 gematik GmbH
 * 
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the Licence);
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 * 
 *     https://joinup.ec.europa.eu/software/page/eupl
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 * 
 */

import { CONFIG_SHOW_ALERT_KEY, CONFIGS_LOCAL_STORAGE_KEY } from '@/constants';

const DEFAULT_CONFIGS = {
  CONFIG_LOGIN_URL_KEY: 'http://localhost:3500/gem-cidp-login',
  CONFIG_AUTHENTICATOR_HOST_KEY: 'authenticator://',
  CONFIG_PROFILE_URL_KEY: 'http://localhost:3500/secure-gem-cidp-profile',
  CONFIG_USER_INFO_URL_KEY: 'http://localhost:3500/secure/userinfo',
  CONFIG_CARD_TYPE_KEY: 'HBA',
  CONFIG_SHOW_ALERT_KEY: 'false',
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

export function getConfig(key: string): string {
  return loadConfigs()[key];
}

export function saveConfig(configs: { [string: string]: string }) {
  console.log(JSON.stringify(configs));
  localStorage.setItem(CONFIGS_LOCAL_STORAGE_KEY, JSON.stringify(configs));
}

export function debugAlert(message?: any) {
  if (JSON.parse(getConfig(CONFIG_SHOW_ALERT_KEY))) {
    alert(message);
  }
}
