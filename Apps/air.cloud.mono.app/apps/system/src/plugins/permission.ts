import type { RouteRecordRaw } from "vue-router";
import NProgress from "@root/base/utils/nprogress";
import router from "@/router";
import { useUserStore } from "@root/base/store";

import { usePermissionStore } from "./permission-store";
import { getClientAppConfig } from "@root/base/store/modules/client/client";
export function setupPermission() {
  const whiteList = ["/oauth"];
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    try {
      // 动态标题设置
      const appName = getClientAppConfig()?.appName;
      console.log("appName:", appName);
      if (appName == "" || appName == null || appName == undefined) {
        to.meta.title = "初始化应用";
        document.title = to.meta.title as string;
      } else {
        const title = (to.params.title as string) || (to.query.title as string);
        to.meta.title = appName + title ? "" : (" - " + title);
        document.title = to.meta.title as string;
      }
      const isLoggedIn = useUserStore().isLoggedIn();
      console.log("isLoggedIn:", isLoggedIn);
      // 未登录处理
      if (!isLoggedIn) {
        // 未选择应用，跳转应用选择页
        if (whiteList.includes(to.path)) {
          next();
        } else {
          window.location.href = "http://localhost:5173/#/login"
          NProgress.done();
        }
        return;
      }
      // 已登录处理
      if (to.path === "/oauth") {
        next({ path: "/" });
        return;
      }
      try {
        const permissionStore = usePermissionStore();
        const userStore = useUserStore();
        // 动态路由生成
        if (!permissionStore.isRouteGenerated()) {
          if (!userStore.userInfo?.roles?.length) {
            await userStore.getUserInfo();
          }
          const dynamicRoutes = await permissionStore.generateRoutes();
          dynamicRoutes.forEach((route: RouteRecordRaw) => {
            router.addRoute(route);
          });

          next({ ...to, replace: true });
          return;
        }

      } catch (e) {

      }


      // 路由404检查
      if (to.matched.length === 0) {
        next("/404");
        return;
      }
      next();
    } catch (error) {
      console.error("Route guard error:", error);
      await useUserStore().resetAllState();
      next("/oauth");
      NProgress.done();
    }
  });

  router.afterEach(() => {
    NProgress.done();
  });
}
