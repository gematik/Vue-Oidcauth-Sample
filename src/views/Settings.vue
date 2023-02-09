<!--
  - Copyright (c) 2023 gematik GmbH
  - 
  - Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
  - the European Commission - subsequent versions of the EUPL (the Licence);
  - You may not use this work except in compliance with the Licence.
  - You may obtain a copy of the Licence at:
  - 
  -     https://joinup.ec.europa.eu/software/page/eupl
  - 
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the Licence is distributed on an "AS IS" basis,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the Licence for the specific language governing permissions and
  - limitations under the Licence.
  - 
  -->

<template>
  <div class="flex flex-col items-center">
    <h1 class="text-2xl font-normal leading-normal mt-0 mb-2 text-indigo-800">Settings</h1>
    <table class="border-collapse border mb-5">
      <thead>
        <tr>
          <th class="border p-2">Name</th>
          <th class="border p-2 w-96">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) in configs" :key="key">
          <td class="border p-2 text-left">{{ keyToName(key) }}</td>
          <td class="border p-2">
            <input
              class="
                bg-gray-200
                appearance-none
                border-2 border-gray-200
                rounded
                w-full
                p-2
                text-gray-700
                leading-tight
                focus:outline-none focus:bg-white focus:border-purple-500
              "
              type="url"
              name=""
              id=""
              v-model="configs[key]"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex items-center mb-20">
      <div class="w-3/3">
        <button
          class="
            shadow
            bg-blue-900
            hover:bg-blue-800
            focus:shadow-outline focus:outline-none
            text-white
            font-bold
            py-2
            px-4
            rounded
            mb-2
          "
          type="submit"
          v-on:click="save"
        >
          Speichern
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { loadConfigs, saveConfig } from '@/config';
import { CONFIG_KEY_NAME_MAP } from '@/constants';

export default defineComponent({
  name: 'Settings',
  data() {
    return {
      configs: loadConfigs(),
    };
  },
  computed: {},
  methods: {
    keyToName(key) {
      return CONFIG_KEY_NAME_MAP[key];
    },
    save() {
      saveConfig(this.configs);
      this.$router.back();
    },
  },
});
</script>
