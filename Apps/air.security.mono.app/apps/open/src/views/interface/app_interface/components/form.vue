<template>
  <el-form ref="formRef" :model="formModel" :rules="rules" label-width="120px">
    <el-form-item label="接口信息" prop="externalInterfaceId">
      <el-select v-model="formModel.externalInterfaceId" placeholder="请选择对外接口" filterable clearable style="width: 100%">
        <el-option v-for="opt in externalOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="授权给" prop="appId">
        <el-select v-model="formModel.appId" placeholder="请选择应用ID" filterable clearable style="width: 100%">
          <el-option v-for="opt in appOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>
    <el-form-item label="到期时间" prop="expiredTime">
      <el-date-picker
        v-model="formModel.expiredTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        placeholder="请选择到期时间"
        style="width: 100%"
      />
    </el-form-item>
  
    <el-form-item label="描述" prop="description">
      <el-input v-model="formModel.description" type="textarea" :rows="3" placeholder="请输入描述" />
    </el-form-item>
    <el-form-item label="删除备注" prop="deleteRemark">
      <el-input v-model="formModel.deleteRemark" type="textarea" :rows="3" placeholder="请输入删除备注" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import AppInterfaceAuthorizationAPI from '../apis/app_interface_authorization.api'
import type { AppInterfaceAuthorizationForm } from '../dtos/app_interface_authorization.dto'
import AppAPI from '../../../system/app/apis/app.api'
import ExternalInterfaceMappingAPI from '../../outer/apis/external_interface_mapping.api'

const emit = defineEmits<{ (e: 'success'): void }>()
const props = defineProps<{ appId?: string; actionId?: string }>()

const formRef = ref(null)
const saving = ref(false)
const formModel = ref<AppInterfaceAuthorizationForm>({
  id: '',
  appId: '',
  actionId: '',
  actionSecret: '',
  expiredTime: '',
  externalInterfaceId: '',
  description: '',
  deleteRemark: '',
})

const rules = {
  externalInterfaceId: [{ required: true, message: '请选择接口信息', trigger: 'change' }],
  appId: [{ required: true, message: '请选择授权应用', trigger: 'change' }],
  expiredTime: [{ required: true, message: '请选择到期时间', trigger: 'change' }],
}

const appOptions = ref<{ label: string; value: string }[]>([])
const externalOptions = ref<{ label: string; value: string }[]>([])

async function loadAppOptions() {
  try {
    const resp: any = await AppAPI.query({})
    const list = resp?.list || []
    appOptions.value = (list || []).map((a: any) => ({ label: a.appName || a.appId, value: a.appId }))
  } catch (err) {
    appOptions.value = []
  }
}

async function loadExternalOptions(info?: string) {
  try {
    const resp: any = await ExternalInterfaceMappingAPI.select({ page: 1, limit: 999, info: info || undefined })
    const list = resp || []
    externalOptions.value = (list || []).map((e: any) => ({ label: e.name || e.id, value: e.id }))
  } catch (err) {
    externalOptions.value = []
  }
}

onMounted(() => {
  loadAppOptions()
  loadExternalOptions()
})

function resetForm() {
  formModel.value = {
    id: '',
    appId: '',
    actionId: '',
    actionSecret: '',
    expiredTime: '',
    externalInterfaceId: '',
    description: '',
    deleteRemark: '',
  }
  formRef.value?.resetFields?.()
}

watch(
  () => [props.appId, props.actionId],
  async ([appId, actionId]) => {
    resetForm()
    if (!appId || !actionId) return
    const detail = await AppInterfaceAuthorizationAPI.detail(appId, actionId)
    if (!detail) return
    formModel.value.id = detail.id || ''
    formModel.value.appId = detail.appId || ''
    formModel.value.actionId = detail.actionId || ''
    formModel.value.actionSecret = detail.actionSecret || ''
    formModel.value.expiredTime = detail.expiredTime ? `${detail.expiredTime}` : ''
    formModel.value.externalInterfaceId = detail.externalInterfaceId || ''
    formModel.value.description = detail.description || ''
    formModel.value.deleteRemark = detail.deleteRemark || ''
    // ensure selected values are present in options
    if (formModel.value.appId) await loadAppOptions()
    if (formModel.value.externalInterfaceId) await loadExternalOptions(formModel.value.externalInterfaceId)
  },
  { immediate: true }
)

async function submit() {
  try {
    await formRef.value?.validate?.()
  } catch (err) {
    return false
  }

  const appId = formModel.value.appId?.trim()
  if (!appId) {
    ElMessage.error('请选择授权应用')
    return false
  }

  saving.value = true
  try {
    await AppInterfaceAuthorizationAPI.save({
      ...formModel.value,
      appId,
    } as AppInterfaceAuthorizationForm)

    ElMessage.success('保存成功')
    emit('success')
    return true
  } catch (e: any) {
    ElMessage.error(e?.message || '保存失败')
    return false
  } finally {
    saving.value = false
  }
}

defineExpose({ submit, resetForm })
</script>
