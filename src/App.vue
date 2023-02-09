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
  <div>
    <div class="flex  justify-center">
      <img class="h-28" src="@/assets/logo_gematik.png" />
    </div>
    <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/profile">Profile</router-link>
  </div>
  <router-view/> -->
    <router-view />
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
