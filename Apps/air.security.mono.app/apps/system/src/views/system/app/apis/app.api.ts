
import { QueryResult } from "@root/base/components/air/AirTable/dtos/PageQuery";
import { AppForm, AppVO, AppQuery } from "../dtos/app.dto";
import request from "@root/base/utils/request";

const SAVE_APP_URL = "/v1/security/app/save";
const APP_DETAIL_URL = "/v1/security/app/detail";
const DELETE_APP_URL = "/v1/security/app/remove";
const QUERY_APP_URL = "/v1/security/app/query";

const AppAPI = {
    /** 获取应用列表 */
    query(queryParams?: AppQuery) {
        return request<any, QueryResult<AppVO>>({ url: `${QUERY_APP_URL}`, method: "post", data: queryParams });
    },
    /** 获取应用详情 */
    detail(id?: string) {
        return request<any, AppVO>({ url: `${APP_DETAIL_URL}/${id}`, method: "get" });
    },
    /** 保存应用 */
    save(data: AppForm) {
        return request({ url: `${SAVE_APP_URL}`, method: "post", data });
    },
    /** 删除应用 */
    remove(id: string) {
        return request({ url: `${DELETE_APP_URL}/${id}`, method: "delete" });
    },

};

export default AppAPI;