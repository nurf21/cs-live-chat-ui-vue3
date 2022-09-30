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
          <el-menu-item-group>
            <template #title>Group 1</template>
            <el-menu-item index="settings">Option 1</el-menu-item>
            <el-menu-item index="2-2">Option 2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group 2">
            <el-menu-item index="2-3">Option 3</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="2-4">
            <template #title>Option 4</template>
            <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
          </el-sub-menu>
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
export default {
  data() {
    return {
      isCollapse: true,
    };
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
