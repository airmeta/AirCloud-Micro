import { useAppStore } from "@root/base/store/modules/app-store";
import { DeviceEnum } from "@root/base/enums/settings/device-enum";
import AppAPI from "../apis/app.api";
import type { AppForm, AppVO, AppQuery } from "../dtos/app.dto";
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { PageQuery, QueryResult } from '@root/base/components/air/AirTable/dtos/PageQuery';
import { AirTableColumn } from '@root/base/components/air/AirTable/components/air-table-column';

// simple Table base is assumed available in menu scripts; reuse same init pattern
export class AppPage {
  queryFormRef = ref();
  loading = ref(false);
  queryParams = reactive<any>({});
  tableData = ref<AppVO[]>([]);
  dataTableRef = ref<any>(null);
  menuFormRef = ref<any>(null);

  appStore = useAppStore();
  dialog = reactive({ title: '新增应用', visible: false });
  drawerSize = computed(() => (this.appStore.device === DeviceEnum.DESKTOP ? '600px' : '90%'));

  initialForm: AppForm = {
    appId: '',
    appName: '',
    appRedirectUrl: null,
    logo: null,
    isDefault: false,
    appEncryptType: undefined,
    publicKey: undefined,
    privateKey: undefined,
    appPrivateKey: null,
    enableMfa: false,
    description: null,
    isCommonApp: false,
    id: '',
  } as AppForm;

  formData = ref({ ...this.initialForm } as AppForm);

  tableColumns: AirTableColumn[] = [
    {label: '序号', type: 'index', width: 60 },
    { label: '应用名称', prop: 'appName', minWidth: 200 },
    { label: 'App ID', prop: 'appId', width: 300 },
    { label: '重定向地址', prop: 'appRedirectUrl', width: 300  },
    
    { label: '描述', prop: 'description', minWidth: 200 },
    { label: '操作', fixed: 'right', width: 220, slot: 'operation' },
  ];

  afterRequest = async (raw: any, parsed: QueryResult<any>) => {
    return { list: parsed.list || [], page: parsed.page };
  };

  initTable(dataTableRef?: any, menuFormRef?: any) {
    if (dataTableRef) this.dataTableRef.value = dataTableRef.value ?? dataTableRef;
    if (menuFormRef) this.menuFormRef.value = menuFormRef.value ?? menuFormRef;
  }

  handleFormSuccess() {
    this.dialog.visible = false;
    this.dataTableRef.value?.reload?.();
  }

  handleOpenDialog(parentId?: string, id?: string) {
    if (id) {
      this.dialog.title = '编辑应用';
      this.detail(id).then((data) => {
        this.formData.value = data as any;
        this.dialog.visible = true;
      });
    } else {
      this.dialog.title = '新增应用';
      this.formData.value = { ...this.initialForm } as AppForm;
      this.dialog.visible = true;
    }
  }

  handleCloseDialog() {
    this.dialog.visible = false;
    this.formData.value = { ...this.initialForm } as AppForm;
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
  handleRowClick(row: any) {
    // 可选：处理行点击事件
    
    
 }
  /** proxies to AppAPI */
  async query(params?: AppQuery) { return AppAPI.query(params); }
  async detail(id?: string) { return AppAPI.detail(id); }
  async save(data: AppForm) { return AppAPI.save(data); }
  async remove(id: string) { return AppAPI.remove(id); }
}

export const AppPageService = new AppPage();
