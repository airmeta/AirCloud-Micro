/**
 * 字典表单 DTO - 对应后端 DictionaryConfigSDto
 * zh-cn: 字典配置保存传输对象
 * en-us: Dictionary configuration save DTO
 */
export interface DictForm {
  /** 字典配置ID（新增不填） */
  id?: string | null;
  /** 父级ID */
  parentId?: string | null;
  /** 编码（必填，最大长度64） */
  code: string;
  /** 标签（必填，最大长度128） */
  label: string;
  /** 值（必填，最大长度256） */
  value: string;
  /** 描述（可选，最大长度512） */
  description?: string | null;
  /** 扩展字段（CLOB） */
  meta?: string | null;
}

/**
 * 字典返回对象 / Dictionary response DTO
 */
export interface DictVO {
  /** 字典配置ID */
  id: string;
  /** 父级ID */
  parentId?: string | null;
  /** 编码 */
  code: string;
  /** 标签 */
  label: string;
  /** 值 */
  value: string;
  /** 描述 */
  description?: string | null;
  /** 扩展字段（CLOB） */
  meta?: string | null;
}

/**
 * 字典树形返回对象 / Dictionary tree response DTO
 */
export interface DictTreeVO extends DictVO {
  /** 子节点集合 */
  children?: DictTreeVO[];
}
