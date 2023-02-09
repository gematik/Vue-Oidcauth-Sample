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
    <h1 class="text-2xl font-normal leading-normal mt-0 mb-2 text-red-700">The authentication was unsuccessful.</h1>
    <h1 class="text-2xl font-normal leading-normal mt-0 mb-2 text-red-700">Error: {{ error }}</h1>
    <div class="mt-3.5">
      <a href="/" class="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded"> Home </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: decodeURIComponent(this.$route.query.error || ''),
    };
  },
};
</script>
