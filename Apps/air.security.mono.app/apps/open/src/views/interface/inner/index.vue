<template>
   <air-table
            ref="dataTableRefLocal"
            :queryFormRef="queryFormRef"
            v-loading="loading"
            row-key="id"
            :request="InternalInterfaceMappingAPI.query"
            :after-request="afterRequest"
            :columns="tableColumns"
        >
            <template #toolbar-left>
                <el-button type="primary" icon="plus" @click="handleOpenDialog()">新增</el-button>
            </template>
            <template #table-query-form>
                <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                    <el-form-item label="关键词" prop="keyword">
                        <el-input placeholder="名称 / 路由ID / 描述" v-model="queryParams.keyword" clearable />
                    </el-form-item>
                </el-form>
            </template>

            <template #paramInfo="{ row }">
                <div class="param-info">
                    <span>请求参数: {{ row.requestParameters?.length ?? 0 }}个</span>
                    <span>响应参数: {{ row.responseParameters?.length ?? 0 }}个</span>
                    <el-icon class="param-eye" @click.stop="handleShowParams(row)">
                        <View />
                    </el-icon>
                </div>
            </template>

            <template #name="{ row }">
                <div class="name-cell" :title="`名称: ${row.name}`">
                    <span>{{ row.name || '-' }}</span>
                    <el-tooltip
                        v-if="!row.routeAppId"
                        content="该应用已被删除,此路由地址已不可访问"
                        placement="top"
                    >
                        <el-icon class="name-warning-icon">
                            <WarningFilled style="color: #E6A23C" />
                        </el-icon>
                    </el-tooltip>
                </div>
            </template>

            <template #route="{ row }">
                <div class="route-cell">
                      <el-tag
                        v-if="row.routeAppName || row.routeAppId"
                        :type="row.routeAppId ? 'primary' : 'danger'"
                        size="small"
                    >
                        {{ row.routeAppName || '未关联应用' }}
                    </el-tag>
                    <span class="route-path">{{ row.route || '-' }}</span>
                </div>
            </template>

            <template #operation="{ row }">
                <el-button type="primary" link size="small" @click.stop="handleOpenDialog(row.id)">
                    <el-icon>
                        <Edit />
                    </el-icon>
                    编辑
                </el-button>
                <el-button type="danger" link size="small" @click.stop="handleDelete(row.id)">
                    <el-icon>
                        <Delete />
                    </el-icon>
                    删除
                </el-button>
            </template>
        </air-table>
        <el-drawer v-model="dialogVisible" :title="dialogTitle" size="70%">
            <FormDialog ref="formDialogRef" :id="currentId" @success="handleFormSuccess" />
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="dialogSaving" @click="handleSave">保存</el-button>
            </template>
        </el-drawer>

        <el-dialog v-model="paramDialogVisible" :title="paramDialogTitle" width="50%">
            <pre class="param-json">{{ paramDialogContent }}</pre>
            <template #footer>
                <el-button @click="paramDialogVisible = false">关闭</el-button>
            </template>
        </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import AirTable from '@root/base/components/air/AirTable/index.vue'
import { AirTableColumn } from '@root/base/components/air/AirTable/components/air-table-column'
import { QueryResult } from '@root/base/components/air/AirTable/dtos/PageQuery'
import InternalInterfaceMappingAPI from './apis/internal_interface_mapping.api'
import type { InternalInterfaceMappingVO } from './dtos/internal_interface_mapping.dto'
import FormDialog from './components/form.vue'
import { Edit, Delete, WarningFilled, View } from '@element-plus/icons-vue'

const dataTableRefLocal = ref<any>(null)
const formDialogRef = ref<any>(null)
const queryFormRef = ref(null)
const loading = ref(false)
const queryParams = ref({ keyword: '' })
const dialogVisible = ref(false)
const dialogTitle = ref('新增内网接口')
const dialogSaving = ref(false)
const currentId = ref<string | undefined>('')
const paramDialogVisible = ref(false)
const paramDialogTitle = ref('参数详情')
const paramDialogContent = ref('')

const tableColumns = [
    { label: '序号', type: 'index', width: 60 },
    { label: '名称', prop: 'name', minWidth: 160,slot: 'name' },
    { label: '路由', prop: 'route', minWidth: 240, slot: 'route' },
    { label: '描述', prop: 'description', minWidth: 220 },
    { label: '请求/响应参数', prop: 'requestParameters', slot: 'paramInfo', minWidth: 260 },
    { label: '操作', fixed: 'right', width: 120, slot: 'operation' },
] as AirTableColumn[]

async function afterRequest(raw: any, parsed: QueryResult<InternalInterfaceMappingVO>) {
    return { list: parsed.list, page: parsed.page }
}

async function handleOpenDialog(id?: string) {
    dialogTitle.value = id ? '编辑内网接口' : '新增内网接口'
    currentId.value = id
    dialogVisible.value = true
    await nextTick()
}

function handleDelete(id?: string) {
    if (!id) return
    ElMessageBox.confirm('确认删除该内网接口吗？', '提示', { type: 'warning' })
        .then(async () => {
            await InternalInterfaceMappingAPI.remove(id)
            ElMessage.success('删除成功')
            dataTableRefLocal.value?.reload?.()
        })
        .catch(() => {})
}

function handleFormSuccess() {
    dataTableRefLocal.value?.reload?.()
}

async function handleSave() {
    dialogSaving.value = true
    try {
        const ok = await formDialogRef.value?.submit?.()
        if (ok) dialogVisible.value = false
    } finally {
        dialogSaving.value = false
    }
}

function handleShowParams(row: InternalInterfaceMappingVO) {
    const payload = {
        requestParameters: row.requestParameters || [],
        responseParameters: row.responseParameters || [],
    }
    paramDialogContent.value = JSON.stringify(payload, null, 2)
    paramDialogTitle.value = `参数详情 - ${row.name || row.id}`
    paramDialogVisible.value = true
}
</script>

<style scoped>
.container{padding:16px}
.route-cell{display:flex;align-items:center;gap:8px}
.route-path{color:#606266}
.name-cell{display:flex;align-items:center;gap:6px}
.name-warning-icon{cursor:pointer}
.param-info{display:flex;align-items:center;gap:8px}
.param-eye{cursor:pointer;color:#409EFF}
.param-json{background:#f5f5f5;padding:12px;border-radius:6px;max-height:400px;overflow:auto}
</style>