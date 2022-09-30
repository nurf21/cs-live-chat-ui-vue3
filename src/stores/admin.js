import { defineStore } from "pinia";
import axios from "axios";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    profile: {},
    token: window.sessionStorage.getItem("token") || null,
    ticketRoomCount: {
      guestOpen: 0,
      guestClosed: 0,
      userOpen: 0,
      userClosed: 0,
    },
    recentRooms: [],
    defaultMessages: [],
  }),
  actions: {
    loginAdmin(payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/v1/auth/admin`,
            payload
          )
          .then((response) => {
            window.sessionStorage.setItem("token", response.data.data.token);
            this.token = response.data.data.token;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    logoutAdmin() {
      return new Promise(() => {
        sessionStorage.clear();
        this.profile = null;
        this.token = null;
      });
    },
    getAdminData() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${import.meta.env.VITE_BASE_URL_BACKEND}/v1/admin/profile`, {
            headers: { Authorization: "Bearer " + this.token },
          })
          .then((response) => {
            this.profile = response.data.data;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    getTotalRoomCount() {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/room/admin/count`,
            {
              headers: { Authorization: "Bearer " + this.token },
            }
          )
          .then((response) => {
            this.ticketRoomCount = {
              guestOpen: response.data.data.guest_ticket.open_ticket,
              guestClosed: response.data.data.guest_ticket.closed_ticket,
              userOpen: response.data.data.user_ticket.open_ticket,
              userClosed: response.data.data.user_ticket.closed_ticket,
            };
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    getRecentTicketRooms() {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/room/admin/recent`,
            {
              headers: { Authorization: "Bearer " + this.token },
            }
          )
          .then((response) => {
            this.recentRooms = response.data.data;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    addTicketDefaultMessage(payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/message/default`,
            payload,
            {
              headers: { Authorization: "Bearer " + this.token },
            }
          )
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    getTicketDefaultMessages() {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/message/default`,
            {
              headers: { Authorization: "Bearer " + this.token },
            }
          )
          .then((response) => {
            this.defaultMessages = response.data.data;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    updateTicketDefaultMessage(payload) {
      return new Promise((resolve, reject) => {
        axios
          .put(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/message/default/${payload.id}`,
            payload,
            {
              headers: { Authorization: "Bearer " + this.token },
            }
          )
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    deleteTicketDefaultMessage(payload) {
      return new Promise((resolve, reject) => {
        axios
          .delete(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/message/default/${payload}`,
            {
              headers: { Authorization: "Bearer " + this.token },
            }
          )
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    addTicketCategory(payload) {
      return new Promise((resolve, reject) => [
        axios
          .post(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/v1/ticket/category/admin`,
            payload,
            {
              headers: { Authorization: "Bearer " + this.token },
            }
          )
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          }),
      ]);
    },
    updateTicketCategory(payload) {
      return new Promise((resolve, reject) => [
        axios
          .put(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/category/admin/${payload.id}`,
            payload,
            {
              headers: { Authorization: "Bearer " + this.token },
            }
          )
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          }),
      ]);
    },
    deleteTicketCategory(payload) {
      return new Promise((resolve, reject) => {
        axios
          .delete(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/category/admin/${payload}`,
            {
              headers: { Authorization: "Bearer " + this.token },
            }
          )
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
  },
  getters: {
    getAdminToken: (state) => state.token,
    getAdminProfile: (state) => state.profile,
    getRoomCount: (state) => state.ticketRoomCount,
    getRecentRooms: (state) => state.recentRooms,
    getDefaultMessages: (state) => state.defaultMessages,
  },
});
