<template>
  <el-aside width="200px">
    <el-scrollbar>
      <img
        alt="nymbi logo"
        class="logo"
        src="@/assets/nymbi.png"
        width="150"
        height="75"
        style="padding: 15px 0 15px 10px; margin-left: 5px"
      />
      <el-menu
        :default-openeds="['tickets']"
        :default-active="
          this.$route.path.split('/')[this.$route.path.split('/').length - 1]
        "
        router
      >
        <el-menu-item index="dashboard">
          <template #title>
            <el-icon><Odometer /></el-icon>Dashboard
          </template>
        </el-menu-item>
        <el-menu-item index="categories">
          <template #title>
            <el-icon><Menu /></el-icon>Categories
          </template>
        </el-menu-item>
        <el-sub-menu index="tickets">
          <template #title>
            <el-icon><Ticket /></el-icon>Tickets
          </template>
          <el-menu-item index="ticket-open"
            >Open<el-icon v-if="unread > 0" style="margin: 0 0 10px 5px"
              ><el-badge :value="unread" /></el-icon
          ></el-menu-item>
          <el-menu-item index="ticket-closed">Closed</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="settings">
          <template #title>
            <el-icon><setting /></el-icon>Settings
          </template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAdminStore } from "../stores/admin";

export default {
  name: "admin-menu",
  data() {
    return {
      isCollapse: true,
    };
  },
  methods: {
    ...mapActions(useAdminStore, ["getUnreadTicketMessages"]),
  },
  computed: {
    ...mapState(useAdminStore, {
      unread: "getUnreadState",
    }),
  },
  mounted() {
    this.getUnreadTicketMessages();
  },
};
</script>

<style scoped>
.el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.el-menu {
  border-right: none;
}
</style>
