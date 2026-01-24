
import type { MenuTypeEnum } from "@root/base/enums/system/menu-enum";

export interface MenuQuery {
  /** 搜索关键字 */
  info?: string;
}

export interface MenuQueryResult {
  count: number;
  list: MenuVO[];
}

export interface MenuVO {
  /** 菜单ID */
  id?: string;
  /**所属应用 */
  appId: string;
  /** ICON */
  icon?: string;
  /** 菜单名称 */
  title?: string;
  /** 按钮权限标识 */
  authority: string | null;
  /** 组件路径 外链时此时为空 */
  component?: string;
  /**路由地址 */
  path: string;
  /** 菜单类型 */
  type?: MenuTypeEnum;
  /**显隐(1:显示;0:隐藏)  */
  hide: number;
  /** 父菜单ID  为null则表示根菜单 */
  parentId?: string;
  /**排序 */
  sortNumber: number;

  /** 子菜单 */
  children: MenuVO[];
  
  createTime: string;
  createUserId: string;
  createUserName: string;
}
export interface MenuForm {
  /** 菜单ID */
  id?: string;
  /**所属应用 */
  appId: string;
  /** ICON */
  icon?: string;
  /** 菜单名称 */
  title?: string;
  /** 按钮权限标识 */
  authority: string | null;
  /** 组件路径 外链时此时为空 */
  component?: string;
  /**路由地址 */
  path: string;

  /** 菜单类型 */
  type?: MenuTypeEnum;
  /**显隐(1:显示;0:隐藏)  */
  hide: number;
  /** 父菜单ID  为null则表示根菜单 */
  parentId?: string;
  /**排序 */
  sortNumber: number;
}