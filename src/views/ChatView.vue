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
          <el-col :span="24" style="margin: 20px 0px" ><h3 style="text-align: center;">Before you start a chat, please fill out the form below.</h3></el-col>
          <el-col :span="24">
        <el-form label-position="top" :model="categoryForm">
          <el-container style="display: grid; justify-content: center;">
          <el-form-item
            label="Name"
            class="login-input"
            v-on:keyup.enter="submitCategory"
          >
            <el-input
              v-model="categoryForm.guestName"
              placeholder="Please enter your name"
              size="large"
            />
          </el-form-item>
          <el-form-item
            label="Category"
            class="login-input"
          >
            <el-select-v2
              v-model="categoryForm.categoryId"
              :options="categoryOptions"
              placeholder="Please select a category"
              style="width: 300px;"
              value-key="id"
            />
          </el-form-item>
        </el-container>
          <el-form-item>
            <el-button plain class="login-btn green" @click="submitCategory"
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
            <el-col :span="21" class="header-row" align-self="center">
              <h2>nymbi CS</h2>
            </el-col>
          </el-row>
        </el-header>

        <el-main class="chat-main" id="chat-c" ref="chatBox">
          <el-row v-for="(value, index) in chats" :key="index">
            <el-col :span="24" v-if="value.name != user" class="left-point">
              <div class="message">
                <div class="message__outer">
                  <div class="message__inner__left">
                    <div class="message__bubble__left" dir="auto">
                      {{ value.message }}
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

          <div ref="endMessageRef" id="endChat"></div>
        </el-main>

        <el-footer>
          <el-row>
            <el-col :span="22"
              ><el-input
                v-model="input"
                v-on:keyup.enter="sendMessage"
                placeholder="Type your message..."
                size="large"
            /></el-col>
            <el-col :span="1" @click="sendMessage"
              ><el-button size="large">Send</el-button></el-col
            >
          </el-row>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "pinia";
import { useUserStore } from "../stores/user";
import { useChatStore } from "../stores/chat";

export default {
  name: "chat-view",
  data() {
    return {
      loading: true,
      input: "",
      categoryForm: {},
      chats: [
        // {
        //   name: "",
        //   message: "halo",
        // },
        // {
        //   name: "cs",
        //   message: "halo juga",
        // },
        // {
        //   name: "",
        //   message: "bisa bantu saya?",
        // },
        // {
        //   name: "",
        //   message: "saya butuh bantuan",
        // },
        // {
        //   name: "cs",
        //   message: "hmm...",
        // },
        // {
        //   name: "cs",
        //   message: "bantuin gak ya?",
        // },
        // {
        //   name: "",
        //   message: "ayo dong plissssssssssssssssssssssssssssssssssss",
        // },
        // {
        //   name: "cs",
        //   message: "iya deh",
        // },
      ],
    };
  },
  methods: {
    ...mapActions(useChatStore, ["getTicketCategories"]),
    scrollToEnd() {
      const list = document.getElementById("chat-c");
      list.lastElementChild.scrollIntoView(true);
    },
    sendMessage() {
      if (this.input != "") {
        this.chats.push({ name: this.user, message: this.input });
        this.input = "";
        window.setTimeout(() => {
          this.scrollToEnd();
        }, 10);
      }
    },
    submitCategory() {
      console.log(this.categoryForm)
    },
  },
  computed: {
    ...mapGetters(useUserStore, { user: "getUsername", token: "getToken" }),
    ...mapGetters(useChatStore, { roomId: "getRoomId", categoryOptions: "getCategoryOptions" }),
  },
  mounted() {
    if (this.token == null) {
      if (this.roomId != "") {
        console.log(this.roomId);
        // get room by id
      } else {
        this.getTicketCategories()
          .then(() => {
            this.loading = false;
          })
      }
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

.el-skeleton__item {
  /* background: linear-gradient(90deg,#909399 25%,#d1dbe5 37%,#fde2e2 63%); */
  height: 25px;
  margin-right: 10px;
  border-radius: 35px 35px 10px 35px;
  line-height: 185.17%;
  /* -webkit-animation: el-skeleton-loading 1.4s ease infinite !important;
  animation: el-skeleton-loading 1.4s ease infinite !important; */
}

/* @media (min-width: 1024px) { */
.chat-container {
  /* min-height: 100vh; */
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

.header-row {
  padding: 10px 10px 10px 0px;
}

.chat-main {
  display: flex;
  height: 500px;
  background-color: #d6d6d6;
}

#chat-c {
  overflow-x: hidden;
  overflow-y: scroll;
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
</style>
