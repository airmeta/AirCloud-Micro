import { QueryResult } from "@root/base/components/air/AirTable/dtos/PageQuery";
import type { InternalInterfaceMappingForm, InternalInterfaceMappingVO } from "../dtos/internal_interface_mapping.dto";
import request from "@root/base/utils/request";

const BASE = "/v1/open/mapping/inter_interface";
const URL_DELETE = `${BASE}/remove`;
const URL_DETAIL = `${BASE}/detail`;
const URL_QUERY = `${BASE}/query`;
const URL_SELECT = `${BASE}/select`;
const URL_SAVE = `${BASE}/save`;

const InternalInterfaceMappingAPI = {
  /** 查询内网接口映射（分页） */
  query(params?: any) {
    return request<any, QueryResult<InternalInterfaceMappingVO>>({ url: `${URL_QUERY}`, method: "post", data: params });
  },
  /** 下拉/选择列表（返回数组） */
  select(params?: { page?: number; limit?: number; info?: string }) {
    return request<any, InternalInterfaceMappingVO[]>({ url: `${URL_SELECT}`, method: "post", data: params });
  },
  /** 获取内网接口映射详情 */
  detail(id?: string) {
    return request<any, InternalInterfaceMappingVO>({ url: `${URL_DETAIL}/${id}`, method: "get" });
  },
  /** 保存内网接口映射（新增/编辑） */
  save(data: InternalInterfaceMappingForm) {
    return request<any, string>({ url: `${URL_SAVE}`, method: "post", data });
  },
  /** 删除内网接口映射 */
  remove(id: string) {
    return request<any, boolean>({ url: `${URL_DELETE}/${id}`, method: "delete" });
  },
};

export default InternalInterfaceMappingAPI;
