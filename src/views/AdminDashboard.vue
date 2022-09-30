<template>
  <el-container class="layout-container-demo">
    <el-aside width="200px">
      <AdminMenu />
    </el-aside>

    <el-container>
      <el-header>
        <AdminHeader />
      </el-header>

      <el-main>
        <el-row class="title-row">
          <el-col :span="12" style="margin-right: 20px"
            ><h2>Guest Tickets</h2></el-col
          >
          <el-col :span="6"><h2>User Tickets</h2></el-col>
        </el-row>
        <el-row class="card-row">
          <el-col :span="6" class="card-1">
            <div class="card-container">
              <el-row>
                <el-col :span="12"><span>Open Ticket</span></el-col>
                <el-col :span="12"
                  ><span style="color: #222222">{{
                    roomCount.guestOpen
                  }}</span></el-col
                >
              </el-row>
            </div>
          </el-col>
          <el-col :span="6" class="card-2">
            <div class="card-container">
              <el-row>
                <el-col :span="12"><span>Closed Ticket</span></el-col>
                <el-col :span="12"
                  ><span style="color: #222222">{{
                    roomCount.guestClosed
                  }}</span></el-col
                >
              </el-row>
            </div>
          </el-col>
          <el-col :span="6" class="card-3">
            <div class="card-container">
              <el-row>
                <el-col :span="12"><span>Open Ticket</span></el-col>
                <el-col :span="12"
                  ><span style="color: #222222">{{
                    roomCount.userOpen
                  }}</span></el-col
                >
              </el-row>
            </div>
          </el-col>
          <el-col :span="5" class="card-4">
            <div class="card-container">
              <el-row>
                <el-col :span="12"><span>Closed Ticket</span></el-col>
                <el-col :span="12"
                  ><span style="color: #222222">{{
                    roomCount.userClosed
                  }}</span></el-col
                >
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row class="title-row" style="margin-top: 25px">
          <el-col :span="12" style="margin-right: 20px">
            <h2>Recent Ticket</h2>
          </el-col>
          <el-col :span="6">
            <h2>Online Admin</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-container>
              <el-main class="rooms-main" style="margin-right: 20px">
                <div v-if="loadingRoomList" class="rooms-loading">
                  <div class="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>

                <div v-else>
                  <div
                    v-if="recentRooms.length == 0"
                    class="empty-room-admin"
                    style="margin-top: 25%"
                  >
                    <el-empty> </el-empty>
                  </div>

                  <div
                    v-else
                    v-for="(value, index) in recentRooms"
                    :key="index"
                  >
                    <el-card class="box-card">
                      <el-row>
                        <el-col :span="22"
                          ><span>ID : {{ value.id }}</span></el-col
                        >
                        <el-col :span="2">
                          <span
                            v-if="value.status == 'open'"
                            class="status-open"
                            >{{
                              value.status[0].toUpperCase() +
                              value.status.substring(1)
                            }}</span
                          >
                          <span v-else class="status-closed">{{
                            value.status[0].toUpperCase() +
                            value.status.substring(1)
                          }}</span>
                        </el-col>
                      </el-row>
                      <el-divider />
                      <el-row>
                        <el-col :span="24"
                          ><span>
                            {{
                              value.messages[value.messages.length - 1].message
                            }}</span
                          ></el-col
                        >
                      </el-row>
                      <el-row>
                        <el-col :span="22"
                          ><span style="font-size: 12px">
                            {{
                              formatTime(
                                value.messages[value.messages.length - 1]
                                  .created_at
                              )
                            }}</span
                          ></el-col
                        >
                        <el-col :span="2"
                          ><span> {{ value.category_name }}</span></el-col
                        >
                      </el-row>
                    </el-card>
                  </div>
                </div>
              </el-main>
            </el-container>
          </el-col>

          <el-col :span="12">
            <el-container>
              <el-main class="rooms-main">
                <div v-if="loadingRoomList" class="rooms-loading">
                  <div class="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <div v-else>
                  <el-row align="middle">
                    <el-col :span="2">
                      <el-avatar
                        :src="profile.admin_profile.profile_picture"
                        :size="50"
                    /></el-col>
                    <el-col :span="22"
                      ><span>
                        {{ profile.username }} ({{
                          profile.admin_role.name
                        }})</span
                      ></el-col
                    >
                  </el-row>
                </div>
              </el-main>
            </el-container>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAdminStore } from "../stores/admin";
import AdminMenu from "../components/AdminMenu.vue";
import AdminHeader from "../components/AdminHeader.vue";
import moment from "moment";

export default {
  name: "admin-dashboard",
  data() {
    return {
      isCollapse: true,
      card1: "",
      loadingRoomList: true,
    };
  },
  components: {
    AdminMenu,
    AdminHeader,
  },
  computed: {
    ...mapState(useAdminStore, {
      token: "getAdminToken",
      roomCount: "getRoomCount",
      recentRooms: "getRecentRooms",
      profile: "getAdminProfile",
    }),
  },
  methods: {
    ...mapActions(useAdminStore, [
      "getTotalRoomCount",
      "getRecentTicketRooms",
      "getAdminData",
    ]),
    refreshRoomCount() {
      window.setInterval(() => {
        this.getTotalRoomCount();
      }, 60000);
    },
    formatTime(value) {
      return moment(value).format("YYYY-MM-DD hh:mm A");
    },
  },
  mounted() {
    this.getAdminData().then(() => {
      console.log(this.profile);
    });
    if (this.token == null) {
      this.$router.push("/admin/login");
    }
    this.getTotalRoomCount();
    this.refreshRoomCount();
    this.getRecentTicketRooms().then(() => {
      this.loadingRoomList = false;
    });
  },
};
</script>

<style scoped>
.layout-container-demo {
  width: 100vw;
  height: 100vh;
  /* padding: 2rem 0; */
}

.el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.card-1 {
  color: #ffffff;
  font-size: 25px;
  text-align: center;
  margin: 10px 10px 10px 0px;
  height: 150px;
  background: url("../assets/card1.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 10px;
}

.card-2 {
  color: #ffffff;
  font-size: 25px;
  text-align: center;
  margin: 10px 10px 10px 0px;
  height: 150px;
  background: url("../assets/card2.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 10px;
}

.card-3 {
  color: #ffffff;
  font-size: 25px;
  text-align: center;
  margin: 10px 10px 10px 0px;
  height: 150px;
  background: url("../assets/card3.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 10px;
}

.card-4 {
  color: #ffffff;
  font-size: 25px;
  text-align: center;
  margin: 10px 10px 10px 0px;
  height: 150px;
  background: url("../assets/card4.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 10px;
}

.card-container {
  width: 100%;
  position: absolute;
  /* left: 25%; */
  top: 35%;
}
</style>
