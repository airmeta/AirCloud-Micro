import { Storage } from "../utils/storage";
import { AUTH_KEYS, ROLE_ROOT } from "../constants/index";
import { useUserStoreHook } from "../store/modules/user/user-store";

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

import { clientConfig } from "../store/modules/login/appStatusDto";
import { getClientConfig, setClientConfig } from "../store/modules/client/client";

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
  const client_config = getClientConfig() as clientConfig | null;
  if (client_config?.ticket) return client_config.ticket;

  // 兜底：如果 client_config 尚未初始化，也允许从统一存储键读取
  return Storage.get<string | null>(AUTH_KEYS.TICKIT, null);
};

const setTicket = (ticket: string) => {
  // 兜底写入，避免 client_config 为空导致异常而中断后续存储
  Storage.set(AUTH_KEYS.TICKIT, ticket);

  const client_config = getClientConfig() as clientConfig | null;
  if (client_config) {
    client_config.ticket = ticket;
    setClientConfig(client_config);
  }
};

const clearTicket = () => {
  Storage.remove(AUTH_KEYS.TICKIT);
  const client_config = getClientConfig() as clientConfig | null;
  if (client_config?.ticket) {
    client_config.ticket = "" as any;
    setClientConfig(client_config);
  }
};
const isChooseApp = () => {
  const appId = sessionStorage.getItem(AUTH_KEYS.CHOSEE_APP);
  return appId ? appId : null;
};

const setChooseApp = (appId: string | null) => {
  if (appId) sessionStorage.setItem(AUTH_KEYS.CHOSEE_APP, appId);
  else sessionStorage.removeItem(AUTH_KEYS.CHOSEE_APP);
};

const setApp = (info: Object | null) => {
  if (info) sessionStorage.setItem(AUTH_KEYS.APP_INFO, JSON.stringify(info));
  else sessionStorage.removeItem(AUTH_KEYS.APP_INFO);
};

const getApp = () => {
  const info = sessionStorage.getItem(AUTH_KEYS.APP_INFO);
  return info ? JSON.parse(info) : null;
};

const clearAccountInfo = () => {
  sessionStorage.removeItem(AUTH_KEYS.ACCOUNT_INFO);
};

export { isLoggedIn, getTicket, setTicket, clearTicket, setAccountInfo, getAccountInfo, isChooseApp, setChooseApp, setApp, getApp, clearAccountInfo };


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