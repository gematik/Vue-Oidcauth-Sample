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
import { VERSION } from '~/constants'
const productVersion = computed(() => `v${VERSION}`)
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gray-800 text-white py-2 w-full">
    <div class="flex justify-between ml-4 mr-4">
      <div class="flex-1">
        <!-- left content -->
        <p class="text-gray-400 font-mono">{{ productVersion }}</p>
      </div>
      <div class="flex-1 text-center">
        <!-- middle content -->
        <a href="https://www.gematik.de/" target="_blank" class="no-underline text-gray-400 font-light">
          &copy; {{ year }} gematik GmbH
        </a>
      </div>
      <div class="flex-1 text-right">
        <!-- right content -->
        <a
          href="https://wiki.gematik.de/display/GAKB/Installationshandbuch+Authenticator"
          target="_blank"
          class="hover:underline no-underline text-gray-400 font-light external-link"
          >gematik Authenticator Handbuch</a
        >
      </div>
    </div>
  </footer>
</template>
