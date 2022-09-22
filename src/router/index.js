import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import LogoutView from "../views/LogoutView.vue";
import GuestChatView from "../views/GuestChatView.vue";
import RoomListView from "../views/RoomListView.vue";
import ChatRoomView from "../views/ChatRoomView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/logout",
      name: "logout",
      component: LogoutView,
    },
    {
      path: "/chat",
      name: "chat",
      component: GuestChatView,
    },
    {
      path: "/ticket/list",
      name: "room-list",
      component: RoomListView,
    },
    {
      path: "/room/:id",
      name: "chat-room",
      component: ChatRoomView,
    },
  ],
});

export default router;
