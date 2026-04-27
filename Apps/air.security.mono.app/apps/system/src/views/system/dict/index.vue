<template>
    <div class="dict-container" style="display:flex;height:100%;">
        <div class="dict-left"
            style="width:240px;border-right:1px solid var(--el-border-color);overflow:auto;padding:12px;box-sizing:border-box">
            <el-form ref="leftQueryRef" :model="leftQueryParams" :inline="true"
                style="margin-bottom:8px;display:flex;gap:8px;align-items:center;">
                <el-form-item label="标签" prop="label"
                    style="width: 100%;margin-right:0px !important;margin-bottom:5px !important;">
                    <el-input v-model="leftQueryParams.label" placeholder="筛选标签" clearable style="width: 100%;" />
                </el-form-item>
            </el-form>
            <div style="display:flex;gap:6px;margin-bottom:8px;justify-content:space-between;">
                <el-button size="small" type="primary" @click="openAddLeft">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    添加
                </el-button>
                <el-button size="small" @click="openEditLeft">
                    <el-icon>
                        <Edit />
                    </el-icon>
                    编辑
                </el-button>
                <el-button size="small" type="danger" @click="deleteLeft">
                    <el-icon>
                        <Delete />
                    </el-icon>
                    删除
                </el-button>
            </div>
            <el-menu :default-active="selectedId" class="el-menu-vertical" @select="onLeftSelect">
                <el-menu-item style="height: 40px;" v-for="item in filterData" :key="item.id" :index="item.id">
                    <div style="display: flex;justify-content: space-between;align-items: center;width:100%;">
                        <div style="display: flex;justify-content: space-between;align-items: center; ">
                            <div>
                               <el-icon><Operation /></el-icon>
                            </div>
                            <strong>{{ item.label }}</strong>
                        </div>
                        <div style="font-size:12px;color:#323232;">{{ item.code }}</div>
                    </div>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="dict-right" :style="{ width: 'calc(100% - 240px)', padding: '12px' }">
            <div v-if="selectedId">
                <air-table ref="tableRef" :columns="columns" :queryFormRef="queryFormRef" :request="queryRight"
                    :after-request="afterRequest" row-key="id">
                    <template #toolbar-left>
                        <el-button size="small" type="primary" @click="openAddRight">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            添加
                        </el-button>
                    </template>
                    <template #table-query-form>
                        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                            <el-form-item label="标签" prop="label">
                                <el-input v-model="queryParams.label" placeholder="请输入标签检索" clearable />
                            </el-form-item>
                            <el-form-item label="编码" prop="code">
                                <el-input v-model="queryParams.code" placeholder="请输入编码检索" clearable />
                            </el-form-item>
                            <el-form-item label="值" prop="value">
                                <el-input v-model="queryParams.value" placeholder="请输入值检索" clearable />
                            </el-form-item>
                        </el-form>
                    </template>
                    <template #operation="{ row }">
                        <el-button size="small" type="primary" link @click="openEditRow(row)">
                            <el-icon>
                                <Edit />
                            </el-icon>
                            编辑
                        </el-button>
                        <el-button size="small" type="danger" link @click="deleteRow(row)">
                            <el-icon>
                                <Delete />
                            </el-icon>
                            删除
                        </el-button>
                    </template>
                </air-table>
            </div>
            <div v-else class="placeholder">
                <el-empty description="请选择左侧项" />
            </div>
        </div>

    </div>

    <el-drawer v-model="dialog.visible" :title="dialog.title" size="520px" @close="closeDialog">
        <component :is="DictForm" ref="dictFormRef" :model="formData" />
        <template #footer>
            <div style="text-align:right;margin-top:12px;">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="saveDialog">保存</el-button>
            </div>
        </template>
    </el-drawer>

</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import AirTable from '@root/base/components/air/AirTable/index.vue';
import type { AirTableColumn } from '@root/base/components/air/AirTable/components/air-table-column';
import type { DictVO } from './dtos/dict.dto';
import DictAPI from './apis/dict.api';
import DictForm from './components/form.vue';
import { ElMessage } from 'element-plus';
import { Plus, Edit, Delete } from '@element-plus/icons-vue';

const baseList = ref<any[]>([]);
const selectedId = ref<string | undefined>(undefined);
const tableRef = ref<any>(null);
const columns = ref<AirTableColumn<DictVO>[]>([
    { label: '编码', prop: 'code', minWidth: 140 },
    { label: '标签', prop: 'label', minWidth: 160 },
    { label: '值', prop: 'value', minWidth: 160 },
    { label: '描述', prop: 'description', minWidth: 240, showOverflowTooltip: true },
    { label: '操作', slot: 'operation', width: 160, align: 'center' }
]);

