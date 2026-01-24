
import type { MenuQuery, MenuForm,MenuQueryResult} from "../dtos/menu.dto";
import request from "@root/base/utils/request";

const SAVE_MENU_URL = "/v1/security/menu/save";
const MENU_DETAIL_URL = "/v1/security/menu/detail";
const DELETE_MENU_URL = "/v1/security/menu/remove";
const QUERY_MENU_URL = "/v1/security/menu/query";

const MenuAPI = {
    /** 获取菜单树形列表 */
    query(queryParams?: MenuQuery) {
        return request<any, MenuQueryResult>({ url: `${QUERY_MENU_URL}`, method: "post", data: queryParams });
    },
    /** 获取菜单表单数据 */
    detail(id?: string) {
        return request<any, MenuForm>({ url: `${MENU_DETAIL_URL}/${id}`, method: "get" });
    },
    /** 新增菜单 */
    save(data: MenuForm) {
        return request({ url: `${SAVE_MENU_URL}`, method: "post", data });
    },
    /** 删除菜单 */
    remove(id: string) {
        return request({ url: `${DELETE_MENU_URL}/${id}`, method: "delete" });
    },

};

export default MenuAPI;