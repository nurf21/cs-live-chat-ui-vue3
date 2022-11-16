<template>
  <div class="chat-container">
    <div v-if="loading" class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>

    <div v-else>
      <el-container v-if="roomId == ''">
        <el-row>
          <el-col :span="24" style="margin: 20px 0px"
            ><h3 style="text-align: center">
              Before you start a chat, please fill out the form below.
            </h3></el-col
          >
          <el-col :span="24">
            <el-form label-position="top" :model="categoryForm">
              <el-container style="display: grid; justify-content: center">
                <el-form-item
                  label="Name"
                  class="login-input"
                  v-on:keyup.enter="submitCategory"
                >
                  <el-input
                    v-model="categoryForm.guest_name"
                    placeholder="Please enter your name"
                    size="large"
                  />
                </el-form-item>
                <el-form-item label="Category" class="login-input">
                  <el-select-v2
                    v-model="categoryForm.category_id"
                    :options="categoryOptions"
                    placeholder="Please select a category"
                    style="width: 300px"
                    value-key="id"
                    size="large"
                  />
                </el-form-item>
              </el-container>
              <el-form-item>
                <el-button
                  plain
                  class="login-btn orange"
                  @click="submitCategory"
                  >Submit</el-button
                >
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-container>

      <el-container v-else>
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
                    <el-dropdown-item @click="closeRoom"
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
              <span @click="newChat">Click here</span> to start a new chat
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
import { mapState, mapActions } from "pinia";
import { useUserStore } from "../stores/user";
import { useChatStore } from "../stores/chat";
import { useSocketStore } from "../stores/socket-io";
import { ElMessage, ElMessageBox } from "element-plus";
import moment from "moment";

export default {
  name: "chat-view",
  data() {
    return {
      loading: true,
      messageForm: { message_type: "text" },
      categoryForm: {},
      detailsDialogVisible: false,
    };
  },
  methods: {
    ...mapActions(useChatStore, [
      "getTicketCategories",
      "guestCreateTicketRoom",
      "guestGetRoomByRoomID",
      "deleteRoomAndRoomId",
      "guestSendMessageToRoom",
      "guestCloseRoom",
    ]),
    ...mapActions(useSocketStore, ["joinRoom", "leaveRoom"]),
    scrollToEnd() {
      const list = document.getElementById("chat-c");
      list.lastElementChild.scrollIntoView(true);
    },
    formatTime(value) {
      return moment(value).format("YYYY-MM-DD hh:mm A");
    },
    sendMessage() {
      if (this.messageForm.message != "") {
        this.messageForm.room_id = this.roomId;
        this.guestSendMessageToRoom(this.messageForm)
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
    submitCategory() {
      this.loading = true;
      this.guestCreateTicketRoom(this.categoryForm)
        .then(() => {
          this.guestGetRoomByRoomID(this.roomId).then(() => {
            this.loading = false;
            window.setTimeout(() => {
              this.scrollToEnd();
            }, 10);
            this.joinRoom(this.roomId);
          });
        })
        .catch((error) => {
          if (error.data.message.includes("GuestName")) {
            ElMessage.error("Please enter your name");
          } else if (error.data.message.includes("Category")) {
            ElMessage.error("Please select a category");
          } else {
            ElMessage.error("Unexpected error");
          }
        });
    },
    newChat() {
      ElMessageBox.confirm(
        "You won't be able to view this chat history again because you are not logged in. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).then(() => {
        this.loading = true;
        this.deleteRoomAndRoomId();
        this.getTicketCategories().then(() => {
          this.loading = false;
        });
      });
    },
    closeRoom() {
      ElMessageBox.confirm(
        "You and our customer service won't be able to reply this chat once it's closed. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).then(() => {
        this.guestCloseRoom(this.roomId)
          .then(() => {
            this.guestGetRoomByRoomID(this.roomId);
            window.setTimeout(() => {
              this.scrollToEnd();
            }, 10);
            this.leaveRoom(this.roomId);
          })
          .catch(() => {
            ElMessage.error("Unexpected error");
          });
      });
    },
  },
  computed: {
    ...mapState(useUserStore, { user: "getUsername", token: "getToken" }),
    ...mapState(useChatStore, {
      roomId: "getRoomId",
      room: "getRoom",
      categoryOptions: "getCategoryOptions",
    }),
  },
  mounted() {
    if (this.token == null) {
      if (this.roomId != "") {
        this.guestGetRoomByRoomID(this.roomId)
          .then(() => {
            this.loading = false;
            window.setTimeout(() => {
              this.scrollToEnd();
            }, 10);
            this.joinRoom(this.roomId);
          })
          .catch(() => {
            ElMessage.error("Unexpected error");
          });
      } else {
        this.getTicketCategories().then(() => {
          this.loading = false;
        });
      }
    } else {
      this.$router.push("/ticket/list");
    }
  },
};
</script>

