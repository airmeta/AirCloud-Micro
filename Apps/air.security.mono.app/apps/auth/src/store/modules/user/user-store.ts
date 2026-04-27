import { store } from "@/store";

import AuthAPI, { type LoginFormData } from "@/api/auth-api";
import UserAPI, { type UserInfo } from "@/api/system/user-api";
import { appSettings, appStatusDto } from "@/store/modules/login/appStatusDto";
import { setTicket, isLoggedIn, setAccountInfo, getAccountInfo } from "@/utils/auth";
import { usePermissionStoreHook } from "@/store";
import { useDictStoreHook } from "@/store/modules/dict-store";
import { useTagsViewStore } from "@/store";
import { setClientConfig, setClientAppConfig } from '@/store/modules/client/client';
import { UserInfo as UserInfoType } from "@/api/system/user-api";
export const useUserStore = defineStore("user", () => {
  // 用户信息
  const userInfo = ref<UserInfo>({} as UserInfo);
  /**
   * 登录
   *
   * @param {LoginFormData}
   * @returns
   */
  function login(LoginFormData: LoginFormData) {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.login(LoginFormData)
        .then((data) => {
          setTicket(data.ticket);
          setAccountInfo(data.payload);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  /**
   * 获取用户信息
   *
   * @returns {UserInfo} 用户信息
   */
  function getUserInfo() {
    let info = getAccountInfo() as UserInfoType;
    userInfo.value = info;
    return userInfo;
  }

  /**
   * 登出
   */
  function logout() {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.logout()
        .then(() => {
          // 重置所有系统状态
          resetAllState();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 重置所有系统状态
   * 统一处理所有清理工作，包括用户凭证、路由、缓存等
   */
  function resetAllState() {

    // 2. 重置其他模块状态
    // 重置路由
    usePermissionStoreHook().resetRouter();
    // 清除字典缓存
    useDictStoreHook().clearDictCache();
    // 清除标签视图
    useTagsViewStore().delAllViews();

    sessionStorage.clear();
    localStorage.clear();
    return Promise.resolve();
  }
  async function initLoginPage() {
    const res = await UserAPI.userInit();
    const clientConfig: appStatusDto = res;
    setClientConfig(clientConfig.client);
    if (clientConfig.appId !== "") {
      setClientAppConfig({
        appName: clientConfig.appName,
        appId: clientConfig.appId,
      } as appSettings);
    }

    return res;
  }
  return {
    userInfo,
    isLoggedIn: () => isLoggedIn(),
    getUserInfo,
    login,
    logout,
    resetAllState,
    initLoginPage
  };
});

/**
 * 在组件外部使用UserStore的钩子函数
 * @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
