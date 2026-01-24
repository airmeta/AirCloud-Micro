import { useAppStore } from "@root/base/store/modules/app-store";
import { DeviceEnum } from "@root/base/enums/settings/device-enum";

import MenuAPI from "../apis/menu.api";

import type { MenuQuery, MenuForm, MenuVO, MenuQueryResult } from "../dtos/menu.dto";


import { ElMessage, ElMessageBox } from "element-plus";

import { MenuTypeEnum } from "@root/base/enums/system/menu-enum";


import MenuACTION from "../actions/menu.action";

import { ref, reactive, computed, onMounted } from "vue";
import { QueryResult } from "@root/base/components/air/AirTable/dtos/PageQuery";
import { AirTableColumn } from "@root/base/components/air/AirTable/components/air-table-column";

import { tablePage } from "@root/base/components/air/AirTable/scripts/table.page";
import AppAPI from "../../app/apis/app.api";


export class menuPage extends tablePage<MenuVO, MenuForm, MenuQuery> {
    menuFormRef = ref();
    appStore = useAppStore();
    dialog = reactive({ title: "新增菜单", visible: false });

    drawerSize = computed(() => (this.appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"));
    // menuTableData alias to inherited tableData
    get menuTableData() {
        return this.tableData as any;
    }

    initialMenuFormData = ref<MenuForm>({
        id: "",
        parentId: "",
        type: MenuTypeEnum.CATALOG,
        appId: "",
        icon: "",
        title: "",
        authority: "",
        component: "",
        path: "",
        hide: 1,
        sortNumber: 1,
    });

    formData = ref({ ...this.initialMenuFormData.value });

    // 应用选项与映射
    appOptions = ref<{ label: string; value: string }[]>([]);
    appMap = computed(() => {
        const m: Record<string, string> = {};
        for (const it of this.appOptions.value) m[it.value] = it.label;
        return m;
    });

    selectedMenuId = ref<string | undefined>();

    // afterRequest 同样在类内可用
    afterRequest: (raw: any, parsed: QueryResult<any>) => Promise<QueryResult<any>> = async (raw: any, parsed: QueryResult<any>) => {
        const newList = await MenuACTION.getMenuTree(parsed.list || []);
        return { list: newList, page: parsed.page };
    };

    // ref for AirTable instance
    dataTableRef = ref<any>(null);

    handleFormSuccess() {
        this.dialog.visible = false;
        this.dataTableRef.value?.reload?.();
    }

    /**
     * initTable - 初始化表格与表单的 ref（由页面在 mounted 时调用）
     * 使得服务可以隐式使用模板上的 ref（避免模板直接覆盖服务内部 ref 对象）
     * initTable - initialize table/form refs (call from page on mounted)
     */
    initTable(dataTableRef?: any, menuFormRef?: any) {
        if (dataTableRef) {
            // dataTableRef 可能是 ref 对象或 DOM/ref 值，统一赋到内部 ref.value
            this.dataTableRef.value = dataTableRef.value ?? dataTableRef;
        }
        if (menuFormRef) {
            this.menuFormRef.value = menuFormRef.value ?? menuFormRef;
        }
        if (dataTableRef || menuFormRef) this.loadApps();
    }

    // 加载应用选项（下拉）
    async loadApps() {
        try {
            const resp = await AppAPI.query({});
            const list = (resp.list || []) as any[];
            this.appOptions.value = list.map((a) => ({ label: a.appName, value: a.appId }));
        } catch (e) {
            // ignore
        }
    }

    // 列配置
    tableColumns = [
        {label: "序号", type: "index", width: 60 },
        { label: "菜单名称", prop: "title", slot: "title", fixed: true, minWidth: 200 },
        { label: "类型", width: 80, slot: "type" },
        { label: "路由路径", prop: "path", width: 250 },
        { label: "组件路径", prop: "component", width: 250 },
        { label: "权限标识", prop: "authority", width: 200 },
        { label: "所属应用", prop: "appId", slot: "appId", width: 200 },
        { label: "状态", width: 80, slot: "status" },
        { label: "排序", prop: "sortNumber", width: 80 },
        { label: "操作", fixed: "right", width: 220, slot: "operation" },
    ] as AirTableColumn[];

    // 行点击
    handleRowClick(row: MenuVO) {
        this.selectedMenuId.value = row.id;
    }

    // 打开表单弹窗
    handleOpenDialog(parentId?: string, menuId?: string) {
        if (menuId) {
            this.dialog.title = "编辑菜单";
            this.detail(menuId).then((data) => {
                this.initialMenuFormData.value = { ...data };
                this.formData.value = data;
                this.dialog.visible = true;
            });
        } else {
            this.dialog.title = "新增菜单";
            // 如果传入 parentId 则设置为表单的 parentId（兼容传入 '0' 表示顶级）
            this.formData.value.parentId = parentId ?? "";
            this.dialog.visible = true;
        }
    }

    // 菜单类型切换
    handleMenuTypeChange() {
        if (this.formData.value.type !== this.initialMenuFormData.value.type) {
            if (this.formData.value.type === MenuTypeEnum.MENU) {
                if (this.initialMenuFormData.value.type === MenuTypeEnum.CATALOG) {
                    this.formData.value.component = "";
                } else {
                    this.formData.value.path = this.initialMenuFormData.value.path;
                    this.formData.value.component = this.initialMenuFormData.value.component;
                }
            }
        }
    }

    // 提交表单
    handleSubmit() {
        this.menuFormRef.value.validate((isValid: boolean) => {
            if (isValid) {
                const menuId = this.formData.value.id;
                if (menuId) {
                    if (this.formData.value.parentId == menuId) {
                        ElMessage.error("父级菜单不能为当前菜单");
                        return;
                    }
                    this.save(this.formData.value).then(() => {
                        ElMessage.success("修改成功");
                        // 统一触发表单成功后的处理（关闭抽屉并刷新表格）
                        this.handleFormSuccess();
                    });
                } else {
                    this.save(this.formData.value).then(() => {
                        ElMessage.success("新增成功");
                        // 统一触发表单成功后的处理（关闭抽屉并刷新表格）
                        this.handleFormSuccess();
                    });
                }
            }
        });
    }

    // 删除菜单
    handleDelete(menuId: string) {
        if (!menuId) {
            ElMessage.warning("请勾选删除项");
            return false;
        }

        ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        }).then(
            () => {
                this.loading.value = true;
                this.remove(menuId)
                    .then(() => {
                        ElMessage.success("删除成功");
                        // 删除后也刷新表格
                        this.handleFormSuccess();
                    })
                    .finally(() => {
                        this.loading.value = false;
                    });
            },
            () => {
                ElMessage.info("已取消删除");
            }
        );
    }
    // 重置表单
    resetForm() {
        this.menuFormRef.value.resetFields();
        this.menuFormRef.value.clearValidate();
        this.formData.value = {
            id: "",
            parentId: "",
            type: MenuTypeEnum.CATALOG,
            appId: "",
            icon: "",
            title: "",
            authority: "",
            component: "",
            path: "",
            hide: 1,
            sortNumber: 1,
        };
    }
    // 关闭表单弹窗
    handleCloseDialog() {
        this.dialog.visible = false;
        this.resetForm();
    }

    /** 查询菜单列表（代理 MenuAPI.query） */
    async query(params?: MenuQuery): Promise<MenuQueryResult> {
        return await MenuAPI.query(params);
    }

    /** 获取菜单详情（代理 MenuAPI.detail） */
    async detail(id?: string) {
        return MenuAPI.detail(id);
    }

    /** 保存菜单（新增或修改，代理 MenuAPI.save） */
    async save(data: MenuForm) {
        return MenuAPI.save(data);
    }

    /** 删除菜单（代理 MenuAPI.remove） */
    async remove(id: string) {
        return MenuAPI.remove(id);
    }
}

// 单例导出，方便在其他模块中直接使用 CRUD 服务
export const MenuPageService = new menuPage();