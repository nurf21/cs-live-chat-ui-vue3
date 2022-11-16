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
import { mapState, mapActions } from "pinia";
import { useUserStore } from "../stores/user";
import { useSocketStore } from "../stores/socket-io";

export default {
  name: "home-view",
  methods: {
    ...mapActions(useUserStore, ["getUserData"]),
    ...mapActions(useSocketStore, ["leaveRoomList"]),
  },
  computed: {
    ...mapState(useUserStore, { user: "getUsername", profile: "getProfile" }),
  },
  mounted() {
    this.leaveRoomList();
  },
};
</script>
