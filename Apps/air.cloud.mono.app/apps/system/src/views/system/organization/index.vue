<template>
  <div class="app-container">
    <air-table
      ref="dataTableRefLocal"
      :queryFormRef="queryFormRef"
      v-loading="loading"
      row-key="id"
      :page-size="0"
      :request="OrgAPI.query"
       :showExpandButtons="true"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @row-click="handleRowClick"
      :columns="tableColumns"
    >
      <template #table-query-form>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
          <el-form-item label="部门名称" prop="departmentName">
            <el-input placeholder="部门名称" v-model="queryParams.departmentName" clearable />
          </el-form-item>
        </el-form>
      </template>

      <template #toolbar-left>
        <el-button type="primary" @click="handleOpenDialog()">
          <el-icon>
            <Plus />
          </el-icon>
          添加
        </el-button>
      </template>

      <template #appId="{ row }">
        <el-tag type="primary">{{ appMap[row.appId] || row.appId }}</el-tag>
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link size="small" @click.stop="mp.openAssignment(row.id)">
          <el-icon>
            <User />
          </el-icon>
          职位管理
        </el-button>
        <el-button type="primary" link size="small" icon="edit" @click.stop="handleOpenDialog(undefined, row.id)">编辑</el-button>
        <el-button type="danger" link size="small" icon="delete" @click.stop="handleDelete(row.id)">删除</el-button>
      </template>
    </air-table>

    <el-drawer v-model="dialog.visible" :title="dialog.title" :size="drawerSize" @close="handleCloseDialog">
      <OrgForm ref="orgFormRefLocal" :formData="formData" @success="handleFormSuccess" @cancel="handleCloseDialog" />
    </el-drawer>
    <el-dialog v-model="mp.assignmentDialog.visible" :title="mp.assignmentDialog.title" width="70%" :destroy-on-close="true" @close="() => { mp.assignmentDialog.visible=false; mp.assignmentDeptId.value = null; }">
      <org-assignment :departmentId="mp.assignmentDeptId.value" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { OrgPageService as mp } from "./scripts/org.page";
import AirTable from "@root/base/components/air/AirTable/index.vue";
import { Plus, User } from '@element-plus/icons-vue';
import OrgAPI from "./apis/org.api";
import OrgForm from "./components/form.vue";
import OrgAssignment from './components/org-assignment.vue';

defineOptions({ name: "SysOrganization", inheritAttrs: false });

const dataTableRefLocal = ref(null);
const orgFormRefLocal = ref(null);

const loading = mp.loading;
const queryParams = mp.queryParams;
const queryFormRef = mp.queryFormRef;

const dialog = mp.dialog;
const drawerSize = mp.drawerSize;
const formData = mp.formData;
const tableColumns = mp.tableColumns;
const appMap = mp.appMap;

const handleRowClick = (row: any) => mp.handleRowClick(row);
const handleOpenDialog = (parentId?: string, id?: string) => mp.handleOpenDialog(parentId, id);
const handleCloseDialog = () => mp.handleCloseDialog();
const handleFormSuccess = () => mp.handleFormSuccess();
const handleDelete = (id: string) => mp.handleDelete(id);

onMounted(() => {
  mp.initTable(dataTableRefLocal, orgFormRefLocal);
});

onUnmounted(() => {
  mp.initTable(null as any, null as any);
});
</script>

<style scoped>
.el-card { padding: 12px; }
</style>
