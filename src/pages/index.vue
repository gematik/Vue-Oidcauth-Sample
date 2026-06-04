<!--
  - Copyright 2026, gematik GmbH
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

<template>
  <div class="flex flex-col items-center m-4">
    <div class="mb-3 max-w-6xl">
      <h2 class="text-3xl tracking-tight text-black sm:text-4xl drop-shadow">{{ i18n.welcome.de }}</h2>
      <p class="mt-4 text-lg leading-7 text-black">{{ i18n.instructions.de }}</p>
    </div>
    <div class="options-container">
      <CardTypeButton :scenario="CARD_TYPE.HBA" :callback="startAuthFlow"></CardTypeButton>
      <CardTypeButton :scenario="CARD_TYPE.SMCB" :callback="startAuthFlow"></CardTypeButton>
      <CardTypeButton :scenario="CARD_TYPE.MULTI" :callback="startAuthFlow"></CardTypeButton>
    </div>
  </div>
</template>

<script lang="ts">
import { CARD_TYPE } from '~/constants'
import i18nData from '~/assets/i18n.json'
const i18n = i18nData as Record<string, Record<string, string>>

console.log('custom useRuntimeConfig().public', useRuntimeConfig())

export default defineComponent({
  name: 'Home',
  data() {
    return {
      CARD_TYPE,
      i18n
    }
  },
  methods: {
    startAuthFlow(cardType: string) {
      this.$router.push({ name: 'authenticator', query: { cardType } })
    }
  }
})
</script>

<style>
.options-container {
  display: flex;
  gap: 30px;
  margin-top: 30px;
  justify-content: center;
  flex-wrap: wrap;
  align-items: flex-start;
}

.text-shadow-white {
  text-shadow:
    1px 1px 2px white,
    0 0 1em white,
    0 0 0.2em white;
}
</style>
