<template>

    <div class="pro-table-container">
        <el-card shadow="hover" class="data-form">
            <!-- 查询表单插槽（由父组件提供） -->
            <div class="table-query-form" v-if="$slots['table-query-form']">
                <div>
                    <slot name="table-query-form"></slot>
                </div>
                <div>
                    <el-form-item class="search-buttons">
                        <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
                        <el-button icon="refresh" @click="handleReset">重置</el-button>
                    </el-form-item>
                </div>
            </div>
        </el-card>
        
        <el-card shadow="hover" class="data-table">
            <!-- 工具栏: 若提供 slot toolbar 则使用用户自定义，否则使用内置工具条 -->
            <ToolBar :columns="columns" :visible="visibleColumnsLocal" :stripe="stripeLocal" :show-add="props.showAdd"
                        @update:visible="val => (visibleColumnsLocal = val)" @update:stripe="val => (stripeLocal = val)"
                        @refresh="handleRefresh" @add="() => emit('add')"
                        @expand-all="handleExpandAll" @collapse-all="handleCollapseAll"
                        :show-expand-buttons="props.showExpandButtons" :tree-mode="hasTreeProps">
                <template #toolbar-left>
                    <slot name="toolbar-left"></slot>
                </template>
                <template #toolbar-right>
                    <slot name="toolbar-right"></slot>
                </template>
            </ToolBar>

            <!-- 表格部分 -->
            <el-table ref="elTableRef" v-bind="$attrs" :data="computedTableData" :border="border" :stripe="stripeLocal"
                v-loading="computedLoading" element-loading-text="加载中..." element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.1)" @selection-change="handleSelectionChange"
                @sort-change="handleSortChange">
                <template v-for="item in displayColumns" :key="item.prop || item.key">
                        <!-- 多选列 -->
                        <el-table-column v-if="item.type === 'selection'" type="selection" width="55" />

                        <!-- 单选列（type === 'single'）: 使用 radio 控件，仅允许选择一行；会触发与多选相同的 `selection-change` 事件，传入选中行数组 -->
                        <el-table-column v-else-if="item.type === 'single'" :width="item.width || 55">
                            <template #default="scope">
                                <input
                                    type="radio"
                                    :checked="selectedSingleId === (scope.row && scope.row.id)"
                                    @click="() => handleSingleSelect(scope.row)"
                                />
                            </template>
                        </el-table-column>

                    <!-- 序号列 -->
                    <el-table-column v-else-if="item.type === 'index'" type="index" :width="item.width || '80'"
                        :label="item.label || '序号'" />

                    <!-- 普通列 -->
                    <el-table-column v-else :prop="item.prop" :label="item.label" :width="item.width"
                        :min-width="item.minWidth" :align="item.align || 'left'" :sortable="item.sortable || false"
                        v-bind="item.attrs || {}">
                        <!-- 自定义列内容 -->
                        <template #default="scope" v-if="item.slot">
                            <slot :name="item.slot" :row="scope.row" :index="scope.$index"></slot>
                        </template>
                        <template #default="scope" v-else>
                            {{ (scope.row && item.prop) ? getProp(scope.row, item.prop) : '' }}
                        </template>
                    </el-table-column>
                </template>
            </el-table>

            <!-- 分页部分：当 pageSize 为 0 时不显示分页控件 -->
            <div class="pagination" v-if="pagination && pageSizeLocal !== 0">
                <el-pagination v-model:current-page="currentPageLocal" v-model:page-size="pageSizeLocal"
                    :page-sizes="pageSizes" :total="computedTotal" :layout="paginationLayout"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { PropType, ref, computed, watch, onMounted, getCurrentInstance } from "vue";
import { Refresh } from "@element-plus/icons-vue";
import ToolBar from "./components/toolBar.vue";
import type { AirTableColumn } from "./components/air-table-column";
import { PageQuery, Requester, QueryResult, PageInfo } from "./dtos/PageQuery";

type AfterRequestFn = (raw: any, parsed: QueryResult<any>) => QueryResult<any> | Promise<QueryResult<any>> | void;

