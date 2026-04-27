import type { App } from "vue";
import { createRouter, createWebHashHistory, type RouteRecordRaw, type Router } from "vue-router";

export interface CreateAppRouterOptions {
  routes?: RouteRecordRaw[];
}

export function createAppRouter(options: CreateAppRouterOptions = {}): Router {
  const { routes = [] } = options;

  return createRouter({
    history: createWebHashHistory(),
    routes,
    // 刷新时，滚动条位置还原
    scrollBehavior: () => ({ left: 0, top: 0 }),
  });
}

export function setupRouter(app: App<Element>, router: Router) {
  app.use(router);
}

const router = createAppRouter();

export default router;
