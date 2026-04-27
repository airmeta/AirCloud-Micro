<template>
        <air-table
                ref="dataTableRefLocal"
                :queryFormRef="queryFormRef"
                v-loading="loading"
                row-key="id"
                :request="AppInterfaceAuthorizationAPI.query"
                :after-request="afterRequest"
                :columns="tableColumns"
        >
                <template #toolbar-left>
                        <el-button type="primary" icon="plus"  @click="handleOpenDialog()">新增</el-button>
                </template>

                <template #table-query-form>
                        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                                <el-form-item label="关键词" prop="keyword">
                                        <el-input placeholder="应用ID / 动作编号 / 描述" v-model="queryParams.keyword" clearable />
                                </el-form-item>
                                <el-form-item label="授权应用" prop="appId">
                                        <el-select v-model="queryParams.appId" placeholder="请选择应用" filterable clearable style="width: 220px">
                                                <el-option v-for="opt in appOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                                        </el-select>
                                </el-form-item>
                                <el-form-item label="接口信息" prop="externalInterfaceId">
                                        <el-select v-model="queryParams.externalInterfaceId" placeholder="请选择接口" filterable clearable style="width: 220px">
                                                <el-option v-for="opt in externalOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                                        </el-select>
                                </el-form-item>
                        </el-form>
                </template>

                <template #appId="{ row }">
                        {{ getAppLabel(row.appId) }}
                </template>

                <template #externalInterfaceId="{ row }">
                        {{ getExternalLabel(row.externalInterfaceId) }}
                </template>

                <template #actionId="{ row }">
                        <span>{{ row.actionId || '-' }}</span>
                        <el-button v-if="row.actionId || row.actionSecret" type="primary" link size="small" @click.stop="handleShowActionInfo(row)">
                                <el-icon>
                                        <View />
                                </el-icon>
                        </el-button>
                </template>

                <template #expiredTime="{ row }">
                        <template v-if="row.expiredTime">
                                <el-tooltip v-if="getExpireTip(row.expiredTime)" :content="getExpireTip(row.expiredTime)" placement="top">
                                        <el-tag
                                                :type="getExpireInfo(row.expiredTime).expired ? 'danger' : getExpireInfo(row.expiredTime).type"
                                                effect="plain"
                                        >
                                                <span :class="getExpireInfo(row.expiredTime).expired ? 'expired-text' : ''">{{ row.expiredTime }}</span>
                                        </el-tag>
                                </el-tooltip>
                                <template v-else>
                                        <el-tag
                                                :type="getExpireInfo(row.expiredTime).expired ? 'danger' : getExpireInfo(row.expiredTime).type"
                                                effect="plain"
                                        >
                                                <span :class="getExpireInfo(row.expiredTime).expired ? 'expired-text' : ''">{{ row.expiredTime }}</span>
                                        </el-tag>
                                </template>
                                <el-tooltip
                                        v-if="getExpireInfo(row.expiredTime).expired"
                                        content="当前接口授权已到期,无法访问!"
                                        placement="top"
                                >
                                        <el-icon style="color: var(--el-color-danger); margin-left: 4px;">
                                                <CloseBold />
                                        </el-icon>
                                </el-tooltip>
                                <el-tooltip
                                        v-else-if="getExpireInfo(row.expiredTime).type === 'danger'"
                                        content="请注意当前接口授权已不足30天!"
                                        placement="top"
                                >
                                        <el-icon style="color: var(--el-color-danger); margin-left: 4px;">
                                                <WarningFilled />
                                        </el-icon>
                                </el-tooltip>
                        </template>
                        <template v-else>
                                -
                        </template>
                </template>

                <template #operation="{ row }">
                        <el-button type="primary" link size="small" @click.stop="handleOpenDialog(row)">
                                <el-icon>
                                        <Edit />
                                </el-icon>
                                编辑
                        </el-button>
                        <el-button type="danger" link size="small" @click.stop="handleDelete(row)">
                                <el-icon>
                                        <Delete />
                                </el-icon>
                                删除
                        </el-button>
                </template>
        </air-table>

        <el-drawer v-model="dialogVisible" :title="dialogTitle" size="70%">
                <FormDialog
                        ref="formDialogRef"
                        :app-id="currentAppId"
                        :action-id="currentActionId"
                        @success="handleFormSuccess"
                />
                <template #footer>
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" :loading="dialogSaving" @click="handleSave">保存</el-button>
                </template>
        </el-drawer>

        <el-dialog v-model="actionInfoDialog.visible" title="动作信息" width="420px">
                <div class="dialog-line">
                        <strong>动作编号：</strong><span>{{ actionInfoDialog.actionId || '-' }}</span>
                </div>
                <div class="dialog-line">
                        <strong>动作密钥：</strong><span>{{ actionInfoDialog.actionSecret || '-' }}</span>
                </div>
                <template #footer>
                        <el-button @click="actionInfoDialog.visible = false">关闭</el-button>
                </template>
        </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import AirTable from '@root/base/components/air/AirTable/index.vue'
