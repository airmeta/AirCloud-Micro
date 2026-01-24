<template>
  <div style="min-height: 600px;">
    <el-divider content-position="left">部门信息</el-divider>
    <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center">
      <div style="display:flex; gap:12px; align-items:center">
        <el-skeleton :loading="deptLoading" animated>
          <template #template>
            <el-skeleton-item variant="text" style="width:240px; height:20px" />
            <el-skeleton-item variant="text" style="width:320px; height:14px; margin-top:6px" />
          </template>
          <template #default>
            <div>
              <div style="font-weight:600">部门：{{ deptInfo.departmentName || deptInfo.name || '—' }}</div>
              <div style="color:#999;font-size:12px">描述：{{ deptInfo.description || deptInfo.departmentCode || '' }}</div>
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>

    <el-divider content-position="left">职位信息</el-divider>
    <air-table
      ref="tableRef"
      :queryFormRef="queryRef"
      :request="request"
      row-key="id"
      :show-expand-buttons="false"
      :columns="columns"
    >
      <template #table-query-form>
        <el-form :model="queryRef" inline>
          <el-form-item label="职位名称">
            <el-input v-model="queryRef.name" placeholder="职位名称" clearable />
          </el-form-item>
        </el-form>
      </template>
      <template #toolbar-left>
        <el-button type="primary"@click="openForm()">
           <el-icon>
            <Plus />
          </el-icon>
          添加</el-button>
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link size="small" @click="edit(row)">编辑</el-button>
        <el-button type="danger" link size="small" @click="removeRow(row.id)">删除</el-button>
      </template>
    </air-table>

    <el-dialog v-model="formVisible" :title="formTitle" width="640px" :destroy-on-close="true" class="asg-form-dialog">
      <el-form :model="formData" ref="formRef" label-width="80px">
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import AirTable from '@root/base/components/air/AirTable/index.vue';
import AsgAPI from '../apis/asg.api';
import OrgAPI from '../apis/org.api';
import type { AsgVO, AsgForm } from '../dtos/asg.dto';
import type { OrgVO } from '../dtos/org.dto';

// AirTable 已通过 import 在 <script setup> 中可用，无需手动注册

const props = defineProps<{ departmentId?: string | null }>();
const departmentId = ref<string | null>(props.departmentId ?? null);

// 部门信息与加载状态 / Department info and loading
const deptLoading = ref(false);
const deptInfo = ref<Partial<OrgVO & { departmentName?: string; departmentCode?: string; description?: string }>>({});

const tableRef = ref<any>(null);
// 查询表单数据 / Query form model
const queryRef = ref({ name: '', code: '' });
const columns = ref<AirTableColumn[]>([
  {  type: "index", width: 60 },
  { label: '职位名称', prop: 'name' },
  { label: '描述', prop: 'description' },
  { label: '操作', slot: 'operation', fixed: 'right', width: 180 },
]);

// 表单状态
const formVisible = ref(false);
const formTitle = ref('新增职位');
const formRef = ref(null);
const formData = ref<AsgForm>({ id: '', name: '', description: '', departmentId: '' });

function request(params: any) {
  // 将 air-table 的分页/筛选参数转发给后端，并注入 departmentId 与本地查询表单
  return AsgAPI.query({ ...params, ...queryRef.value, departmentId: departmentId.value });
}

async function loadDept(id?: string | null) {
  if (!id) {
    deptInfo.value = {};
    return;
  }
  deptLoading.value = true;
  try {
    const resp = await OrgAPI.detail(id);
    // OrgAPI.detail 返回的是表单/VO，采用宽松赋值
    deptInfo.value = resp || {};
  } catch (e) {
    deptInfo.value = {};
  } finally {
    deptLoading.value = false;
  }
}

function reload() {
  tableRef.value?.reload?.();
}

function doSearch() {
  tableRef.value?.reload?.();
}

function clearSearch() {
  queryRef.value.name = '';
  queryRef.value.code = '';
  tableRef.value?.reload?.();
}

function openForm() {
  formTitle.value = '新增职位';
  formData.value = { id: '', name: '', description: '', departmentId: departmentId.value ?? '' };
  formVisible.value = true;
}

function edit(row: AsgVO) {
  formTitle.value = '编辑职位';
  formData.value = { id: row.id, name: row.name || '', description: row.description || '', departmentId: departmentId.value ?? '' };
  formVisible.value = true;
}

async function removeRow(id?: string) {
  if (!id) return;
  try {
    await AsgAPI.remove(id);
    reload();
  } catch (e) {
    // ignore
  }
}

async function save() {
  // ensure departmentId present
  if (!departmentId.value) return;
  formData.value.departmentId = departmentId.value;
  try {
    await AsgAPI.save(formData.value);
    formVisible.value = false;
    reload();
  } catch (e) {
    // ignore
  }
}

onMounted(() => {
  // initial departmentId
  departmentId.value = props.departmentId ?? null;
  loadDept(departmentId.value);
});

watch(() => props.departmentId, (v) => {
  departmentId.value = v ?? null;
  // reload table when department changes
  loadDept(departmentId.value);
  setTimeout(() => reload(), 50);
});
</script>

<style scoped>
.asg-form-dialog .el-dialog__body {
  min-height: 600px;
}
</style>
