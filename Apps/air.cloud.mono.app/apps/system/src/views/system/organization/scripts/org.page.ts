import { useAppStore } from "@root/base/store/modules/app-store";
import { DeviceEnum } from "@root/base/enums/settings/device-enum";

import OrgAPI from "../apis/org.api";

import type { OrgForm, OrgVO, OrgQuery } from "../dtos/org.dto";

import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive, computed, type Ref } from "vue";
import { AirTableColumn } from "@root/base/components/air/AirTable/components/air-table-column";
import type { FormInstance } from "element-plus";

import { tablePage } from "@root/base/components/air/AirTable/scripts/table.page";
import AppAPI from "../../app/apis/app.api";

export class orgPage extends tablePage<OrgVO, OrgForm, OrgQuery> {
    /**
     * --- 状态 / 参数（Properties / State） ---
     *
     * zh-cn: 以下为类中使用到的所有响应式状态、ref、computed 等，统一放置在顶部。
     * en-us: The reactive state (refs, computed, etc.) used by the class are placed here.
     */

    // 表单实例引用 / Form instance ref
    orgFormRef: Ref<FormInstance | null> = ref(null);

    // 应用 store / App store
    appStore = useAppStore();

    // 新增/编辑对话框状态 / Dialog state for create/edit
    dialog = reactive({ title: "新增部门", visible: false });

    // 抽屉宽度（自适应设备） / Drawer size depending on device
    drawerSize = computed(() => (this.appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"));

    // 初始表单数据（用于重置） / Initial form data used for reset
    initialFormData = ref<OrgForm>({
        id: "",
        departmentCode: "",
        departmentName: "",
        parentDepartmentId: "",
        description: "",
        managedAppIds: "",
        managedRegions: "",
        appId: "",
    });

    // 当前表单数据 / Current form data
    formData = ref({ ...this.initialFormData.value });

    // 当前选中行 ID / Selected row id
    selectedId = ref<string | undefined>();

    // 表格引用（含 reload 方法） / Table ref (may contain reload)
    dataTableRef: Ref<{ reload?: () => void } | null> = ref(null);

    // 应用选项与映射 / App options and map for display
    appOptions = ref<{ label: string; value: string }[]>([]);
    appMap = computed(() => {
        const m: Record<string, string> = {};
        for (const it of this.appOptions.value) m[it.value] = it.label;
        return m;
    });

    // 表格列定义 / Table columns definition
    tableColumns: AirTableColumn[] = [
        { label: "序号", type: "index", width: 60 },
        { label: "部门名称", prop: "name", minWidth: 200 },
        { label: "部门编码", prop: "code", width: 180 },
        { label: "所属应用", prop: "appId", width: 180, slot: "appId" },
        { label: "描述", prop: "description", minWidth: 200 },
        { label: "操作", fixed: "right", width: 260, slot: "operation" },
    ];

    // 职位管理抽屉状态 / Assignment drawer state
    assignmentDialog = reactive({ title: '职位管理', visible: false });
    assignmentDeptId = ref<string | null>(null);

    /**
     * --- 方法 / Methods ---
     *
     * zh-cn: 以下为类的方法实现，放置在属性之后，便于阅读与维护。
     * en-us: Methods are placed below the properties for readability and maintenance.
     */

    // 点击行时设置选中 ID / Set selectedId on row click
    handleRowClick(row: OrgVO) {
        this.selectedId.value = row.id;
    }

    // 打开/编辑对话框 / Open create/edit dialog
    handleOpenDialog(parentId?: string, id?: string) {
        if (id) {
            this.dialog.title = "编辑部门";
            this.detail(id).then((data) => {
                // 将返回的数据放入表单（不覆盖 initialFormData）
                this.formData.value = { ...data } as any;
                this.dialog.visible = true;
            });
        } else {
            this.dialog.title = "新增部门";
            this.formData.value = { ...this.initialFormData.value } as any;
            this.formData.value.parentDepartmentId = parentId ?? "";
            this.dialog.visible = true;
        }
    }

    // 关闭对话框并重置表单 / Close dialog and reset form
    handleCloseDialog() {
        this.dialog.visible = false;
        this.resetForm();
    }

    // 表单提交（新增或更新）/ Submit form (create or update)
    handleSubmit() {
        this.orgFormRef.value?.validate((isValid: boolean) => {
            if (!isValid) return;
            const id = this.formData.value.id;
            if (id) {
                this.save(this.formData.value as OrgForm).then(() => {
                    ElMessage.success("修改成功");
                    this.handleFormSuccess();
                });
            } else {
                this.save(this.formData.value as OrgForm).then(() => {
                    ElMessage.success("新增成功");
                    this.handleFormSuccess();
                });
            }
        });
    }

    // 保存成功后的通用处理 / Common handler after save success
    handleFormSuccess() {
        this.dialog.visible = false;
        this.dataTableRef.value?.reload?.();
    }

    // 重置表单到初始值 / Reset form to initial values
    resetForm() {
        this.orgFormRef.value?.resetFields();
        this.orgFormRef.value?.clearValidate();
        this.formData.value = { ...this.initialFormData.value } as OrgForm;
    }

    // 表格初始化（注入 ref）并加载应用选项 / Init table refs and load app options
    initTable(dataTableRef?: any, orgFormRef?: any) {
        if (dataTableRef) this.dataTableRef.value = dataTableRef.value ?? dataTableRef;
        if (orgFormRef) this.orgFormRef.value = orgFormRef.value ?? orgFormRef;
        if (dataTableRef || orgFormRef) this.loadApps();
    }

    // 加载应用选项（下拉）/ Load app options for select
    async loadApps() {
        try {
            const resp = await AppAPI.query({});
            const list = (resp.list || []) as any[];
            this.appOptions.value = list.map((a) => ({ label: a.appName, value: a.appId }));
        } catch (e) {
            // ignore load failures
        }
    }

    // 删除操作 / Delete handler with confirmation
    handleDelete(id: string) {
        if (!id) {
            ElMessage.warning("请勾选删除项");
            return;
        }
        ElMessageBox.confirm("确认删除已选中的数据项?", "警告", { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" })
            .then(() => {
                this.loading.value = true;
                this.remove(id).then(() => {
                    ElMessage.success("删除成功");
                    this.handleFormSuccess();
                }).finally(() => (this.loading.value = false));
            })
            .catch(() => {});
    }

    // 打开职位管理抽屉 / Open assignment drawer and set department id
    openAssignment(departmentId?: string) {
        if (!departmentId) return;
        this.assignmentDeptId.value = departmentId;
        this.assignmentDialog.visible = true;
    }

    // --- API 包装方法（直接委托给 OrgAPI） / API wrapper methods ---
    async query(params?: OrgQuery) {
        return OrgAPI.query(params);
    }

    async detail(id?: string) {
        return OrgAPI.detail(id);
    }

    async save(data: OrgForm) {
        return OrgAPI.save(data);
    }

    async remove(id: string) {
        return OrgAPI.remove(id);
    }
}

export const OrgPageService = new orgPage();
