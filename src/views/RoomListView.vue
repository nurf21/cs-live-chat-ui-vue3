<template>
  <div class="rooms-container">
    <el-page-header
      @back="
        () => {
          this.$router.push('/');
        }
      "
      style="margin-bottom: 25px"
    >
      <template #content>
        <span class="text-large font-600 mr-3"> Ticket List </span>
      </template>
    </el-page-header>

    <el-container>
      <el-main class="rooms-main">
        <el-row>
          <el-col :span="21">
            <el-input v-model="searchParam" class="w-50 m-2" placeholder="Search" size="large" v-on:keyup.enter="searchRoom">
              <template #prefix>
                <el-icon class="el-input__icon"><search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="2" :offset="1">
            <el-button
              class="orange"
              style="
                border: #fc5d38 solid;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 25px;
              "
              @click="showCreateRoomForm"
              >+</el-button
            >
          </el-col>
        </el-row>

        <div v-if="loadingRoomList" class="rooms-loading">
          <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        <div v-else>
          <div v-if="rooms.length == 0" class="empty-div">
            <el-empty>
              <el-button
                @click="showCreateRoomForm"
                class="orange"
                style="border-color: #fc5d38"
                >Create a new ticket</el-button
              >
            </el-empty>
          </div>

          <div v-else v-for="(value, index) in rooms" :key="index">
            <el-card
              class="box-card"
              @click="
                leaveRoomList();
                this.$router.push(`/room/${value.id}`);
              "
            >
              <el-row>
                <el-col :span="22"
                  ><span>ID : {{ value.id }}</span></el-col
                >
                <el-col :span="2">
                  <span v-if="value.status == 'open'" class="status-open">{{
                    value.status[0].toUpperCase() + value.status.substring(1)
                  }}</span>
                  <span v-else class="status-closed">{{
                    value.status[0].toUpperCase() + value.status.substring(1)
                  }}</span>
                </el-col>
              </el-row>
              <el-divider />
              <el-row>
                <el-col :span="24"
                  ><span>
                    {{
                      value.last_message.message
                    }}</span
                  ></el-col
                >
              </el-row>
              <!-- <div class="separator"></div> -->
              <el-row>
                <el-col :span="22"
                  ><span style="font-size: 12px">
                    {{
                      formatTime(
                        value.last_message.created_at
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

    <el-dialog v-model="dialogFormVisible" width="25%" align-center>
      <div v-if="loadingCreateRoom" style="padding: 70px auto">
        <div class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <el-form v-else :model="categoryForm">
        <el-container
          style="display: grid; justify-content: center; margin-top: 25px"
        >
          <el-form-item class="login-input">
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
          <el-button plain class="login-btn orange" @click="submitCategory"
            >Submit</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useChatStore } from "../stores/chat";
import { useSocketStore } from "../stores/socket-io";
import { ElMessage } from "element-plus";
import moment from "moment";

export default {
  name: "room-list",
  data() {
    return {
      dialogFormVisible: false,
      categoryForm: {},
      loadingCreateRoom: false,
      loadingRoomList: true,
      searchParam: "",
    };
  },
  computed: {
    ...mapState(useChatStore, {
      rooms: "getRooms",
      categoryOptions: "getCategoryOptions",
    }),
  },
  methods: {
    ...mapActions(useChatStore, [
      "getTicketCategories",
      "createTicketRoom",
      "getRoomsByToken",
    ]),
    ...mapActions(useSocketStore, ["joinRoomList", "leaveRoomList"]),
    showCreateRoomForm() {
      this.loadingCreateRoom = true;
      this.dialogFormVisible = true;
      this.getTicketCategories().then(() => {
        this.loadingCreateRoom = false;
      });
    },
    searchRoom() {
      this.loadingRoomList = true;
      this.getRoomsByToken(this.searchParam).then(() => {
      this.loadingRoomList = false;
    });
    },
    submitCategory() {
      this.loadingCreateRoom = true;
      this.createTicketRoom(this.categoryForm)
        .then((response) => {
          this.leaveRoomList();
          this.$router.push(`/room/${response.data.room_id}`);
        })
        .catch(() => {
          ElMessage.error("Unexpected error");
        });
    },
    formatTime(value) {
      return moment(value).format("YYYY-MM-DD hh:mm A");
    },
  },
  mounted() {
    if (this.$route.query.action == "new") {
      this.dialogFormVisible = true;
      this.showCreateRoomForm();
    }

    this.getRoomsByToken(this.searchParam).then(() => {
      this.loadingRoomList = false;
      this.joinRoomList();
    });
  },
};
</script>

<style>
.rooms-container {
  display: grid;
  align-items: center;
}

.rooms-main {
  /* display: flex; */
  height: 700px;
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.16), 0 4px 6px rgba(0, 0, 0, 0.45);
  border-radius: 10px;
  overflow-x: hidden;
  overflow-y: auto;
}

.empty-div {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.box-card {
  margin: 25px auto;
  height: auto;
  cursor: pointer;

  -webkit-tap-highlight-color: transparent;
  transform: scale(1);
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.box-card:after {
  background-color: #f2f2f2;
  content: "";
  height: 10px;
  position: absolute;
  top: 390px;
  width: 100%;
}

.box-card:hover {
  transform: scale(1.025);
}

.separator {
  margin: 15px 0;
}

.status-open {
  font-size: 12px;
  border: rgb(2, 185, 2) solid;
  background: rgb(2, 185, 2);
  border-radius: 25%;
  padding: 5px;
}

.status-closed {
  font-size: 12px;
  border: rgb(255, 43, 43) solid;
  background: rgb(255, 43, 43);
  border-radius: 25%;
  padding: 5px;
}

.rooms-loading {
  position: absolute;
  top: 50%;
  left: 50%;
}
</style>
