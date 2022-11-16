import { defineStore } from "pinia";
import axios from "axios";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    profile: {
      email: "",
    },
    token: window.localStorage.getItem("admin_token") || null,
    ticketRoomCount: {
      guestOpen: 0,
      guestClosed: 0,
      userOpen: 0,
      userClosed: 0,
    },
    recentRooms: [],
    defaultMessages: [],
    onlineCount: {
      online_admins: [],
      online_admins_count: 0,
    },
    unreadMessages: 0,
    openRooms: [],
    closedRooms: [],
    messages: [],
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
            window.localStorage.setItem(
              "admin_token",
              response.data.data.token
            );
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
        localStorage.removeItem("admin_token");
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
            }/v1/ticket/room/admin/recent?limit=10`,
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
    getOnlineCount() {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/admin/dashboard/online/count`,
            {
              headers: { Authorization: "Bearer " + this.token },
            }
          )
          .then((response) => {
            this.onlineCount = response.data.data;
            console.log(this.onlineCount);
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
    getUnreadTicketMessages() {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/message/admin/unread`,
            {
              headers: { Authorization: "Bearer " + this.token },
            }
          )
          .then((response) => {
            this.unreadMessages = response.data.data.unread;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    getOpenTicketRooms() {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/room/admin/open`,
            { headers: { Authorization: "Bearer " + this.token } }
          )
          .then((response) => {
            this.openRooms = response.data.data;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    getClosedTicketRooms() {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/room/admin/closed`,
            { headers: { Authorization: "Bearer " + this.token } }
          )
          .then((response) => {
            this.closedRooms = response.data.data;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    getTicketMessages(payload) {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/message/admin/${payload}`,
            { headers: { Authorization: "Bearer " + this.token } }
          )
          .then((response) => {
            this.messages = response.data.data;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    adminCloseRoom(payload) {
      return new Promise((resolve, reject) => {
        axios
          .put(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/room/admin/close/${payload}`, {},
            { headers: { Authorization: "Bearer " + this.token } }
          )
          .then((response) => {
            this.messages = response.data.data;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    }
  },
  getters: {
    getAdminToken: (state) => state.token,
    getAdminProfile: (state) => state.profile,
    getRoomCount: (state) => state.ticketRoomCount,
    getRecentRooms: (state) => state.recentRooms,
    getOnlineCounter: (state) => state.onlineCount,
    getDefaultMessages: (state) => state.defaultMessages,
    getUnreadState: (state) => state.unreadMessages,
    getOpenRoomsState: (state) => state.openRooms,
    getClosedRoomsState: (state) => state.closedRooms,
    getMessagesState: (state) => state.messages,
  },
});
