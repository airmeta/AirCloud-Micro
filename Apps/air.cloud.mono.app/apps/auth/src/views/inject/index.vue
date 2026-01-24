<template>
  <div>
    <h3 text-center m-0 mb-20px>初始化应用</h3>
    <el-form ref="injectFormRef" :model="injectFormData" :rules="injectRules" size="large"
      :validate-on-rule-change="false">
      <!-- 默认管理员账号 -->
      <el-form-item prop="defaultAccount">
        <el-input v-model.trim="injectFormData.defaultAccount" :placeholder="t('inject.defaultAccount')">
          <template #prefix>
            <el-icon>
              <User />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <!-- 应用Id -->
      <el-form-item prop="appId">
        <el-input v-model.trim="injectFormData.appId" :placeholder="t('inject.appId')">
          <template #prefix>
            <el-icon>
              <User />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <!-- 应用地址 -->
      <el-form-item prop="appRedirectUrl">
        <el-input v-model.trim="injectFormData.appRedirectUrl" :placeholder="t('inject.appRedirectUrl')">
          <template #prefix>
            <el-icon>
              <User />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="appEncryptType">
        <el-select v-model="injectFormData.appEncryptType" placeholder="Select" style="width: 100%">
          <el-option key="0" label="RSA加密" :value="0" />
          <el-option key="1" label="SM2加密" :value="1" />
        </el-select>
      </el-form-item>
      <!-- 私钥 -->
      <el-form-item prop="privateKey">
        <el-input type="textarea" v-model.trim="injectFormData.privateKey" style="width: 100%" :rows="2"
          :placeholder="t('inject.privateKey')">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-text class="mx-1" type="info">{{ t('inject.privateKeyRemark') }}</el-text>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-form-item>
        <el-button :loading="loading" type="primary" class="w-full" @click="handleLoginSubmit">
          {{ t("inject.create") }}
        </el-button>
      </el-form-item>
    </el-form>

    <div flex-center gap-10px>
      <el-text size="default">{{ t("inject.hasApp") }}</el-text>
      <el-link type="primary" underline="never" @click="toOtherForm('login')">
        {{ t("inject.back") }}
      </el-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { FormInstance } from "element-plus";
import router from "@/router";
import { useUserStore } from "@/store";
import { InjectFormData } from "./dto/InjectFormData";
import INJECT_API from "./api/inject.api";
import { getClientAppConfig } from "@/store/modules/client/client";
const { t } = useI18n();
const userStore = useUserStore();
const route = useRoute();
const injectFormRef = ref<FormInstance>();
const loading = ref(false);
const injectFormData = ref<InjectFormData>({
  appName: "",
  appEncryptType: 0,
  privateKey: "",
  defaultAccount: ""
});
const injectRules = computed(() => {
  return {
    appName: [
      {
        required: true,
        trigger: "blur",
        message: t("inject.message.appName.required"),
      },
    ],
    defaultAccount: [
      {
        required: true,
        trigger: "blur",
        message: t("inject.message.defaultAccount.required"),
      },
      {
        min: 8,
        message: t("inject.message.defaultAccount.min"),
        trigger: "blur",
      },
    ],
    privateKey: [
      {
        required: true,
        trigger: "blur",
        message: t("inject.message.privateKey.required"),
      },
    ],
    appEncryptType: [
      {
        required: true,
        trigger: "change",
        message: t("inject.message.appEncryptType.required"),
      },
    ],
  };
});

onMounted(() => {
  emit("change");
  loadInit();
});

const loadInit = function () {
  userStore.initLoginPage().then((res) => {
    // 如果已经有应用，跳转到登录页面
    if (res.hasApp) {
      const appName = getClientAppConfig()?.appName;
      if (appName == "" || appName == null || appName == undefined) {
        document.title = "初始化应用";
      } else {
        document.title = appName;
      }
    }
  });
}

/**
 * 登录提交
 */
async function handleLoginSubmit() {
  try {
    // 1. 表单验证
    const valid = await injectFormRef.value?.validate();
    if (!valid) return;
    loading.value = true;
    // 2. 执行登录
    let response = await INJECT_API.createDefaultApp(injectFormData.value);
    if (response === false) {
      throw new Error("创建应用失败");
    } else {
      emit("change");
      toOtherForm("login");
    }
  } catch (error) {
    // 4. 统一错误处理
    console.error("创建应用失败:", error);
    loadInit();
  } finally {
    loading.value = false;
  }
}

const emit = defineEmits(["update:modelValue", "change"]);
function toOtherForm(type: "login") {
  emit("update:modelValue", type);
}
</script>

<style lang="scss" scoped>
.third-party-login {
  .divider-container {
    display: flex;
    align-items: center;
    margin: 40px 0;

    .divider-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, transparent, var(--el-border-color-light), transparent);
    }

    .divider-text {
      padding: 0 16px;
      font-size: 12px;
      color: var(--el-text-color-regular);
      white-space: nowrap;
    }
  }
}
</style>
