<template>
  <div class="login">
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
import { mapActions } from "pinia";
import { useUserStore } from "../stores/user";
import { ElMessage } from "element-plus";

export default {
  name: "login-view",
  data() {
    return {
      form: {
        remember_me: "true",
      },
    };
  },
  methods: {
    ...mapActions(useUserStore, ["login"]),
    onSubmit() {
      this.login(this.form)
        .then((response) => {
          ElMessage({
            message: response.message,
            type: "success",
          });
          this.$router.push("/");
        })
        .catch((error) => {
          ElMessage.error(error.data.message);
        });
    },
  },
};
</script>

<style>
@media (min-width: 1024px) {
  .login {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }

  .login-input {
    width: 300px;
  }

  .login-btn {
    margin: 25px auto 25px auto;
    width: 300px;
    height: 40px;
    border-color: #fc5d38;
    border-radius: 70px;
    /* background: #7e98df;
    border: none; */
  }
}
</style>
