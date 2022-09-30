<script setup>
import { RouterView } from "vue-router";
import NymbiMain from "./components/NymbiMain.vue";
</script>

<template>
  <!-- <header>
    <img
      alt="NymbiMain logo"
      class="logo"
      src="@/assets/logo.png"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <NymbiMain msg="nymbi Live Chat" />

      <AppRouter />
    </div>
  </header> -->

  <NymbiMain />

  <RouterView />
</template>
