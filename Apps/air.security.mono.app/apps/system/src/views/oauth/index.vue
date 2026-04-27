<template>
  <div class="oauth-page">
    <el-card class="oauth-card" shadow="hover">
      <template #header>
        <div class="oauth-card__header">
          <span class="oauth-card__title" style="display: flex; align-items: center;">   
            <el-icon class="oauth-perms__icon">
                <HelpFilled />
              </el-icon>&nbsp;&nbsp;授权请求</span>
          <span class="oauth-card__countdown">倒计时 {{ countdown }}s</span>
        </div>
      </template>
      <div class="oauth-card__body">
        <template v-if="!isExpired">
          <p class="oauth-card__desc">应用 <strong>{{appName}}</strong> 请求访问您的账户。</p>
          <p class="oauth-card__subtitle">请求的权限：</p>
          <ul class="oauth-perms">
            <li v-for="perm in permissions" :key="perm" class="oauth-perms__item">
              <el-icon class="oauth-perms__icon">
                <CircleCheck />
              </el-icon>
              <span class="oauth-perms__text">{{ perm }}</span>
            </li>
          </ul>
        </template>
        <template v-else>
          <p class="oauth-expired__title">当前授权请求已过期</p>
          <p class="oauth-expired__desc">请重新申请授权</p>
        </template>
      </div>
      <template #footer>
        <div class="oauth-card__footer">
          <template v-if="!isExpired">
            <el-button @click="handleDeny">拒绝授权</el-button>
            <el-button type="primary" @click="handleApprove">确认授权</el-button>
          </template>
          <template v-else>
            <div class="oauth-card__footer-expired">
              <el-button type="primary" @click="handleDeny">返回授权中心</el-button>
            </div>
          </template>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useOauthActions } from "./scripts/index.page";
import { CircleCheck,HelpFilled } from "@element-plus/icons-vue";

const permissions = ["您的用户名", "您的电子邮件地址", "您的证件号码", "您的联系方式"];

const { approveAuthorization, denyAuthorization } = useOauthActions();

const route = useRoute();
const appName=ref<string>("");
const redirectToBackUrl = () => {
  const clientConfig=getClientAppConfig();
  const backUrl = route.query.backUrl as string || clientConfig?.loginPath;
  if (!backUrl) return;
  try {
    const resolved = new URL(backUrl, window.location.origin);
    if (resolved.origin !== window.location.origin) return;
    window.location.href = resolved.href;
  } catch {
    window.location.href = backUrl;
  }
};

const countdown = ref(90);
const isExpired = ref(false);
let countdownTimer: number | undefined;

const stopCountdown = () => {
  if (countdownTimer != null) {
    window.clearInterval(countdownTimer);
    countdownTimer = undefined;
  }
};

const handleDeny = () => {
  stopCountdown();
  denyAuthorization();
};

const handleApprove = () => {
  stopCountdown();
  approveAuthorization();
};

const handleBackToAuthCenter = () => {
  stopCountdown();
  redirectToBackUrl();
};

const expireAndAutoDeny = () => {
  if (isExpired.value) return;
  isExpired.value = true;
  stopCountdown();
};

import { useUserStore,useSettingsStore } from "@root/base/store";
import { getClientAppConfig } from "@root/base/store/modules/client/client";
const userStore = useUserStore();
onMounted(() => {
  stopCountdown();
  countdown.value = 90;
  isExpired.value = false;
  const appStore =useSettingsStore();
  const appId: string = appStore.appId as string;
  console.log("appId", appId);
  userStore.initLoginPage(appId).then((res) => {
    const clientConfig = getClientAppConfig();
    if (clientConfig) {
      appName.value = clientConfig.appName;
    }

    // 开始倒计时
    countdownTimer = window.setInterval(() => {
      if (countdown.value <= 1) {
        countdown.value = 0;
        expireAndAutoDeny();
        return;
      }
      countdown.value -= 1;
    }, 1000);
  });

});

onBeforeUnmount(() => {
  stopCountdown();
});
</script>

<style scoped>
.oauth-page {
  display: flex;
  justify-content: center;
  padding: 60px 12px 24px;
  min-height: 100vh;
  width: 100vw;
  background: #f0f0f0;
}

.oauth-card {
  width: 600px;
  max-width: 100%;
  height: 400px;
  position: sticky;
  top: 60px;
  z-index: 1;
}

.oauth-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.oauth-card__title {
  font-weight: 600;
}

.oauth-card__countdown {
  font-weight: 600;
  color: #409eff;
}

.oauth-card__body {
  padding: 0;
}

.oauth-card__desc {
  margin: 0 0 8px;
  line-height: 1.6;
}

.oauth-card__subtitle {
  margin: 0 0 6px;
  color: var(--el-text-color-regular);
}

.oauth-perms {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}

.oauth-perms__item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.oauth-perms__icon {
  margin-top: 2px;
  color: var(--el-color-success);
}

.oauth-perms__text {
  line-height: 1.6;
  word-break: break-word;
}

.oauth-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.oauth-card__footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.oauth-card__footer-expired {
  display: flex;
  justify-content: center;
  width: 100%;
}

.oauth-expired__title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
}

.oauth-expired__desc {
  margin: 0;
  color: var(--el-text-color-regular);
}
</style>
