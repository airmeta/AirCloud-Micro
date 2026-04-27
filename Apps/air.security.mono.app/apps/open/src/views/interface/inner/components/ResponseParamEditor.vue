<template>
  <!-- 父级为数组：块状直显子字段，无展开，默认仅一个数组元素不可增删 -->
  <div v-if="parentType === 'array'" class="param-editor array-mode">
    <div v-if="modelValue?.length" class="array-blocks">
      <div
        v-for="(item, index) in modelValue"
        :key="item.__key || index"
        class="array-block"
      >
        <div class="array-block__header">
          <span class="expand-title">{{ label || '数组项' }} 的子参数</span>
          <span class="expand-tip">(array: 数组元素)</span>
        </div>
        <ResponseParamEditor
          v-model="item.items"
          label="数组项字段"
          :depth="(depth || 0) + 1"
          parent-type="object"
          parent-parent-type="array"
        />
      </div>
    </div>
    <div v-else class="empty-tip">暂无数组项</div>
  </div>

  <div v-else class="param-editor">
    <el-button type="primary" size="small" @click="addParam" style="margin-bottom: 8px">
      + 添加{{ label || '参数' }}
    </el-button>
    <el-table
      :data="modelValue"
      stripe
      border
      size="small"
      style="width: 100%"
      row-key="__key"
      :default-expand-all="false"
      :row-class-name="getRowClassName"
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <div v-if="row.type === 'object' || row.type === 'array'" class="expand-content">
            <ResponseParamEditor
              v-model="row.items"
              :label="row.type === 'object' ? '子属性' : '数组项'"
              :depth="(depth || 0) + 1"
              :parent-type="row.type"
              :parent-parent-type="parentType"
            />
          </div>
          <div v-else class="expand-content">
            <span class="expand-tip">基础类型，无子项</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="110">
        <template #default="{ row }">
          <el-select v-model="row.type" size="small" style="width: 100%" @change="handleTypeChange(row)">
            <el-option
              v-for="opt in getTypeOptions()"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="参数名" min-width="120">
        <template #default="{ row }">
          <el-input v-model="row.name" size="small" placeholder="参数名" />
        </template>
      </el-table-column>
      <el-table-column prop="value" label="示例值" min-width="120">
        <template #default="{ row }">
          <el-input v-model="row.value" size="small" placeholder="示例值" />
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" min-width="150">
        <template #default="{ row }">
          <el-input v-model="row.description" size="small" placeholder="描述" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60" fixed="right">
        <template #default="{ $index }">
          <el-button type="danger" link size="small" @click="removeParam($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import type { InterfaceResponseParameter } from '../../common/interface_parameter.dto'

const props = defineProps<{
  modelValue: InterfaceResponseParameter[]
  label?: string
  depth?: number
  parentType?: string
  parentParentType?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: InterfaceResponseParameter[]): void
}>()

// 根据父类型决定可选的类型列表
function getTypeOptions() {
  // 父级是 array，则子级只能是 object
  if (props.parentType === 'array') {
    return [
      { label: 'object', value: 'object' },
    ]
  }
  // 父级是 object，或父级为 object 且其父级为 array，则子级只能是基础类型
  if (props.parentType === 'object' || (props.parentType === 'object' && props.parentParentType === 'array')) {
    return [
      { label: 'string', value: 'string' },
      { label: 'int', value: 'int' },
      { label: 'long', value: 'long' },
      { label: 'bool', value: 'bool' },
    ]
  }
  // 顶级可以选择所有类型
  return [
    { label: 'string', value: 'string' },
    { label: 'int', value: 'int' },
    { label: 'long', value: 'long' },
    { label: 'bool', value: 'bool' },
    { label: 'object', value: 'object' },
    { label: 'array', value: 'array' },
  ]
}

let keyCounter = 0
function genKey() {
  return `__res_${Date.now()}_${keyCounter++}`
}

function addParam() {
  // 先校验已存在的参数名是否填写
  const hasEmptyName = (props.modelValue || []).some((p) => !p.name || !String(p.name).trim())
  if (hasEmptyName) {
    ElMessage.warning('请先填写现有参数名，再新增')
    return
  }
  // 根据父类型决定默认类型
  let defaultType = 'string'
  if (props.parentType === 'array') {
    defaultType = 'object'
    if (props.modelValue.length >= 1) return // 数组元素仅允许一个对象模板
  }
  const newParam: any = {
    __key: genKey(),
    name: '',
    type: defaultType,
    value: '',
    description: '',
    items: [],
  }
  props.modelValue.push(newParam)
}

function ensureArrayElementsObject(list: InterfaceResponseParameter[]) {
  if (!list) return
  if (props.parentType === 'array' && list.length > 1) {
    list.splice(1) // 数组元素仅保留一个模板对象
  }
  for (const item of list) {
    if (props.parentType === 'array') {
      item.type = 'object'
      if (!item.name) item.name = 'item'
      if (!item.items) item.items = []
    }
  }
  if (props.parentType === 'array' && list.length === 0) {
    props.modelValue.push({
      __key: genKey(),
      name: 'item',
      type: 'object',
      value: '',
      description: '',
      items: [],
    } as any)
  }
}

ensureArrayElementsObject(props.modelValue)

function removeParam(index: number) {
  props.modelValue.splice(index, 1)
}

function handleTypeChange(row: any) {
  if (row.type === 'object' || row.type === 'array') {
    if (!row.items) row.items = []
  }
}

function getRowClassName({ row }: { row: any }) {
  if (row.type !== 'object' && row.type !== 'array') {
    return 'hide-expand'
  }
  return ''
}
</script>

<style scoped>
.param-editor {
  width: 100%;
}
.expand-content {
  padding: 12px 16px;
}
.expand-header {
  font-weight: 500;
  margin-bottom: 12px;
  color: #303133;
  display: flex;
  gap: 12px;
  align-items: center;
}
.expand-title {
  font-size: 14px;
}
.expand-tip {
  font-size: 12px;
  color: #909399;
}
.array-mode .array-blocks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.array-mode .array-block {
  border: 1px solid #ebeef5;
  border-radius: 6px;
  padding: 12px;
  background: #fafafa;
}

.array-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  margin-bottom: 10px;
  color: #303133;
}

.empty-tip {
  color: #a0a3a6;
  font-size: 13px;
}
</style>

<style>
.param-editor .el-table .hide-expand .el-table__expand-icon {
  display: none !important;
}
</style>
