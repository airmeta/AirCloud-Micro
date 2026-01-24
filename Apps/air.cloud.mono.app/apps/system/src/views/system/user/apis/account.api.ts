import { QueryResult } from "@root/base/components/air/AirTable/dtos/PageQuery";
import request from "@root/base/utils/request";
import { AccountLogVO } from "../dtos/user.dto";

// 职责：用户账户相关日志接口 / User account log APIs
const BASE = "/v1/security/account";
const URL_QUERY_LOG = `${BASE}/log/query`;
const URL_DETAIL_LOG = `${BASE}/log/detail`;
const URL_REMOVE_LOG = `${BASE}/log/remove`;
const URL_PASSWORD_CHANGE = `${BASE}/password/change`;
const URL_PASSWORD_RESET = `${BASE}/password/reset`;

const AccountAPI = {
  /** 查询用户账户日志（分页） / Query account logs (paged) */
  queryLogs(params?: any) {
    return request<any, QueryResult<AccountLogVO>>({ url: `${URL_QUERY_LOG}`, method: "post", data: params });
  },

  /** 获取日志详情 / Get log detail */
  detailLog(id?: string) {
    return request<any, AccountLogVO>({ url: `${URL_DETAIL_LOG}/${id}`, method: "get" });
  },

  /** 删除日志 / Remove log */
  removeLog(id: string) {
    return request({ url: `${URL_REMOVE_LOG}/${id}`, method: "delete" });
  },

  /** 修改密码（通过加密 content） / Change password (encrypted content) */
  changePassword(content: string) {
    return request({ url: `${URL_PASSWORD_CHANGE}`, method: "post", data: { content } });
  },

  /** 重置密码（通过加密 content），返回新密码或空字符串 / Reset password (encrypted content) */
  resetPassword(content: string) {
    return request<string>({ url: `${URL_PASSWORD_RESET}`, method: "post", data: { content } });
  },
};

export default AccountAPI;
