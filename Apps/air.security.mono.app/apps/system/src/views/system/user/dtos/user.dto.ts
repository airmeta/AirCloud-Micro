/**
 * User view object - 对应后端 `User` / `UserSDto` 字段
 */
export enum IsOrNotEnum {
  No = 0,
  Yes = 1,
}

export interface UserVO {
  /** 主键 */
  id: string;
  /** 应用中的用户编号 */
  appUserId?: string | null;
  /** 用户名 */
  userName?: string | null;
  /** 账号 */
  account?: string | null;
  /** 证件号码 */
  idCardNo?: string | null;
  /** 邮箱 */
  email?: string | null;
  /** 电话 */
  phoneNumber?: string | null;
  /** 角色集合 - 后端可能以逗号分隔字符串返回，UI 也可能使用数组 */
  roleIds?: string | string[] | null;
  /** 部门集合 (后端可能返回单个 departmentId/departmentName 或逗号分隔的 departmentIds) */
  departmentIds?: string | string[] | null;
  departmentId?: string | null;
  departmentName?: string | null;

  /** 创建账户的应用（后端在新增时自动赋值；列表上做 tag 渲染；编辑时仅渲染） */
  accountCreateAppId?: string | null;
  /** 可选：若后端返回创建应用名称，可用于直接显示 */
  accountCreateAppName?: string | null;

  /** 账号加密密钥（表单中不显示，一般不回传） */
  accountCerdictKey?: string | null;

  /** 是否为第三方平台用户 (0: 否, 1: 是) */
  isThirdPlatformUser?: IsOrNotEnum;

  // 审计字段（若后端返回）
  createTime?: string;
  createUserId?: string;
  createUserName?: string;
}


/**
 * User 表单 DTO（用于新增/编辑）
 * 注意：后端约定 —— 新增时不传 `appUserId`，编辑时传入详情返回的值
 */
export interface UserForm {
  id?: string;
  /** 应用中的用户编号（新增时不传） */
  appUserId?: string;
  /** 用户名 */
  userName: string;
  /** 账号 */
  account: string;
  /** 密码（新增通常必填，编辑可不传） */
  password?: string;
  /** 证件号码 */
  idCardNo?: string | null;
  /** 邮箱 */
  email?: string | null;
  /** 电话 */
  phoneNumber?: string | null;
  /** 角色集合（数组或逗号分隔字符串，按后端接口约定） */
  roleIds?: string[] | string | null;
  /** 部门集合 */
  departmentIds?: string[] | string | null;
  /** 任职/职位集合 */
  assignmentIds?: string[] | string | null;
  /** 创建账户的应用 */
  accountCreateAppId?: string | null;
  /** 是否第三方平台用户(0/1) */
  isThirdPlatformUser?: number;
  /** 账号加密密钥（若需回传） */
  accountCerdictKey?: string | null;
}
/**
 * 用户账户日志返回对象 / Account log view object
 * zh-cn: 用户账户日志返回传输对象
 * en-us: User account log response DTO
 */
export interface AccountLogVO {
  /** 日志 ID / Log Id */
  id: string;
  /** 用户 ID / User Id */
  userId: string;
  /** 类型编码 / Type code */
  typeCode: string;
  /** 扩展字段（CLOB） / Meta info (CLOB) */
  meta?: string | null;
  /** 备注 / Remark */
  remark?: string | null;
}

/**
 * Account 表单 DTO（对应后端 `AccountDto`）
 * zh-cn: 账户数据传输对象（包含加密的 content）
 * en-us: Account DTO (contains encrypted payload)
 */
export interface AccountForm {
  /** 加密的内容 / Encrypted payload */
  content: string;
}
