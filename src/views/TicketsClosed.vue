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
        <el-row>
          <el-col :span="6" class="rooms-col">
            <div v-for="(value, index) in closedRooms" :key="index">
              <el-card style="cursor: pointer" @click="selectRoom(value)">
                <el-row>
                  <el-col :span="4"
                    ><el-avatar :src="value.profile_picture" :size="50"
                  /></el-col>
                  <el-col :span="8">
                    <span v-if="value.guest_name == ``">{{
                      value.username
                    }}</span>
                    <span v-else>{{ value.guest_name }}</span>
                    <br />
                    <span v-if="value.guest_name == ``">{{ value.email }}</span>
                    <br />
                    <!-- <el-col :span="22"><span> {{ value.category_name }}</span></el-col> -->
                  </el-col>
                </el-row>
                <el-divider />
                <el-row>
                  <el-col :span="21"
                    ><span> {{ value.last_message.message }}</span></el-col
                  >
                  <el-col :span="3"><el-badge :value="value.unread" /></el-col>
                </el-row>
                <el-row>
                  <el-col :span="22"
                    ><span style="font-size: 12px">
                      {{ formatTime(value.last_message.created_at) }}</span
                    ></el-col
                  >
                </el-row>
              </el-card>
            </div>
          </el-col>
          <el-col :offset="1" :span="16">
            <div v-if="roomSelected" class="chat-container">
                <el-container>
                  <el-header>
                    <el-row>
                      <el-col
                        :span="2"
                        class="header-row-icon"
                        align-self="center"
                      >
                      <el-avatar :src="room.profile_picture" :size="40"/>
                      </el-col>
                      <el-col :span="18" class="header-row" align-self="center">
                        <h2>{{room.username}} ({{room.email}})</h2>
                      </el-col>
                      <el-col
                        :offset="2"
                        :span="1"
                        class="ellipsis-row-icon"
                        align-self="center"
                      >
                        <el-dropdown>
                          <img
                            alt="cs logo"
                            class="cs-logo"
                            src="../assets/ellipsis.png"
                            width="40"
                            height="40"
                          />
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item
                                @click="detailsDialogVisible = true"
                                >Details</el-dropdown-item
                              >
                              <el-dropdown-item @click="closeRoomClicked"
                                >Close Room</el-dropdown-item
                              >
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                      </el-col>
                    </el-row>
                  </el-header>

                  <el-main class="chat-main" id="chat-c" ref="chatBox">
                    <el-row
                      v-for="(value, index) in messages"
                      :key="index"
                    >
                      <el-col
                        :span="24"
                        v-if="value.sender_type != 'admin'"
                        class="left-point"
                      >
                        <div class="message">
                          <div class="message__outer">
                            <div class="message__inner__left">
                              <div class="message__bubble__left" dir="auto">
                                {{ value.message }}
                                <p class="message-time">
                                  {{ formatTime(value.created_at) }}
                                </p>
                              </div>
                              <div class="message__spacer"></div>
                            </div>
                            <div class="message__status">
                              <span class="avatar"></span>
                            </div>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="24" v-else>
                        <div class="message">
                          <div class="message__outer">
                            <div class="message__inner">
                              <div class="message__bubble" dir="auto">
                                {{ value.message }}
                                <p class="message-time message-time-right">
                                  {{ formatTime(value.created_at) }}
                                </p>
                              </div>
                              <div class="message__spacer"></div>
                            </div>
                            <div class="message__status">
                              <span class="avatar"></span>
                            </div>
                          </div>
                        </div>
                      </el-col>
                    </el-row>

                    <div v-if="room.status == 'closed'" class="closed-message">
                      <p>
                        This room is already closed.
                        <!-- <span
                          @click="this.$router.push('/ticket/list?action=new')"
                          >Click here</span
                        > -->
                        to start a new chat
                      </p>
                    </div>
                    <div ref="endMessageRef" id="endChat"></div>
                  </el-main>

                  <el-footer>
                    <el-row v-if="room.status == 'open'">
                      <el-col :span="22"
                        ><el-input
                          v-model="messageForm.message"
                          v-on:keyup.enter="sendMessage"
                          placeholder="Type your message..."
                          size="large"
                      /></el-col>
                      <el-col :span="1" @click="sendMessage"
                        ><el-button size="large">Send</el-button></el-col
                      >
                    </el-row>

                    <el-row v-else>
                      <el-col :span="22"
                        ><el-input
                          v-model="messageForm.message"
                          v-on:keyup.enter="sendMessage"
                          placeholder="You cannot send message anymore"
                          size="large"
                          disabled
                      /></el-col>
                      <el-col :span="1"
                        ><el-button size="large" disabled>Send</el-button></el-col
                      >
                    </el-row>
                  </el-footer>
                </el-container>
              </div>

              <el-dialog
                v-model="detailsDialogVisible"
                title="Room Details"
                width="25%"
                align-center
              >
                <span>
                  <ul class="alignMe" style="list-style: none; padding: 0px">
                    <li><b>ID</b> {{ room.id }}</li>
                    <li><b>Category</b> {{ room.category_name }}</li>
                    <li>
                      <b>Created Date</b> {{ formatTime(room.created_at) }}
                    </li>
                  </ul>
                </span>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="detailsDialogVisible = false"
                      >Close</el-button
                    >
                  </span>
                </template>
              </el-dialog>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAdminStore } from "../stores/admin";
// import { useSocketStore } from "../stores/socket-io";
import AdminMenu from "../components/AdminMenu.vue";
import AdminHeader from "../components/AdminHeader.vue";
import moment from "moment";

export default {
  name: "admin-tickets-closed",
  data() {
    return {
      room: {},
      roomSelected: false,
      detailsDialogVisible: false,
      messageForm: {},
    };
  },
  components: {
    AdminMenu,
    AdminHeader,
  },
  methods: {
    ...mapActions(useAdminStore, ["getClosedTicketRooms", "getTicketMessages"]),
    formatTime(value) {
      return moment(value).format("YYYY-MM-DD hh:mm A");
    },
    scrollToEnd() {
      const list = document.getElementById("chat-c");
      list.lastElementChild.scrollIntoView(true);
    },
    selectRoom(room) {
      this.room = room
      this.getTicketMessages(room.id)
        .then(() => {
          this.roomSelected = true;
          window.setTimeout(() => {
              this.scrollToEnd();
            }, 10);
        })
    },
  },
  computed: {
    ...mapState(useAdminStore, {
      closedRooms: "getClosedRoomsState",
      messages: "getMessagesState"
    }),
  },
  mounted() {
    this.getClosedTicketRooms();
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

.rooms-col {
  height: 900px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
