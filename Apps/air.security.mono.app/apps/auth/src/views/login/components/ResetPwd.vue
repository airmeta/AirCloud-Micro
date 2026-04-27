<template>
  <div>
    <h3 text-center m-0 mb-20px>{{ t("login.resetPassword") }}</h3>
    <el-form ref="formRef" :model="model" :rules="rules" size="large">
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input v-model.trim="model.username" :placeholder="t('login.username')">
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="code">
        <div flex items-center gap-10px>
          <el-input v-model.trim="model.code" :placeholder="t('login.code')" clearable class="flex-1" @keyup.enter="submit">
            <template #prefix>
              <div class="i-svg:captcha" />
            </template>
          </el-input>
          <div cursor-pointer h-40px w-120px flex-center @click="getCaptcha">
            <el-icon v-if="codeLoading" class="is-loading" size="20">
              <Loading />
            </el-icon>
            <img v-else-if="captchaBase64" border-rd-4px object-cover shadow="[0_0_0_1px_var(--el-border-color)_inset]"
              :src="captchaBase64" alt="captchaCode" style="width: 120px;height: 30px;" />
            <el-text v-else type="info" size="small">点击获取验证码</el-text>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" class="w-full" @click="submit">
          {{ t("login.resetPassword") }}
        </el-button>
      </el-form-item>
    </el-form>

    <div flex-center gap-10px>
      <el-text size="default">{{ t("login.thinkOfPasswd") }}</el-text>
      <el-link type="primary" underline="never" @click="toLogin">{{ t("login.login") }}</el-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import type { FormInstance } from "element-plus";

const { t } = useI18n();

const emit = defineEmits(["update:modelValue"]);
const toLogin = () => emit("update:modelValue", "login");

const model = ref({
  username: "",
  code: "",
});

const rules = computed(() => {
  return {
    username: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.username.required"),
      },
    ],
    code: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.captchaCode.required"),
      },
    ],
  };
});

const formRef = ref<FormInstance>();

// 验证码相关
import AuthAPI from "@/api/auth-api";
const codeLoading = ref(false);
const captchaBase64 = ref<string | undefined>();

function getCaptcha() {
  codeLoading.value = true;
  AuthAPI.getCaptcha()
    .then((data) => {
      model.value.code = "";
      captchaBase64.value = "data:image/png;base64," + data.captchaBase64;
    })
    .finally(() => {
      codeLoading.value = false;
    });
}

onMounted(() => {
  getCaptcha();
});

const submit = async () => {
  await formRef.value?.validate();
  ElMessage.warning("开发中 ...");
};
</script>
