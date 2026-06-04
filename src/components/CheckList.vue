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
<script setup lang="ts">
defineProps({
  steps: {
    type: Array as () => TCheckListItem[],
    required: true,
    validator: (steps: TCheckListItem[]) => {
      // Überprüfe, ob jeder Eintrag im Array die Struktur von TCheckListItem hat
      return steps.every((step) => {
        return (
          (step.type === 'success' || step.type === 'error') &&
          typeof step.title === 'string' &&
          typeof step.text === 'string'
        )
      })
    }
  }
})
</script>

<template>
  <!-- Component: Activity feed -->
  <div>
    <h1 class="text-3xl font-bold text-slate-900 pt-20 pb-5 text-center">Was ist schief gelaufen?</h1>
    <ul
      aria-label="Activity feed"
      role="feed"
      class="relative flex flex-col gap-12 py-12 pl-8 before:absolute before:top-0 before:left-8 before:h-full before:border before:-translate-x-1/2 before:border-slate-200 before:border-dashed after:absolute after:top-6 after:left-8 after:bottom-6 after:border after:-translate-x-1/2 after:border-slate-200"
    >
      <li v-for="(item, index) of steps" :key="index" class="relative pl-8">
        <span
          class="absolute left-0 z-10 flex items-center justify-center w-10 h-10 -translate-x-1/2 rounded-full text-slate-700 ring-2 ring-blue-600"
          :class="{ 'bg-green-500': item.type === 'success', 'bg-red-500': item.type === 'error' }"
        >
          <svg
            v-if="item.type === 'success'"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="white"
            class="size-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <svg
            v-if="item.type === 'error'"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="white"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </span>
        <div class="flex flex-col flex-1 gap-0">
          <h4 class="text-base font-medium text-slate-700">{{ item.title }}</h4>
          <p class="text-sm text-slate-500">{{ item.text }}</p>
        </div>
      </li>
    </ul>
  </div>
  <!-- End Activity feed -->
</template>

<style scoped></style>
