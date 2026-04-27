// Converted from C# entity InternalInterfaceMapping -> TypeScript DTOs
import type {
  InterfaceRequestParameter,
  InterfaceResponseParameter,
} from "../../common/interface_parameter.dto";

/** 内网接口映射 DTO */
export interface InternalInterfaceMappingForm {
  /** 主键ID */
  id: string;

  /** 名称 */
  name: string;

  /** 接口路由ID */
  routeId: string;

  /** 描述 */
  description?: string | null;

  /** 接口参数 */
  requestParameters?: InterfaceRequestParameter[] | null;

  /** 接口响应参数 */
  responseParameters?: InterfaceResponseParameter[] | null;
}

/** 内网接口映射 VO（与 InternalInterfaceMappingForm 结构一致） */
export interface InternalInterfaceMappingVO {
  /** 主键ID */
  id: string;

  /** 名称 */
  name: string;

  /** 接口路由ID */
  routeId: string;

  /** 接口路由地址 */
  route?: string | null;

  /** 路由所属应用ID（为空表示已删除或未绑定） */
  routeAppId?: string | null;

  /** 路由所属应用名称 */
  routeAppName?: string | null;

  /** 描述 */
  description?: string | null;

  /** 接口参数 */
  requestParameters?: InterfaceRequestParameter[] | null;

  /** 接口响应参数 */
  responseParameters?: InterfaceResponseParameter[] | null;
}
