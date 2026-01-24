import type { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "../../router";
import { store } from "../../store";
import router from "../../router";

import { authorityTree } from "../../api/modules/appLoginServices/dtos/appUserInfo";
import AppLoginService from "../../api/modules/appLoginServices/appLoginService";

export const usePermissionStore = defineStore("base-permission", () => {
  // 所有路由（静态路由 + 动态路由）
  const routes = ref<RouteRecordRaw[]>([]);
  // 混合布局的左侧菜单路由
  const mixLayoutSideMenus = ref<RouteRecordRaw[]>([]);
  // 动态路由是否已生成
  const isRouteGenerated = ref(false);
  /** 生成动态路由 */
  async function generateRoutes(transformRoutes: (routes: authorityTree[], isTopLevel?: boolean) => RouteRecordRaw[]): Promise<RouteRecordRaw[]> {
    try {
        const data = await AppLoginService.getAppUser(); // 获取当前登录人的菜单路由
        const dynamicRoutes = transformRoutes(data);
        routes.value = [...constantRoutes, ...dynamicRoutes];
        isRouteGenerated.value = true;
        return dynamicRoutes;
    } catch (error) {
      // 路由生成失败，重置状态
      isRouteGenerated.value = false;
      throw error;
    }
  }
  /** 设置混合布局左侧菜单 */
  const setMixLayoutSideMenus = (parentPath: string) => {
    const parentMenu = routes.value.find((item: RouteRecordRaw) => item.path === parentPath);
    mixLayoutSideMenus.value = parentMenu?.children || [];
  };

  /** 重置路由状态 */
  const resetRouter = () => {
    // 移除动态添加的路由
    const constantRouteNames = new Set(constantRoutes.map((route) => route.name).filter(Boolean));
    routes.value.forEach((route: RouteRecordRaw) => {
      if (route.name && !constantRouteNames.has(route.name)) {
        router.removeRoute(route.name);
      }
    });

    // 重置所有状态
    routes.value = [...constantRoutes];
    mixLayoutSideMenus.value = [];
    isRouteGenerated.value = false;
  };

  return {
    routes,
    getRoutes: () => routes.value,
    mixLayoutSideMenus,
    isRouteGenerated,
    generateRoutes,
    setMixLayoutSideMenus,
     resetRouter,
  };
});

/** 非组件环境使用权限store */
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
