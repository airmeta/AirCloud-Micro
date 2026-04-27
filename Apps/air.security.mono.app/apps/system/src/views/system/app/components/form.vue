<template>
  <el-form ref="internalFormRef" :model="formData"  :rules="rules" label-width="120px">
    <el-form-item label="应用ID" prop="appId">
      <el-input v-model="formData.appId"  :disabled="!!formData.id" placeholder="请输入应用ID">
        <template #append>
            <el-button   @click="generateUUID"  :disabled="!!formData.id">生成</el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="应用名称" prop="appName">
      <el-input v-model="formData.appName" placeholder="请输入应用名称" />
    </el-form-item>
    <el-form-item label="应用重定向地址" prop="appRedirectUrl">
      <el-input v-model="formData.appRedirectUrl" placeholder="请输入重定向地址" />
    </el-form-item>
    <el-form-item label="图标" prop="logo">
      <div v-if="!formData.logo">
        <input ref="logoInputRef" type="file" accept="image/*" @change="onLogoChange" style="display:none" />
        <el-button type="primary" @click="triggerLogoInput">选择图片</el-button>
      </div>
      <div v-else style="margin-top:8px; display:flex; align-items:center; gap:8px;">
        <img :src="formData.logo" alt="logo" style="width:80px; height:80px; object-fit:cover; border:1px solid #eee; padding:4px; background:#fff;" />
        <el-button type="text" @click="clearLogo">移除</el-button>
      </div>
    </el-form-item>
    <el-form-item label="加密类型" prop="appEncryptType">
      <el-select v-model="formData.appEncryptType" placeholder="选择加密类型">
        <el-option :label="'RSA'" :value="AppEncryptTypeEnum.RSA" />
        <el-option :label="'SM2'" :value="AppEncryptTypeEnum.SM2" />
      </el-select>
    </el-form-item>
    <el-form-item label="应用私钥" prop="appPrivateKey">
      <el-input type="textarea" v-model="formData.appPrivateKey" :rows="10" placeholder="对方私钥（可选）" />
    </el-form-item>
    <el-form-item label="是否开启 MFA" prop="enableMfa">
      <el-switch v-model="formData.enableMfa" active-text="是" inactive-text="否" />
    </el-form-item>
    <el-form-item label="是否为公共应用" prop="isCommonApp">
      <el-switch v-model="formData.isCommonApp" active-text="是" inactive-text="否" />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input type="textarea" v-model="formData.description" placeholder="请输入描述" />
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
import { AppPageService } from '../scripts/app.page';
import AppAPI from '../apis/app.api';
import { AppEncryptTypeEnum } from '../dtos/app.dto';

const internalFormRef = ref<FormInstance | null>(null);
// use service's formData
const formData = AppPageService.formData as any;

const rules = reactive({
  appId: [{ required: true, message: '请输入应用ID', trigger: 'blur' }],
  appName: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
  appPrivateKey: [{ required: true, message: '请输入应用私钥', trigger: 'blur' }],
  appEncryptType: [{ required: true, message: '请选择加密类型', trigger: 'change' }],
  appRedirectUrl: [
    {
      validator: (_rule: any, value: string, callback: (err?: Error) => void) => {
        if (!value) return callback(new Error('请输入重定向地址'));
        try {
          const u = new URL(value);
          if (u.protocol !== 'http:' && u.protocol !== 'https:') {
            return callback(new Error('重定向地址必须为 http:// 或 https:// 链接'));
          }
          return callback();
        } catch (e) {
          return callback(new Error('请输入有效的 URL'));
        }
      },
      trigger: 'blur',
    },
  ],
});

function generateUUID() {
  const uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  AppPageService.formData.value.appId = uuid;
}

const logoInputRef = ref<HTMLInputElement | null>(null);

function onLogoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? logoInputRef.value?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    AppPageService.formData.value.logo = reader.result as string;
  };
  reader.readAsDataURL(file);
}

function clearLogo() {
  AppPageService.formData.value.logo = null;
  if (logoInputRef.value) logoInputRef.value.value = '';
}

function triggerLogoInput() {
  logoInputRef.value?.click?.();
}

onMounted(() => {
  AppAPI.query({}).then(() => {});
  // bind local ref to service so service can validate
  AppPageService.menuFormRef = internalFormRef;
});
onUnmounted(() => {
  AppPageService.menuFormRef = ref(null);
});

async function handleSubmit() {
  await AppPageService.handleSubmit();
}
function handleCancel() {
  AppPageService.handleCloseDialog();
}
</script>
