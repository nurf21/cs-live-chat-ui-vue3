<template>
  <div class="logout">
    <h1>Success</h1>
    <nav>
      <RouterLink to="/">Back to home</RouterLink>
    </nav>
  </div>
</template>

<script>
import { useSocketStore } from "../stores/socket-io";
import { mapActions } from "pinia";

export default {
  methods: {
    ...mapActions(useSocketStore, ["connectClientGuest"]),
  },
  mounted() {
    this.connectClientGuest();
  },
};
</script>

<style>
@media (min-width: 1024px) {
  .logout {
    display: grid;
    align-items: center;
    /* row-gap: 25 */
  }
}
</style>
