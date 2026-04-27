import type { NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw, RouteRecordRaw, Router } from "vue-router";
import NProgress from "@root/base/utils/nprogress";

export interface PermissionGuardStores<UserStore, PermissionStore> {
  useUserStore: () => UserStore;
  usePermissionStore: () => PermissionStore;
}

export interface PermissionGuardOptions<UserStore, PermissionStore> {
  router: Router;
  stores: PermissionGuardStores<UserStore, PermissionStore>;
  whiteList?: string[];
  getDocumentTitle?: (to: RouteLocationNormalized) => string | undefined;
  isLoggedIn: (userStore: UserStore) => boolean;
  handleUnauthenticated: (context: {
    to: RouteLocationNormalized;
    userStore: UserStore;
  }) => RouteLocationRaw | false | void;
  handleAuthenticatedRoute?: (context: {
    to: RouteLocationNormalized;
    userStore: UserStore;
    permissionStore: PermissionStore;
  }) => Promise<RouteLocationRaw | false | void> | RouteLocationRaw | false | void;
  shouldGenerateRoutes: (permissionStore: PermissionStore) => boolean;
  ensureUserInfo?: (userStore: UserStore) => Promise<void>;
  generateRoutes: (permissionStore: PermissionStore) => Promise<RouteRecordRaw[]>;
  onError: (context: {
    error: unknown;
    to: RouteLocationNormalized;
    userStore: UserStore;
  }) => Promise<RouteLocationRaw | false | void> | RouteLocationRaw | false | void;
  notFoundRedirect?: RouteLocationRaw;
}

function resolveNext(next: NavigationGuardNext, target?: RouteLocationRaw | false | void) {
  if (target === undefined) {
    next();
    return;
  }

  if (target === false) {
    next(false);
    return;
  }

  next(target);
}

export function setupPermissionGuard<UserStore, PermissionStore>(options: PermissionGuardOptions<UserStore, PermissionStore>) {
  const {
    router,
    stores,
    whiteList = [],
    getDocumentTitle,
    isLoggedIn,
    handleUnauthenticated,
    handleAuthenticatedRoute,
    shouldGenerateRoutes,
    ensureUserInfo,
    generateRoutes,
    onError,
    notFoundRedirect = "/404",
  } = options;

  router.beforeEach(async (to, _from, next) => {
    NProgress.start();

    try {
      const title = getDocumentTitle?.(to);
      if (title !== undefined) {
        to.meta.title = title;
        document.title = title;
      }

      const userStore = stores.useUserStore();
      if (!isLoggedIn(userStore)) {
        if (whiteList.includes(to.path)) {
          next();
          return;
        }

        const target = handleUnauthenticated({ to, userStore });
        resolveNext(next, target);
        if (target !== undefined) {
          NProgress.done();
        }
        return;
      }

      const permissionStore = stores.usePermissionStore();
      const authenticatedTarget = await handleAuthenticatedRoute?.({
        to,
        userStore,
        permissionStore,
      });
      if (authenticatedTarget !== undefined) {
        resolveNext(next, authenticatedTarget);
        if (authenticatedTarget !== false) {
          NProgress.done();
        }
        return;
      }

      if (shouldGenerateRoutes(permissionStore)) {
        await ensureUserInfo?.(userStore);
        const dynamicRoutes = await generateRoutes(permissionStore);
        dynamicRoutes.forEach((route) => {
          router.addRoute(route);
        });

        next({ ...to, replace: true });
        return;
      }

      if (to.matched.length === 0) {
        next(notFoundRedirect);
        return;
      }

      next();
    } catch (error) {
      const userStore = stores.useUserStore();
      const target = await onError({ error, to, userStore });
      resolveNext(next, target);
      NProgress.done();
    }
  });

  router.afterEach(() => {
    NProgress.done();
  });
}
