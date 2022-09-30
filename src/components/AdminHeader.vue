<template>
  <el-header style="text-align: right; font-size: 14px">
    <div class="toolbar" v-if="loadingHeader">
      <div class="lds-ring2">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <div class="toolbar" v-else>
      <el-dropdown>
        <el-icon style="margin-right: 8px; margin-top: 1px"
          ><setting
        /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="onLogout">Logout</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span> {{ profile.username }} ({{ profile.admin_role.name }}) </span>
    </div>
  </el-header>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAdminStore } from "../stores/admin";
import { ElMessageBox } from "element-plus";

export default {
  name: "admin-header",
  data() {
    return {
      loadingHeader: true,
    };
  },
  methods: {
    ...mapActions(useAdminStore, ["getAdminData", "logoutAdmin"]),
    onLogout() {
      ElMessageBox.confirm("Are you sure?", "Logout", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.logoutAdmin();
        this.$router.push("/admin/login");
      });
    },
  },
  computed: {
    ...mapState(useAdminStore, {
      token: "getAdminToken",
      profile: "getAdminProfile",
    }),
  },
  created() {
    if (this.token != null) {
      if (this.profile.username == undefined) {
        this.getAdminData().then(() => {
          this.loadingHeader = false;
        });
      } else {
        this.loadingHeader = false;
      }
    }
  },
};
</script>

<style scoped>
.el-header {
  width: 100%;
  position: relative;
  border-radius: 0;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}

.lds-ring2 {
  display: flex;
  position: relative;
  width: 20px;
  height: 20px;
  justify-content: center;
  /* position: absolute;
  top: 50%;
  left: 50%; */
  margin: -50px 0 0 -50px;
}
.lds-ring2 div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 30px;
  height: 30px;
  margin: 8px;
  border: 8px solid var(--el-color-primary-light-8);
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: var(--el-color-primary-light-8) transparent transparent
    transparent;
}
.lds-ring2 div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring2 div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring2 div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring2 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
