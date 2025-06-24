/*
 * Copyright 2025, gematik GmbH
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

import yaml from 'js-yaml'

// read default-configs.yml from root
let defaultConfigs = {}
try {
  defaultConfigs = yaml.load(require('fs').readFileSync('./default-configs.yml', 'utf8'))
} catch (e) {
  console.info('Could not found default-configs.yml. Add it to root directory to have default configs.')
}

export default defineNuxtConfig({
  // make src dir source of nuxt
  srcDir: './src',

  ssr: false,
  css: ['~/index.css'],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    [
      '@nuxtjs/eslint-module',
      {
        failOnError: true
      }
    ]
  ],

  runtimeConfig: {
    public: {
      defaultConfigs
    }
  },

  compatibilityDate: '2024-08-14'
})
