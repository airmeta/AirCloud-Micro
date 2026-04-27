<template>
  <div class="user-detail">
    <el-skeleton :loading="!user" animated>
      <template #template>
        <el-skeleton-item variant="image" style="width:100%;height:160px;" />
        <el-skeleton-item variant="text" style="width:60%;margin-top:12px;" />
        <el-skeleton-item variant="text" style="width:80%;" />
        <el-skeleton-item variant="text" style="width:40%;" />
      </template>

      <template #default>
        <div style="padding:12px;">
          <el-descriptions :column="1" title="用户明细" border>
            <el-descriptions-item label="用户名">{{ user.userName || '-' }}<el-icon class="copy-icon" @click="copyUserId"><CopyDocument /></el-icon></el-descriptions-item>
            <el-descriptions-item label="账号">{{ user.account || '-' }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ user.email || '-' }}</el-descriptions-item>
            <el-descriptions-item label="电话">{{ user.phoneNumber || '-' }}</el-descriptions-item>
            <el-descriptions-item label="证件号">{{ user.idCardNo || '-' }}</el-descriptions-item>
            <el-descriptions-item label="所属部门">
              <template v-if="deptNames.length">
                <el-tag v-for="(n, i) in deptNames" :key="'dept_'+i" type="info" style="margin-right:6px">{{ n }}</el-tag>
              </template>
              <template v-else>
                {{ user.departmentName || (user.departmentIds || '-') }}
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="角色权限">
              <template v-if="roleNames.length">
                <el-tag v-for="(n, i) in roleNames" :key="'role_'+i" type="success" style="margin-right:6px">{{ n }}</el-tag>
              </template>
              <template v-else>
                {{ user.roleNames || (user.roleIds || '-') }}
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="任职">
              <template v-if="assignmentNames.length">
                <el-tag v-for="(n, i) in assignmentNames" :key="'asg_'+i" type="warning" style="margin-right:6px">{{ n }}</el-tag>
              </template>
              <template v-else>
                {{ user.assignmentNames || (user.assignmentIds || '-') }}
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="创建应用"> <el-tag type="primary">{{ rp.getAppLabel(user.accountCreateAppId,
              user.accountCreateAppName) }}</el-tag></el-descriptions-item>
            <!-- <el-descriptions-item label="是否第三方用户">{{ user.isThirdPlatformUser === 1 ? '是' : '否' }}</el-descriptions-item> -->
            <el-descriptions-item label="创建时间">{{ user.createTime || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </template>
    </el-skeleton>

      <el-dialog v-model="metaDialogVisible" title="扩展内容" width="600px" :close-on-click-modal="false" :show-close="false">
        <div style="min-height:160px; white-space:pre-wrap; word-break:break-word;">{{ metaContent }}</div>
        <template #footer>
          <div style="text-align: right; padding: 8px 0;">
            <el-button type="primary" @click="metaDialogVisible = false">关闭</el-button>
          </div>
        </template>
      </el-dialog>
    <el-divider content-position="left">登录日志</el-divider>
    <div style="padding:12px 0;">
      <air-table ref="logTableRef" :request="requestLogs" row-key="id" :columns="logColumns" :page-size="10">
        <template #table-query-form>
          <el-form :model="logQueryRef" inline>
            <el-form-item label="类型编码">
              <el-input v-model="logQueryRef.typeCode" placeholder="类型编码" clearable />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="logQueryRef.remark" placeholder="备注" clearable />
            </el-form-item>
          </el-form>
        </template>
        <template #typeCode="{ row }">
          <div style="display:flex;align-items:center;gap:6px;">
            <span>{{ row.typeCode }}</span>
            <el-icon class="copy-icon" @click="copyLogId(row.id)"><CopyDocument /></el-icon>
          </div>
        </template>

        <template #meta="{ row }">
          <div>
            <a style="cursor:pointer;color:var(--el-color-primary)" @click="openMeta(row.meta)">查看</a>
          </div>
        </template>
        <template #table-empty>
          <div style="text-align: center; padding: 20px 0;">
            <el-empty description="暂无登录日志" />
          </div>
        </template>
        <template #toolbar-left>
          <el-button type="primary" @click="logTableRef?.reload?.()">
            <el-icon>
              <Refresh />
            </el-icon>
            刷新
          </el-button>
        </template>
      </air-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import AirTable from '@root/base/components/air/AirTable/index.vue';
import AccountAPI from '../apis/account.api';
import { UserPageService } from '../scripts/user.page';
import { ElMessage } from 'element-plus';
import OrgAPI from '../../organization/apis/org.api';
import AsgAPI from '../../organization/apis/asg.api';
import RoleAPI from '../../role/apis/role.api';
const rp = UserPageService;

const props = defineProps<{ user: any | null }>();
const user = toRef(props, 'user');

const logTableRef = ref<any>(null);
// 查询表单模型 / query model for logs
const logQueryRef = ref({ typeCode: '', remark: '' });

const logColumns = ref([
  { type: 'index', width: 60 },
  { label: '类型', prop: 'typeCode', width: 120,slot: 'typeCode' },
  { label: '备注', prop: 'remark' },
  { label: '扩展', prop: 'meta', width: 200, slot: 'meta' },
]);

function requestLogs(params: any) {
  return AccountAPI.queryLogs({ ...params, ...logQueryRef.value, userId: user.value?.id });
}

// related names for tags
const deptNames = ref<string[]>([]);
const roleNames = ref<string[]>([]);
const assignmentNames = ref<string[]>([]);

function parseIds(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String).filter(Boolean);
  if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
  return [String(val)];
}

async function loadRelatedNames() {
  const dIds = parseIds(user.value?.departmentIds || user.value?.departmentId || user.value?.departmentId);
  const rIds = parseIds(user.value?.roleIds || user.value?.roleId);
  const aIds = parseIds(user.value?.assignmentIds || user.value?.assignmentId);

  // departments
  if (dIds.length) {
    try {
      const ps = dIds.map(id => OrgAPI.detail(id).then((res: any) => res?.departmentName || res?.departmentName || res?.name || id).catch(() => id));
      deptNames.value = await Promise.all(ps);
    } catch (e) { deptNames.value = []; }
  } else {
    deptNames.value = [];
  }

  // roles
  if (rIds.length) {
    try {
      const ps = rIds.map(id => RoleAPI.detail(id).then((res: any) => res?.roleName || res?.roleName || id).catch(() => id));
      roleNames.value = await Promise.all(ps);
    } catch (e) { roleNames.value = []; }
  } else {
    roleNames.value = [];
  }

  // assignments
  if (aIds.length) {
    try {
      const ps = aIds.map(id => AsgAPI.detail(id).then((res: any) => res?.name || res?.assignmentName || id).catch(() => id));
      assignmentNames.value = await Promise.all(ps);
    } catch (e) { assignmentNames.value = []; }
  } else {
    assignmentNames.value = [];
  }
}

async function copyUserId() {
  const id = user.value?.id;
  if (!id) {
    ElMessage.warning('用户ID为空');
    return;
  }
  const text = String(id);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      ElMessage.success('用户ID已复制');
      return;
    } catch (e) {
      // fall through to legacy fallback
    }
  }
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand('copy');
    ElMessage.success('用户ID已复制');
  } catch (e) {
    ElMessage.error('复制失败');
  }
  document.body.removeChild(input);
}
async function copyLogId(id: any) {
  const text = id == null ? '' : String(id);
  if (!text) {
    ElMessage.warning('日志ID为空');
    return;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      ElMessage.success('日志ID已复制');
      return;
    } catch (e) {
      // fallback
    }
  }
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand('copy');
    ElMessage.success('日志ID已复制');
  } catch (e) {
    ElMessage.error('复制失败');
  }
  document.body.removeChild(input);
}
const metaDialogVisible = ref(false);
const metaContent = ref('');

function openMeta(content: any) {
  metaContent.value = content == null ? '-' : String(content);
  metaDialogVisible.value = true;
}
watch(() => user.value, (v) => {
  // reload logs when user changes
  setTimeout(() => logTableRef.value?.reload?.(), 50);
  // load related names
  loadRelatedNames();
}, { immediate: true });
</script>

<style scoped>
.user-detail {
  min-height: 240px;
}

.copy-icon {
  cursor: pointer;
  margin-left: 6px;
}

/* set descriptions label width */
.user-detail :deep(.el-descriptions__label) {
  width: 100px;
  max-width: 100px;
  flex: 0 0 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
