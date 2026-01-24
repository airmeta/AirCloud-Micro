import type { RouteRecordRaw } from "vue-router";
import NProgress from "@/utils/nprogress";
import router from "@/router";
import { usePermissionStore, useUserStore } from "@/store";

import { isChooseApp } from "@/utils/auth";
import { getClientAppConfig } from "@/store/modules/client/client";
export function setupPermission() {
  const whiteList = ["/login", "/inject"];
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    console.log("to:", to);
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
          next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
          NProgress.done();
        }
        return;
      }
      let appChosen = isChooseApp();
      // 已登录未选择应用，跳转应用选择页
      if (!appChosen) {
        console.log("appChosen:", appChosen);
        if (to.path !== "/appCenter") {
          next({ path: "/appCenter" });
          NProgress.done();
          return;
        } else {
          next();
          return;
        }
      }
      // 已登录登录页重定向
      if (to.path === "/login") {
        next({ path: "/" });
        return;
      }
      const permissionStore = usePermissionStore();
      const userStore = useUserStore();

      // 动态路由生成
      if (!permissionStore.isRouteGenerated) {
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

      // 路由404检查
      if (to.matched.length === 0) {
        next("/404");
        return;
      }
      next();
    } catch (error) {
      // 错误处理：重置状态并跳转登录
      console.error("Route guard error:", error);
      await useUserStore().resetAllState();
      next("/login");
      NProgress.done();
    }
  });

  router.afterEach(() => {
    NProgress.done();
  });
}
