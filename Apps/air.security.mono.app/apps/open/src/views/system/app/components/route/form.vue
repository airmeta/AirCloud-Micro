<template>
  <el-form ref="internalRef" :model="model" :rules="rules" label-width="100px">
      <el-divider content-position="left">基础信息:</el-divider>
    <el-form-item label="所属应用" prop="appId">
      <el-select v-model="model.appId" placeholder="选择应用" filterable>
        <el-option v-for="it in appOptions" :key="it.value" :label="it.label" :value="it.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="路由地址" prop="route">
      <el-input v-model="model.route" placeholder="/api/xxx" />
    </el-form-item>
    <el-form-item label="请求方法" prop="method">
       <el-select v-model="model.method" placeholder="选择">
        <el-option :label="'GET'" value="GET" />
        <el-option :label="'POST'" value="POST" />
        <el-option :label="'PUT'" value="PUT" />
        <el-option :label="'DELETE'" value="DELETE" />
      </el-select>
    </el-form-item>

    <el-form-item label="允许匿名访问" prop="allowAnonymous">
      <el-select v-model="model.allowAnonymous" placeholder="选择">
        <el-option :label="'否'" :value="0" />
        <el-option :label="'是'" :value="1" />
      </el-select>
    </el-form-item>

    <el-form-item label="需要授权" prop="requiresAuthorization" v-if="model.allowAnonymous == 0">
      <el-select v-model="model.requiresAuthorization" placeholder="选择">
        <el-option :label="'否'" :value="0" />
        <el-option :label="'是'" :value="1" />
      </el-select>
    </el-form-item>
        <el-form-item label="描述" prop="description">
      <el-input type="textarea" :rows="5" v-model="model.description" placeholder="描述" />
    </el-form-item>
    <el-divider content-position="left"
      v-if="model.requiresAuthorization == 1 && model.allowAnonymous == 0">安全配置:</el-divider>
    <div v-if="model.requiresAuthorization == 1 && model.allowAnonymous == 0">
      <div v-for="(m, idx) in model.authorizationMetas || []" :key="idx"
        style="margin-bottom:8px; border:1px dashed #eaeaea; padding:8px;">
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="Schemes">
              <el-input v-model="m.authenticationSchemes" placeholder="AuthenticationSchemes" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Policy">
              <el-input v-model="m.policy" placeholder="Policy" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Roles">
              <el-input v-model="m.roles" placeholder="Roles (comma separated)" />
            </el-form-item>
          </el-col>
        </el-row>
        <div style="text-align:right; margin-top:6px;">
          <el-button type="danger" size="small" @click="removeAuthItem(idx)">删除</el-button>
        </div>
      </div>
      <el-button type="primary" plain size="small" @click="addAuthItem">添加授权项</el-button>
    </div>


  </el-form>
  <div class="dialog-footer" style="margin-top:12px; text-align: right">
    <el-button type="primary" @click="handleSave">保存</el-button>
    <el-button @click="handleCancel">取消</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import AppRouteAPI from "../../apis/app_route.api";
import AppAPI from "../../apis/app.api";
import type { AppRouteForm, AuthorizationMetaItemVO } from "../../dtos/app_route.dto";

const props = defineProps<{ initialData?: Partial<AppRouteForm> }>();
const emit = defineEmits(["success", "cancel"] as const);

const internalRef = ref<any>(null);
const model = ref<AppRouteForm>({ id: "", appId: "", route: "", description: "", allowAnonymous: 0, requiresAuthorization: 0, authorizationMetas: [], method: null });
const appOptions = ref<{ label: string; value: string }[]>([]);

const rules = {
  appId: [{ required: true, message: "请选择所属应用", trigger: "change" }],
  route: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
};

watch(
  () => props.initialData,
  (val) => {
    if (val)
      model.value = {
        id: val.id ?? "",
        appId: val.appId ?? "",
        route: val.route ?? "",
        description: val.description ?? null,
        allowAnonymous: val.allowAnonymous ?? 0,
        requiresAuthorization: val.requiresAuthorization ?? 0,
        authorizationMetas: val.authorizationMetas ?? [] as AuthorizationMetaItemVO[],
        method: val.method ?? null
      } as AppRouteForm;
  },
  { immediate: true }
);

onMounted(() => {
  AppAPI.query({}).then((resp: any) => {
    appOptions.value = (resp.list || []).map((a: any) => ({ label: a.appName, value: a.appId }));
  });
});

async function handleSave() {
  internalRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    const payload = { ...model.value } as AppRouteForm;

    if (payload.allowAnonymous == 0) {
      if (payload.requiresAuthorization == 1) {
        payload.authorizationMetas = payload.authorizationMetas || [];
      } else {
        payload.authorizationMetas = [];
      }
    } else {
      payload.requiresAuthorization = 0;
      payload.authorizationMetas = [];
    }
    await AppRouteAPI.save(payload);
    emit("success");
  });
}

function handleCancel() {
  emit("cancel");
}

function addAuthItem() {
  if (!model.value.authorizationMetas) model.value.authorizationMetas = [];
  model.value.authorizationMetas.push({ authenticationSchemes: null, policy: null, roles: null });
}

function removeAuthItem(idx: number) {
  if (!model.value.authorizationMetas) return;
  model.value.authorizationMetas.splice(idx, 1);
}
</script>

<style scoped>
.dialog-footer {
  padding: 8px 0 0;
}
</style>
