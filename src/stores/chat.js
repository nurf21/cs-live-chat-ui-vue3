import axios from "axios";
import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    roomId: "",
    categoryOptions: [],
  }),
  actions: {
    getTicketCategories() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${import.meta.env.VITE_BASE_URL_BACKEND}/v1/ticket/category`)
          .then((response) => {
            this.categoryOptions = response.data.data
            resolve(response.data)
          })
          .catch((error) => {
            reject(error.data)
          })
      })
    }
  },
  getters: {
    getRoomId: (state) => state.roomId,
    getCategoryOptions: (state) => state.categoryOptions,
  },
});
