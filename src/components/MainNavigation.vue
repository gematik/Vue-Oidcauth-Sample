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
import { ref } from 'vue'
const showExpertTooltip = ref(false)
</script>

<template>
  <nav class="bg-blue-950/20 border-solid border-b-black/20 border-b-2 pt-1">
    <div class="mx-auto px-2 sm:px-2 lg:px-2">
      <div class="relative flex h-16 items-center justify-between">
        <a class="flex items-center justify-start mr-0" style="text-decoration: none" href="/">
          <img class="drop-shadow h-10 pl-0 ml-0" src="@/assets/gematik-logo.svg" alt="gematik logo" />
        </a>
        <a class="flex items-center flex-row flex-nowrap" href="/" style="text-decoration: none">
          <img src="@/assets/logo_authenticator.png" alt="authenticator logo" class="h-10 drop-shadow pl-0 ml-0" />
          <span class="sub-title">Relying Party Test</span>
        </a>
        <div class="absolute flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <div class="flex items-center">
            <nuxt-link to="/settings" class="flex items-center no-underline flex-row">
              <div
                :class="{
                  'opacity-0': !showExpertTooltip,
                  'opacity-100': showExpertTooltip
                }"
                class="pb-2 mt-1 pr-1"
              >
                Einstellungen
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-9 align-text-top"
                @mouseenter="showExpertTooltip = true"
                @mouseleave="showExpertTooltip = false"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