/*
  AirTable 查询表单获取方式说明（优先级自上而下）：
  1. getQueryData (推荐)：父组件传入一个回调 `getQueryData()`，子组件在搜索时调用它，回调可以同步返回表单数据或返回 Promise。
      优点：不依赖 $refs，父组件可以在回调里完成 `validate()`、校验提示或预处理。

  2. queryFormRef（推荐的兼容方式）：父组件在 setup 中声明 `const queryFormRef = ref(null)`，在模板中绑定
      `<el-form ref="queryFormRef">`，并把 `:queryFormRef="queryFormRef"` 传给 `AirTable`。子组件会读取该 ref 的 `.value`。

  使用建议：如果你能控制父组件，优先使用 `getQueryData`；如果不方便，则传入 `queryFormRef`（setup 的 ref）。
*/

const props = withDefaults(
    defineProps<{
        columns: AirTableColumn[];
        tableData?: any[]; // 当未传 request 时使用
        border?: boolean;
        stripe?: boolean;
        loading?: boolean;
        pagination?: boolean;
        total?: number;
        pageSize?: number;
        currentPage?: number;
        pageSizes?: number[];
        paginationLayout?: string;
        showToolbar?: boolean;
        // 外部传入 request（例如 MenuAPI.query）
        request?: Requester | null;
        // 额外查询参数
        queryData?: Record<string, any>;
        // 后置处理函数：接收 raw 响应和解析后的 {list,page}，可以同步或异步返回新的解析结果
        afterRequest?: AfterRequestFn | null;
        showAdd?: boolean;
        // 表单的 ref 对象（推荐）
        queryFormRef?: any;
        // 父组件可选提供的回调，优先于通过 ref 读取表单数据
        getQueryData?: (() => Record<string, any> | Promise<Record<string, any>>) | null;
        // 父组件是否允许显示展开/折叠按钮（默认不显示）
        showExpandButtons?: boolean;
    }>(),
    {
        border: true,
        stripe: true,
        loading: false,
        pagination: true,
        total: 0,
        pageSize: 10,
        currentPage: 1,
        pageSizes: () => [10, 20, 50, 100],
        paginationLayout: "total, sizes, prev, pager, next, jumper",
        showToolbar: true,
        request: null,
        queryData: () => ({}),
        afterRequest: null,
        showAdd: false,
        queryFormRef: null,
        getQueryData: null,
        showExpandButtons: false,
    }
);

const emit = defineEmits<{
    (e: "selection-change", val: any[]): void;
    (e: "sort-change", val: any): void;
    (e: "update:pageSize", val: number): void;
    (e: "update:currentPage", val: number): void;
    (e: "pagination-change", payload: { pageSize: number; currentPage: number }): void;
    (e: "refresh"): void;
    (e: "expand-all"): void;
    (e: "collapse-all"): void;
    (e: "update:stripe", val: boolean): void;
    (e: "add"): void;
}>();

// 检测父组件是否传入了 tree-props（presence 表示为树模式）
const instance = getCurrentInstance();
const hasTreeProps = computed(() => {
    const attrs = instance && (instance.proxy as any)?.$attrs ? (instance.proxy as any).$attrs : {};
    return Object.prototype.hasOwnProperty.call(attrs, 'tree-props') || Object.prototype.hasOwnProperty.call(attrs, 'treeProps');
});

// internal state used when props.request is provided
const internalTableData = ref<any[]>([]);
const internalTotal = ref<number>(0);
const internalLoading = ref<boolean>(false);

// pagination local proxies (used in both modes)
const pageSizeLocal = ref<number>(props.pageSize!);
const currentPageLocal = ref<number>(props.currentPage!);

// expose reload so parent can call $refs.dataTableRef.reload()
defineExpose({ reload: fetchData });

watch(
    () => props.pageSize,
    (v) => {
        if (v !== undefined) pageSizeLocal.value = v;
    }
);

watch(
    () => props.currentPage,
    (v) => {
        if (v !== undefined) currentPageLocal.value = v;
    }
);

// computed helpers: if request provided, use internal state; otherwise use external props
const columns = computed(() => props.columns || []);
const border = computed(() => props.border!);
const pagination = computed(() => props.pagination!);
const pageSizes = computed(() => props.pageSizes || [10, 20, 50, 100]);
const paginationLayout = computed(() => props.paginationLayout || "total, sizes, prev, pager, next, jumper");

// local stripe state (可通过工具条切换)，同步 props.stripe
const stripeLocal = ref<boolean>(props.stripe!);
watch(
    () => props.stripe,
    (v) => {
        if (v !== undefined) stripeLocal.value = v;
    }
);
watch(stripeLocal, (v) => {
    emit('update:stripe', v);
});

