<template>
  <div class="app-container">
    <!-- 搜索区域 已移动到 air-table 的 table-query-form 插槽 -->
      <air-table
          ref="dataTableRefLocal"
        :queryFormRef="queryFormRef"
        v-loading="loading"
        row-key="id"
        :page-size="0"
        :request="MenuAPI.query"
        :after-request="afterRequest"
        :tree-props="{
          children: 'children',
          hasChildren: 'hasChildren',
        }"
        :showExpandButtons="true"
        @row-click="handleRowClick"
        :columns="tableColumns"
      >
        <template #table-query-form>
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="菜单名称" prop="info">
              <el-input placeholder="菜单名称" v-model="queryParams.info" clearable />
            </el-form-item>
          </el-form>
        </template>
        <template #toolbar-left>
          <el-button
            type="primary"
            @click="handleOpenDialog()">
            <el-icon>
              <Plus />
            </el-icon>
            添加
          </el-button>
        </template>
        <!-- 类型列 -->
        <template #type="{ row }">
          <el-tag v-if="row.type === MenuTypeEnum.CATALOG" type="warning">目录</el-tag>
          <el-tag v-else-if="row.type === MenuTypeEnum.MENU" type="success">菜单</el-tag>
          <el-tag v-else-if="row.type === MenuTypeEnum.BUTTON" type="danger">按钮</el-tag>
          <el-tag v-else type="info">外链</el-tag>
        </template>

        <!-- 状态列 -->
        <template #status="{ row }">
          <el-tag v-if="row.hide === 0" type="success">显示</el-tag>
          <el-tag v-else type="info">隐藏</el-tag>
        </template>

        <!-- 操作列 -->
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
    <el-drawer
      v-model="dialog.visible"
      :title="dialog.title"
      :size="drawerSize"
      @close="handleCloseDialog"
    >
      <MenuForm
        ref="menuFormRefLocal"
        :formData="formData"
        :MenuTypeEnum="MenuTypeEnum"
        @menu-type-change="handleMenuTypeChange"
        @success="handleFormSuccess"
        @cancel="handleCloseDialog"
      />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { MenuPageService } from "./scripts/menu.page";
import { MenuTypeEnum } from "@root/base/enums/system/menu-enum";
import AirTable from "@root/base/components/air/AirTable/index.vue";
import { Plus } from '@element-plus/icons-vue';
import MenuForm from "./components/form.vue";
import MenuAPI from "./apis/menu.api";
defineOptions({
  name: "SysMenu",
  inheritAttrs: false,
});

const dataTableRefLocal = ref(null);
const menuFormRefLocal = ref(null);


const mp = MenuPageService;
const loading = mp.loading;
const queryParams = mp.queryParams;
const queryFormRef = mp.queryFormRef;
// local template refs; will be passed into service via initTable()

const dialog = mp.dialog;
const drawerSize = mp.drawerSize;
const formData = mp.formData;
const tableColumns = mp.tableColumns;
const afterRequest = mp.afterRequest;
const handleRowClick = (row: any) => mp.handleRowClick(row);
const handleOpenDialog = (parentId?: string, menuId?: string) => mp.handleOpenDialog(parentId, menuId);
const handleCloseDialog = () => mp.handleCloseDialog();
const handleMenuTypeChange = () => mp.handleMenuTypeChange();
const handleFormSuccess = () => mp.handleFormSuccess();
const handleDelete = (id: string) => mp.handleDelete(id);

onMounted(() => {
  mp.initTable(dataTableRefLocal, menuFormRefLocal);
});

onUnmounted(() => {
  // clear bindings
  mp.initTable(null as any, null as any);
});



</script>