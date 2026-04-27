
import { QueryResult } from "@root/base/components/air/AirTable/dtos/PageQuery";
import { RoleForm, RoleVO, RoleQuery } from "../dtos/role.dto";
import request from "@root/base/utils/request";

const SAVE_ROLE_URL = "/v1/security/role/save";
const ROLE_DETAIL_URL = "/v1/security/role/detail";
const DELETE_ROLE_URL = "/v1/security/role/remove";
const QUERY_ROLE_URL = "/v1/security/role/query";
const COPY_ROLE_URL = "/v1/security/role/copy";
const JOIN_ACTION_URL = "/v1/security/role/join-action";
const JOIN_MENU_URL = "/v1/security/role/join-menu";
const JOIN_GROUP_URL = "/v1/security/role/join-group";
const LEAVE_GROUP_URL = "/v1/security/role/leave-group";
const REMOVE_ACTION_URL = "/v1/security/role/remove-action";
const REMOVE_MENU_URL = "/v1/security/role/remove-menu";
const ROLE_MENU_URL = "/v1/security/role/role-menu";
const BATCH_CHANGE_MENU_URL = "/v1/security/role/batch-change-menu";
const RoleAPI = {
    /** 获取角色列表 */
    query(queryParams?: RoleQuery) {
        return request<any, QueryResult<RoleVO>>({ url: `${QUERY_ROLE_URL}`, method: "post", data: queryParams });
    },
    /** 获取角色详情 */
    detail(id?: string) {
        return request<any, RoleVO>({ url: `${ROLE_DETAIL_URL}/${id}`, method: "get" });
    },
    /** 保存角色 */
    save(data: RoleForm) {
        return request({ url: `${SAVE_ROLE_URL}`, method: "post", data });
    },
    /** 删除角色 */
    remove(id: string) {
        return request({ url: `${DELETE_ROLE_URL}/${id}`, method: "delete" });
    },
    /** 复制角色并创建新角色 */
    copy(data: RoleForm) {
        return request({ url: `${COPY_ROLE_URL}`, method: 'post', data });
    },
    /** 为角色加入动作权限 */
    joinAction(roleId: string, permissionId: string) {
        return request({ url: `${JOIN_ACTION_URL}/${roleId}`, method: 'get', params: { permissionId } });
    },
    /** 为角色加入菜单 */
    joinMenu(roleId: string, menuId: string) {
        return request({ url: `${JOIN_MENU_URL}/${roleId}/${menuId}`, method: 'get' });
    },
    /** 将角色加入角色组 */
    joinGroup(roleId: string, roleGroupId: string) {
        return request({ url: `${JOIN_GROUP_URL}/${roleId}/${roleGroupId}`, method: 'get' });
    },
    /** 将角色从角色组移除 */
    leaveGroup(roleId: string, roleGroupId: string) {
        return request({ url: `${LEAVE_GROUP_URL}/${roleId}/${roleGroupId}`, method: 'get' });
    },
    /** 从角色中移除动作权限 */
    removeAction(roleId: string, permissionId: string) {
        return request({ url: `${REMOVE_ACTION_URL}/${roleId}/${permissionId}`, method: 'get' });
    },
    /** 从角色中移除菜单 */
    removeMenu(roleId: string, menuId: string) {
        return request({ url: `${REMOVE_MENU_URL}/${roleId}/${menuId}`, method: 'get' });
    },
    /** 获取角色菜单 */
    roleMenu(roleId: string) {
        return request({ url: `${ROLE_MENU_URL}/${roleId}`, method: 'get' });
    },
    /** 批量变更角色菜单 */
    batchChangeMenu(data: any) {
        return request({ url: `${BATCH_CHANGE_MENU_URL}`, method: 'post', data });
    },

};

export default RoleAPI;