// @room/base/src/utils/routeHelper.ts
import type { Component, DefineComponent } from 'vue';
import { RouteComponent } from 'vue-router';

// 定义动态导入的组件类型（匹配 Vue 路由的 component 类型）
type AsyncComponent = () => Promise<{
  default: DefineComponent<{}, {}, any>;
}>;

// 视图根路径（全局变量，由业务包初始化）
let VIEWS_ROOT_PATH: string = '';

/**
 * 初始化路由辅助函数（由业务包调用）
 * @param rootPath 业务包的视图根路径，如 '/src/views' 或 'src/views'
 */
export const initRouteHelper = (rootPath: string): void => {
  if (!rootPath) {
    throw new Error('视图根路径不能为空！');
  }
  // 统一路径格式：移除末尾的 /，避免拼接时出现重复
  VIEWS_ROOT_PATH = rootPath.endsWith('/') ? rootPath.slice(0, -1) : rootPath;
};

/**
 * 加载路由组件，支持兜底加载 index.vue
 * @param routePath 路由路径（如 '/system/menu'）
 * @param fallback404Path 404组件路径（可选，默认 'error/404'）
 * @returns 异步组件加载函数（适配 Vue Router 的 component 类型）
 */
/**
 * 加载路由组件（修复严格模式 + 组件解析问题）
 * 核心：直接返回 Vue Router 可执行的异步加载函数，而非嵌套函数
 */



// 定义加载路径的工具函数（避免重复代码，同时规避严格模式问题）
const load = async (path: string): Promise<{ default: Component }> => {
  try {
    return await import(/* @vite-ignore */ path); // vite-ignore 避免静态分析报错
  } catch (e) {
    throw new Error(`加载组件失败：${path}`);
  }
};

export  const  loadView = async (
  routePath: string,
  fallback404Path: string = 'error/404'
): Promise<RouteComponent> => {

  if (!VIEWS_ROOT_PATH) {
    throw new Error('请先调用 initRouteHelper 初始化视图根路径！');
  }
  const cleanRoutePath = routePath.startsWith('/')
    ? routePath.slice(1)
    : routePath;
  try {
      return await load(`${VIEWS_ROOT_PATH}/${cleanRoutePath}.vue`) as RouteComponent;
    } catch {
      try {
        return await load(`${VIEWS_ROOT_PATH}/${cleanRoutePath}/index.vue`) as RouteComponent;
      } catch {
        return await load(`${VIEWS_ROOT_PATH}/${fallback404Path}.vue`) as RouteComponent; 
      }
    }
};

// 导出类型供业务包使用
export type { AsyncComponent };