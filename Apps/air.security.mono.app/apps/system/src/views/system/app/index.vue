<template>
  <div class="app-container">
    <air-table
      ref="dataTableRefLocal"
      :queryFormRef="queryFormRef"
      v-loading="loading"
      row-key="id"
      :request="AppAPI.query"
      :after-request="afterRequest"
      @row-click="handleRowClick"
      :columns="tableColumns"
    >
      <template #table-query-form>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
          <el-form-item label="应用名称" prop="name">
            <el-input placeholder="应用名称" v-model="queryParams.name" clearable />
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
      <template #operation="{ row }">
        <el-button
            type="primary"
            link
            size="small"
            icon="edit"
            @click.stop="handleOpenDialog(undefined, row.id)"
          >
            编辑
          </el-button>

          <el-button
            type="danger"
            link
            size="small"
            icon="delete"
            @click.stop="handleDelete(row.id)"
          >
            删除
          </el-button>
      </template>
    </air-table>

    <el-drawer v-model="dialog.visible" :title="dialog.title" :size="drawerSize" @close="handleCloseDialog">
      <AppForm ref="menuFormRefLocal" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import AirTable from '@root/base/components/air/AirTable/index.vue';
import AppAPI from './apis/app.api';
import { AppPageService } from './scripts/app.page';
import AppForm from './components/form.vue';

const mp = AppPageService;
const loading = mp.loading;
const queryParams = mp.queryParams;
const queryFormRef = mp.queryFormRef;
const dataTableRefLocal = ref(null);
const menuFormRefLocal = ref(null);
const dialog = mp.dialog;
const drawerSize = mp.drawerSize;
const formData = mp.formData;
const tableColumns = mp.tableColumns;
const afterRequest = mp.afterRequest;

onMounted(() => {
  mp.initTable(dataTableRefLocal, menuFormRefLocal);
});
onUnmounted(() => {
  mp.initTable(null as any, null as any);
});

const handleRowClick = (row: any) => mp.handleRowClick(row);
const handleOpenDialog = (parentId?: string, id?: string) => mp.handleOpenDialog(parentId, id);
const handleCloseDialog = () => mp.handleCloseDialog();
const handleDelete = (id: string) => mp.handleDelete(id);
</script>
