import router from "@/router";
import { setupPermissionGuard } from "@root/base/plugins/permission";
import { usePermissionStore, useUserStore } from "@/store";
import { isChooseApp } from "@/utils/auth";
import { getClientAppConfig } from "@/store/modules/client/client";

const whiteList = ["/login", "/inject"];

function resolveDocumentTitle(to: Parameters<typeof setupPermissionGuard>[0]["router"]["currentRoute"]["value"]) {
  const appName = getClientAppConfig()?.appName;
  if (appName === "" || appName == null) {
    return "初始化应用";
  }

  const title = (to.params.title as string) || (to.query.title as string) || "";
  return title ? `${appName} - ${title}` : appName;
}

export function setupPermission() {
  setupPermissionGuard({
    router,
    stores: {
      useUserStore,
      usePermissionStore,
    },
    whiteList,
    getDocumentTitle: (to) => resolveDocumentTitle(to),
    isLoggedIn: (userStore) => userStore.isLoggedIn(),
    handleUnauthenticated: ({ to }) => `/login?redirect=${encodeURIComponent(to.fullPath)}`,
    handleAuthenticatedRoute: ({ to }) => {
      const appChosen = isChooseApp();
      if (!appChosen && to.path !== "/appCenter") {
        return { path: "/appCenter" };
      }

      if (to.path === "/login") {
        return { path: "/" };
      }
    },
    shouldGenerateRoutes: (permissionStore) => !permissionStore.isRouteGenerated,
    ensureUserInfo: async (userStore) => {
      if (!userStore.userInfo?.roles?.length) {
        await userStore.getUserInfo();
      }
    },
    generateRoutes: (permissionStore) => permissionStore.generateRoutes(),
    onError: async ({ error, userStore }) => {
      console.error("Route guard error:", error);
      await userStore.resetAllState();
      return "/login";
    },
  });
}
