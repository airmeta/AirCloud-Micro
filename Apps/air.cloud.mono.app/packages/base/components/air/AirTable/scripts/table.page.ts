
/**
    * tablePage - 通用表格页面基类
    *
    * 中文说明：
    * 提取通用的表格相关 state 与方法，供各业务页面继承复用。
    * 包括：查询表单 ref、加载状态、查询参数、表格数据、分页、选择和刷新逻辑等。
    *
    * English:
    * Base class for table pages. Extracts common table-related state and helpers
    * such as query form ref, loading flag, query params, table data, pagination,
    * selection and reload helper for reuse across pages.
    */
export class tablePage<T = any, F = any, Q = any> {

    // 查询表单 Ref - Query form ref
    queryFormRef = ref();
    // 加载状态 - Loading flag
    loading = ref(false);
    // 查询参数（可响应式）- Query parameters (reactive)
    queryParams = reactive<any>({});
    // 表格数据 - Table data (generic)
    tableData = ref<T[]>([]);

    // AirTable 组件实例 ref（用于调用 reload 等方法）
    // AirTable component instance ref (used to call reload())
    dataTableRef = ref<any>(null);

    // 分页相关 state - Pagination state
    currentPage = ref<number>(1);
    pageSize = ref<number>(10);
    total = ref<number>(0);
    // 可选的 page size 列表
    pageSizes = ref<number[]>([10, 20, 50, 100]);
    // 分页布局字符串
    paginationLayout = ref<string>("total, sizes, prev, pager, next, jumper");

    // 选择的行 ID（通用命名，可用于单选场景）
    selectedId = ref<string | undefined>();

    /**
     * reload - 触发表格刷新
     * 子类或调用方可以直接调用此方法，内部会优先使用 dataTableRef.reload()
     * 如果未挂载 dataTableRef，则 callable 返回已 resolved 的 Promise。
     */
    async reload() {
        if (this.dataTableRef?.value && typeof this.dataTableRef.value.reload === "function") {
            try {
                await this.dataTableRef.value.reload();
            } catch (e) {
                // swallow - 调用方可以自行处理错误
            }
        }
    }

    /**
     * resetQuery - 重置查询参数并回到第一页
     * Reset query params and current page to 1
     */
    resetQuery() {
        // 清空所有已存在的查询字段（保留引用）
        for (const k of Object.keys(this.queryParams)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.queryParams[k] = undefined;
        }
        this.currentPage.value = 1;
    }

    /**
     * onPageChange - 页码变化处理
     * 子类可在此或在 reload 前进行自定义行为
     */
    onPageChange(page: number) {
        this.currentPage.value = page;
        void this.reload();
    }

    /**
     * onSizeChange - 每页大小变化处理
     */
    onSizeChange(size: number) {
        this.pageSize.value = size;
        this.currentPage.value = 1;
        void this.reload();
    }

    /**
     * fetch - 占位 fetch 方法，子类应覆盖以实现实际的数据请求逻辑
     * Placeholder fetch method - should be overridden by subclass to implement actual request
     */
    async fetch(_params?: any): Promise<void> {
        // default no-op, subclass implement
        return Promise.resolve();
    }
}
