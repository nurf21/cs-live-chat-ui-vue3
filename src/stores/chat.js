import axios from "axios";
import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    roomId: localStorage.getItem("room") || "",
    room: {},
    categoryOptions: [],
    rooms: [],
    messages: [],
  }),
  actions: {
    getTicketCategories() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${import.meta.env.VITE_BASE_URL_BACKEND}/v1/ticket/category`)
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
          .post(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/v1/ticket/room`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
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
          .post(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/v1/ticket/room/guest`,
            payload
          )
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
          .get(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/room/${payload}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
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
          .get(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/room/guest/${payload}`
          )
          .then((response) => {
            this.room = response.data.data;
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      });
    },
    getTicketMessages(payload) {
      const token = localStorage.getItem("token");
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/message/${payload}`,
            { headers: { Authorization: "Bearer " + token } }
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
    guestSendMessageToRoom(payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/v1/ticket/message/guest`,
            payload
          )
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
          .post(
            `${import.meta.env.VITE_BASE_URL_BACKEND}/v1/ticket/message`,
            payload,
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
    getRoomsByToken(search) {
      const token = localStorage.getItem("token");
      return new Promise((resolve, reject) => {
        axios
          .get(`${import.meta.env.VITE_BASE_URL_BACKEND}/v1/ticket/room/list?search=${search}`, {
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
          .put(
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/room/guest/close/${payload}`
          )
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
            `${
              import.meta.env.VITE_BASE_URL_BACKEND
            }/v1/ticket/room/close/${payload}`,
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
    getMessagesState: (state) => state.messages
  },
});
