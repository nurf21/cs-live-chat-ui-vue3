import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    id: 0,
    name: "",
    email: "",
    token: localStorage.getItem("token") || null,
  }),
  actions: {
    login(payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/api/v1/auth/user`, payload)
          .then((response) => {
            localStorage.setItem("token", response.data.data.token);
            this.token = response.data.data.token;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    logout() {
      return new Promise(() => {
        localStorage.removeItem("token");
        sessionStorage.clear();
        this.id = 0;
        this.name = "";
        this.email = "";
        this.token = null;
      });
    },
    getUserData() {
      return new Promise((resolve, reject) => {
        const instance = axios.create({
          baseURL: `/api/v1/`,
          headers: { Authorization: "Bearer " + this.token },
        });
        instance
          .get(`/member/profile`)
          .then((response) => {
            this.id = response.data.data.id;
            this.name = response.data.data.username;
            this.email = response.data.data.email;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
  },
  getters: {
    getToken: (state) => state.token,
    getUsername: (state) => state.name,
  },
});
