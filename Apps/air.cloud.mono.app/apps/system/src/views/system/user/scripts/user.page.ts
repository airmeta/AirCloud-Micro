import UserAPI from '../apis/user.api';
import request from '@root/base/utils/request';
import { EncryptUtil } from '@root/base/store/modules/client/encrypt';
import { useSettingsStore } from '@root/base/store/modules/settings-store';
import RoleAPI from '../../role/apis/role.api';
import OrgAPI from '../../organization/apis/org.api';
import AppAPI from '../../app/apis/app.api';
import AsgAPI from '../../organization/apis/asg.api';
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { QueryResult } from '@root/base/components/air/AirTable/dtos/PageQuery';
import { AirTableColumn } from '@root/base/components/air/AirTable/components/air-table-column';
import type { UserForm, UserVO } from '../dtos/user.dto';

export class UserPage {
  queryFormRef = ref();
  loading = ref(false);
  queryParams = reactive<any>({});
  dataTableRef = ref<any>(null);
  userFormRef = ref<any>(null);
  selectedId = ref<string | undefined>();
  selectedRows = ref<any[]>([]);

  dialog = reactive({ title: '新增用户', visible: false });
  drawerSize = '720px';

  initialForm: UserForm = { id: '', appUserId: '', userName: '', account: '', password: '', assignmentIds: [] } as UserForm;
  formData = ref({ ...this.initialForm } as UserForm);

  roleOptions = ref<{ label: string; value: string }[]>([]);
  deptOptions = ref<{ label: string; value: string }[]>([]);
  appOptions = ref<{ label: string; value: string }[]>([]);
  assignmentOptions = ref<{ label: string; value: string }[]>([]);
  appMap = computed(() => {
    const m: Record<string, string> = {};
    for (const it of this.appOptions.value) m[it.value] = it.label;
    return m;
  });

  /** 返回应用显示名称（优先使用映射，其次使用可能的返回字段） */
  getAppLabel(appId?: string | null, fallbackName?: string | null) {
    if (!appId) return fallbackName || '';
    const mapped = this.appMap.value[appId];
    if (mapped) return mapped;
    // try to find from options as a fallback (handles inconsistent id types)
    const found = this.appOptions.value.find((a) => `${a.value}` === `${appId}`);
    if (found) return found.label;
    return fallbackName || appId || '';
  }

  tableColumns: AirTableColumn[] = [
    { type: 'index', width: 60 },
    { label: '账号', prop: 'account', width: 180 },
    { label: '用户名', prop: 'userName', minWidth: 180 },
    { label: '邮箱', prop: 'email', width: 180 },
    { label: '电话', prop: 'phoneNumber', width: 180 },
    { label: '创建平台', prop: 'accountCreateAppId', width: 160, slot: 'accountApp' },
    { label: '操作', fixed: 'right', width: 300, slot: 'operation' },  
];

  afterRequest = async (raw: any, parsed: QueryResult<any>) => {
    return { list: parsed.list || [], page: parsed.page };
  };

  initTable(dataTableRef?: any, userFormRef?: any) {
    if (dataTableRef) this.dataTableRef.value = dataTableRef.value ?? dataTableRef;
    if (userFormRef) this.userFormRef.value = userFormRef.value ?? userFormRef;
    if (dataTableRef || userFormRef) this.loadOptions();
  }

  // 详情抽屉数据与状态
  detailDialog = reactive({ title: '用户明细', visible: false });
  detailData = ref<any | null>(null);

  async openDetail(id?: string) {
    if (!id) return;
    this.detailData.value = null;
    try {
      const d: any = await this.detail(id);
      // normalize some fields for display
      d.departmentName = d.departmentName || (d.departmentIds ? (Array.isArray(d.departmentIds) ? '' : d.departmentIds) : null);
      this.detailData.value = d;
      this.detailDialog.visible = true;
    } catch (e) {
      // ignore
    }
  }

