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

import { createStore } from 'vuex';
import axios from 'axios';
import { CONFIG_PROFILE_URL_KEY, CONFIG_USER_INFO_URL_KEY } from '@/constants';
import { getConfig } from '@/config';

export default createStore({
  state: {
    accessData: {
      access_token: '',
      id_token: '',
      expires_in: '',
      claims: '',
    },
    userData: {},
  },
  mutations: {
    setAccessData(state, data): void {
      state.accessData = data;
    },
    setUserData(state, data): void {
      state.userData = data;
    },
    clearAccessData(state, data): void {
      state.userData = data;
    },
  },
  actions: {
    async getAuthData({ commit }, params) {
      const { data } = await axios.post(getConfig(CONFIG_PROFILE_URL_KEY), params, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      commit('setAccessData', data);
      // set axios default header
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
    },
    async getAccessData({ commit }) {
      try {
        const { data } = await axios.get(getConfig(CONFIG_USER_INFO_URL_KEY));

        commit('setUserData', data);
      } catch (e) {
        console.log(e);
      }
    },
  },
  modules: {},
});
