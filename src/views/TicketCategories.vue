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
        <el-table :data="categoryData">
          <el-table-column label="Date" prop="date" />
          <!-- <el-table-column label="Name" prop="name" >
              <template #default="scope">
                <el-input v-model="scope.row.name" size="large" placeholder="Type to search" />
              </template>
            </el-table-column> -->
          <el-table-column label="Name" prop="name" />
          <el-table-column align="right">
            <template #header>
              <el-button
                type="success"
                @click="
                  newCategory = {};
                  dialogFormVisible = true;
                "
                >Add</el-button
              >
            </template>
            <template #default="scope">
              <el-button @click="handleEdit(scope.row)">Edit</el-button>
              <el-button type="danger" @click="handleDelete(scope.row)"
                >Delete</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>

    <el-dialog v-model="dialogFormVisible">
      <el-form :model="newCategory" label-width="50px" @submit.prevent>
        <el-form-item label="Name">
          <el-input
            v-model="newCategory.name"
            placeholder="Category name"
            size="large"
            autofocus
            v-on:keyup.enter="submitCategory"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            @click="submitCategory"
            style="margin-top: 15px"
            >Submit</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useChatStore } from "../stores/chat";
import { useAdminStore } from "../stores/admin";
import { ElMessage, ElMessageBox } from "element-plus";
import AdminMenu from "../components/AdminMenu.vue";
import AdminHeader from "../components/AdminHeader.vue";
import moment from "moment";

export default {
  name: "admin-categories",
  components: {
    AdminMenu,
    AdminHeader,
  },
  data() {
    return {
      dialogFormVisible: false,
      newCategory: {},
    };
  },
  methods: {
    ...mapActions(useChatStore, ["getTicketCategories"]),
    ...mapActions(useAdminStore, [
      "addTicketCategory",
      "updateTicketCategory",
      "deleteTicketCategory",
    ]),
    formatTime(value) {
      return moment(value).format("YYYY-MM-DD hh:mm A");
    },
    submitCategory() {
      if (this.newCategory.id == undefined || this.newCategory.id == 0) {
        this.addTicketCategory(this.newCategory)
          .then((response) => {
            this.dialogFormVisible = false;
            this.newCategory = {};
            this.getTicketCategories().then(() => {
              this.categoryData.forEach((data) => {
                data.date = this.formatTime(data.created_at);
              });
              ElMessage.success(response.message);
            });
          })
          .catch((error) => {
            ElMessage.error(error.data.message);
          });
      } else {
        this.updateTicketCategory(this.newCategory)
          .then((response) => {
            this.dialogFormVisible = false;
            this.newCategory = {};
            this.getTicketCategories().then(() => {
              this.categoryData.forEach((data) => {
                data.date = this.formatTime(data.created_at);
              });
              ElMessage.success(response.message);
            });
          })
          .catch((error) => {
            ElMessage.error(error.data.message);
          });
      }
    },
    handleEdit(row) {
      this.newCategory = {
        id: row.id,
        name: row.name,
      };
      this.dialogFormVisible = true;
    },
    handleDelete(row) {
      ElMessageBox.confirm("Are you sure?", "Confirmation", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.deleteTicketCategory(row.id).then((response) => {
          this.getTicketCategories().then(() => {
            this.categoryData.forEach((data) => {
              data.date = this.formatTime(data.created_at);
            });
            ElMessage.success(response.message);
          });
        });
      });
    },
  },
  computed: {
    ...mapState(useChatStore, { categoryData: "getCategoryOptions" }),
  },
  mounted() {
    this.getTicketCategories().then(() => {
      this.categoryData.forEach((data) => {
        data.date = this.formatTime(data.created_at);
      });
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
</style>
