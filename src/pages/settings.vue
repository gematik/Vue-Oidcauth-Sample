<!--
  - Copyright 2025, gematik GmbH
  -
  - Licensed under the EUPL, Version 1.2 or - as soon they will be approved by the
  - European Commission – subsequent versions of the EUPL (the "Licence").
  - You may not use this work except in compliance with the Licence.
  -
  - You find a copy of the Licence in the "Licence" file or at
  - https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
  -
  - Unless required by applicable law or agreed to in writing,
  - software distributed under the Licence is distributed on an "AS IS" basis,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
  - In case of changes by gematik find details in the "Readme" file.
  -
  - See the Licence for the specific language governing permissions and limitations under the Licence.
  -
  - *******
  -
  - For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
  -->
<script lang="ts">
import { defineComponent } from 'vue'
import { getConfigs, saveConfig } from '@/config'
import {
  CARD_TYPE,
  CONFIG_KEYS,
  DEFAULT_CONFIG,
  DEFAULT_CONFIG_BY_TYPES,
  type TConfig,
  TFormInputColumnTypes
} from '@/constants'

export default defineComponent({
  name: 'Settings',
  data() {
    const formColumns: TConfig[] = [
      {
        label: 'IdP URL',
        key: CONFIG_KEYS.IDP_HOST,
        type: TFormInputColumnTypes.input,
        required: true
      },
      {
        label: 'IdP Client ID',
        key: CONFIG_KEYS.CLIENT_ID,
        type: TFormInputColumnTypes.input,
        required: true
      },
      {
        label: 'IdP Redirect URI',
        key: CONFIG_KEYS.REDIRECT_URI,
        type: TFormInputColumnTypes.input,
        required: true
      },
      {
        label: 'Authenticator Host',
        key: CONFIG_KEYS.AUTHENTICATOR_HOST_KEY,
        type: TFormInputColumnTypes.input,
        required: true
      },
      {
        label: 'Card Type',
        key: CONFIG_KEYS.CARD_TYPE_KEY,
        type: TFormInputColumnTypes.dropDown,
        required: true,
        options: [
          {
            text: 'HBA',
            value: CARD_TYPE.HBA
          },
          {
            text: 'SMC-B',
            value: CARD_TYPE.SMCB
          },
          {
            text: 'Multi (HBA + SMC-B)',
            value: CARD_TYPE.MULTI
          }
        ]
      },
      {
        label: 'IdP Scope',
        key: CONFIG_KEYS.SCOPE,
        type: TFormInputColumnTypes.input,
        required: true
      },
      {
        label: 'Redirect Automatically',
        key: CONFIG_KEYS.REDIRECT_AUTOMATICALLY_KEY,
        type: TFormInputColumnTypes.dropDown,
        required: true,
        optionsType: 'boolean'
      }
    ]
    return {
      configs: { ...getConfigs() },
      defaultConfigTypes: Object.keys(DEFAULT_CONFIG_BY_TYPES),
      formColumns
    }
  },
  methods: {
    save() {
      saveConfig(this.configs)
      this.$router.push('/')
    },
    saveDefaultConfig(defaultConfigType: string) {
      this.configs = { ...DEFAULT_CONFIG, ...DEFAULT_CONFIG_BY_TYPES[defaultConfigType] }
    }
  }
})
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="text-2xl font-normal leading-normal mt-0 mb-2 text-indigo-800">Settings</h1>

    <div class="flex flex-row flex-wrap justify-center">
      <button
        v-for="defaultConfigType in defaultConfigTypes"
        :key="defaultConfigType"
        class="mx-2 shadow bg-blue-900 hover:bg-blue-800 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded mb-2"
        type="button"
        @click="saveDefaultConfig(defaultConfigType)"
      >
        {{ defaultConfigType }}
      </button>
    </div>

    <form class="mt-10" @submit.prevent="save">
      <FormElement
        v-for="config in formColumns"
        :key="config.key"
        :required="!!config.required"
        :label="config.label"
        :model="configs"
        :name="config.key"
        :type="config.type"
        :options-type="config.optionsType"
        :options="config.options"
        :hide="config.hide"
        :validation-regex="config.validationRegex"
        :on-element-change="config.onChange"
        :info-text="config.infoText"
      />

      <div class="w-[100%] mt-3 text-center">
        <button
          class="shadow bg-blue-900 hover:bg-blue-800 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded mb-2"
          type="submit"
          @click="save"
        >
          Speichern
        </button>
      </div>
    </form>
  </div>
</template>
