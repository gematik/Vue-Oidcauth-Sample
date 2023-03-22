<!--
  - Copyright 2023 gematik GmbH
  -
  - The Authenticator App is licensed under the European Union Public Licence (EUPL); every use of the Authenticator App
  - Sourcecode must be in compliance with the EUPL.
  -
  - You will find more details about the EUPL here: https://joinup.ec.europa.eu/collection/eupl
  -
  - Unless required by applicable law or agreed to in writing, software distributed under the EUPL is distributed on an "AS
  - IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the EUPL for the specific
  - language governing permissions and limitations under the License.ee the Licence for the specific language governing
  - permissions and limitations under the Licence.
  -->
<template>
  <div class="flex flex-col items-center">
    <h1 class="text-2xl font-normal leading-normal mt-0 mb-2 text-indigo-800">
      Welcome to the Authenticator Example Application
    </h1>
    <div>
      You are currently: <b>{{ loggedIn ? 'Logged in' : 'Logged out' }}</b>
    </div>
    <div>
      Protected route:
      <router-link to="/profile">Profile</router-link>
    </div>
    <div>
      Settings:
      <router-link to="/settings">Settings</router-link>
    </div>
    <div class="mt-8">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        :disabled="loading"
        @click="toggle"
      >
        {{ loggedIn ? 'Logout' : 'Login' }}
      </button>
    </div>
    <div>
      <div class="text-center">The Login button will open the resource server.<code>(GET /login)</code></div>
      <div class="text-center">The resource server will redirect to the IdP</div>
      <div class="text-center">The IdP will redirect to the local authenticator</div>
      <div class="text-center">
        "Settings-Card type" with entry either "HBA" or "SMC-B" works only for "gem-zidp-login" or "rice-login". It has
        no impact on "ogr-login
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store/AccessDataStore';
import { debugAlert, getConfig } from '@/config';
import { CONFIG_LOGIN_URL_KEY, CONFIG_CARD_TYPE_KEY, CONFIG_REDIRECT_AUTOMATICALLY_KEY } from '@/constants';

export default {
  name: 'Home',
  data() {
    return {
      redirectAutomatically: getConfig(CONFIG_REDIRECT_AUTOMATICALLY_KEY, true),
      loading: false,
    };
  },
  computed: {
    loggedIn() {
      return !!store.state.accessData.access_token;
    },
  },
  methods: {
    logout() {
      //this.$cookies.remove('token');
      this.$store.commit('clearAccessData', '');
      this.token = null;
    },
    async toggle() {
      if (this.loggedIn) {
        this.logout();
      } else {
        this.login();
      }
    },
    login() {
      debugAlert('WE START WITH GOING TO RELYING PARTY');
      if (getConfig(CONFIG_LOGIN_URL_KEY).includes('ogr-login')) {
        window.location.href = getConfig(CONFIG_LOGIN_URL_KEY);
      } else {
        const cardTypeInfo = this.determineCardTypeInfo();
        debugAlert('WE EXTEND PATH WITH CARD TYPE: ' + getConfig(CONFIG_LOGIN_URL_KEY) + cardTypeInfo);

        let url = getConfig(CONFIG_LOGIN_URL_KEY) + cardTypeInfo;

        // add redirect automatically parameter
        if (this.redirectAutomatically) {
          url += '?redirect_automatically=true';
        }

        window.location.href = url;
      }
    },
    determineCardTypeInfo() {
      const cardType = getConfig(CONFIG_CARD_TYPE_KEY);
      switch (cardType) {
        case 'HBA':
        case '': {
          return '-HBA';
        }
        case 'SMC-B': {
          return '-SMC-B';
        }
        default: {
          alert(cardType + " ist unbekannt. Bitte 'HBA' oder 'SMC-B' im Feld 'Card type' eingeben.");
          throw new Error(cardType + " ist unbekannt. Bitte 'HBA' oder 'SMC-B' im Feld 'Card type' eingeben.");
        }
      }
    },
  },
};
</script>