  // 重置密码（事件触发，暂不实现具体逻辑）
  async resetPassword(userId: string) {
    if (!userId) { ElMessage.warning('用户ID为空'); return; }
    try {
      // 重置密码流程：前端不允许直接设置密码，只提交验证码给后端处理
      const res: any = await ElMessageBox.prompt('请输入重置验证码（由后端或邮件下发）', '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'text',
        inputPattern: /\S+/,
        inputErrorMessage: '请输入有效的验证码'
      });
      const code = (res as any).value;
      if (!code) return;

      // prepare encrypted content matching ResetPasswordDto: { UserId, Code }
      const data1 = { UserId: userId, Code: code };
      const appStore = useSettingsStore();
      const appPublicKey: string = appStore.appPublicKey as string;
      const content = EncryptUtil.encryptData(JSON.stringify(data1), appPublicKey) as string;

      await UserAPI.resetPassword(content);
      ElMessage.success('重置请求已发送，若后端处理成功将完成重置');
    } catch (err: any) {
      // prompt cancel throws; if other error, show
      if (err && err !== 'cancel' && err !== 'close') {
        ElMessage.error(err?.message || '重置密码失败');
      }
    }
  }

  // 重置密码弹窗状态：在列表中点击“重置密码”时打开，包含账号、用户名和验证码输入框
  resetDialog = reactive({ visible: false, userId: '', account: '', userName: '', code: '' });
  resetCodeCountdown = ref(0);

  startResetCountdown(sec = 60) {
    this.resetCodeCountdown.value = sec;
    const t = setInterval(() => {
      this.resetCodeCountdown.value -= 1;
      if (this.resetCodeCountdown.value <= 0) {
        clearInterval(t);
      }
    }, 1000);
  }

  // 发送验证码（根据账号内容判断手机号或邮箱）
  async sendResetCode() {
    const account = (this.resetDialog.account || '').trim();
    if (!account) { ElMessage.warning('无效的账号'); return; }
    if (this.resetCodeCountdown.value > 0) { return; }
    try {
      // simple heuristic: contains @ -> email, otherwise treat as mobile
      if (account.indexOf('@') >= 0) {
        await request({ url: `/api/v1/users/email/code`, method: 'post', params: { email: account } });
      } else {
        await request({ url: `/api/v1/users/mobile/code`, method: 'post', params: { mobile: account } });
      }
      ElMessage.success('验证码已发送');
      this.startResetCountdown(60);
    } catch (e: any) {
      ElMessage.error(e?.message || '发送验证码失败');
    }
  }

  openResetDialog(user: any) {
    if (!user) return;
    this.resetDialog.userId = user.id || '';
    this.resetDialog.account = user.account || '';
    this.resetDialog.userName = user.userName || '';
    this.resetDialog.code = '';
    this.resetDialog.visible = true;
  }

  async sendResetRequest() {
    const userId = this.resetDialog.userId;
    const code = (this.resetDialog.code || '').trim();
    if (!userId) { ElMessage.warning('用户ID为空'); return; }
    if (!code) { ElMessage.warning('请输入验证码'); return; }
    try {
      const data1 = { UserId: userId, Code: code };
      const appStore = useSettingsStore();
      const appPublicKey: string = appStore.appPublicKey as string;
      const content = EncryptUtil.encryptData(JSON.stringify(data1), appPublicKey) as string;
      await UserAPI.resetPassword(content);
      ElMessage.success('重置请求已发送，若后端处理成功将完成重置');
      this.resetDialog.visible = false;
    } catch (e: any) {
      ElMessage.error(e?.message || '重置请求失败');
    }
  }

  async loadOptions() {
    try {
      const rolesResp: any = await RoleAPI.query({});
      const roles = (rolesResp.list || rolesResp || []) as any[];
      this.roleOptions.value = (roles || []).map((r) => ({ label: r.roleName, value: r.id }));
    } catch (e) {}
    try {
      const deptsResp: any = await OrgAPI.query({});
      const depts = (deptsResp.list || deptsResp || []) as any[];
      this.deptOptions.value = (depts || []).map((d) => ({ label: d.orgName || d.title || d.name || d.label, value: d.id }));
    } catch (e) {}
    try {
      const appsResp: any = await AppAPI.query({});
      const apps = (appsResp.list || appsResp || []) as any[];
      this.appOptions.value = (apps || []).map((a) => ({ label: a.appName || a.name, value: a.appId || a.id }));
    } catch (e) {}
    try {
      const asgsResp: any = await AsgAPI.query({});
      const asgs = (asgsResp.list || asgsResp || []) as any[];
      this.assignmentOptions.value = (asgs || []).map((a) => ({ label: a.name || a.title || a.assignmentName, value: a.id }));
    } catch (e) {}
  }

  handleFormSuccess() {
    this.dialog.visible = false;
    this.dataTableRef.value?.reload?.();
  }

  handleOpenDialog(id?: string) {
    if (id) {
      this.dialog.title = '编辑用户';
      this.detail(id).then((data: any) => {
        if (data) {
          data.roleIds = Array.isArray(data.roleIds) ? data.roleIds : (data.roleIds ? (data.roleIds as string).split(',') : []);
          data.departmentIds = Array.isArray(data.departmentIds) ? data.departmentIds : (data.departmentIds ? (data.departmentIds as string).split(',') : []);
          data.assignmentIds = Array.isArray(data.assignmentIds) ? data.assignmentIds : (data.assignmentIds ? (data.assignmentIds as string).split(',') : []);
        }
        this.formData.value = data as any;
        this.dialog.visible = true;
      });
    } else {
      this.dialog.title = '新增用户';
      this.formData.value = { ...this.initialForm } as UserForm;
      this.dialog.visible = true;
    }
  }

  handleCloseDialog() {
    this.dialog.visible = false;
    this.formData.value = { ...this.initialForm } as UserForm;
  }

  async handleSubmit() {
    this.userFormRef.value?.validate(async (valid: boolean) => {
      if (!valid) return;
      const id = this.formData.value.id;
      const payload: any = { ...this.formData.value };
      if (Array.isArray(payload.roleIds)) payload.roleIds = payload.roleIds.join(',');
      if (Array.isArray(payload.departmentIds)) payload.departmentIds = payload.departmentIds.join(',');
      if (Array.isArray(payload.assignmentIds)) payload.assignmentIds = payload.assignmentIds.join(',');
      await this.save(payload as any);
      ElMessage.success(id ? '修改成功' : '新增成功');
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

  async handleRowClick(row: any) {}

  async query(params?: any) { return UserAPI.query(params); }
  async detail(id?: string) { return UserAPI.detail(id); }
  async save(data: UserForm) { return UserAPI.save(data); }
  async remove(id: string) { return UserAPI.remove(id); }
}

export const UserPageService = new UserPage();
