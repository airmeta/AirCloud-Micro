<template>
  <el-form ref="internalFormRef" :model="formData" :rules="rules" label-width="140px">

    <el-divider content-position="left">基础信息:</el-divider>
    <el-form-item label="账号" prop="account">
      <el-input v-model="formData.account" placeholder="请输入账号" :disabled="!!formData.id" />
    </el-form-item>
    <el-form-item label="用户名" prop="userName">
      <el-input v-model="formData.userName" placeholder="请输入用户名,例如:张三" />
    </el-form-item>

    <el-form-item v-if="!formData.id" label="密码" prop="password">
      <el-input v-model="formData.password" placeholder="请输入8-16位长度密码,包含数字,大小写字母,特殊字符" show-password />
    </el-form-item>
    <el-form-item label="电话" prop="phoneNumber">
      <el-input v-model="formData.phoneNumber" placeholder="请输入电话号码" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="formData.email" placeholder="可选：请输入邮箱" />
    </el-form-item>
    <el-form-item label="证件号码" prop="idCardNo">
      <el-input v-model="formData.idCardNo" placeholder="可选：证件号码" />
    </el-form-item>

    <el-divider content-position="left">高级配置:</el-divider>
    <el-form-item label="角色" prop="roleIds">
      <el-select v-model="formData.roleIds" multiple placeholder="请选择角色" clearable>
        <el-option v-for="opt in roleOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="部门" prop="departmentIds">
      <el-select v-model="formData.departmentIds" multiple placeholder="请选择部门" clearable>
        <el-option v-for="opt in deptOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="职位" prop="assignmentIds">
      <el-select v-model="formData.assignmentIds" multiple placeholder="请选择职位" clearable>
        <el-option v-for="opt in assignmentOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
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
import { UserPageService } from '../scripts/user.page';

const internalFormRef = ref<FormInstance | null>(null);
const formData = UserPageService.formData as any;
const roleOptions = UserPageService.roleOptions;
const deptOptions = UserPageService.deptOptions;
const assignmentOptions = UserPageService.assignmentOptions;

const mobilePattern = /^1[3-9]\d{9}$/;
const rules = reactive({
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { validator: (rule: any, value: string, callback: any) => {
        if (formData.id) return callback();
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,16}$/;
        if (!value) return callback(new Error('请输入密码'));
        if (!pattern.test(value)) return callback(new Error('密码需8-16位，且包含数字、大小写字母和特殊字符'));
        callback();
      }, trigger: 'blur' }
  ],
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (!value) return callback(new Error('请输入账号'));
        if (value.length < 8) return callback(new Error('账号长度不能小于8位'));
        callback();
      }, trigger: 'blur'
    }
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: mobilePattern, message: '请输入有效的手机号码', trigger: 'blur' }
  ]
  // email 和 idCardNo 为可选
});

onMounted(() => {
  UserPageService.userFormRef = internalFormRef;
});
onUnmounted(() => {
  UserPageService.userFormRef = ref(null) as any;
});

async function handleSubmit() {
  await UserPageService.handleSubmit();
}
function handleCancel() {
  UserPageService.handleCloseDialog();
}
</script>
