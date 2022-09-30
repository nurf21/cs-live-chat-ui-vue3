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
        <el-tabs type="border-card">
          <el-tab-pane label="Default Messages">
            <el-row v-for="(value, index) in defaultMessages" :key="index">
              <el-col
                :span="24"
                class="left-point"
                v-if="showEditMessage[index]"
              >
                <div class="message">
                  <div class="message__outer">
                    <div class="message__inner__left">
                      <el-form
                        :model="editMessageForm[index]"
                        style="margin-top: 30px"
                      >
                        <el-form-item style="width: 500px">
                          <el-input
                            v-model="editMessageForm[index].message"
                            type="textarea"
                            :rows="5"
                            placeholder="Type your message"
                            :autosize="{ minRows: 5, maxRows: 10 }"
                          />
                        </el-form-item>
                      </el-form>
                      <div class="message__spacer__buttons__edit">
                        <el-button
                          type="success"
                          size="default"
                          circle
                          @click="submitEditDefaultMessage(index)"
                        >
                          <template #icon>
                            <el-icon><Check /></el-icon>
                          </template>
                        </el-button>

                        <el-button
                          type="danger"
                          size="default"
                          circle
                          @click="showEditMessage[index] = false"
                        >
                          <template #icon>
                            <el-icon><Close /></el-icon>
                          </template>
                        </el-button>
                      </div>
                    </div>
                    <div class="message__status">
                      <span class="avatar"></span>
                    </div>
                  </div>
                </div>
              </el-col>

              <el-col :span="24" class="left-point" v-else>
                <div class="message">
                  <div class="message__outer">
                    <div class="message__inner__left">
                      <div class="message__bubble__left" dir="auto">
                        {{ value.message }}
                      </div>
                      <div class="message__spacer__buttons">
                        <el-button
                          type="primary"
                          size="default"
                          circle
                          @click="showEditMessage[index] = true"
                        >
                          <template #icon>
                            <el-icon><Edit /></el-icon>
                          </template>
                        </el-button>

                        <el-button
                          type="danger"
                          size="default"
                          circle
                          @click="trashMessage(value.id)"
                        >
                          <template #icon>
                            <el-icon><Delete /></el-icon>
                          </template>
                        </el-button>
                      </div>
                    </div>
                    <div class="message__status">
                      <span class="avatar"></span>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>

            <el-button
              type="success"
              size="large"
              circle
              v-if="showAddButton"
              @click="showAddButton = false"
              style="margin-top: 15px"
            >
              <template #icon>
                <el-icon><Plus /></el-icon>
              </template>
            </el-button>

            <el-form
              :model="defaultMessageForm"
              v-else
              style="margin-top: 30px"
            >
              <el-form-item style="width: 500px">
                <el-input
                  v-model="defaultMessageForm.message"
                  type="textarea"
                  :rows="5"
                  placeholder="Type your message"
                  :autosize="{ minRows: 5, maxRows: 10 }"
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmitDefault"
                  >Submit</el-button
                >
                <el-button @click="onCancelDefault">Cancel</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAdminStore } from "../stores/admin";
import AdminMenu from "../components/AdminMenu.vue";
import AdminHeader from "../components/AdminHeader.vue";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: "admin-settings",
  components: {
    AdminMenu,
    AdminHeader,
  },
  data() {
    return {
      showAddButton: true,
      defaultMessageForm: {
        message_type: "text",
      },
      showEditMessage: [],
      editMessageForm: [],
    };
  },
  methods: {
    ...mapActions(useAdminStore, [
      "addTicketDefaultMessage",
      "getTicketDefaultMessages",
      "updateTicketDefaultMessage",
      "deleteTicketDefaultMessage",
    ]),
    onSubmitDefault() {
      this.addTicketDefaultMessage(this.defaultMessageForm)
        .then(() => {
          this.getTicketDefaultMessages().then((response) => {
            this.showEditMessage = [];
            for (let i = 0; i < response.data.length; i++) {
              this.showEditMessage.push(false);
              this.editMessageForm.push({
                id: response.data[i].id,
                message_type: response.data[i].message_type,
                message: response.data[i].message,
              });
            }
            this.onCancelDefault();
            ElMessage({
              message: "success",
              type: "success",
            });
          });
        })
        .catch((error) => {
          ElMessage({
            message: error.data.message,
            type: "error",
          });
        });
    },
    onCancelDefault() {
      (this.defaultMessageForm.message = ""), (this.showAddButton = true);
    },
    submitEditDefaultMessage(index) {
      this.updateTicketDefaultMessage(this.editMessageForm[index]).then(() => {
        this.getTicketDefaultMessages().then((response) => {
          this.showEditMessage = [];
          for (let i = 0; i < response.data.length; i++) {
            this.showEditMessage.push(false);
            this.editMessageForm.push({
              id: response.data[i].id,
              message_type: response.data[i].message_type,
              message: response.data[i].message,
            });
          }
          ElMessage({
            message: "success",
            type: "success",
          });
        });
      });
    },
    trashMessage(id) {
      ElMessageBox.confirm("Are you sure?", "Confirmation", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.deleteTicketDefaultMessage(id).then(() => {
          this.getTicketDefaultMessages().then((response) => {
            this.showEditMessage = [];
            for (let i = 0; i < response.data.length; i++) {
              this.showEditMessage.push(false);
              this.editMessageForm.push({
                id: response.data[i].id,
                message_type: response.data[i].message_type,
                message: response.data[i].message,
              });
            }
            this.onCancelDefault();
            ElMessage({
              message: "success",
              type: "success",
            });
          });
        });
      });
    },
  },
  computed: {
    ...mapState(useAdminStore, { defaultMessages: "getDefaultMessages" }),
  },
  mounted() {
    this.getTicketDefaultMessages().then((response) => {
      this.showEditMessage = [];
      for (let i = 0; i < response.data.length; i++) {
        this.showEditMessage.push(false);
        this.editMessageForm.push({
          id: response.data[i].id,
          message_type: response.data[i].message_type,
          message: response.data[i].message,
        });
      }
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

.el-tabs {
  height: 100%;
}

.message__spacer__buttons {
  top: 25%;
  margin-left: 15px;
}

.message__spacer__buttons__edit {
  top: 42.5%;
  margin-left: 15px;
}
</style>
