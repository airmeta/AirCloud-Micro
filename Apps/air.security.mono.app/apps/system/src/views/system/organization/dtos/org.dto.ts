/**
 * 顶级部门默认 ParentId
 * Top Department Default ParentId
 */
export const TOP_DEPARTMENT_ID = "00000000000000000000000000000000";

/**
 * 部门表单（用于新增/修改）
 * Organization form data used for create/update operations
 */
export interface OrgForm {
	/**
	 * zh-cn: 部门ID
	 * en-us: Department ID
	 */
	id: string;

	/**
	 * zh-cn: 部门编码（全局唯一）
	 * en-us: Department Code (globally unique)
	 */
	departmentCode: string;

	/**
	 * zh-cn: 部门名称
	 * en-us: Department Name
	 */
	departmentName: string;

	/**
	 * zh-cn: 上级部门ID，若无上级则为 TOP_DEPARTMENT_ID
	 * en-us: Parent Department ID. Use TOP_DEPARTMENT_ID if none
	 */
	parentDepartmentId?: string | null;

	/**
	 * zh-cn: 部门描述
	 * en-us: Department Description
	 */
	description?: string | null;

	/**
	 * zh-cn: 管理应用列表，多个应用使用逗号分隔
	 * en-us: List of managed application IDs, comma-separated
	 */
	managedAppIds?: string | null;

	/**
	 * zh-cn: 管理区域列表，多个区域使用逗号分隔
	 * en-us: List of managed region IDs, comma-separated
	 */
	managedRegions?: string | null;

	/**
	 * zh-cn: 所属应用
	 * en-us: Belonging Application ID
	 */
	appId: string;
}

/**
 * 部门视图对象（用于树/列表显示）
 */
export interface OrgVO {
	/** 部门 ID / Department Id */
	id: string;

	/** 兼容树查询字段：code */
	code?: string;

	/** 兼容树查询字段：name */
	name?: string;

	/** 上级部门 ID（用于表单/列表） */
	parentDepartmentId?: string | null;

	/** 兼容树查询字段：parentId */
	parentId?: string | null;

	/** 部门描述 */
	description?: string | null;
	appId: string;
	children?: OrgVO[];
}

/**
 * 查询参数类型
 */
export interface OrgQuery {
	departmentName?: string;
	departmentCode?: string;
	appId?: string;
	page?: number;
	size?: number;
}

