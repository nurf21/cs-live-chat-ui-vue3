<template>
  <div>
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAdminStore } from "../stores/admin";

export default {
  name: "admin-def",
  computed: {
    ...mapState(useAdminStore, { token: "getAdminToken" }),
  },
  mounted() {
    if (this.token == null) {
      this.$router.push("/admin/login");
    } else {
      this.$router.push("/admin/dashboard");
    }
  },
};
</script>
