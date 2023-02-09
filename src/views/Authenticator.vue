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
  <div class='text-center'>Redirecting...</div>
</template>

<script>
import { CONFIG_AUTHENTICATOR_HOST_KEY } from '@/constants';
import { getConfig } from '@/config';

export default {
  created() {
    const routeParams = { ...this.$route.query };
    const HOST = getConfig(CONFIG_AUTHENTICATOR_HOST_KEY);
    location.href = HOST + '?' + this.serialize(routeParams);
  },
  methods: {
    serialize(obj) {
      const str = [];
      for (let p in obj)
        if (obj[p]) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
      return str.join('&');
    },
  },
};
</script>
