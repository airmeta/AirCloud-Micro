import request from "@root/base/utils/request";
import { QueryResult } from "@root/base/components/air/AirTable/dtos/PageQuery";
import type { AsgForm, AsgVO } from "../dtos/asg.dto";

const SAVE_ASSIGNMENT_URL = "/v1/security/assignment/save";
const ASSIGNMENT_DETAIL_URL = "/v1/security/assignment/detail";
const DELETE_ASSIGNMENT_URL = "/v1/security/assignment/remove";
const QUERY_ASSIGNMENT_URL = "/v1/security/assignment/query";

const AsgAPI = {
    /**
     * zh-cn: 查询职位信息列表
     * en-us: Query assignment information list
     */
    async query(queryParams?: any): Promise<QueryResult<AsgVO>> {
        return request<any, QueryResult<AsgVO>>({ url: `${QUERY_ASSIGNMENT_URL}`, method: "post", data: queryParams });
    },

    /**
     * zh-cn: 查询职位详情
     * en-us: Get assignment details
     */
    detail(id?: string) {
        return request<any, AsgForm>({ url: `${ASSIGNMENT_DETAIL_URL}/${id}`, method: "get" });
    },

    /**
     * zh-cn: 创建或更新职位信息
     * en-us: Create or update assignment information
     */
    save(data: AsgForm) {
        return request({ url: `${SAVE_ASSIGNMENT_URL}`, method: "post", data });
    },

    /**
     * zh-cn: 删除职位信息
     * en-us: Delete assignment information
     */
    remove(id: string) {
        return request({ url: `${DELETE_ASSIGNMENT_URL}/${id}`, method: "delete" });
    },
};

export default AsgAPI;
