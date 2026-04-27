// Converted from C# entity AppRoute -> TypeScript DTOs
// C# CreateEntityBase fields are represented where useful (create user/time)
import { IsOrNotEnum } from '../../user/dtos/user.dto';

/** 应用路由 VO（后端返回的完整视图对象） */
export interface AppRouteVO {
  /** 应用Id */
  appId: string;
  /** 描述 */
  description?: string | null;
  /** 是否允许匿名访问 (0: 否, 1: 是) */
  allowAnonymous?: IsOrNotEnum | null;
  /** 是否需要授权访问 (0: 否, 1: 是) */
  requiresAuthorization?: IsOrNotEnum | null;
  /** 授权元信息（数组，前端使用对象，保存时会序列化为 JSON 字符串） */
  authorizationMetas?: AuthorizationMetaItemVO[] | null;
  /** 请求方法 */
  method?: string | null;
  /** 是否自动创建 (0: 否, 1: 是) */
  isAutoCreate?: IsOrNotEnum | null;
  /** 创建者 id（来自 CreateEntityBase） */
  createUserId?: string | null;
  /** 创建者姓名 */
  createUserName?: string | null;
  /** 创建时间（ISO 字符串） */
  createTime?: string | null;
  /** 实体 id（通用） */
  id: string;
  /** 路由地址 */
  route: string;
}

/** 授权元信息项（对应后端 EndPointAuthorizeData） */
export interface AuthorizationMetaItemVO {
  /** AuthenticationSchemes */
  authenticationSchemes?: string | null;
  /** Policy */
  policy?: string | null;
  /** Roles */
  roles?: string | null;
}

/** 应用授权 */
export interface AppRouteAuthVO {
  /** 实体 id（通用） */
  id: string;
  /** 应用Id */
  appId: string;
  /** 应用名称 */
  appName: string;
  /** 路由地址 */
  route: string;
  /** 路由描述 */
  routeDescription?: string | null;
  /** 授权描述 */
  description?: string | null;
  /** 创建时间（ISO 字符串） */
  createTime?: string | null;
  /** 授权时间（ISO 字符串） */
  authTime?: string | null;
  /** 应用是否被删除 */
  appIsDelete?: IsOrNotEnum | null;
  /** 应用是否启用 */
  appIdEnable?: IsOrNotEnum | null;
  /** 是否允许匿名访问 */
  allowAnonymous?: IsOrNotEnum | null;
  /** 是否需要授权 */
  requiresAuthorization?: IsOrNotEnum | null;
  /** 授权元数据（JSON 字符串） */
  authorizationMeta?: string | null;
  /** 是否自动创建 */
  isAutoCreate?: IsOrNotEnum | null;
  /** 请求方法 */
  method?: string | null;
  /** 是否已授权（是否绑定） */
  isBind?: boolean;
}

/** 前端表单模型（小驼峰，便于 v-model 绑定） */
export interface AppRouteForm {
  appId: string;
  route: string;
  description?: string | null;
  /** 是否允许匿名访问 (0: 否, 1: 是) */
  allowAnonymous?: number | null;
  /** 是否需要授权访问 (0: 否, 1: 是) */
  requiresAuthorization?: number | null;
  /** 授权元信息（数组，前端使用对象，保存时会序列化为 JSON 字符串） */
  authorizationMetas?: AuthorizationMetaItemVO[] | null;
  /** 请求方法 */
  method?: string | null;
  id: string;
}

/** 辅助：将后端 VO 转为前端表单模型 */
export function toAppRouteForm(vo: AppRouteVO): AppRouteForm {
  return {
    appId: vo.appId,
    route: vo.route,
    description: vo.description ?? null,
    allowAnonymous: vo.allowAnonymous ?? null,
    requiresAuthorization: vo.requiresAuthorization ?? null,
    authorizationMetas: vo.authorizationMetas,
    method: vo.method ?? null,
    id: vo.id,
  };
}