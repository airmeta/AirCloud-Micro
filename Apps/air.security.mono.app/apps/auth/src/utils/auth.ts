import { Storage } from "@root/base/utils/storage";
import { AUTH_KEYS, ROLE_ROOT } from "@/constants";
import { useUserStoreHook } from "@/store/modules/user/user-store";
import router from "@/router";

// 负责本地凭证与偏好的读写
export const AuthStorage = {
  getAccessToken(): string {
    const isRememberMe = Storage.get<boolean>(AUTH_KEYS.REMEMBER_ME, false);
    return Storage.get(AUTH_KEYS.ACCESS_TOKEN, "");
  },

  getRefreshToken(): string {
    const isRememberMe = Storage.get<boolean>(AUTH_KEYS.REMEMBER_ME, false);
    return Storage.get(AUTH_KEYS.REFRESH_TOKEN, "");
  },

  setTokens(accessToken: string, refreshToken: string, rememberMe: boolean): void {
    Storage.set(AUTH_KEYS.REMEMBER_ME, rememberMe);
    if (rememberMe) {
      Storage.set(AUTH_KEYS.ACCESS_TOKEN, accessToken);
      Storage.set(AUTH_KEYS.REFRESH_TOKEN, refreshToken);
    } else {
      Storage.remove(AUTH_KEYS.ACCESS_TOKEN);
      Storage.remove(AUTH_KEYS.REFRESH_TOKEN);
    }
  },

  clearAuth(): void {
    Storage.remove(AUTH_KEYS.ACCESS_TOKEN);
    Storage.remove(AUTH_KEYS.REFRESH_TOKEN);
  },

  getRememberMe(): boolean {
    return Storage.get<boolean>(AUTH_KEYS.REMEMBER_ME, false);
  },
};

import { clientConfig } from "@/store/modules/login/appStatusDto";
import { getClientConfig, setClientConfig } from "@/store/modules/client/client";

const isLoggedIn = () => {
  return !!sessionStorage.getItem(AUTH_KEYS.ACCOUNT_INFO);
};

const setAccountInfo = (info: Object) => {
  sessionStorage.setItem(AUTH_KEYS.ACCOUNT_INFO, JSON.stringify(info));
}
const getAccountInfo = () => {
  const info = sessionStorage.getItem(AUTH_KEYS.ACCOUNT_INFO);
  return info ? JSON.parse(info) : null;
}

const getTicket = () => {
  const client_config = getClientConfig() as clientConfig;
  if (client_config) {
    return client_config.ticket;
  }
  return null;
};

const setTicket = (ticket: string) => {
  const client_config = getClientConfig() as clientConfig;
  client_config.ticket = ticket;
  setClientConfig(client_config);
};

const clearTicket = () => {
  Storage.remove(AUTH_KEYS.TICKIT);
};
const isChooseApp = () => {
  const appId = sessionStorage.getItem(AUTH_KEYS.CHOSEE_APP);
  return appId ? appId : null;
};


export { isLoggedIn, getTicket, setTicket, clearTicket, setAccountInfo, getAccountInfo, isChooseApp };
/**
 * 权限判断
 */
export function hasPerm(value: string | string[], type: "button" | "role" = "button"): boolean {
  const { roles, perms } = useUserStoreHook().userInfo;

  if (!roles || !perms) {
    return false;
  }

  // 超级管理员拥有所有权限
  if (type === "button" && roles.includes(ROLE_ROOT)) {
    return true;
  }

  const auths = type === "button" ? perms : roles;
  return typeof value === "string"
    ? auths.includes(value)
    : value.some((perm) => auths.includes(perm));
}

/**
 * 重定向到登录页面
 */
export async function redirectToLogin(message: string = "请重新登录"): Promise<void> {
  ElNotification({
    title: "提示",
    message,
    type: "warning",
    duration: 3000,
  });
  await useUserStoreHook().resetAllState();
  try {
    // 跳转到登录页，保留当前路由用于登录后跳转
    const currentPath = router.currentRoute.value.fullPath;
    await router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  } catch (error) {
    console.error("Redirect to login error:", error);
    // 强制跳转，即使路由重定向失败
    window.location.href = "/login";
  }
}
