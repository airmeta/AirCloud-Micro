<template>
  <el-form ref="formRef" :model="formModel" :rules="rules" label-width="110px">
    <el-form-item label="名称" prop="name">
      <el-input v-model="formModel.name" placeholder="请输入名称" />
    </el-form-item>
    <el-form-item label="接口路由ID" prop="routeId">
      <el-select
        v-model="formModel.routeId"
        filterable
        remote
        clearable
        placeholder="请选择路由ID"
        :remote-method="handleRouteSearch"
        :loading="routeLoading"
        @visible-change="handleRouteVisible"
        style="width: 100%"
      >
        <el-option
          v-for="item in routeOptions"
          :key="item.id"
          :value="item.id"
          :label="item.route"
        >
          <div class="route-option" title="{{ item.route }} | {{ item.description || '' }}">
            <div class="route-text">{{ item.route }}</div>
            <div class="route-desc" v-if="item.description">{{ item.description }}</div>
          </div>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input v-model="formModel.description" placeholder="请输入描述" />
    </el-form-item>

    <!-- 请求参数列表 -->
    <el-form-item label="请求参数">
      <div style="width: 100%">
        <RequestParamEditor v-model="formModel.requestParameters" label="请求参数" />
      </div>
    </el-form-item>

    <!-- 响应参数列表 -->
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
import InternalInterfaceMappingAPI from '../apis/internal_interface_mapping.api'
import type { InternalInterfaceMappingForm } from '../dtos/internal_interface_mapping.dto'
import AppRouteAPI from '../../../system/app/apis/app_route.api'
import type { AppRouteVO } from '../../../system/app/dtos/app_route.dto'
import { InterfaceParameterType, type InterfaceRequestParameter, type InterfaceResponseParameter } from '../../common/interface_parameter.dto'
import RequestParamEditor from './RequestParamEditor.vue'
import ResponseParamEditor from './ResponseParamEditor.vue'

const emit = defineEmits<{
  (e: 'success'): void
}>()

const props = defineProps<{ id?: string }>()
const formRef = ref(null)
const saving = ref(false)
const formModel = ref<{
  id: string
  name: string
  routeId: string
  description: string
  requestParameters: InterfaceRequestParameter[]
  responseParameters: InterfaceResponseParameter[]
}>(
  {
    id: '',
    name: '',
    routeId: '',
    description: '',
    requestParameters: [],
    responseParameters: [],
  }
)

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  routeId: [{ required: true, message: '请选择接口路由ID', trigger: 'change' }],
}

const routeOptions = ref<AppRouteVO[]>([])
const routeLoading = ref(false)

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
    routeId: '',
    description: '',
    requestParameters: [],
    responseParameters: [],
  }
}

watch(
  () => props.id,
  async (id) => {
    resetForm()
    if (!id) return
    const detail = await InternalInterfaceMappingAPI.detail(id)
    formModel.value.id = detail?.id || ''
    formModel.value.name = detail?.name || ''
    formModel.value.routeId = detail?.routeId || ''
    formModel.value.description = detail?.description || ''
    formModel.value.requestParameters = normalizeRequestParams(detail?.requestParameters || [])
    formModel.value.responseParameters = normalizeResponseParams(detail?.responseParameters || [])

    // 预加载当前路由选项以便显示标签
    if (formModel.value.routeId) await loadRouteOptions(formModel.value.routeId)
  },
  { immediate: true }
)

async function loadRouteOptions(info?: string) {
  routeLoading.value = true
  try {
    const res = await AppRouteAPI.queryRoutes({ page: 1, limit: 20, info })
    routeOptions.value = res?.list || []
  } catch (err) {
    console.error(err)
    routeOptions.value = []
  } finally {
    routeLoading.value = false
  }
}

function handleRouteVisible(visible: boolean) {
  if (visible && routeOptions.value.length === 0) {
    loadRouteOptions()
  }
}

function handleRouteSearch(keyword: string) {
  loadRouteOptions(keyword)
}

async function submit() {
  try {
    await formRef.value?.validate?.()
  } catch (err) {
    return false
  }
  // 校验请求/响应参数：所有名称必填且不重复
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
    await InternalInterfaceMappingAPI.save({
      id: formModel.value.id,
      name: formModel.value.name,
      routeId: formModel.value.routeId,
      description: formModel.value.description,
      requestParameters: formModel.value.requestParameters,
      responseParameters: formModel.value.responseParameters,
    } as InternalInterfaceMappingForm)

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
  color: #f56c6c;
  font-size: 12px;
  text-align: right;
}
</style>
