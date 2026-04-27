// 接口参数公共 DTO

/** 是否（0/1） */
export enum IsOrNotEnum {
  No = 0,
  Yes = 1,
}

/**
 * 接口参数类型枚举（字符串值，前后端统一）
 */
export enum InterfaceParameterType {
  String = "string",
  Int = "int",
  Long = "long",
  Float = "float",
  Double = "double",
  Bool = "bool",
  Decimal = "decimal",
  Datetime = "datetime",
  Date = "date",
  Null = "null",
  Object = "object",
  Array = "array",
  Stream = "stream",
}

/**
 * 接口请求参数模型（支持嵌套+验证，优化版）
 */
export interface InterfaceRequestParameter {
  /** 参数名称 */
  name: string;

  /** 默认值 */
  defaultValue?: string | null;

  /** 是否必填 */
  isRequired?: boolean;

  /** 参数类型 */
  type: InterfaceParameterType;

  /** 参数验证条件 */
  validConditions?: string[];

  /** 参数描述 */
  description?: string | null;

  /** 是否启用列加密 */
  encrypt?: IsOrNotEnum;

  /** 子参数列表（嵌套核心） */
  items?: InterfaceRequestParameter[];
}

/**
 * 接口响应参数模型（支持嵌套+展示，优化版）
 */
export interface InterfaceResponseParameter {
  /** 参数名称 */
  name: string;

  /** 默认值/示例值 */
  value?: string | null;

  /** 参数类型 */
  type: InterfaceParameterType;

  /** 是否启用列加密 */
  encrypt?: IsOrNotEnum;

  /** 参数描述 */
  description?: string | null;

  /** 子参数列表（嵌套核心） */
  items?: InterfaceResponseParameter[];
}
