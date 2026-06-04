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

<script lang="ts" setup>
import MainNavigation from '~/components/MainNavigation.vue'
import MainFooter from '~/components/MainFooter.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <MainNavigation />
    <div class="bg"></div>
    <div class="flex-grow mt-12">
      <slot />
    </div>
    <MainFooter />
  </div>
</template>

<style>
#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
