<template>
  <el-form ref="internalFormRef" :model="formData" :rules="rules" label-width="110px">
    
    <el-divider  content-position="left" >基础信息:</el-divider>
    <el-form-item label="应用信息" prop="appId">
      <el-tree-select
        v-model="formData.appId"
        placeholder="选择所属应用"
        :data="appOptions"
        :disabled="!!formData.id"
        filterable
        check-strictly
        :render-after-expand="false"
        @change="handleAppChange"
      />
    </el-form-item>

    <el-form-item prop="parentDepartmentId">
      <template #label>
        <span class="label-with-icon">
          <span class="label-text">上级部门 </span>
          <el-tooltip effect="dark" content="上级部门仅允许选择当前部门所属应用的所属部门（编辑或切换应用时生效）" placement="top">
            <el-icon class="label-icon">
              <warning-filled />
            </el-icon>
          </el-tooltip>
        </span>
      </template>
      <el-tree-select
        v-model="formData.parentDepartmentId"
        placeholder="选择上级部门"
        :data="parentOptionsFiltered"
        clearable
        filterable
        check-strictly
        :render-after-expand="false"
      />
    </el-form-item>
    <el-form-item label="部门编码" prop="departmentCode">
      <el-input v-model="formData.departmentCode" placeholder="请输入部门编码" />
    </el-form-item>

    <el-form-item label="部门名称" prop="departmentName">
      <el-input v-model="formData.departmentName" placeholder="请输入部门名称" />
    </el-form-item>

    <el-form-item label="描述" prop="description">
      <el-input type="textarea" v-model="formData.description" />
    </el-form-item>
    <el-divider  content-position="left" >高级配置:</el-divider>
    <el-form-item label="管理应用" prop="managedAppIds">
      <el-select
        v-model="managedAppSelected"
        multiple
        filterable
        collapse-tags
        placeholder="选择管理的应用（多选）"
      >
        <el-option v-for="opt in appOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="管理区域" prop="managedRegions">
      <el-select
        v-model="managedRegionSelected"
        multiple
        filterable
        collapse-tags
        placeholder="选择管理的区域（多选）"
      >
        <el-option v-for="opt in regionOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
    </el-form-item>

  </el-form>

  <div class="dialog-footer" style="margin-top:12px; text-align: right">
    <el-button type="primary" @click="handleSubmit">确 定</el-button>
    <el-button @click="handleCancel">取 消</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, computed } from "vue";
import { WarningFilled } from '@element-plus/icons-vue';
import type { FormInstance } from "element-plus";
import AppAPI from "../../app/apis/app.api";
import OrgAPI from "../apis/org.api";
import RegionAPI from "../../region/apis/region.api";
import { OrgPageService } from "../scripts/org.page";
import type { OrgForm } from "../dtos/org.dto";

const internalFormRef = ref<FormInstance | null>(null);
const formData = OrgPageService.formData;
const emit = defineEmits(["success", "cancel"] as const);

defineExpose({
  validate: (cb: any) => internalFormRef.value?.validate(cb),
  resetFields: () => internalFormRef.value?.resetFields?.(),
  clearValidate: () => internalFormRef.value?.clearValidate?.(),
});

const appOptions = ref<Array<{ label: string; value: string }>>([]);
const parentOptions = ref<Array<{ label: string; value: string; children?: any[] }>>([]);
const regionOptions = ref<Array<{ label: string; value: string }>>([]);
const appFiltered = ref(false); // 是否因切换应用而只展示该应用下的上级部门

// 将表单中以逗号分隔的字符串与多选数组进行映射
const managedAppSelected = computed<string[]>({
  get() {
    const s = formData.value?.managedAppIds || "";
    return (s || "").split(",").filter((x) => x);
  },
  set(v: string[]) {
    formData.value.managedAppIds = (v || []).join(",");
  },
});

const managedRegionSelected = computed<string[]>({
  get() {
    const s = formData.value?.managedRegions || "";
    return (s || "").split(",").filter((x) => x);
  },
  set(v: string[]) {
    formData.value.managedRegions = (v || []).join(",");
  },
});

const parentOptionsFiltered = computed(() => {
  const excludeId = formData.value?.id || "";
  const currentAppId = formData.value?.appId || "";
  const isEditing = !!formData.value?.id;
  const filterTree = (nodes: Array<any> = []) => {
    return nodes.reduce((acc: any[], node: any) => {
      if (node.value === excludeId) return acc;
      const children = filterTree(node.children || []);
      // When editing or when appFiltered (user changed app), only include nodes that belong to the same app
      if (isEditing || appFiltered.value) {
        if (node.appId === currentAppId) {
          acc.push({ ...node, children });
        }
      } else {
        acc.push({ ...node, children });
      }
      return acc;
    }, [] as any[]);
  };
  return filterTree(parentOptions.value || []);
});

// when app changes, load departments for that app and set appFiltered=true
async function handleAppChange(val: string) {
  try {
    if (!val) {
      appFiltered.value = false;
      // reload all departments
      const resp: any = await OrgAPI.query({});
      const mapNode = (node: any) => ({ label: node.name || node.departmentName, value: node.id, appId: node.appId, children: (node.children || []).map(mapNode) });
      const list = resp?.list || [];
      parentOptions.value = (list || []).map(mapNode);
      return;
    }
    appFiltered.value = true;
    const resp: any = await OrgAPI.query({ appId: val });
    const mapNode = (node: any) => ({ label: node.name || node.departmentName, value: node.id, appId: node.appId, children: (node.children || []).map(mapNode) });
    const list = resp?.list || [];
    parentOptions.value = (list || []).map(mapNode);
  } catch (e) {
    // ignore
  }
}

const rules = reactive({
  appId: [{ required: true, message: "请选择所属应用", trigger: "blur" }],
  departmentCode: [{ required: true, message: "请输入部门编码", trigger: "blur" }],
  departmentName: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
});

onMounted(() => {
  AppAPI.query({}).then((response) => {
    appOptions.value = (response.list || []).map((app: any) => ({ label: app.appName, value: app.appId }));
  });
  OrgAPI.query({}).then((response: any) => {
    const mapNode = (node: any) => ({ label: node.name || node.departmentName, value: node.id, appId: node.appId, children: (node.children || []).map(mapNode) });
    const list = response?.list || [];
    parentOptions.value = (list || []).map(mapNode);
  });
  // load regions for managedRegions select
  RegionAPI.query({}).then((response: any) => {
    const list = response?.list || [];
    regionOptions.value = (list || []).map((r: any) => ({ label: r.name || r.regionName || r.regionCode || r.id, value: r.id }));
  }).catch(() => {});
  OrgPageService.orgFormRef = internalFormRef;
});

onUnmounted(() => {
  OrgPageService.orgFormRef = ref(null);
});

async function handleSubmit() {
  await OrgPageService.handleSubmit();
}

function handleCancel() {
  emit("cancel");
}
</script>
