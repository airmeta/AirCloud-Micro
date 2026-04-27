<template>
  <el-form ref="formRef" :model="formModel" :rules="rules" label-width="120px">
    <el-form-item label="名称" prop="name">
      <el-input v-model="formModel.name" placeholder="请输入名称" />
    </el-form-item>
    <el-form-item label="内部接口ID" prop="internalInterfaceId">
      <el-select
        v-model="formModel.internalInterfaceId"
        filterable
        remote
        clearable
        placeholder="请选择内部接口"
        :remote-method="handleInterfaceSearch"
        :loading="interfaceLoading"
        @visible-change="handleInterfaceVisible"
        style="width: 100%"
      >
        <el-option
          v-for="item in interfaceOptions"
          :key="item.id"
          :value="item.id"
          :label="item.name"
          :disabled="!item.routeAppId"
        >
          <div class="route-option" :title="`${item.name} | ${item.route || ''}`">
            <div class="route-text">{{ item.name }}</div>
            <div class="route-desc" v-if="item.route">{{ item.route }}</div>
            <el-tag v-else type="danger" size="small">该路由所属应用已被删除</el-tag>
          </div>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input v-model="formModel.description" type="textarea" :rows="3" placeholder="请输入描述" />
    </el-form-item>
    <el-form-item label="启用应用加密" prop="enableAppEncrypt">
      <el-select v-model="formModel.enableAppEncrypt" placeholder="请选择" style="width: 180px">
        <el-option :value="IsOrNotEnum.Yes" label="是" />
        <el-option :value="IsOrNotEnum.No" label="否" />
      </el-select>
    </el-form-item>

    <el-form-item label="请求参数">
      <div style="width: 100%">
        <RequestParamEditor v-model="formModel.requestParameters" label="请求参数" />
      </div>
    </el-form-item>

    <el-form-item label="响应参数">
      <div style="width: 100%">
        <ResponseParamEditor v-model="formModel.responseParameters" label="响应参数" />
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import ExternalInterfaceMappingAPI from '../apis/external_interface_mapping.api'
import type { ExternalInterfaceMappingForm, ExternalInterfaceMappingVO } from '../dtos/external_interface_mapping.dto'
import InternalInterfaceMappingAPI from '../../inner/apis/internal_interface_mapping.api'
import type { InternalInterfaceMappingVO } from '../../inner/dtos/internal_interface_mapping.dto'
import { InterfaceParameterType, type InterfaceRequestParameter, type InterfaceResponseParameter, IsOrNotEnum } from '../../common/interface_parameter.dto'
import RequestParamEditor from '../../inner/components/RequestParamEditor.vue'
import ResponseParamEditor from '../../inner/components/ResponseParamEditor.vue'

const emit = defineEmits<{ (e: 'success'): void }>()
const props = defineProps<{ id?: string }>()

const formRef = ref(null)
const saving = ref(false)
const formModel = ref<{
  id: string
  name: string
  internalInterfaceId: string
  description: string
  enableAppEncrypt: IsOrNotEnum
  requestParameters: InterfaceRequestParameter[]
  responseParameters: InterfaceResponseParameter[]
}>({
  id: '',
  name: '',
  internalInterfaceId: '',
  description: '',
  enableAppEncrypt: IsOrNotEnum.No,
  requestParameters: [],
  responseParameters: [],
})

const typeOrder: InterfaceParameterType[] = [
  InterfaceParameterType.String,
  InterfaceParameterType.Int,
  InterfaceParameterType.Long,
  InterfaceParameterType.Float,
  InterfaceParameterType.Double,
  InterfaceParameterType.Bool,
  InterfaceParameterType.Decimal,
  InterfaceParameterType.Datetime,
  InterfaceParameterType.Date,
  InterfaceParameterType.Null,
  InterfaceParameterType.Object,
  InterfaceParameterType.Array,
  InterfaceParameterType.Stream,
]

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  internalInterfaceId: [{ required: true, message: '请选择内部接口', trigger: 'change' }],
  enableAppEncrypt: [{ required: true, message: '请选择是否启用应用加密', trigger: 'change' }],
}

const interfaceOptions = ref<InternalInterfaceMappingVO[]>([])
const interfaceLoading = ref(false)
const lastInterfaceQuery = ref<string>('')

function normalizeType(raw: any): InterfaceParameterType {
  if (typeof raw === 'number') return typeOrder[raw] ?? InterfaceParameterType.String
  if (typeof raw === 'string' && /^\d+$/.test(raw)) {
    const idx = Number(raw)
    return typeOrder[idx] ?? InterfaceParameterType.String
  }
  return (raw as InterfaceParameterType) || InterfaceParameterType.String
}