// 可见列控制（默认展示所有非 selection/index 列）
const visibleColumnsLocal = ref<string[]>(
    (props.columns || [])
        .filter((c: any) => c.type !== 'selection' && c.type !== 'index')
        .map((c: any) => String(c.prop ?? c.key ?? ''))
);
watch(
    () => props.columns,
    (v) => {
        visibleColumnsLocal.value = (v || [])
            .filter((c: any) => c.type !== 'selection' && c.type !== 'index')
            .map((c: any) => String(c.prop ?? c.key ?? ''));
    }
);

// 最终用于渲染的列（保留 selection/index 列，并根据 visibleColumnsLocal 筛选其它列）
const displayColumns = computed(() =>
    (props.columns || []).filter((c: any) => {
        if (c.type === 'selection' || c.type === 'index') return true;
        const key = String(c.prop ?? c.key ?? '');
        return visibleColumnsLocal.value.includes(key);
    })
);

const computedTableData = computed(() => (props.request ? internalTableData.value : props.tableData || []));
const computedTotal = computed(() => (props.request ? internalTotal.value : props.total || 0));
const computedLoading = computed(() => (props.request ? internalLoading.value : props.loading!));

// el-table ref for expand/collapse
const elTableRef = ref<any>(null);

// emit wrappers
const handleSelectionChange = (val: any[]) => emit("selection-change", val);

function traverseRows(rows: any[], fn: (row: any) => void) {
    if (!rows || !rows.length) return;
    for (const r of rows) {
        fn(r);
        if (Array.isArray(r.children) && r.children.length) traverseRows(r.children, fn);
    }
}

function expandAllRows() {
    if (!elTableRef.value) return;
    traverseRows(computedTableData.value || [], (row) => {
        try { elTableRef.value.toggleRowExpansion?.(row, true); } catch (e) { /* ignore */ }
    });
}

function collapseAllRows() {
    if (!elTableRef.value) return;
    traverseRows(computedTableData.value || [], (row) => {
        try { elTableRef.value.toggleRowExpansion?.(row, false); } catch (e) { /* ignore */ }
    });
}


// single selection state and handler
const selectedSingleId = ref<any>(null);
function handleSingleSelect(row: any) {
    if (!row) {
        selectedSingleId.value = null;
        emit('selection-change', []);
        return;
    }
    const id = row.id ?? (row.key ?? null);
    // toggle: if already selected, unselect; otherwise select
    if (selectedSingleId.value === id) {
        selectedSingleId.value = null;
        emit('selection-change', []);
    } else {
        selectedSingleId.value = id;
        emit('selection-change', [row]);
    }
}
const handleSortChange = (val: any) => emit("sort-change", val);

const handleSizeChange = (val: number) => {
    pageSizeLocal.value = val;
    emit("update:pageSize", val);
    emit("pagination-change", { pageSize: val, currentPage: currentPageLocal.value });

    if (props.request) {
        fetchData();
    }
};

const handleCurrentChange = (val: number) => {
    currentPageLocal.value = val;
    emit("update:currentPage", val);
    emit("pagination-change", { pageSize: pageSizeLocal.value, currentPage: val });

    if (props.request) {
        fetchData();
    }
};

const handleRefresh = () => {
    emit("refresh");
    if (props.request) fetchData();
};

function handleExpandAll() {
    if (hasTreeProps.value) expandAllRows();
    emit('expand-all');
}

function handleCollapseAll() {
    if (hasTreeProps.value) collapseAllRows();
    emit('collapse-all');
}

