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
      <template #appEncryptType="{ row }">
        <el-tag v-if="row.appEncryptType === AppEncryptTypeEnum.RSA" type="success">RSA</el-tag>
        <el-tag v-else-if="row.appEncryptType === AppEncryptTypeEnum.SM2" type="warning">SM2</el-tag>
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
        <el-button type="info" link size="small" @click.stop="viewPublicKey(row)">
          <el-icon>
            <DocumentCopy />
          </el-icon>
          公钥
        </el-button>

        <el-button type="primary" link size="small" @click.stop="openAuthDrawer(row)">
          <el-icon>
            <Link />
          </el-icon>
          授权
        </el-button>

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

    <el-dialog v-model="pubKeyDialog.visible" :title="pubKeyDialog.title" width="640px">
      <div style="padding:12px 0;">
        <div style="margin-bottom:8px;">加密方式：
          <el-tag v-if="pubKeyDialog.encrypt === AppEncryptTypeEnum.RSA" type="success">RSA</el-tag>
          <el-tag v-else-if="pubKeyDialog.encrypt === AppEncryptTypeEnum.SM2" type="warning">SM2</el-tag>
          <span v-else>未知</span>
        </div>
        <pre style="white-space:pre-wrap;word-break:break-all;background:#f7f7f7;padding:12px;border-radius:6px;font-family:monospace;">{{ pubKeyDialog.publicKey }}</pre>
      </div>
      <template #footer>
        <el-button @click="pubKeyDialog.visible = false">关闭</el-button>
        <el-button type="primary" @click="copyPubKey">复制</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="authDrawer.visible" :title="authDrawer.appName + ' - 授权列表'" size="60%">
      <AuthComp :app-id="authDrawer.appId" :app-name="authDrawer.appName" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Plus, DocumentCopy, Link } from '@element-plus/icons-vue';
import AirTable from '@root/base/components/air/AirTable/index.vue';
import AppAPI from './apis/app.api';
import { ElMessage } from 'element-plus';
import AuthComp from './components/auth.vue';
import { AppPageService } from './scripts/app.page';
import AppForm from './components/form.vue';
import { AppEncryptTypeEnum } from './dtos/app.dto';

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

// 公钥 dialog
const pubKeyDialog = ref({ visible: false, title: '', publicKey: '', encrypt: undefined as number | undefined });
async function viewPublicKey(row: any) {
  if (!row) return;
  try {
    const detail: any = await AppAPI.detail(row.id || row.appId);
    pubKeyDialog.value.publicKey = detail?.publicKey || '';
    pubKeyDialog.value.encrypt = detail?.appEncryptType;
    pubKeyDialog.value.title = `应用 ${detail?.appName || row.appName || row.appId} 公钥`;
    pubKeyDialog.value.visible = true;
  } catch (e: any) {
    ElMessage.error('获取公钥失败');
  }
}
function copyPubKey() {
  const text = pubKeyDialog.value.publicKey || '';
  if (!text) { ElMessage.warning('无可复制的公钥'); return; }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => ElMessage.success('已复制到剪贴板'));
  } else {
    ElMessage.info('请手动复制公钥');
  }
}

// 授权抽屉状态（由独立组件处理具体逻辑）
const authDrawer = ref({ visible: false, appId: '', appName: '' });

function openAuthDrawer(row: any) {
  if (!row) return;
  authDrawer.value.appId = row.appId || row.id;
  authDrawer.value.appName = row.appName || row.appId || '';
  authDrawer.value.visible = true;
}
</script>
