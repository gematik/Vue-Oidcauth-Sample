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
export const CONFIG_AUTH_TOKEN_CHECK_ENDPOINT_KEY = 'CONFIG_AUTH_TOKEN_CHECK_ENDPOINT_KEY';
export const CONFIG_REDIRECT_AUTOMATICALLY_KEY = 'CONFIG_REDIRECT_AUTOMATICALLY_KEY';

export const SCOPE_ADDITION_HBA = ' Person_ID'
export const SCOPE_ADDITION_SMCB = ' Institutions_ID'

export const CONFIG_KEY_NAME_MAP = {
  CONFIG_LOGIN_URL_KEY: 'Login Url',
  CONFIG_PROFILE_URL_KEY: 'Profile Url ',
  CONFIG_USER_INFO_URL_KEY: 'User Info Url',
  CONFIG_AUTHENTICATOR_HOST_KEY: 'Authenticator Host',
  CONFIG_CARD_TYPE_KEY: 'Card type',
  CONFIG_SHOW_ALERT_KEY: 'Show Alert',
  CONFIG_AUTH_TOKEN_CHECK_ENDPOINT_KEY: 'Check Auth Token URL',
  CONFIG_REDIRECT_AUTOMATICALLY_KEY: 'Redirect Automatically',
};