// fetch using PageQuery when request prop is provided
async function fetchData() {
    if (!props.request) return;
    internalLoading.value = true;
    try {
        const pq = new PageQuery(currentPageLocal.value, pageSizeLocal.value, props.queryData || {});
        const params = pq.toParams();

        // 直接调用 request 获取原始响应
        const raw = await props.request(params);

        // 根据原始响应解析出 list 和 page（与 PageQuery.query 的解析逻辑一致）
        const payload = raw && raw.data ? raw.data : raw || {};

        const list: any[] = payload.list ?? payload.records ?? payload.items ?? payload.rows ?? [];
        const total =
            payload.total ??
            payload.totalCount ??
            payload.count ??
            (payload.page && payload.page.total) ??
            undefined;
        const pageFromPayload = (payload.page ?? {}) as Partial<PageInfo>;

        const page: PageInfo = {
            page: pageFromPayload.page ?? currentPageLocal.value,
            limit: pageFromPayload.limit ?? pageSizeLocal.value,
            total: pageFromPayload.total ?? total,
            ...pageFromPayload,
        };

        const parsed: QueryResult<any> = {
            list,
            page,
        };

        // afterRequest 后置处理（允许返回新的 QueryResult）
        let finalResult = parsed;
        if (props.afterRequest) {
            const maybe = props.afterRequest(raw, parsed);
            if (maybe instanceof Promise) {
                finalResult = await maybe;
            } else if (maybe !== undefined) {
                finalResult = maybe as QueryResult<any>;
            }
        }

        internalTableData.value = finalResult.list || [];
        internalTotal.value = finalResult.page?.total ?? 0;

        // sync local pagination to returned page info
        if (finalResult.page) {
            currentPageLocal.value = finalResult.page.page ?? currentPageLocal.value;
            pageSizeLocal.value = finalResult.page.limit ?? pageSizeLocal.value;
        }
    } finally {
        internalLoading.value = false;
    }
}

// fetch with override query data
async function fetchDataWithQuery(overrideQuery?: Record<string, any>) {
    if (!props.request) return;
    internalLoading.value = true;
    try {
        const pq = new PageQuery(currentPageLocal.value, pageSizeLocal.value, overrideQuery ?? (props.queryData || {}));
        const params = pq.toParams();
        const raw = await props.request(params);
        const payload = raw && raw.data ? raw.data : raw || {};

        const list: any[] = payload.list ?? payload.records ?? payload.items ?? payload.rows ?? [];
        const total =
            payload.total ??
            payload.totalCount ??
            payload.count ??
            (payload.page && payload.page.total) ??
            undefined;
        const pageFromPayload = (payload.page ?? {}) as Partial<PageInfo>;

        const page: PageInfo = {
            page: pageFromPayload.page ?? currentPageLocal.value,
            limit: pageFromPayload.limit ?? pageSizeLocal.value,
            total: pageFromPayload.total ?? total,
            ...pageFromPayload,
        };

        const parsed: QueryResult<any> = {
            list,
            page,
        };

        let finalResult = parsed;
        if (props.afterRequest) {
            const maybe = props.afterRequest(raw, parsed);
            if (maybe instanceof Promise) {
                finalResult = await maybe;
            } else if (maybe !== undefined) {
                finalResult = maybe as QueryResult<any>;
            }
        }

        internalTableData.value = finalResult.list || [];
        internalTotal.value = finalResult.page?.total ?? 0;

        if (finalResult.page) {
            currentPageLocal.value = finalResult.page.page ?? currentPageLocal.value;
            pageSizeLocal.value = finalResult.page.limit ?? pageSizeLocal.value;
        }
    } finally {
        internalLoading.value = false;
    }
}

// helper: try to get parent ref of the query form
function getParentQueryFormRef() {
    // 优先使用父组件直接传入的 ref（setup 中的 ref 对象）
    if ((props as any).queryFormRef) {
        const p = (props as any).queryFormRef;
        // 如果传入的是 ref 对象（具有 .value），返回 .value，否则直接返回
        try {
            return p && p.value !== undefined ? p.value : p;
        } catch (e) {
            return p;
        }
    }
}

function getQueryFormData(): Record<string, any> {
    const ref = getParentQueryFormRef();
    if (!ref) return props.queryData || {};
    // try common places for el-form model
    if (ref.model) return ref.model;
    if (ref.$props && ref.$props.model) return ref.$props.model;
    if ((ref as any).modelValue) return (ref as any).modelValue;
    if ((ref as any).value) return (ref as any).value;
    return props.queryData || {};
}

async function handleSearch() {
    // 优先使用父组件直接提供的回调（如果提供了 getQueryData）
    if (props.getQueryData && typeof props.getQueryData === 'function') {
        try {
            const maybe = props.getQueryData();
            const q = maybe instanceof Promise ? await maybe : maybe;
            await fetchDataWithQuery(q);
        } catch (e) {
            // 回调出错则不继续（父组件可在回调内处理错误）
            // console.error(e);
        }
        return;
    }

    const ref = getParentQueryFormRef();
    if (!ref) {
        // 无表单引用，直接使用 props.queryData
        await fetchDataWithQuery(props.queryData || {});
        return;
    }

    // 尝试验证表单：兼容 Promise 和 callback 两种写法
    try {
        if (typeof ref.validate === 'function') {
            const maybe = ref.validate();
            if (maybe instanceof Promise) {
                await maybe; // validate resolves on success, rejects on fail
            } else {
                // callback 形式：ref.validate(callback)
                await new Promise<void>((resolve, reject) => {
                    try {
                        ref.validate((valid: boolean) => {
                            valid ? resolve() : reject(new Error('validation failed'));
                        });
                    } catch (err) {
                        reject(err);
                    }
                });
            }
        }
    } catch (err) {
        // 验证失败，停止查询
        return;
    }

    // 验证通过，读取表单 model 并查询
    const q = getQueryFormData();
    await fetchDataWithQuery(q);
}

