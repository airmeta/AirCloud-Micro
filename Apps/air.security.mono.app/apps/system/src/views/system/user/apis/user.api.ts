import { QueryResult } from "@root/base/components/air/AirTable/dtos/PageQuery";
import type { UserForm, UserVO } from "../dtos/user.dto";
import request from "@root/base/utils/request";

const BASE = "/v1/security/user";
const URL_DELETE = `${BASE}/remove`;
const URL_DETAIL = `${BASE}/detail`;
const URL_SAVE = `${BASE}/save`;
const URL_QUERY = `${BASE}/query`;
const URL_REMOVE_ROLE = `${BASE}/remove-role`;
const URL_REMOVE_ROLE_GROUP = `${BASE}/remove-role-group`;
const URL_JOIN_DEPT = `${BASE}/join-department`;
const URL_JOIN_USER_GROUP = `${BASE}/join-user-group`;
const URL_LEAVE_DEPT = `${BASE}/leave-department`;
const URL_LEAVE_USER_GROUP = `${BASE}/leave-user-group`;
const URL_ASSIGN_ROLE_GROUP = `${BASE}/assign-role-group`;
const URL_ASSIGN_ROLE = `${BASE}/assign-role`;

const UserAPI = {
  /** 查询用户（分页） */
  query(params?: any) {
    return request<any, QueryResult<UserVO>>({ url: `${URL_QUERY}`, method: "post", data: params });
  },
  /** 获取用户详情 */
  detail(id?: string) {
    return request<any, UserVO>({ url: `${URL_DETAIL}/${id}`, method: "get" });
  },
  /** 保存用户（新增/编辑） */
  save(data: UserForm) {
    return request({ url: `${URL_SAVE}`, method: "post", data });
  },
  /** 删除用户 */
  remove(id: string) {
    // 后端路由为 POST remove/{userId}
    return request({ url: `${URL_DELETE}/${id}`, method: "post" });
  },
  /** 从用户移除角色 */
  removeRole(userId: string, roleId: string) {
    return request({ url: `${URL_REMOVE_ROLE}/${userId}/${roleId}`, method: "get" });
  },
  /** 从用户移除角色组 */
  removeRoleGroup(userId: string, roleGroupId: string) {
    return request({ url: `${URL_REMOVE_ROLE_GROUP}/${userId}/${roleGroupId}`, method: "get" });
  },
  /** 将用户加入部门 */
  joinDepartment(userId: string, departmentId: string) {
    return request({ url: `${URL_JOIN_DEPT}/${userId}/${departmentId}`, method: "get" });
  },
  /** 将用户加入用户组 */
  joinUserGroup(userId: string, groupId: string) {
    return request({ url: `${URL_JOIN_USER_GROUP}/${userId}/${groupId}`, method: "get" });
  },
  /** 用户离开部门 */
  leaveDepartment(userId: string, departmentId: string) {
    return request({ url: `${URL_LEAVE_DEPT}/${userId}/${departmentId}`, method: "get" });
  },
  /** 用户离开用户组 */
  leaveUserGroup(userId: string, groupId: string) {
    return request({ url: `${URL_LEAVE_USER_GROUP}/${userId}/${groupId}`, method: "get" });
  },
  /** 为用户分配角色组 */
  assignRoleGroup(userId: string, roleGroupId: string) {
    return request({ url: `${URL_ASSIGN_ROLE_GROUP}/${userId}/${roleGroupId}`, method: "get" });
  },
  /** 为用户分配角色 */
  assignRole(userId: string, roleId: string) {
    return request({ url: `${URL_ASSIGN_ROLE}/${userId}/${roleId}`, method: "get" });
  },
  /** 重置账户密码（通过加密 content） */
  resetPassword(content: string) {
    return request({ url: '/v1/security/account/password/reset', method: 'post', data: { content } });
  }
};

export default UserAPI;
