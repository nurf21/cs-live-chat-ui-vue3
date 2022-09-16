<template>
  <div class="about">
    <h1 v-if="user != ''">Welcome, {{ user }}</h1>
    <h1 v-else>Welcome, Guest</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

<script>
import { mapGetters, mapActions } from "pinia";
import { useUserStore } from "../stores/user";

export default {
  name: "home-view",
  methods: {
    ...mapActions(useUserStore, ["getUserData"]),
  },
  computed: {
    ...mapGetters(useUserStore, { token: "getToken", user: "getUsername" }),
  },
  created() {
    if (this.token != null) {
      this.getUserData();
    }
  },
};
</script>