import { AirTableColumn } from '@root/base/components/air/AirTable/components/air-table-column'
import { QueryResult } from '@root/base/components/air/AirTable/dtos/PageQuery'
import AppInterfaceAuthorizationAPI from './apis/app_interface_authorization.api'
import type { AppInterfaceAuthorizationForm } from './dtos/app_interface_authorization.dto'
import FormDialog from './components/form.vue'
import { Edit, Delete, View, WarningFilled, CloseBold } from '@element-plus/icons-vue'
import AppAPI from "../../system/app/apis/app.api"
import ExternalInterfaceMappingAPI from '../outer/apis/external_interface_mapping.api'

const dataTableRefLocal = ref<any>(null)
const formDialogRef = ref<any>(null)
const queryFormRef = ref(null)
const loading = ref(false)
const queryParams = ref({ keyword: '', appId: '', externalInterfaceId: '' })
const dialogVisible = ref(false)
const dialogTitle = ref('新增应用接口授权')
const dialogSaving = ref(false)
const currentAppId = ref<string | undefined>('')
const currentActionId = ref<string | undefined>('')

const actionInfoDialog = ref({ visible: false, actionId: '', actionSecret: '' })

const appOptions = ref<{ label: string; value: string }[]>([])
const externalOptions = ref<{ label: string; value: string }[]>([])

const appMap = computed<Record<string, string>>(() => {
        const map: Record<string, string> = {}
        appOptions.value.forEach((a) => {
                map[`${a.value}`] = a.label
        })
        return map
})

const externalMap = computed<Record<string, string>>(() => {
        const map: Record<string, string> = {}
        externalOptions.value.forEach((e) => {
                map[`${e.value}`] = e.label
        })
        return map
})

const tableColumns = [
        { label: '序号', type: 'index', width: 60 },
        { label: '应用ID', prop: 'appId', minWidth: 160,slot: 'appId'},
        { label: '对外接口ID', prop: 'externalInterfaceId', minWidth: 200, slot: 'externalInterfaceId' },
        { label: '访问信息', prop: 'actionId', minWidth: 200, slot: 'actionId' },
        { label: '到期时间', prop: 'expiredTime', slot: 'expiredTime', minWidth: 200 },
        { label: '描述', prop: 'description', minWidth: 220 },
        { label: '操作', fixed: 'right', width: 120, slot: 'operation' },
] as AirTableColumn[]

async function afterRequest(raw: any, parsed: QueryResult<AppInterfaceAuthorizationForm>) {
        return { list: parsed.list, page: parsed.page }
}

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

function getAppLabel(id?: string) {
        if (!id) return ''
        return appMap.value[id] || id
}

function getExternalLabel(id?: string) {
        if (!id) return ''
        return externalMap.value[id] || id
}

function getExpireInfo(expiredTime?: string) {
        const EMPTY = { type: '', days: Number.NaN, expired: false }
        if (!expiredTime) return EMPTY
        const ts = new Date(expiredTime).getTime()
        if (Number.isNaN(ts)) return EMPTY
        const diffDays = Math.floor((ts - Date.now()) / 86400000)
        if (diffDays < 0) return { type: 'danger', days: diffDays, expired: true }
        if (diffDays > 100) return { type: 'success', days: diffDays, expired: false }
        if (diffDays > 30) return { type: 'warning', days: diffDays, expired: false }
        return { type: 'danger', days: diffDays, expired: false }
}

function getExpireTip(expiredTime?: string) {
        const info = getExpireInfo(expiredTime)
        if (!expiredTime || Number.isNaN(info.days)) return ''
        if (info.expired) return '当前接口授权已到期,无法访问!'
        if (info.days > 100) return '距离到期时间超过100天'
        if (info.days > 30) return '距离到期时间超过30天'
        return '距离到期时间不足30天'
}

async function handleOpenDialog(row?: AppInterfaceAuthorizationForm) {
        dialogTitle.value = row ? '编辑应用接口授权' : '新增应用接口授权'
        currentAppId.value = row?.appId
        currentActionId.value = row?.actionId
        dialogVisible.value = true
        await nextTick()
        if (!row) formDialogRef.value?.resetForm?.()
}

function handleDelete(row?: AppInterfaceAuthorizationForm) {
        if (!row?.appId || !row?.actionId) {
                ElMessage.error('缺少应用ID或动作编号')
                return
        }
        ElMessageBox.confirm('确认删除该应用接口授权吗？', '提示', { type: 'warning' })
                .then(async () => {
                        await AppInterfaceAuthorizationAPI.remove({
                                appId: row.appId,
                                actionId: row.actionId,
                                remark: row.deleteRemark || '',
                        })
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

function handleShowActionInfo(row: AppInterfaceAuthorizationForm) {
        actionInfoDialog.value = {
                visible: true,
                actionId: row?.actionId || '',
                actionSecret: row?.actionSecret || '',
        }
}

onMounted(() => {
        loadAppOptions()
        loadExternalOptions()
})
</script>

<style scoped>
.container { padding: 16px; }
.dialog-line { margin-bottom: 8px; }
.dialog-line strong { display: inline-block; width: 88px; font-weight: 600; }
.expired-text { text-decoration: line-through; color: var(--el-color-danger); }
</style>
