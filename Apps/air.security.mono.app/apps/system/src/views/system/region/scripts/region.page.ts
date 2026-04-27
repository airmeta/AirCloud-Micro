import { useAppStore } from "@root/base/store/modules/app-store";
import { DeviceEnum } from "@root/base/enums/settings/device-enum";

import RegionAPI from "../apis/region.api";
import AppAPI from "../../app/apis/app.api";

import type { RegionForm, RegionVO } from "../dtos/region.dto";

import { ElMessage, ElMessageBox } from "element-plus";
import { RegionTypeEnum } from "../dtos/region.dto";

import { ref, reactive, computed, type Ref } from "vue";
import { AirTableColumn } from "@root/base/components/air/AirTable/components/air-table-column";
import type { FormInstance } from "element-plus";

import { tablePage } from "@root/base/components/air/AirTable/scripts/table.page";
import { MaybeRef, PageInfo, PageQuery, QueryResult } from "@root/base/components/air/AirTable/dtos/PageQuery";


interface RegionQuery extends PageQuery {
    name?: string;
    info?: string;
    parentId?: string;
}



export class regionPage extends tablePage<RegionVO, RegionForm, RegionQuery> {
    regionFormRef: Ref<FormInstance | null> = ref(null);
    appStore = useAppStore();
    dialog = reactive({ title: "新增区域", visible: false });

    drawerSize = computed(() => (this.appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"));

    // initial form
    initialRegionFormData = ref<RegionForm>({
        id: "",
        code: "",
        name: "",
        type: RegionTypeEnum.District,
        parentId: "",
        parentRegionId: undefined,
        description: "",
        lngAndSat: "",
        appId: "",
    });

    formData = ref({ ...this.initialRegionFormData.value });

    selectedRegionId = ref<string | undefined>();

    // ref for AirTable instance (only reload used)
    dataTableRef: Ref<{ reload?: () => void } | null> = ref(null);
    appOptions = ref<{ label: string; value: string }[]>([]);
    appMap = computed(() => {
        const m: Record<string, string> = {};
        for (const it of this.appOptions.value) m[it.value] = it.label;
        return m;
    });

    handleFormSuccess() {
        this.dialog.visible = false;
        this.dataTableRef.value?.reload?.();
    }

    initTable(dataTableRef?: MaybeRef<{ reload?: () => void }>, regionFormRef?: MaybeRef<FormInstance>) {
        if (dataTableRef) {
            // handle either ref object or raw element/component instance
            this.dataTableRef.value = (dataTableRef as unknown as { value?: { reload?: () => void } }).value ?? (dataTableRef as unknown as { reload?: () => void });
        }
        if (regionFormRef) {
            this.regionFormRef.value = (regionFormRef as unknown as { value?: FormInstance }).value ?? (regionFormRef as unknown as FormInstance);
        }
        if (dataTableRef || regionFormRef) this.loadApps();
    }

    async loadApps() {
        try {
            const resp = await AppAPI.query({});
            const list = (resp.list || []) as any[];
            this.appOptions.value = list.map((a) => ({ label: a.appName, value: a.appId }));
        } catch (e) {
            // ignore
        }
    }

    tableColumns = [
        { label: "序号", type: "index", width: 60 },
        { label: "区域名称", prop: "name", fixed: true, minWidth: 200 },
        { label: "区域类型", width: 100, slot: "type" },
        { label: "区域编码", prop: "code", width: 150 },
        { label: "所属应用", prop: "appId", width: 150, slot: "appId" },
        { label: "描述", prop: "description", minWidth: 200 },
        { label: "坐标", prop: "lngAndSat", width: 180 },
        { label: "操作", fixed: "right", width: 220, slot: "operation" },
    ] as AirTableColumn[];

    handleRowClick(row: RegionVO) {
        this.selectedRegionId.value = row.id;
    }

    handleOpenDialog(parentId?: string, regionId?: string) {
        if (regionId) {
            this.dialog.title = "编辑区域";
            this.detail(regionId).then((data: RegionForm) => {
                this.initialRegionFormData.value = { ...data };
                this.formData.value = data;
                this.dialog.visible = true;
            });
        } else {
            this.dialog.title = "新增区域";
            this.formData.value.parentId = parentId ?? "";
            this.dialog.visible = true;
        }
    }

    handleSubmit() {
        this.regionFormRef.value?.validate((isValid: boolean) => {
            if (isValid) {
                const regionId = this.formData.value.id;
                if (regionId) {
                    if (this.formData.value.parentId == regionId) {
                        ElMessage.error("父级区域不能为当前区域");
                        return;
                    }
                    this.save(this.formData.value as RegionForm).then(() => {
                        ElMessage.success("修改成功");
                        this.handleFormSuccess();
                    });
                } else {
                    this.save(this.formData.value as RegionForm).then(() => {
                        ElMessage.success("新增成功");
                        this.handleFormSuccess();
                    });
                }
            }
        });
    }

    handleDelete(regionId: string) {
        if (!regionId) {
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
                this.remove(regionId)
                    .then(() => {
                        ElMessage.success("删除成功");
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

    resetForm() {
        this.regionFormRef.value?.resetFields();
        this.regionFormRef.value?.clearValidate();
        this.formData.value = {
            id: "",
            code: "",
            name: "",
            type: RegionTypeEnum.District,
            parentId: "",
            parentRegionId: undefined,
            description: "",
            lngAndSat: "",
            appId: "",
        } as RegionForm;
    }

    handleCloseDialog() {
        this.dialog.visible = false;
        this.resetForm();
    }

    async query(params?: RegionQuery){
        return RegionAPI.query(params);
    }

    async detail(id?: string) {
        return RegionAPI.detail(id);
    }

    async save(data: RegionForm) {
        return RegionAPI.save(data);
    }

    async remove(id: string) {
        return RegionAPI.remove(id);
    }
}

export const RegionPageService = new regionPage();