async function handleReset() {
    // 优先使用父组件提供的回调（如果父组件在回调里执行 reset 并返回新的查询数据）
    if (props.getQueryData && typeof props.getQueryData === 'function') {
        try {
            const maybe = props.getQueryData();
            const q = maybe instanceof Promise ? await maybe : maybe;
            await fetchDataWithQuery(q);
        } catch (e) {
            await fetchData();
        }
        return;
    }

    const ref = getParentQueryFormRef();
    if (ref) {
        // If the form component exposes resetFields, call it first
        if (typeof ref.resetFields === 'function') {
            try {
                ref.resetFields();
            } catch (e) {
                // ignore
            }
        }

        // Try to read the model from the ref (common locations)
        let model: any = null;
        if (ref.model) model = ref.model;
        else if (ref.$props && ref.$props.model) model = ref.$props.model;
        else if ((ref as any).modelValue) model = (ref as any).modelValue;
        else if ((ref as any).value) model = (ref as any).value;

        // If we have a model object, explicitly clear its keys so parent reactive state is updated
        if (model && typeof model === 'object') {
            try {
                for (const k of Object.keys(model)) {
                    const v = model[k];
                    if (Array.isArray(v)) model[k] = [];
                    else if (typeof v === 'boolean') model[k] = false;
                    else if (typeof v === 'number') model[k] = undefined;
                    else model[k] = '';
                }
            } catch (e) {
                // ignore if model is not writable
            }
        }

        // Use the cleared model (or empty object) to fetch
        await fetchDataWithQuery(model || {});
        return;
    }

    await fetchData();
}

onMounted(() => {
    if (!props.request) return;

    // 尝试在初次挂载时使用父级表单/回调提供的查询条件进行首次请求
    (async () => {
        try {
            const init = await initialQueryData();
            if (init && Object.keys(init).length > 0) {
                await fetchDataWithQuery(init);
            } else {
                await fetchData();
            }
        } catch (e) {
            console.error(e);
            // 如果获取初始查询出错，回退到默认 fetchData
            await fetchData();
        }
    })();
});

// helper: try to obtain initial query data from parent
async function initialQueryData(): Promise<Record<string, any> | null> {
    // 优先使用父组件提供的回调
    if (props.getQueryData && typeof props.getQueryData === 'function') {
        try {
            const maybe = props.getQueryData();
            return maybe instanceof Promise ? await maybe : maybe;
        } catch (e) {
            return null;
        }
    }

    // 否则尝试读取父组件传入的 ref 或 $refs
    const ref = getParentQueryFormRef();
    if (!ref) return props.queryData || null;

    // 常见位置：ref.model / ref.$props.model / ref.modelValue / ref.value
    if (ref.model) return ref.model;
    if (ref.$props && ref.$props.model) return ref.$props.model;
    if ((ref as any).modelValue) return (ref as any).modelValue;
    if ((ref as any).value) return (ref as any).value;

    return props.queryData || null;
}

// helper: safe get by prop path (supports "a.b.c")
function getProp(row: any, prop?: string) {
    if (!prop) return "";
    const parts = String(prop).split(".");
    let val = row;
    for (const p of parts) {
        if (val == null) return "";
        val = val[p];
    }
    return val == null ? "" : val;
}
</script>

<style lang="scss" scoped>
.pro-table-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.table-query-form {
    display: flex;
    justify-content: left;
    align-items: center;
}

.data-form :deep(.el-card__body) {
    padding: 20px;
    display: flex;
    justify-content: left;
    align-items: center;
    padding-bottom: 0px;
}

.data-form {
    margin-bottom: 10px;
}

.table-query-form .search-buttons {
    display: flex;
    gap: 8px;
    align-items: center
}

.pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
}
</style>