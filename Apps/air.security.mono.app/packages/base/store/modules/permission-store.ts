import type { RouteRecordRaw } from "vue-router";
import { store } from "@root/base/store";

export interface BasePermissionStoreOptions<TSourceRoute = unknown> {
  storeId?: string;
  constantRoutes: RouteRecordRaw[];
  getRoutes: () => Promise<TSourceRoute[]>;
  transformRoutes: (routes: TSourceRoute[], isTopLevel?: boolean) => RouteRecordRaw[];
  removeRoute?: (name: string) => void;
}

const defaultPermissionStore = createPermissionStore({
  constantRoutes: [],
  getRoutes: async () => [],
  transformRoutes: () => [],
});

let currentPermissionStore = defaultPermissionStore;

export function setPermissionStore(storeInstance: typeof defaultPermissionStore) {
  currentPermissionStore = storeInstance;
}

export const usePermissionStore = (...args: Parameters<typeof defaultPermissionStore.usePermissionStore>) =>
  currentPermissionStore.usePermissionStore(...args);

export const usePermissionStoreHook = () => currentPermissionStore.usePermissionStoreHook();

export function createPermissionStore<TSourceRoute = unknown>(options: BasePermissionStoreOptions<TSourceRoute>) {
  const {
    storeId = "base-permission",
    constantRoutes,
    getRoutes,
    transformRoutes,
    removeRoute,
  } = options;

  const usePermissionStore = defineStore(storeId, () => {
    // 所有路由（静态路由 + 动态路由）
    const routes = ref<RouteRecordRaw[]>([]);
    // 混合布局的左侧菜单路由
    const mixLayoutSideMenus = ref<RouteRecordRaw[]>([]);
    // 动态路由是否已生成
    const isRouteGenerated = ref(false);

    /** 生成动态路由 */
    async function generateRoutes(): Promise<RouteRecordRaw[]> {
      try {
        const data = await getRoutes();
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
      if (removeRoute) {
        const constantRouteNames = new Set(constantRoutes.map((route) => route.name).filter(Boolean) as string[]);
        routes.value.forEach((route: RouteRecordRaw) => {
          if (route.name && !constantRouteNames.has(String(route.name))) {
            removeRoute(String(route.name));
          }
        });
      }

      // 重置所有状态
      routes.value = [...constantRoutes];
      mixLayoutSideMenus.value = [];
      isRouteGenerated.value = false;
    };

    return {
      routes,
      mixLayoutSideMenus,
      isRouteGenerated,
      generateRoutes,
      setMixLayoutSideMenus,
      resetRouter,
    };
  });

  function usePermissionStoreHook() {
    return usePermissionStore(store);
  }

  return {
    usePermissionStore,
    usePermissionStoreHook,
  };
}
