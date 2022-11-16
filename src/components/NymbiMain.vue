<script>
import AppRouter from "./AppRouter.vue";
import { useUserStore } from "../stores/user";
import { useSocketStore } from "../stores/socket-io";
import { mapActions, mapState } from "pinia";

export default {
  components: {
    AppRouter,
  },
  methods: {
    ...mapActions(useUserStore, ["getUserData"]),
    ...mapActions(useSocketStore, [
      "connectClientGuest",
      "clientConnectAuthorized",
    ]),
  },
  computed: {
    ...mapState(useUserStore, { profile: "getProfile" }),
  },
  mounted() {
    if (localStorage.getItem("token") == null) {
      this.connectClientGuest();
    } else {
      this.getUserData().then(() => {
        this.clientConnectAuthorized(this.profile);
      });
    }
  },
};
</script>

<template>
  <header v-if="!this.$route.path.includes('admin')">
    <img
      alt="NymbiMain logo"
      class="logo"
      src="@/assets/logo.png"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <div class="greetings">
        <h1 class="orange">nymbi Live Chat</h1>
        <h3>Start live chat with our customer service</h3>
      </div>

      <AppRouter />
    </div>
  </header>
  <!-- <div class="greetings">
    <h1 class="orange">{{ msg }}</h1>
    <h3>Start live chat with our customer service</h3>
  </div> -->
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

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
