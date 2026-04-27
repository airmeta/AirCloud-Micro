import type { App } from "vue";
import type { RouteRecordRaw } from "vue-router";
import { createAppRouter, setupRouter as installRouter } from "@root/base/router";

export const Layout = () => import("@root/base/layouts/index.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/oauth",
    component: () => import("@/views/oauth/index.vue"),
    meta: { hidden: true },
  },
  {
    path: "/",
    name: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        // 用于 keep-alive 功能，需要与 SFC 中自动推导或显式声明的组件名称一致
        // 参考文档: https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
        name: "Dashboard",
        meta: {
          title: "dashboard",
          icon: "homepage",
          affix: true,
          keepAlive: true,
        },
      }
    ],
  },
];

const router = createAppRouter({ routes: constantRoutes });

// 全局注册 router
export function setupRouter(app: App<Element>) {
  installRouter(app, router);
}

export default router;
