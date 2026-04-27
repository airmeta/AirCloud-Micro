// Converted from C# entity ExternalInterfaceMapping -> TypeScript DTOs
import type {
  InterfaceRequestParameter,
  InterfaceResponseParameter,
  IsOrNotEnum,
} from "../../common/interface_parameter.dto";

/** 外部接口映射 DTO */
export interface ExternalInterfaceMappingForm {
  /** 标识 */
  id: string;

  /** 名称 */
  name?: string | null;

  /** 内部接口标识 */
  internalInterfaceId: string;

  /** 内部接口名称 */
  internalInterfaceName?: string | null;

  /** 内部接口描述 */
  internalInterfaceDescription?: string | null;

  /** 描述 */
  description?: string | null;

  /** 是否要求使用应用加密 */
  enableAppEncrypt?: IsOrNotEnum;

  /** 接口参数 */
  requestParameters?: InterfaceRequestParameter[] | null;

  /** 接口响应参数 */
  responseParameters?: InterfaceResponseParameter[] | null;
}

/** 外部接口映射 VO（与 ExternalInterfaceMappingForm 结构一致） */
export interface ExternalInterfaceMappingVO {
  /** 标识 */
  id: string;

  /** 名称 */
  name?: string | null;

  /** 内部接口标识 */
  internalInterfaceId: string;

  /** 内部接口名称 */
  internalInterfaceName?: string | null;

  /** 内部接口描述 */
  internalInterfaceDescription?: string | null;

  /** 描述 */
  description?: string | null;

  /** 是否要求使用应用加密 */
  enableAppEncrypt?: IsOrNotEnum;

  /** 接口参数 */
  requestParameters?: InterfaceRequestParameter[] | null;

  /** 接口响应参数 */
  responseParameters?: InterfaceResponseParameter[] | null;
}
