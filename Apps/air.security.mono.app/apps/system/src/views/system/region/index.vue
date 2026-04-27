<template>
  <div class="app-container">
    <air-table
      ref="dataTableRefLocal"
      :queryFormRef="queryFormRef"
      v-loading="loading"
      row-key="id"
      :page-size="0"
      :request="RegionAPI.query"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @row-click="handleRowClick"
      :columns="tableColumns"
    >
      <template #table-query-form>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
          <el-form-item label="区域名称" prop="name">
            <el-input placeholder="区域名称" v-model="queryParams.name" clearable />
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

      <template #type="{ row }">
        <el-tag v-if="row.type === RegionTypeEnum.District" type="warning">市区</el-tag>
        <el-tag v-else-if="row.type === RegionTypeEnum.County" type="success">县区</el-tag>
        <el-tag v-else-if="row.type === RegionTypeEnum.Town" type="info">乡镇/街道</el-tag>
        <el-tag v-else type="info">村/社居委</el-tag>
      </template>

      <template #appId="{ row }">
        <el-tag type="primary">{{ appMap[row.appId] || row.appId }}</el-tag>
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link size="small" icon="edit" @click.stop="handleOpenDialog(undefined, row.id)">编辑</el-button>

        <el-button type="danger" link size="small" icon="delete" @click.stop="handleDelete(row.id)">删除</el-button>
      </template>
    </air-table>

    <el-drawer v-model="dialog.visible" :title="dialog.title" :size="drawerSize" @close="handleCloseDialog">
      <RegionForm
        ref="regionFormRefLocal"
        :formData="formData"
        :RegionTypeEnum="RegionTypeEnum"
        @success="handleFormSuccess"
        @cancel="handleCloseDialog"
      />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { RegionPageService as mp } from "./scripts/region.page";
import { RegionTypeEnum } from "./dtos/region.dto";
import AirTable from "@root/base/components/air/AirTable/index.vue";
import { Plus } from '@element-plus/icons-vue';
import RegionAPI from "./apis/region.api";
import RegionForm from "./components/form.vue";

defineOptions({ name: "SysRegion", inheritAttrs: false });

const dataTableRefLocal = ref(null);
const regionFormRefLocal = ref(null);

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
const handleSubmit = () => mp.handleSubmit();

const RegionAPIRef = RegionAPI;

onMounted(() => {
  mp.initTable(dataTableRefLocal, regionFormRefLocal);
});

onUnmounted(() => {
  mp.initTable(null as any, null as any);
});
</script>

<style scoped>
.el-card { padding: 12px; }
</style>
