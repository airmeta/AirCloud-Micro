

/**
 * Role view object (与后端 Role 实体对应)
 */
export interface RoleVO {
	/** 主键 */
	id: string;
	/** 角色名 */
	roleName: string;
	/** 描述，可选 */
	description?: string | null;
	/** 所属应用 ID */
	appId: string;
}

/**
 * Role 表单提交 DTO（用于新增/编辑）
 */
export interface RoleForm {
	id?: string;
	roleName: string;
	description?: string | null;
	appId: string;
	/** 复制时使用的源角色ID，可选 */
	targetId?: string | null;
}

/**
 * Role 列表查询参数
 */
export interface RoleQuery {
	roleName?: string;
	appId?: string;
	// 可选的分页参数（根据项目约定调整）
	page?: number;
	size?: number;
}