const queryFormRef = ref();
const queryParams = reactive({ code: '', label: '', value: '' });

const leftQueryRef = ref();
const leftQueryParams = reactive({ label: '' });

const filterData = computed(() => {
    const q = (leftQueryParams.label || '').trim().toLowerCase();
    if (!q) return baseList.value;
    return baseList.value.filter((it: any) => (it.label || '').toLowerCase().includes(q));
});
// dialog for add/edit
const dialog = reactive({ title: '新增字典', visible: false });
const dictFormRef = ref<any>(null);
const formData = ref<any>({});

function openAddLeft() {
    formData.value = { id: '', parentId: null, code: '', label: '', value: '', description: '', meta: '' };
    dialog.title = '新增字典(父级: 根)';
    dialog.visible = true;
}

async function openEditLeft() {
    if (!selectedId.value) {
        ElMessage.warning('请先选择一项进行编辑');
        return;
    }
    try {
        const resp: any = await DictAPI.detail(selectedId.value);
        formData.value = resp || {};
        dialog.title = '编辑字典';
        dialog.visible = true;
    } catch (e) {
        ElMessage.error('获取详情失败');
    }
}

async function deleteLeft() {
    if (!selectedId.value) {
        ElMessage.warning('请先选择一项删除');
        return;
    }
    try {
        await DictAPI.remove(selectedId.value);
        ElMessage.success('删除成功');
        // refresh backend list after delete
        await loadBase();
        tableRef.value?.reload?.();
    } catch (e) {
        ElMessage.error('删除失败');
    }
}

function openAddRight() {
    if (!selectedId.value) {
        ElMessage.warning('请先选择父级');
        return;
    }
    formData.value = { id: '', parentId: selectedId.value, code: '', label: '', value: '', description: '', meta: '' };
    dialog.title = '新增字典(父级: 子项)';
    dialog.visible = true;
}

async function openEditRow(row: any) {
    if (!row || !row.id) return;
    try {
        const resp: any = await DictAPI.detail(row.id);
        formData.value = resp || {};
        dialog.title = '编辑字典';
        dialog.visible = true;
    } catch (e) {
        ElMessage.error('获取详情失败');
    }
}

async function deleteRow(row: any) {
    if (!row || !row.id) return;
    try {
        await DictAPI.remove(row.id);
        ElMessage.success('删除成功');
        tableRef.value?.reload?.();
        await loadBase();
    } catch (e) {
        ElMessage.error('删除失败');
    }
}

async function saveDialog() {
    try {
        await dictFormRef.value.validate();
        const vals = dictFormRef.value.getValues();
        const ok = await DictAPI.save(vals);
        if (ok) {
            ElMessage.success('保存成功');
            dialog.visible = false;
            // refresh lists (reload backend data after changes)
            await loadBase();
            tableRef.value?.reload?.();
        } else {
            ElMessage.error('保存失败');
        }
    } catch (e: any) {
        // validation failed or save error
    }
}

function closeDialog() {
    dialog.visible = false;
}

function doSearch() {
    tableRef.value?.reload?.();
}

function doReset() {
    queryParams.code = '';
    queryParams.label = '';
    queryParams.value = '';
    tableRef.value?.reload?.();
}

async function loadBase() {
    try {
        const resp: any = await DictAPI.queryBase({ Label: leftQueryParams.label });
        // expect array
        baseList.value = resp || [];
        if (baseList.value.length > 0) {
            selectedId.value = baseList.value[0].id;
            // table will fetch automatically via queryRight when requested
        }
    } catch (e) {
        baseList.value = [];
    }
}

function onLeftSelect(id: string) {
    selectedId.value = id;
    // reload table
    tableRef.value?.reload?.();
}

// AirTable expects a request function that accepts params
async function queryRight(params?: any) {
    // don't load right table when no left selection
    if (!selectedId.value) {
        return Promise.resolve({ list: [], page: { total: 0 } });
    }
    const p = { ...(params || {}), ParentId: selectedId.value };
    return DictAPI.query(p);
}

function afterRequest(raw: any, parsed: any) {
    return { list: parsed.list || parsed || [], page: parsed.page };
}

onMounted(() => {
    loadBase();
});
</script>
<style scoped>
.dict-container {
    height: 100%;
}

.dict-left .el-menu {
    border-right: none;
}

.el-menu-vertical {
    width: 100%;
}

.dict-right .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--el-text-color-secondary);
}
</style>
