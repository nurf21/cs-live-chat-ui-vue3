<template>
  <div class="chat-container">
    <div v-if="loading" class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>

    <div v-else>
      <el-page-header
        @back="
          () => {
            this.$router.push('/ticket/list');
          }
        "
        style="margin-bottom: 25px"
      >
        <template #content>
          <span class="text-large font-600 mr-3"> {{ room.id }} </span>
        </template>
      </el-page-header>

      <el-container>
        <el-header>
          <el-row>
            <el-col :span="3" class="header-row-icon" align-self="center">
              <img
                alt="cs logo"
                class="cs-logo"
                src="../assets/cs.png"
                width="40"
                height="40"
              />
            </el-col>
            <el-col :span="18" class="header-row" align-self="center">
              <h2>nymbi CS</h2>
            </el-col>
            <el-col :span="3" class="ellipsis-row-icon" align-self="center">
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
                    <el-dropdown-item @click="detailsDialogVisible = true"
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
          <el-row v-for="(value, index) in room.messages" :key="index">
            <el-col
              :span="24"
              v-if="value.sender_type == 'admin'"
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
              <span @click="this.$router.push('/ticket/list?action=new')"
                >Click here</span
              >
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
          <li><b>Created Date</b> {{ formatTime(room.created_at) }}</li>
        </ul>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailsDialogVisible = false">Close</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useChatStore } from "../stores/chat";
import { ElMessage, ElMessageBox } from "element-plus";
import moment from "moment";

export default {
  name: "chat-room",
  data() {
    return {
      detailsDialogVisible: false,
      loading: true,
      messageForm: { message_type: "text" },
    };
  },
  methods: {
    ...mapActions(useChatStore, [
      "getRoomByRoomID",
      "closeRoom",
      "sendMessageToRoom",
    ]),
    scrollToEnd() {
      const list = document.getElementById("chat-c");
      list.lastElementChild.scrollIntoView(true);
    },
    formatTime(value) {
      return moment(value).format("YYYY-MM-DD hh:mm A");
    },
    closeRoomClicked() {
      ElMessageBox.confirm(
        "You and our customer service won't be able to reply this chat once it's closed. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).then(() => {
        this.closeRoom(this.room.id)
          .then(() => {
            this.getRoomByRoomID(this.room.id);
            window.setTimeout(() => {
              this.scrollToEnd();
            }, 10);
          })
          .catch(() => {
            ElMessage.error("Unexpected error");
          });
      });
    },
    sendMessage() {
      if (this.messageForm.message != "") {
        this.messageForm.room_id = this.room.id;
        this.sendMessageToRoom(this.messageForm)
          .then(() => {
            this.room.messages.push({
              sender_type: "guest",
              message: this.messageForm.message,
            });
            this.messageForm.message = "";
            window.setTimeout(() => {
              this.scrollToEnd();
            }, 10);
          })
          .catch(() => {
            ElMessage.error("Unexpected error");
          });
      }
    },
  },
  computed: {
    ...mapState(useChatStore, {
      room: "getRoom",
    }),
  },
  mounted() {
    console.log("================================ params =============================")
    console.log(this.route.params.id)
    this.getRoomByRoomID(this.$route.params.id)
      .then(() => {
        this.loading = false;
        window.setTimeout(() => {
          this.scrollToEnd();
        }, 10);
      })
      .catch(() => {
        ElMessage.error("Unexpected error");
      });
  },
};
</script>
