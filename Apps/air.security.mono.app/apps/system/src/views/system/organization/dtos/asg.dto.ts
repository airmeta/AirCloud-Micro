/**
 * 职位保存模型（用于新增/修改）
 * Assignment Save Data Transfer Object
 */
export interface AsgForm {
    /**
     * zh-cn: 职位ID
     * en-us: Assignment Id
     */
    id: string;

    /**
     * zh-cn: 职位名称
     * en-us: Assignment Name
     */
    name: string;

    /**
     * zh-cn: 职位描述
     * en-us: Assignment Description
     */
    description?: string | null;

    /**
     * zh-cn: 所属部门ID
     * en-us: Department Id
     */
    departmentId: string;
}

/**
 * 职位视图对象（用于列表/展示）
 */
export interface AsgVO {
    /** 职位 ID */
    id: string;

    /** 职位名称 */
    name?: string;

    /** 职位编码（可选，兼容前端展示） */
    code?: string;

    /** 职位描述 */
    description?: string | null;

    /** 所属部门 ID */
    departmentId?: string | null;
}

export default {};
