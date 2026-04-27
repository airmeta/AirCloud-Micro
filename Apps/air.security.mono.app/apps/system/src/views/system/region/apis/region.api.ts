
import { QueryResult } from "@root/base/components/air/AirTable/dtos/PageQuery";
import type { RegionForm, RegionVO } from "../dtos/region.dto";
import request from "@root/base/utils/request";

const SAVE_REGION_URL = "/v1/security/region/save";
const REGION_DETAIL_URL = "/v1/security/region/detail";
const DELETE_REGION_URL = "/v1/security/region/remove";
const QUERY_REGION_URL = "/v1/security/region/query";

const RegionAPI = {
    /** 获取区域树形列表 */
    async query(queryParams?: any):Promise<QueryResult<RegionVO>> {
        const regionVOs= await request<any, RegionVO[]>({ url: `${QUERY_REGION_URL}`, method: "post", data: queryParams });
        const regionVOsResult: QueryResult<RegionVO> = {
            list: regionVOs,
            page: {
                page: 1,
                limit: 0,
                total: regionVOs.length,
            },
        };
        return regionVOsResult;
    },

    /** 获取区域表单数据 */
    detail(id?: string) {
        return request<any, RegionForm>({ url: `${REGION_DETAIL_URL}/${id}`, method: "get" });
    },

    /** 新增或更新区域 */
    save(data: RegionForm) {
        return request({ url: `${SAVE_REGION_URL}`, method: "post", data });
    },

    /** 删除区域 */
    remove(id: string) {
        return request({ url: `${DELETE_REGION_URL}/${id}`, method: "delete" });
    },
};

export default RegionAPI;