<template>
  <nav v-if="token == null">
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/chat">Chat Now</RouterLink>
  </nav>
  <nav v-if="token != null">
    <a @click="onLogout" style="cursor: pointer">Logout</a>
    <RouterLink to="/chat">Chat Now</RouterLink>
  </nav>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useUserStore } from "../stores/user";
import { ElMessageBox } from "element-plus";

export default {
  name: "app-router",
  computed: {
    ...mapState(useUserStore, { token: "getToken" }),
  },
  methods: {
    ...mapActions(useUserStore, ["logout"]),
    onLogout() {
      ElMessageBox.confirm("Are you sure?", "Logout", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.logout();
        this.$router.push("/logout");
      });
    },
  },
};
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.button-group {
  margin-top: 200px;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
