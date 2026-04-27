<template>
    <div class="app-route-list">
        <air-table
            ref="dataTableRefLocal"
            :queryFormRef="queryFormRef"
            v-loading="loading"
            row-key="id"
            :page-size="10"
            :request="AppRouteAPI.queryRoutes"
            :after-request="afterRequest"
            :show-expand-buttons="false"
            :columns="tableColumns"
        >
                <template #toolbar-left>
                    <el-button type="primary" @click="onAdd">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        添加
                    </el-button>
                </template>
            <template #table-query-form>
                <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                    <el-form-item label="路由地址" prop="route">
                        <el-input placeholder="路由地址/描述" v-model="queryParams.info" clearable />
                    </el-form-item>
                </el-form>
            </template>

            <!-- 所属应用列 -->
            <template #appId="{ row }">
                <el-tag type="primary">{{ appMap[row.appId] || row.appId }}</el-tag>
            </template>

            <template #route="{ row }">
                <div>{{ row.route }}</div>
            </template>

            <template #operation="{ row }">
                <el-button type="primary" link size="small" @click.stop="handleEdit(row.id)">
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
        <el-drawer v-model="drawerVisible" title="路由维护" size="840px" :with-header="true">
            <AppRouteFormComp :initialData="editFormData" @success="handleFormSuccess" @cancel="handleCancelDrawer" />
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AirTable from "@root/base/components/air/AirTable/index.vue";
import AppRouteAPI from "../../apis/app_route.api";
import AppAPI from "../../apis/app.api";
import { AppRouteVO } from "../../dtos/app_route.dto";
import AppRouteFormComp from "./form.vue";
import { Plus, Edit, Delete, Link } from '@element-plus/icons-vue';
import { QueryResult } from "@root/base/components/air/AirTable/dtos/PageQuery";
import { AirTableColumn } from "@root/base/components/air/AirTable/components/air-table-column";

const dataTableRefLocal = ref<any>(null);
const queryFormRef = ref(null);
const loading = ref(false);
const queryParams = ref({ info: "" });
const drawerVisible = ref(false);
const editFormData = ref<any>({ id: "", appId: "", route: "", description: "" });

const tableColumns = [
    { label: "序号", type: "index", width: 60 },
    { label: "所属应用", prop: "appId", slot: "appId", width: 220 },
    { label: "路由地址", prop: "route", slot: "route", minWidth: 250 },
    { label: "请求方法", prop: "method", width: 120 },
    { label: "描述", prop: "description", minWidth: 200 },
    { label: "创建时间", prop: "createTime", width: 180 },
    { label: "操作", fixed: "right", width: 220, slot: "operation" },
] as AirTableColumn[];

const appMap = ref<Record<string, string>>({});

onMounted(() => {
    AppAPI.query({}).then((resp: any) => {
        const list = resp.list || [];
        const m: Record<string, string> = {};
        for (const a of list) m[a.appId] = a.appName;
        appMap.value = m;
    });
});

async function afterRequest(raw: any, parsed: QueryResult<AppRouteVO>) {
    return { list: parsed.list, page: parsed.page };
}

function handleEdit(id?: string) {
    if (!id) return;
    AppRouteAPI.detail(id).then((resp) => {
        editFormData.value = resp || { id: "", appId: "", route: "", description: "" };
        drawerVisible.value = true;
    });
}

function handleDelete(id: string) {
    if (!id) return;
    AppRouteAPI.remove(id).then(() => {
        dataTableRefLocal.value?.reload?.();
    });
}

function handleBind(id: string) {
    console.log("bind", id);
}

function handleOpenAdd() {
    editFormData.value = { id: "", appId: "", route: "", description: "" };
    drawerVisible.value = true;
    console.log("add",drawerVisible.value);
}

function handleFormSuccess() {
    drawerVisible.value = false;
    dataTableRefLocal.value?.reload?.();
}

const onAdd = () => {
    handleOpenAdd();
};

function handleCancelDrawer() {
    drawerVisible.value = false;
}
</script>