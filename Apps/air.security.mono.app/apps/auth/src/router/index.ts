import type { App } from "vue";
import type { RouteRecordRaw } from "vue-router";
import { createAppRouter, setupRouter as installRouter } from "@root/base/router";

export const Layout = () => import("@/layouts/index.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },
  {
    path: "/inject",
    component: () => import("@/views/inject/index.vue"),
    meta: { hidden: true },
  },
  {
    path: "/appCenter",
    component: () => import("@/views/app-center/index.vue"),
    meta: { hidden: true },
  }
];

const router = createAppRouter({ routes: constantRoutes });

// 全局注册 router
export function setupRouter(app: App<Element>) {
  installRouter(app, router);
}

export default router;
