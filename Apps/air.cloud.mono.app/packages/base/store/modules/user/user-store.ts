import { store } from "../../index";

import AuthAPI, { type LoginFormData } from "../../../api/auth-api";
import UserAPI, { type UserInfo } from "../../../api/system/user-api";
import { setTicket, isLoggedIn, setAccountInfo, getAccountInfo } from "../../../utils/auth";
import { useDictStoreHook } from "../../../store/modules/dict-store";
import { useTagsViewStore } from "../../../store";
import { setClientConfig, setClientAppConfig, getClientAppConfig } from '../../../store/modules/client/client';
import { UserInfo as UserInfoType } from "../../../api/system/user-api";
import { appSettings, appStatusDto } from "../../../api/modules/appLoginServices/dtos/loginResult";
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
  function setPermissions(permissions: string[]) {
    if (userInfo.value) {
      userInfo.value.perms = permissions;
    }
  }
  function setUserInfo(info: UserInfo) {
    userInfo.value = info;
  }
  function setRoles(roles: string[]) {
    if (userInfo.value) {
      userInfo.value.roles = roles;
    }
  }
  /**
   * 重置所有系统状态
   * 统一处理所有清理工作，包括用户凭证、路由、缓存等
   */
  function resetAllState() {

  //   // 2. 重置其他模块状态
  //   // 重置路由
  //    /** 重置路由状态 */
  // const resetRouter = () => {
  //   // 移除动态添加的路由
  //   const constantRouteNames = new Set(constantRoutes.map((route) => route.name).filter(Boolean));
  //   routes.value.forEach((route: RouteRecordRaw) => {
  //     if (route.name && !constantRouteNames.has(route.name)) {
  //       router.removeRoute(route.name);
  //     }
  //   });

  //   // 重置所有状态
  //   routes.value = [...constantRoutes];
  //   mixLayoutSideMenus.value = [];
  //   isRouteGenerated.value = false;
  // };
    // 清除字典缓存
    useDictStoreHook().clearDictCache();
    // 清除标签视图
    useTagsViewStore().delAllViews();

    return Promise.resolve();
  }
  async function initLoginPage(appId:string="") {
    const res = await UserAPI.userInit(appId);
    const clientConfig: appStatusDto = res;
    setClientConfig(clientConfig.client);
    if (clientConfig.appId !== "") {
      setClientAppConfig({
        appName: clientConfig.appName,
        appId: clientConfig.appId,
        loginPath:clientConfig.loginPath
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
    initLoginPage,
    setUserInfo,
    setPermissions,
    setRoles
  };
});

/**
 * 在组件外部使用UserStore的钩子函数
 * @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
