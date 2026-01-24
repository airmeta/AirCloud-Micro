<template>
  <el-form ref="internalFormRef" :model="formData" :rules="rules" label-width="120px">
    
    <el-form-item label="应用信息" prop="appId">
      <el-tree-select
        v-model="formData.appId"
        placeholder="请选择应用"
        :data="appOptions"
        :disabled="!!formData.id"
        clearable
        filterable
        check-strictly
        :render-after-expand="false"
      />
    </el-form-item>
    <el-form-item label="角色名" prop="roleName">
      <el-input v-model="formData.roleName" placeholder="请输入角色名" />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input type="textarea" v-model="formData.description" :rows="5" placeholder="请输入描述" />
    </el-form-item>
  </el-form>
  <div class="dialog-footer" style="margin-top:12px; text-align: right">
    <el-button type="primary" @click="handleSubmit">确 定</el-button>
    <el-button @click="handleCancel">取 消</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import type { FormInstance } from 'element-plus';
import { RolePageService } from "../scripts/role.page";

const internalFormRef = ref<FormInstance | null>(null);
const formData = RolePageService.formData as any;

const appOptions = RolePageService.appOptions;

const rules = reactive({
  roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
  appId: [{ required: true, message: '请选择应用', trigger: 'change' }],
});

onMounted(() => {
  // load apps for select (ensure app list available when editing directly)
  RolePageService.loadApps();
  RolePageService.menuFormRef = internalFormRef;
});
onUnmounted(() => {
  RolePageService.menuFormRef = ref(null);
});

async function handleSubmit() {
  await RolePageService.handleSubmit();
}
function handleCancel() {
  RolePageService.handleCloseDialog();
}
</script>
