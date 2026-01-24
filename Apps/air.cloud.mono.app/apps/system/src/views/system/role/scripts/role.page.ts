import RoleAPI from '../apis/role.api';
import AppAPI from '../../app/apis/app.api';
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { PageQuery, QueryResult } from '@root/base/components/air/AirTable/dtos/PageQuery';
import { AirTableColumn } from '@root/base/components/air/AirTable/components/air-table-column';
import { useAppStore } from '@root/base/store/modules/app-store';
import { RoleForm, RoleVO, RoleQuery } from '../dtos/role.dto';
import { DeviceEnum } from '@root/base/enums/settings/device-enum';

export class RolePage {
    queryFormRef = ref();
    loading = ref(false);
    queryParams = reactive<any>({});
    tableData = ref<RoleVO[]>([]);
    dataTableRef = ref<any>(null);
    menuFormRef = ref<any>(null);
    selectedId = ref<string | undefined>();
    selectedRows = ref<any[]>([]);

    appStore = useAppStore();
    appOptions = ref<{ label: string; value: string }[]>([]);
    appMap = computed(() => {
        const m: Record<string, string> = {};
        for (const it of this.appOptions.value) m[it.value] = it.label;
        return m;
    });
    dialog = reactive({ title: '新增角色', visible: false });
    drawerSize = computed(() => (this.appStore.device === DeviceEnum.DESKTOP ? '600px' : '90%'));

    initialForm: RoleForm = { id: '', roleName: '', description: null, appId: '' } as RoleForm;
    formData = ref({ ...this.initialForm } as RoleForm);

    tableColumns: AirTableColumn[] = [
        { type: 'single' },
        {type: 'index', width: 60 },
        { label: '角色名', prop: 'roleName', minWidth: 200 },
        { label: '所属应用', prop: 'appId', width: 200, slot: 'appId' },
        { label: '描述', prop: 'description', minWidth: 200 },
        { label: '操作', fixed: 'right', width: 260, slot: 'operation' },
    ];

    afterRequest = async (raw: any, parsed: QueryResult<any>) => {
        return { list: parsed.list || [], page: parsed.page };
    };

    initTable(dataTableRef?: any, menuFormRef?: any) {
        if (dataTableRef) this.dataTableRef.value = dataTableRef.value ?? dataTableRef;
        if (menuFormRef) this.menuFormRef.value = menuFormRef.value ?? menuFormRef;
        // ensure app list is loaded when the table/form refs are initialized
        if (dataTableRef || menuFormRef) this.loadApps();
    }

    async loadApps() {
        try {
            const resp = await AppAPI.query({});
            const list = (resp.list || []) as any[];
            this.appOptions.value = list.map((a) => ({ label: a.appName, value: a.appId }));
            console.log('Loaded apps for role page:', this.appOptions.value);
        } catch (e) {
            // ignore
        }
    }

    handleFormSuccess() {
        this.dialog.visible = false;
        this.dataTableRef.value?.reload?.();
    }

    handleOpenDialog(parentId?: string, id?: string) {
        if (id) {
            this.dialog.title = '编辑角色';
            this.detail(id).then((data) => {
                this.formData.value = data as any;
                this.dialog.visible = true;
            });
        } else {
            this.dialog.title = '新增角色';
            this.formData.value = { ...this.initialForm } as RoleForm;
            this.dialog.visible = true;
        }
    }

    handleCloseDialog() {
        this.dialog.visible = false;
        this.formData.value = { ...this.initialForm } as RoleForm;
    }

    async handleSubmit() {
        this.menuFormRef.value?.validate(async (valid: boolean) => {
            if (!valid) return;
            const id = this.formData.value.id;
            if (id) {
                await this.save(this.formData.value);
                ElMessage.success('修改成功');
            } else {
                await this.save(this.formData.value);
                ElMessage.success('新增成功');
            }
            this.handleFormSuccess();
        });
    }
    async handleCopy() {
        this.menuFormRef.value?.validate(async (valid: boolean) => {
            if (!valid) return;
            const id = this.formData.value.id;
            if(!this.formData.value.targetId){
                ElMessage.error('源角色不能为空');
                return;
            }
            this.formData.value.appId = this.selectedRows.value[0]?.appId || this.formData.value.appId;
            await this.copy(this.formData.value);
            ElMessage.success('新增成功');
            this.handleFormSuccess();
        });
    }

    handleDelete(id: string) {
        if (!id) { ElMessage.warning('请勾选删除项'); return; }
        ElMessageBox.confirm('确认删除已选中的数据项?', '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
            .then(() => {
                this.loading.value = true;
                this.remove(id).then(() => {
                    ElMessage.success('删除成功');
                    this.handleFormSuccess();
                }).finally(() => this.loading.value = false);
            }).catch(() => ElMessage.info('已取消删除'));
    }

    async handleRowClick(row: any) {
        // optional
    }

    /** proxies to RoleAPI */
    async query(params?: RoleQuery) { return RoleAPI.query(params); }
    async detail(id?: string) { return RoleAPI.detail(id); }
    async save(data: RoleForm) { return RoleAPI.save(data); }
    async remove(id: string) { return RoleAPI.remove(id); }
    async copy(data: RoleForm) { return RoleAPI.copy(data); }
    /** 打开复制创建对话框：从目标角色读取数据，置空 id 并设置 targetId，然后打开表单供用户修改并保存 */
    async openCopyDialog(targetId: string) {
        if (!targetId) return;
        try {
            // prepare a new form prefilled from source, clear id and set targetId
            const newForm: any = { ...(this.formData.value || {}), id: '', targetId };
            this.formData.value = newForm;
            this.dialog.title = '复制并创建角色';
            this.dialog.visible = true;
        } catch (e) {
            // ignore
        }
    }
}

export const RolePageService = new RolePage();
