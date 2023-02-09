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

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Profile from '@/views/Profile.vue';
import Callback from '@/views/Callback.vue';
import Authrequest from '@/views/Authrequest.vue';
import Authenticator from '@/views/Authenticator.vue';
import Settings from '@/views/Settings.vue';
import AuthenticationFailed from '@/views/AuthenticationFailed.vue';
import store from '@/store/AccessDataStore';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { isProtected: true },
  },
  {
    path: '/authrequest',
    name: 'Authrequest',
    component: Authrequest,
  },

  {
    path: '/authenticator',
    name: 'Authenticator',
    component: Authenticator,
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/authentication-failed',
    name: 'Authentication Failed',
    component: AuthenticationFailed,
  },
  { path: '/*/', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  console.log('custom test ' + to.fullPath, from.fullPath);
  if ((to.meta.isProtected && store.state.accessData?.access_token) || !to.meta.isProtected) {
    next();
  } else {
    next({ path: '/', query: { redirect: to.path, ...to.query } });
  }
});

export default router;