<style>
:root {
  --main-light-color: #f9bbb1;
  --main-dark-color: #481b0b;
  --main-background-color: black;
}

.chat-container {
  display: grid;
  align-items: center;
}

.el-header {
  padding-left: 0px;
  padding-right: 0px;
  background-color: #fc5d38;
  border-radius: 10px 10px 0px 0px;
}

.header-row-icon {
  padding: 10px 0px 10px 20px;
}

.ellipsis-row-icon {
  padding: 10px 0px 10px 20px;
  cursor: pointer;
  transition: all 0.3s linear;
}

.ellipsis-row-icon:hover {
  transform: scale(1.1);
}

.header-row {
  padding: 10px 10px 10px 0px;
}

.chat-main {
  /* display: flex; */
  height: 700px;
  background-color: #d6d6d6;
}

#chat-c {
  overflow-x: hidden;
  overflow-y: auto;
  /* height: 500px; */
}

.message__outer {
  display: flex;
}

.message__inner {
  flex: 1;
  display: flex;
  flex-direction: row-reverse;
}

.message__inner__left {
  flex: 1;
  display: flex;
  flex-direction: row;
}

.message__actions {
  width: 67px;
  padding-right: 5px;
}

.message__spacer {
  flex: 1;
}

.message__bubble {
  color: white;
  line-height: 185.17%;
  background: #fc5d38;
  padding: 10px 30px;
  max-width: calc(100% - 67px);
  overflow-wrap: break-word;
  border-radius: 35px 35px 10px 35px;
  margin: 10px 0px;
}

.message__bubble__left {
  color: black;
  line-height: 185.17%;
  padding: 10px 30px;
  background: white;
  max-width: calc(100% - 67px);
  overflow-wrap: break-word;
  border-radius: 35px 35px 35px 10px;
  margin: 10px 0px;
}

.message--first .message__bubble {
  border-end-end-radius: 4px;
}

/* Middle message */
.message--middle .message__bubble {
  border-start-end-radius: 4px;
  border-end-end-radius: 4px;
}

/* Last message */
.message--last .message__bubble {
  border-start-end-radius: 4px;
}

.message__actions {
  flex-shrink: 0;
}

.message__status {
  width: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.message-time {
  color: black;
  font-size: 11px;
}

.message-time-right {
  color: white;
}

.closed-message {
  margin: 10px auto 0px auto;
  width: 50%;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  font-size: 14px;
  color: white;
  padding: 10px;
  text-align: center;
}

.closed-message span {
  color: #fc5d38;
  font-weight: bolder;
  cursor: pointer;
}

.lds-ring {
  display: flex;
  /* position: relative; */
  width: 80px;
  height: 80px;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -50px 0 0 -50px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fc5d38;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fc5d38 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.el-footer {
  margin-top: 15px;
  padding-left: 0px;
}

.alignMe b {
  display: inline-block;
  width: 35%;
  position: relative;
  padding-right: 10px; /* Ensures colon does not overlay the text */
}

.alignMe b::after {
  content: ":";
  position: absolute;
  right: 10px;
}
</style>
