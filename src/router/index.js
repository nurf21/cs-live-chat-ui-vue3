import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import LogoutView from "../views/LogoutView.vue";
import GuestChatView from "../views/GuestChatView.vue";
import RoomListView from "../views/RoomListView.vue";
import ChatRoomView from "../views/ChatRoomView.vue";
import AdminDefView from "../views/AdminDef.vue";
import AdminLoginView from "../views/AdminLogin.vue";
import AdminDashboardView from "../views/AdminDashboard.vue";
import AdminSettingsView from "../views/AdminSettings.vue";
import TicketCategoriesView from "../views/TicketCategories.vue";
import TicketsOpenView from "../views/TicketsOpen.vue";
import TicketsClosedView from "../views/TicketsClosed.vue";

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
    {
      path: "/admin",
      name: "admin-def",
      component: AdminDefView,
    },
    {
      path: "/admin/login",
      name: "admin-login",
      component: AdminLoginView,
    },
    {
      path: "/admin/dashboard",
      name: "admin-dashboard",
      component: AdminDashboardView,
    },
    {
      path: "/admin/settings",
      name: "admin-settings",
      component: AdminSettingsView,
    },
    {
      path: "/admin/categories",
      name: "admin-categories",
      component: TicketCategoriesView,
    },
    {
      path: "/admin/ticket-open",
      name: "admin-tickets-open",
      component: TicketsOpenView,
    },
    {
      path: "/admin/ticket-closed",
      name: "admin-tickets-closed",
      component: TicketsClosedView,
    },
  ],
});

export default router;
