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

/**
 * localStorage key for the saved configs
 */
export const CONFIGS_LOCAL_STORAGE_KEY = 'de.gematik.authenticator.clientsample.configs';
export const CONFIG_LOGIN_URL_KEY = 'CONFIG_LOGIN_URL_KEY';
export const CONFIG_PROFILE_URL_KEY = 'CONFIG_PROFILE_URL_KEY';
export const CONFIG_USER_INFO_URL_KEY = 'CONFIG_USER_INFO_URL_KEY';
export const CONFIG_AUTHENTICATOR_HOST_KEY = 'CONFIG_AUTHENTICATOR_HOST_KEY';
export const CONFIG_CARD_TYPE_KEY = 'CONFIG_CARD_TYPE_KEY';
export const CONFIG_SHOW_ALERT_KEY = 'CONFIG_SHOW_ALERT_KEY';

export const SCOPE_ADDITION_HBA = ' Person_ID'
export const SCOPE_ADDITION_SMCB = ' Institutions_ID'

export const CONFIG_KEY_NAME_MAP = {
  CONFIG_LOGIN_URL_KEY: 'Login Url',
  CONFIG_PROFILE_URL_KEY: 'Profile Url ',
  CONFIG_USER_INFO_URL_KEY: 'User Info Url',
  CONFIG_AUTHENTICATOR_HOST_KEY: 'Authenticator Host',
  CONFIG_CARD_TYPE_KEY: 'Card type',
  CONFIG_SHOW_ALERT_KEY: 'Show Alert',
};
