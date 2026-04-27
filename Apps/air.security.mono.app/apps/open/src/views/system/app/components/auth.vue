<template>
  <div>
    <!-- 工具栏内包含添加按钮（见 air-table 的 toolbar-left 插槽） -->
    <air-table ref="dataTableRef" :table-data="authList" :request="requestAuth" :queryFormRef="queryFormRef" :queryData="queryParams" v-loading="authLoading" style="width:100%" row-key="id" :pagination="false" :columns="authColumns">
      <template #table-query-form>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
          <el-form-item label="路由地址" prop="route">
            <el-input placeholder="路由地址/描述" v-model="queryParams.info" clearable />
          </el-form-item>
        </el-form>
      </template>
       <template #toolbar-left>
         <div style="text-align: left; align-items: center;display: flex;color: #E6A23C;"><el-icon><Warning /></el-icon><div> 授权发生改变后,需要10分钟的时间生效,请10分钟后检查</div></div>
      </template>
      <template #bindStatus="{ row }">
         <el-tag v-if="row.isBind" type="success">已绑定</el-tag>
          <el-tag v-else type="info">未绑定</el-tag>
      </template>

      <template #operation="{ row }">
        <el-button link icon="close" v-if="row.isBind" type="danger"  @click="removeBindRoute(row)">解绑</el-button>
          <el-button link icon="Check" v-else type="primary"  @click="bindRoute(row)">绑定</el-button>
      </template>
    </air-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import AppRouteAPI from '../apis/app_route.api';
import { ElMessage } from 'element-plus';
import AirTable from '@root/base/components/air/AirTable/index.vue';
import type { AirTableColumn } from '@root/base/components/air/AirTable/components/air-table-column';

const props = defineProps<{ appId: string; appName: string }>();

const appId = ref(props.appId || '');
const appName = ref(props.appName || '');
const authList = ref<any[]>([]);
const authLoading = ref(false);
const dataTableRef = ref<any>(null);
const queryFormRef = ref(null);
const queryParams = ref({ info: '', appId: appId.value });

const authColumns = [
  { type: 'index', width: 60 },
  { label: '路由', prop: 'route', minWidth: 240 },
  { label: '路由描述', prop: 'routeDescription', minWidth: 200 },
  { label: '请求方法', prop: 'method', width: 120 },
  { label: '授权描述', prop: 'description', minWidth: 200 },
  { label: '创建时间', prop: 'createTime', width: 180 },
  { label: '绑定状态', slot: 'bindStatus', width: 120 },
  { label: '操作', slot: 'operation', width: 180 },
] as AirTableColumn[];
watch(
  () => props.appId,
  (v) => (appId.value = v || ''),
  { immediate: true }
);

watch(
  () => props.appName,
  (v) => (appName.value = v || ''),
  { immediate: true }
);

watch(
  () => props.appId,
  (v) => {
    appId.value = v || '';
    if (v) {
      // reload air-table data when appId changes
      // keep queryParams in sync so AirTable PageQuery contains bindAppId
      try { queryParams.value.appId = appId.value; } catch (e) { /* ignore */ }
      dataTableRef.value?.reload?.();
    }
  },
  { immediate: true }
);
// request function for AirTable (supports pagination and queryData)
function requestAuth(params: any) {
  const body = { ...(params || {}), appId: appId.value };
  return AppRouteAPI.queryAuth(body);
}

async function bindRoute(item: any) {
  const routeId = item.id || item.route || item.routeId;
  if (!routeId) { ElMessage.warning('无法绑定：缺少 routeId'); return; }
  try {
    await AppRouteAPI.bind(routeId, appId.value);
    ElMessage.success('绑定成功');
  } catch (e: any) {
    ElMessage.error('绑定失败');
  } finally {
    dataTableRef.value?.reload?.();
  }
}

async function removeBindRoute(item: any) {
  const routeId = item.id || item.route || item.routeId;
  if (!routeId) { ElMessage.warning('无法解绑：缺少 routeId'); return; }
  try {
    await AppRouteAPI.removeBind(routeId, appId.value);
    ElMessage.success('解绑成功');
  } catch (e: any) {
    ElMessage.error('解绑失败');
  } finally {
    dataTableRef.value?.reload?.();
  }
}
</script>

<style scoped></style>
