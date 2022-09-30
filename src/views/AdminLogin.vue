<template>
  <div class="login-admin">
    <el-form label-position="top" :model="form">
      <el-form-item
        label="Email or Username"
        class="login-input"
        v-on:keyup.enter="onSubmit"
      >
        <el-input
          v-model="form.login"
          placeholder="Enter email or username"
          size="large"
        />
      </el-form-item>
      <el-form-item
        label="Password"
        class="login-input"
        v-on:keyup.enter="onSubmit"
      >
        <el-input
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          show-password
          size="large"
        />
      </el-form-item>
      <el-form-item>
        <el-button plain class="login-btn orange" @click="onSubmit"
          >Login</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAdminStore } from "../stores/admin";
import { ElMessage } from "element-plus";

export default {
  name: "admin-login",
  data() {
    return {
      form: {
        remember_me: "true",
      },
    };
  },
  methods: {
    ...mapActions(useAdminStore, ["loginAdmin"]),
    onSubmit() {
      this.loginAdmin(this.form)
        .then((response) => {
          ElMessage({
            message: response.message,
            type: "success",
          });
          this.$router.push("/admin/dashboard");
        })
        .catch((error) => {
          ElMessage.error(error.data.message);
        });
    },
  },
  computed: {
    ...mapState(useAdminStore, { token: "getAdminToken" }),
  },
  mounted() {
    if (this.token != null) {
      this.$router.push("/admin");
    }
  },
};
</script>

<style>
.login-admin {
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.16), 0 4px 6px rgba(0, 0, 0, 0.45);
  border-radius: 10px;
  padding: 30px;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
