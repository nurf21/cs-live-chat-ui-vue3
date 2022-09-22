import axios from "axios";
import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    roomId: localStorage.getItem("room") || "",
    room: {},
    categoryOptions: [],
    rooms: [],
  }),
  actions: {
    getTicketCategories() {
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/v1/ticket/category`)
          .then((response) => {
            this.categoryOptions = response.data.data;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.data);
          });
      });
    },
    createTicketRoom(payload) {
      const token = localStorage.getItem("token");
      return new Promise((resolve, reject) => {
        axios
          .post(`/api/v1/ticket/room`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            this.roomId = response.data.data.room_id;
            localStorage.setItem("room", response.data.data.room_id);
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    guestCreateTicketRoom(payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/api/v1/ticket/room/guest`, payload)
          .then((response) => {
            this.roomId = response.data.data.room_id;
            localStorage.setItem("room", response.data.data.room_id);
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    getRoomByRoomID(payload) {
      const token = localStorage.getItem("token");
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/v1/ticket/room/${payload}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            this.room = response.data.data;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    guestGetRoomByRoomID(payload) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/v1/ticket/room/guest/${payload}`)
          .then((response) => {
            this.room = response.data.data;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    guestSendMessageToRoom(payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/api/v1/ticket/message/guest`, payload)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    sendMessageToRoom(payload) {
      const token = localStorage.getItem("token");
      return new Promise((resolve, reject) => {
        axios
          .post(`/api/v1/ticket/message`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    getRoomsByToken() {
      const token = localStorage.getItem("token");
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/v1/ticket/room/list`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            this.rooms = response.data.data;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    guestCloseRoom(payload) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/api/v1/ticket/room/guest/close/${payload}`)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    closeRoom(payload) {
      const token = localStorage.getItem("token");
      return new Promise((resolve, reject) => {
        axios
          .put(
            `/api/v1/ticket/room/close/${payload}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
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
    deleteRoomAndRoomId() {
      this.roomId = "";
      this.room = null;
      localStorage.removeItem("room");
    },
  },
  getters: {
    getRoomId: (state) => state.roomId,
    getRoom: (state) => state.room,
    getCategoryOptions: (state) => state.categoryOptions,
    getRooms: (state) => state.rooms,
  },
});
