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