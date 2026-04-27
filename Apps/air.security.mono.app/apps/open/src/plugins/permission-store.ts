import type { RouteRecordRaw } from "vue-router";
import {
  createPermissionStore,
  setPermissionStore,
} from "@root/base/store/modules/permission-store";
import { constantRoutes } from "@/router";
import router from "@/router";
import { authorityTree } from "@root/base/api/modules/appLoginServices/dtos/appUserInfo";
import AppLoginService from "@root/base/api/modules/appLoginServices/appLoginService";

const modules = import.meta.glob(["../views/**/*.vue"]);
const Layout = () => import("@root/base/layouts/index.vue");
/**
 * 转换后端路由数据为Vue Router配置
 * 处理组件路径映射和Layout层级嵌套
 */
const transformRoutes = (routes: authorityTree[], isTopLevel: boolean = true): RouteRecordRaw[] => {
  return routes.map((route) => {
    const { component, children, ...args } = route;
    // 处理组件：顶层或非Layout保留组件，中间层Layout设为undefined
    const processedComponent = isTopLevel || component !== "Layout" ? component : undefined;
    const normalizedRoute = { ...args } as RouteRecordRaw;
    if (!processedComponent) {
      // 多级菜单的父级菜单，不需要组件
      normalizedRoute.component = undefined;
    } else {
      // 动态导入组件，Layout特殊处理，找不到组件时返回404
      normalizedRoute.component = processedComponent === "Layout"
        ? Layout
        : modules[`../views${processedComponent}.vue`]
          || modules[`../views${processedComponent}/index.vue`]
          || modules[`../views/error/404.vue`];
    }
    // 递归处理子路由
    if (children && children.length > 0) {
      normalizedRoute.children = transformRoutes(children, false);
    }
    return normalizedRoute;
  });
};

const permissionStore = createPermissionStore<authorityTree>({
  storeId: "system-permission",
  constantRoutes,
  getRoutes: () => AppLoginService.getAppUser(),
  transformRoutes,
  removeRoute: (name) => router.removeRoute(name),
});

setPermissionStore(permissionStore);

export const usePermissionStore = permissionStore.usePermissionStore;
export const usePermissionStoreHook = permissionStore.usePermissionStoreHook;
