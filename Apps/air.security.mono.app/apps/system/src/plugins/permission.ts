import router from "@/router";
import { setupPermissionGuard } from "@root/base/plugins/permission";
import { useUserStore } from "@root/base/store";
import { usePermissionStore } from "./permission-store";
import { getClientAppConfig } from "@root/base/store/modules/client/client";

const whiteList = ["/oauth"];

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
    handleUnauthenticated: ({ to }) => {
      if (whiteList.includes(to.path)) {
        return;
      }

      window.location.href = "http://localhost:5173/#/login";
      return false;
    },
    handleAuthenticatedRoute: ({ to }) => {
      if (to.path === "/oauth") {
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
      return "/oauth";
    },
  });
}
