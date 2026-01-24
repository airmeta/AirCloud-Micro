<template>
  <el-form ref="internalFormRef" :model="formData" :rules="rules" label-width="110px">
    <el-form-item label="应用信息" prop="appId">
      <el-tree-select
        v-model="formData.appId"
        placeholder="选择所属应用"
        :data="appOptions"
        :disabled="!!formData.id"
        filterable
        check-strictly
        :render-after-expand="false"
      />
    </el-form-item>

    <el-form-item label="上级区域" prop="parentId">
      <el-tree-select
          v-model="formData.parentId"
          placeholder="选择上级区域"
          :data="parentOptionsFiltered"
          clearable
          filterable
          check-strictly
          :render-after-expand="false"
        />
    </el-form-item>

    <el-form-item label="区域编码" prop="code">
      <el-input v-model="formData.code" placeholder="请输入区域编码" />
    </el-form-item>

    <el-form-item label="区域名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入区域名称" />
    </el-form-item>

    <el-form-item label="区域类型" prop="type">
      <el-radio-group v-model="formData.type">
        <el-radio :value="RegionTypeEnum.District">市区</el-radio>
        <el-radio :value="RegionTypeEnum.County">县区</el-radio>
        <el-radio :value="RegionTypeEnum.Town">乡镇/街道</el-radio>
        <el-radio :value="RegionTypeEnum.Village">村/社居委</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="描述" prop="description">
      <el-input type="textarea" v-model="formData.description" />
    </el-form-item>

    <el-form-item label="经纬度" prop="lngAndSat">
      <el-input v-model="formData.lngAndSat" />
    </el-form-item>
  </el-form>

  <div class="dialog-footer" style="margin-top:12px; text-align: right">
    <el-button type="primary" @click="handleSubmit">确 定</el-button>
    <el-button @click="handleCancel">取 消</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, computed } from "vue";
import type { FormInstance } from "element-plus";
import AppAPI from "../../app/apis/app.api";
import RegionAPI from "../apis/region.api";
import { RegionPageService } from "../scripts/region.page";
import { RegionTypeEnum } from "../dtos/region.dto";

const internalFormRef = ref<FormInstance | null>(null);
const formData = RegionPageService.formData;
const emit = defineEmits(["success", "cancel"] as const);

defineExpose({
  validate: (cb: any) => internalFormRef.value?.validate(cb),
  resetFields: () => internalFormRef.value?.resetFields?.(),
  clearValidate: () => internalFormRef.value?.clearValidate?.(),
});

const appOptions = ref<Array<{ label: string; value: string }>>([]);
const parentOptions = ref<Array<{ label: string; value: string; children?: any[] }>>([]);
const parentOptionsFiltered = computed(() => {
  const excludeId = formData.value?.id || "";
  const filterTree = (nodes: Array<any> = []) => {
    return nodes.reduce((acc: any[], node: any) => {
      if (node.value === excludeId) return acc;
      const children = filterTree(node.children || []);
      acc.push({ ...node, children });
      return acc;
    }, [] as any[]);
  };
  return filterTree(parentOptions.value || []);
});

const rules = reactive({
  appId: [{ required: true, message: "请选择所属应用", trigger: "blur" }],
  code: [{ required: true, message: "请输入区域编码", trigger: "blur" }],
  name: [{ required: true, message: "请输入区域名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择区域类型", trigger: "change" }],
});

onMounted(() => {
  AppAPI.query({}).then((response) => {
    appOptions.value = (response.list || []).map((app: any) => ({ label: app.appName, value: app.appId }));
  });
  RegionAPI.query({}).then((response: any) => {
    const mapNode = (node: any) => ({ label: node.name, value: node.id, children: (node.children || []).map(mapNode) });
    const list = response?.list || [];
    parentOptions.value = (list || []).map(mapNode);
  });
  RegionPageService.regionFormRef = internalFormRef;
});

onUnmounted(() => {
  RegionPageService.regionFormRef = ref(null);
});

async function handleSubmit() {
  await RegionPageService.handleSubmit();
}

function handleCancel() {
  emit("cancel");
}
</script>

<style scoped>
.dialog-footer { }
</style>
