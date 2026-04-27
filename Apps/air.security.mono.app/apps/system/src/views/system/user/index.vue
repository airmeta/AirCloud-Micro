<template>
  <div class="app-container">
    <air-table ref="dataTableRefLocal" :queryFormRef="queryFormRef" v-loading="loading" row-key="id"
      :request="UserAPI.query" :after-request="afterRequest" @row-click="handleRowClick"
      @selection-change="onSelectionChange" :columns="tableColumns">

      <template #table-query-form>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
          <el-form-item label="用户名" prop="userName">
            <el-input placeholder="用户名" v-model="queryParams.userName" clearable />
          </el-form-item>
          <el-form-item label="账号" prop="account">
            <el-input placeholder="账号" v-model="queryParams.account" clearable />
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
        <el-button type="info" link size="small" @click.stop="rp.openDetail(row.id)">
          <el-icon>
            <DocumentCopy />
          </el-icon>
          账户明细
        </el-button>

        <el-button type="warning" link size="small" @click.stop="rp.openResetDialog(row)">
          <el-icon>
            <Lock />
          </el-icon>
          重置密码
        </el-button>

        <el-button type="primary" link size="small" icon="edit" @click.stop="handleOpenDialog(row.id)">编辑</el-button>
        <el-button type="danger" link size="small" icon="delete" @click.stop="handleDelete(row.id)">删除</el-button>
      </template>

      <template #accountApp="{ row }">
        <el-tag type="primary">{{ rp.getAppLabel(row.accountCreateAppId, row.accountCreateAppName) }}</el-tag>
      </template>

    </air-table>

    <el-drawer v-model="dialog.visible" :title="dialog.title" :size="drawerSize" @close="handleCloseDialog">
      <UserForm ref="userFormRefLocal" />
    </el-drawer>

    <el-drawer v-model="rp.detailDialog.visible" :title="rp.detailDialog.title" size="60%"
      @close="() => rp.detailDialog.visible = false">
      <UserDetail :user="rp.detailData" />
    </el-drawer>

    <el-dialog v-model="rp.resetDialog.visible" title="重置密码" width="480px" :close-on-click-modal="false" :close-on-press-escape="false">
      <div style="padding:12px 0;">
        <template v-if="!resetSuccess">
          <el-form>
            <el-form-item label="账号:" label-width="80px">
              <div style="margin-bottom:8px"><strong>{{ rp.resetDialog.account }}</strong></div>
            </el-form-item>
            <el-form-item label="用户名:" label-width="80px">
              <div style="margin-bottom:12px"><strong>{{ rp.resetDialog.userName }}</strong></div>
            </el-form-item>
            <el-form-item label="验证码:" label-width="80px">
              <div style="display:flex;align-items:center;gap:8px;">
                <el-input v-model="rp.resetDialog.code" placeholder="请输入验证码" clearable class="flex-1" @keyup.enter="sendResetRequest">
                  <template #prefix>
                    <div class="i-svg:captcha" />
                  </template>
                </el-input>
                <div style="width:120px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;" @click="getCaptcha">
                  <el-icon v-if="codeLoading" class="is-loading" size="20">
                    <Loading />
                  </el-icon>
                  <img v-else-if="captchaBase64" :src="captchaBase64" alt="captcha" style="width:120px;height:30px;border-radius:4px;object-fit:cover;box-shadow: inset 0 0 0 1px var(--el-border-color);" />
                  <el-text v-else type="info" size="small">点击获取验证码</el-text>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </template>
        <template v-else>
          <div style="padding:24px;text-align:center;">
            <div style="font-size:18px;font-weight:600;color:var(--el-color-success,#67C23A);margin-bottom:12px;">重置成功!</div>
            <div style="margin-bottom:8px;">新的密码为：</div>
            <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
              <div style="padding:10px 16px;background:#f7f7f7;border-radius:6px;font-family:monospace;font-size:16px;word-break:break-all;">{{ resetNewPassword }}</div>
              <el-button type="text" title="复制密码" @click="copyPassword">
                <el-icon>
                  <DocumentCopy />
                </el-icon>
              </el-button>
            </div>
          </div>
        </template>
      </div>
      <template #footer>
        <div style="text-align: right; padding: 8px 0;">
          <template v-if="!resetSuccess">
            <el-button @click="rp.resetDialog.visible = false">取消</el-button>
            <el-button type="primary" @click="sendResetRequest">提交</el-button>
          </template>
          <template v-else>
            <el-button type="danger" @click="acknowledgeClose">我已存储,立即关闭</el-button>
          </template>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import AirTable from '@root/base/components/air/AirTable/index.vue';