let reqKeySeed = 0
function normalizeRequestParams(list: InterfaceRequestParameter[] = []): InterfaceRequestParameter[] {
  return (list || []).map((item) => {
    const normalizedItems = item.items ? normalizeRequestParams(item.items) : []
    return {
      __key: (item as any).__key ?? `req_${Date.now()}_${reqKeySeed++}`,
      ...item,
      type: normalizeType(item.type),
      items: normalizedItems,
    }
  })
}

let resKeySeed = 0
function normalizeResponseParams(list: InterfaceResponseParameter[] = []): InterfaceResponseParameter[] {
  return (list || []).map((item) => {
    const normalizedItems = item.items ? normalizeResponseParams(item.items) : []
    return {
      __key: (item as any).__key ?? `res_${Date.now()}_${resKeySeed++}`,
      ...item,
      type: normalizeType(item.type),
      items: normalizedItems,
    }
  })
}

function resetForm() {
  formModel.value = {
    id: '',
    name: '',
    internalInterfaceId: '',
    description: '',
    enableAppEncrypt: IsOrNotEnum.No,
    requestParameters: [],
    responseParameters: [],
  }
}

async function loadInterfaceOptions(info?: string) {
  if (interfaceLoading.value) return
  const key = (info || '').trim()
  if (key === lastInterfaceQuery.value && interfaceOptions.value.length) return
  lastInterfaceQuery.value = key
  interfaceLoading.value = true
  try {
    const res = await InternalInterfaceMappingAPI.select({ page: 1, limit: 20, info: key || undefined })
    interfaceOptions.value = res || []
  } catch (err) {
    console.error(err)
    interfaceOptions.value = []
  } finally {
    interfaceLoading.value = false
  }
}

function handleInterfaceVisible(visible: boolean) {
  if (visible && interfaceOptions.value.length === 0) {
    lastInterfaceQuery.value = ''
    loadInterfaceOptions()
  }
}

function handleInterfaceSearch(keyword: string) {
  loadInterfaceOptions(keyword)
}

watch(
  () => props.id,
  async (id) => {
    resetForm()
    if (!id) return
    const detail = await ExternalInterfaceMappingAPI.detail(id) as ExternalInterfaceMappingVO
    formModel.value.id = detail?.id || ''
    formModel.value.name = detail?.name || ''
    formModel.value.internalInterfaceId = detail?.internalInterfaceId || ''
    formModel.value.description = detail?.description || ''
    formModel.value.enableAppEncrypt = detail?.enableAppEncrypt ?? IsOrNotEnum.No
    formModel.value.requestParameters = normalizeRequestParams(detail?.requestParameters || [])
    formModel.value.responseParameters = normalizeResponseParams(detail?.responseParameters || [])

    if (formModel.value.internalInterfaceId) {
      await loadInterfaceOptions(formModel.value.internalInterfaceId)
    }
  },
  { immediate: true }
)

async function submit() {
  try {
    await formRef.value?.validate?.()
  } catch (err) {
    return false
  }

  const checkParams = (
    list: InterfaceRequestParameter[] | InterfaceResponseParameter[],
    scopeLabel: string,
  ): boolean => {
    const dfs = (
      params: (InterfaceRequestParameter | InterfaceResponseParameter)[],
      parentPath: string,
    ): boolean => {
      const siblingNames = new Set<string>()
      for (const p of params || []) {
        const name = (p as any).name?.trim?.()
        const currentPath = parentPath ? `${parentPath} / ${name || '未命名'}` : name || '未命名'
        if (!name) {
          ElMessage.error(`${scopeLabel} 中存在未填写的参数名（位置：${currentPath}）`)
          return false
        }
        if (siblingNames.has(name)) {
          ElMessage.error(`${scopeLabel} 中存在同级重复的参数名：${name}`)
          return false
        }
        siblingNames.add(name)
        if ((p as any).items?.length) {
          if (!dfs((p as any).items, currentPath)) return false
        }
      }
      return true
    }

    return dfs(list as any, '')
  }

  if (!checkParams(formModel.value.requestParameters, '请求参数')) return false
  if (!checkParams(formModel.value.responseParameters, '响应参数')) return false

  saving.value = true
  try {
    await ExternalInterfaceMappingAPI.save({
      id: formModel.value.id,
      name: formModel.value.name,
      internalInterfaceId: formModel.value.internalInterfaceId,
      description: formModel.value.description,
      enableAppEncrypt: formModel.value.enableAppEncrypt,
      requestParameters: formModel.value.requestParameters,
      responseParameters: formModel.value.responseParameters,
    } as ExternalInterfaceMappingForm)

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

defineExpose({ submit })
</script>

<style scoped>
.route-option {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.route-text,
.route-desc {
  white-space: nowrap;
  overflow-x: auto;
  max-width: 50%;
}
.route-text {
  font-weight: 600;
}
.route-desc {
  font-size: 12px;
  text-align: right;
}
</style>
