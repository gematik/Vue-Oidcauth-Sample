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
  <div class="card-type__container zoomOut" @click="callback(scenario)">
    <div class="max-w-sm rounded-3xl overflow-hidden shadow-lg bg-white">
      <div class="flex justify-center items-center">
        <img
          class="h-52 m-4 card-type__scenario-image"
          :src="cardImage"
          :alt="`Pictogram of an ${props.scenario} card setup`"
        />
      </div>

      <div class="p-3 text-center">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          @click="callback(scenario)"
        >
          Start {{ scenario }}
        </button>
      </div>

      <div class="px-6 card-type__info">
        <div class="text-xl font-bold mb-2 text-black">
          <svg
            class="fill-current text-gray-500 w-3 h-3 mr-2 inline align-baseline"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z"
            /></svg
          >{{ scenario.toUpperCase() }}
        </div>
        <p class="text-gray-600 mb-4">{{ scenarioInfo }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import i18nData from '~/assets/i18n.json'

const i18n = i18nData as Record<string, Record<string, string>>
const props = defineProps<{
  scenario: string
  callback: (scenario: string) => void
}>()

const validTypes = ['smc-b', 'hba', 'multi']
if (!validTypes.includes(props.scenario.toLowerCase())) {
  throw new Error(`Invalid prop: type should be one of ${validTypes.join(', ')}`)
}

const scenarioInfo = ref(i18n[props.scenario].de)

const images: Record<string, string> = import.meta.glob('@/assets/*.png', { eager: true, import: 'default' })

const cardImage = computed((): string => {
  const imagePath = `/assets/${props.scenario.toLowerCase()}.png`
  return images[imagePath] || ''
})
</script>
<style scoped>
.card-type__container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-direction: column;
  cursor: pointer;
  position: relative;
}

.card-type__container:hover {
  color: blue;
  filter: brightness(1);
  animation: zoomIn 0.5s forwards;
  opacity: 100%;
}
.card-type__info {
  max-height: 0;
  overflow: hidden;
  transition:
    max-height 0.5s ease,
    opacity 0.5s ease,
    transform 0.5s ease;
}

.card-type__container:hover .card-type__info {
  max-height: 200px;
  opacity: 1;
  transform: translateY(0);
}

.card-type__scenario-image {
}

.card-type__container:hover .card-type__scenario-image {
  opacity: 100%;
  filter: brightness(1.2);
}

@keyframes zoomIn {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}

.zoomOut {
  animation: zoomOut 0.5s forwards;
}

@keyframes zoomOut {
  from {
    transform: scale(1.05);
  }
  to {
    transform: scale(1);
  }
}
</style>
