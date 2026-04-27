import { QueryResult } from "@root/base/components/air/AirTable/dtos/PageQuery";
import type { OrgForm, OrgVO } from "../dtos/org.dto";
import request from "@root/base/utils/request";

const SAVE_DEPARTMENT_URL = "/v1/security/department/save";
const DEPARTMENT_DETAIL_URL = "/v1/security/department/detail";
const DELETE_DEPARTMENT_URL = "/v1/security/department/remove";
const QUERY_DEPARTMENT_URL = "/v1/security/department/query";

const ASSIGN_REGION_URL = "/v1/security/department/assign/region";
const REMOVE_REGION_URL = "/v1/security/department/remove/region";

const ASSIGN_APP_URL = "/v1/security/department/assign/app";
const REMOVE_APP_URL = "/v1/security/department/remove/app";

const OrgAPI = {
    /**
     * zh-cn: 查询部门树（返回树形列表）
     * en-us: Query departments as a tree list
     */
    async query(queryParams?: any): Promise<QueryResult<OrgVO>> {
        const list = await request<any, OrgVO[]>({ url: `${QUERY_DEPARTMENT_URL}`, method: "post", data: queryParams });
        const result: QueryResult<OrgVO> = {
            list: list || [],
            page: {
                page: 1,
                limit: 0,
                total: (list || []).length,
            },
        };
        return result;
    },

    /**
     * zh-cn: 获取部门详情
     * en-us: Get department details
     */
    detail(id?: string) {
        return request<any, OrgForm>({ url: `${DEPARTMENT_DETAIL_URL}/${id}`, method: "get" });
    },

    /**
     * zh-cn: 保存（新增或更新）部门信息
     * en-us: Save (create or update) department
     */
    save(data: OrgForm) {
        return request({ url: `${SAVE_DEPARTMENT_URL}`, method: "post", data });
    },

    /**
     * zh-cn: 删除部门
     * en-us: Delete department
     */
    remove(id: string) {
        return request({ url: `${DELETE_DEPARTMENT_URL}/${id}`, method: "delete" });
    },

    /**
     * zh-cn: 为部门分配区域
     * en-us: Assign a region to a department
     */
    assignRegion(departmentId: string, regionId: string) {
        return request({ url: `${ASSIGN_REGION_URL}/${departmentId}/${regionId}`, method: "get" });
    },

    /**
     * zh-cn: 取消部门的区域分配
     * en-us: Remove a region from a department
     */
    removeRegion(departmentId: string, regionId: string) {
        return request({ url: `${REMOVE_REGION_URL}/${departmentId}/${regionId}`, method: "delete" });
    },

    /**
     * zh-cn: 为部门分配应用
     * en-us: Assign an app to a department
     */
    assignApp(departmentId: string, appId: string) {
        return request({ url: `${ASSIGN_APP_URL}/${departmentId}/${appId}`, method: "get" });
    },

    /**
     * zh-cn: 取消部门的应用分配
     * en-us: Remove an app from a department
     */
    removeApp(departmentId: string, appId: string) {
        return request({ url: `${REMOVE_APP_URL}/${departmentId}/${appId}`, method: "delete" });
    },
};

export default OrgAPI;