import UserAPI from './apis/user.api';
import UserForm from './components/form.vue';
import UserDetail from './components/user-detail.vue';
import { DocumentCopy, Lock } from '@element-plus/icons-vue';
import { UserPageService } from './scripts/user.page';

const rp = UserPageService;
const loading = rp.loading;
const queryParams = rp.queryParams;
const queryFormRef = rp.queryFormRef;
const dataTableRefLocal = ref(null);
const userFormRefLocal = ref(null);
const dialog = rp.dialog;
const drawerSize = rp.drawerSize;
const tableColumns = rp.tableColumns;
const afterRequest = rp.afterRequest;

onMounted(() => {
  rp.initTable(dataTableRefLocal, userFormRefLocal);
});
onUnmounted(() => {
  rp.initTable(null as any, null as any);
});

const handleRowClick = (row: any) => rp.handleRowClick(row);
const handleOpenDialog = (id?: string) => rp.handleOpenDialog(id);
const handleCloseDialog = () => rp.handleCloseDialog();
const handleDelete = (id: string) => rp.handleDelete(id);
function onSelectionChange(rows: any[]) {
  rp.selectedId.value = rows && rows.length ? rows[0].id : undefined;
  rp.selectedRows.value = rows && rows.length ? rows : [];
}

// captcha for reset dialog (image captcha like login)
import AuthAPI from '@root/base/api/auth-api';
import AccountAPI from './apis/account.api';
import { EncryptUtil } from '@root/base/store/modules/client/encrypt';
import { useSettingsStore } from '@root/base/store/modules/settings-store';
import { ElMessage } from 'element-plus';
const codeLoading = ref(false);
const captchaBase64 = ref<string | undefined>();
const resetSuccess = ref(false);
const resetNewPassword = ref('');

function getCaptcha() {
  codeLoading.value = true;
  AuthAPI.getCaptcha()
    .then((data) => {
      rp.resetDialog.code = '';
      captchaBase64.value = 'data:image/png;base64,' + data.captchaBase64;
    })
    .finally(() => {
      codeLoading.value = false;
    });
}

// load captcha when reset dialog opens
watch(() => rp.resetDialog.visible, (v) => {
  if (v) {
    captchaBase64.value="";
    // reset success state when dialog opens
    resetSuccess.value = false;
    resetNewPassword.value = '';
    rp.resetDialog.code = '';
  }
});

async function sendResetRequest() {
  const userId = rp.resetDialog.userId;
  const code = (rp.resetDialog.code || '').trim();
  if (!userId) { ElMessage.warning('用户ID为空'); return; }
  if (!code) { ElMessage.warning('请输入验证码'); return; }
  try {
    const data1 = { UserId: userId, Code: code };
    const appStore = useSettingsStore();
    const appPublicKey: string = appStore.appPublicKey as string;
   console.log("eee", EncryptUtil.encryptData("123231",appPublicKey))
    const content = EncryptUtil.encryptData(JSON.stringify(data1), appPublicKey) as string;
    const result = await AccountAPI.resetPassword(content);
    if (result) {
      // 非空返回表示密码已重置并返回了新密码
      resetNewPassword.value = result as string;
      resetSuccess.value = true;
      ElMessage.success('重置成功，请妥善保存新密码');
    } else {
      ElMessage.error('重置失败，返回为空');
      // 保持对话框打开以便重试
    }
  } catch (e: any) {
    ElMessage.error(e?.message || '重置请求失败');
  }
}

async function acknowledgeClose() {
  // 先尝试把密码复制到剪贴板，再关闭并重置状态
  try {
    const text = resetNewPassword.value || '';
    if (text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      ElMessage.success('已将新密码复制到剪贴板');
    }
  } catch (e) {
    ElMessage.warning('复制到剪贴板失败，请手动复制');
  } finally {
    rp.resetDialog.visible = false;
    resetSuccess.value = false;
    resetNewPassword.value = '';
    rp.resetDialog.code = '';
  }
}

async function copyPassword() {
  const text = resetNewPassword.value || '';
  if (!text) { ElMessage.warning('无可复制的密码'); return; }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    ElMessage.success('已将新密码复制到剪贴板');
  } catch (e) {
    ElMessage.warning('复制到剪贴板失败，请手动复制');
  }
}
</script>
