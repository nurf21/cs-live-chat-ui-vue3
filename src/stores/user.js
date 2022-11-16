import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    name: "",
    profile: null,
    token: localStorage.getItem("token") || null,
  }),
  actions: {
    login(payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/v1/auth/user`,
            payload
          )
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
        this.name = "";
        this.token = null;
      });
    },
    getUserData() {
      return new Promise((resolve, reject) => {
        const instance = axios.create({
          baseURL: `${import.meta.env.VITE_BASE_URL_BACKEND}/v1/`,
          headers: { Authorization: "Bearer " + this.token },
        });
        instance
          .get(`/member/profile`)
          .then((response) => {
            this.name = response.data.data.username;
            this.profile = response.data.data;
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
    getProfile: (state) => state.profile,
  },
});
