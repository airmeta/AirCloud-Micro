<template>
    <div class="app-container">
        <air-table ref="dataTableRefLocal" :queryFormRef="queryFormRef" v-loading="loading" row-key="id"
            :request="RoleAPI.query" :after-request="afterRequest" @row-click="handleRowClick"
            @selection-change="onSelectionChange" :columns="tableColumns">
            <template #table-query-form>
                <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                    <el-form-item label="角色名" prop="roleName">
                        <el-input placeholder="角色名" v-model="queryParams.roleName" clearable />
                    </el-form-item>
                </el-form>
            </template>
            <template #toolbar-left>
                <el-button type="primary" @click="handleOpenDialog()">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    添加
                </el-button>
                <el-button type="warning" :disabled="!rp.selectedId" style="margin-left:8px;"
                    @click="handleCopyFromSelect">
                    <el-icon>
                        <DocumentCopy />
                    </el-icon>
                    复制
                </el-button>
            </template>
            <template #appId="{ row }">
                <el-tag type="primary">{{ appMap[row.appId] || row.appId }}</el-tag>
            </template>
            <template #operation="{ row }">
                <el-button type="primary" link size="small" icon="edit"
                    @click.stop="handleOpenDialog(undefined, row.id)">
                    编辑
                </el-button>

                <el-button type="primary" link size="small" @click.stop="openPermissionDialog(row.id)">权限分配</el-button>

                <el-button type="danger" link size="small" icon="delete" @click.stop="handleDelete(row.id)">
                    删除
                </el-button>
            </template>
        </air-table>

        <el-drawer v-model="dialog.visible" :title="dialog.title" :size="drawerSize" @close="handleCloseDialog">
            <component :is="dialog.title && dialog.title.includes('复制') ? RoleCopyForm : RoleForm"
                ref="menuFormRefLocal" />
        </el-drawer>
        <el-dialog v-model="permissionDialog" title="权限分配" width="640px">
            <div style="height:600px; overflow-y:auto;">
                <el-tree
                    ref="permissionTreeRef"
                    :data="permissionTreeData"
                    node-key="id"
                    show-checkbox
                    :props="{ children: 'children', label: 'title' }"
                    :default-checked-keys="permissionCheckedKeys"
                />
            </div>
            <template #footer>
                <el-button @click="permissionDialog = false">取 消</el-button>
                <el-button type="primary" @click="savePermission">保 存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Plus, DocumentCopy, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import AirTable from '@root/base/components/air/AirTable/index.vue';
import RoleAPI from './apis/role.api';
import MenuACTION from '../menu/actions/menu.action';
import { RolePageService } from './scripts/role.page';
import RoleForm from './components/form.vue';
import RoleCopyForm from './components/copy-form.vue';

const rp = RolePageService;
const loading = rp.loading;
const queryParams = rp.queryParams;
const queryFormRef = rp.queryFormRef;
const dataTableRefLocal = ref(null);
const menuFormRefLocal = ref(null);
const dialog = rp.dialog;
const drawerSize = rp.drawerSize;
const formData = rp.formData;
const tableColumns = rp.tableColumns;
const afterRequest = rp.afterRequest;
const appMap = rp.appMap;

onMounted(() => {
    rp.initTable(dataTableRefLocal, menuFormRefLocal);
});
onUnmounted(() => {
    rp.initTable(null as any, null as any);
});

const handleRowClick = (row: any) => rp.handleRowClick(row);
const handleOpenDialog = (parentId?: string, id?: string) => rp.handleOpenDialog(parentId, id);
const handleCloseDialog = () => rp.handleCloseDialog();
const handleDelete = (id: string) => rp.handleDelete(id);
const permissionDialog = ref(false);
const permissionTreeData = ref<any[]>([]);
const permissionCheckedKeys = ref<any[]>([]);
const permissionTreeRef = ref<any>(null);
const currentRoleForPerm = ref<string | null>(null);

async function openPermissionDialog(roleId: string) {
    if (!roleId) return;
    currentRoleForPerm.value = roleId;
    try {
                // roleMenu 返回 menu 列表（包含 Checked 字段），直接转树并使用 Checked
                const roleMenusResp: any = await RoleAPI.roleMenu(roleId);
                const list = roleMenusResp?.data || roleMenusResp || [];
                const tree = MenuACTION.getMenuTree(list || []);

                permissionTreeData.value = tree;
                // collect checked keys from tree
                const keys: string[] = [];
                const walk = (nodes: any[] = []) => {
                    for (const n of nodes) {
                        if (n.Checked || n.checked) keys.push(n.id || n.value || n.key);
                        if (n.children && n.children.length) walk(n.children);
                    }
                };
                walk(permissionTreeData.value as any[]);
                permissionCheckedKeys.value = keys;
        // open dialog
        permissionDialog.value = true;
    } catch (e) {
        console.error(e);
    }
}

async function savePermission() {
    try {
        // get checked keys from tree component if available
        let keys: any[] = permissionCheckedKeys.value || [];
        if (permissionTreeRef.value && typeof permissionTreeRef.value.getCheckedKeys === 'function') {
            keys = permissionTreeRef.value.getCheckedKeys();
        }
        await RoleAPI.batchChangeMenu({ roleId: currentRoleForPerm.value, menuIds: keys });
        permissionDialog.value = false;
        // refresh table
        rp.dataTableRef?.value?.reload?.();
    } catch (e) {
        console.error(e);
    }
}
function handleCopyFromSelect() {
    const id = rp.selectedId?.value ?? undefined;
    if (!id) {
        //请先选择一个角色
        ElMessage.warning('请先选择一个角色');
        return;
    }
    console.log("rp.selectedId", rp.selectedId);
    rp.openCopyDialog(id);
}
function onSelectionChange(rows: any[]) {
    rp.selectedId.value = rows && rows.length ? rows[0].id : undefined;
    rp.selectedRows.value = rows && rows.length ? rows : [];
}
</script>
