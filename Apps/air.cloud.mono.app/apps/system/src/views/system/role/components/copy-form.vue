<template>
    <el-form ref="internalFormRef" :model="formData" :rules="rules" label-width="120px">
        
        <el-divider content-position="left" >源角色:</el-divider>  
        <el-form-item label="来源角色:">
            <div>{{ firstSelected?.roleName || formData.roleName }}</div>
        </el-form-item>
        <el-form-item label="角色描述:">
            <div style="white-space: pre-wrap">{{ firstSelected?.description || '-' }}</div>
        </el-form-item>
        <el-form-item label="所属应用:">
            <el-tag type="primary">{{ appMap[firstSelected?.appId] || firstSelected?.appId || formData.appId }}</el-tag>
        </el-form-item>

       <el-divider content-position="left" >新增角色:</el-divider>  
        <el-form-item label="角色名" prop="roleName">
            <el-input v-model="formData.roleName" placeholder="请输入角色名" />
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
import { RolePageService } from '../scripts/role.page';

const internalFormRef = ref<FormInstance | null>(null);
const formData = RolePageService.formData as any;

const selectedRows = RolePageService.selectedRows;
const appMap = RolePageService.appMap;
const appOptions = RolePageService.appOptions;
import { computed } from 'vue';
const firstSelected = computed(() => (selectedRows.value && selectedRows.value.length ? selectedRows.value[0] : null));

const rules = reactive({});

onMounted(() => {
    // ensure apps loaded
    RolePageService.loadApps();
    RolePageService.menuFormRef = internalFormRef;
});
onUnmounted(() => {
    RolePageService.menuFormRef = ref(null);
});

async function handleSubmit() {
    await RolePageService.handleCopy();
}
function handleCancel() {
    RolePageService.handleCloseDialog();
}
</script>
