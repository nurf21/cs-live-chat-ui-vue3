import { defineStore } from "pinia";
import { useAdminStore } from "./admin";
import io from "socket.io-client";

export const useSocketStore = defineStore("socket", {
  state: () => ({
    socket: io(`${import.meta.env.VITE_BASE_URL_SOCKET}`, {
      transports: ["websocket"],
    }),
  }),
  actions: {
    // ====================== CLIENT ===========================
    async connectClientGuest() {
      const response = await fetch("https://api.ipify.org/");
      const ip = await response.text();
      this.socket.emit("connect-client", {
        body: {
          type: "guest",
          ip: ip,
        },
      });
    },
    clientConnectAuthorized(user) {
      this.socket.emit("connect-client", {
        body: {
          type: "authorized",
          user: user,
        },
      });
    },
    joinRoom(roomId) {
      this.socket.emit("join-room", {
        body: {
          room_id: roomId,
        },
      });
    },
    leaveRoom(roomId) {
      this.socket.emit("leave-room", {
        body: {
          room_id: roomId,
        },
      });
    },
    joinRoomList() {
      this.socket.emit("join-room-list-client", {});
    },
    leaveRoomList() {
      this.socket.emit("leave-room-list-client", {});
    },

    // ====================== ADMIN ===========================
    connectAdmin(admin) {
      this.socket.emit("connect-admin", {
        body: {
          admin: admin,
        },
      });
    },
    logoutSocketAdmin(admin) {
      console.log("LOGOUT SOCKET");
      console.log(admin);
      this.socket.emit("logout-admin", {
        body: {
          admin: admin,
        },
      });
    },
    refreshRoomCount() {
      this.socket.on("refresh-room-count", function () {
        const admin = useAdminStore();
        admin.getTotalRoomCount();
        admin.getRecentTicketRooms();
      });
    },
    refreshOnlineCount() {
      this.socket.on("refresh-online-count", function () {
        const admin = useAdminStore();
        admin.getOnlineCount();
      });
    },
  },
});
