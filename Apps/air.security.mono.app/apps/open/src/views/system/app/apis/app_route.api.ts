import { QueryResult } from "@root/base/components/air/AirTable/dtos/PageQuery";
import { AppRouteVO, AppRouteForm, AppRouteAuthVO } from "../dtos/app_route.dto";
import request from "@root/base/utils/request";

const SAVE_URL = "/v1/security/approute/save";
const DETAIL_URL = "/v1/security/approute/detail";
const DELETE_URL = "/v1/security/approute/remove";
const QUERY_ROUTE_URL = "/v1/security/approute/query/route";
const QUERY_AUTH_URL = "/v1/security/approute/query/auth";
const QUERY_ALL_AUTH_URL = "/v1/security/approute/query/all-auth";
const BIND_URL = "/v1/security/approute/bind";
const REMOVE_BIND_URL = "/v1/security/approute/remove"; // note: same base as DELETE

const AppRouteAPI = {
  /** 保存 AppRoute */
  save(data: AppRouteForm) {
    return request({ url: SAVE_URL, method: "post", data });
  },
  /** 删除 AppRoute */
  remove(id: string) {
    return request({ url: `${DELETE_URL}/${id}`, method: "delete" });
  },
  /** 获取 AppRoute 详情 */
  detail(id?: string) {
    return request<any, AppRouteVO>({ url: `${DETAIL_URL}/${id}`, method: "get" });
  },
  /** 查询 AppRoute 列表（分页） */
  queryRoutes(queryParams?: any) {
    return request<any, QueryResult<AppRouteVO>>({ url: QUERY_ROUTE_URL, method: "post", data: queryParams });
  },
  /** 查询 AppRoute 授权信息（分页） */
  queryAuth(queryParams?: any) {
    return request<any, QueryResult<AppRouteAuthVO>>({ url: QUERY_AUTH_URL, method: "post", data: queryParams });
  },
  /** 查询应用所有路由授权信息（绑定用） */
  queryAllAuth(bindAppId?: string) {
    return request<any, AppRouteAuthVO[]>({ url: `${QUERY_ALL_AUTH_URL}/${bindAppId}`, method: "get" });
  },
  /** 绑定路由到应用 */
  bind(routeId: string, bindAppId: string) {
    return request({ url: `${BIND_URL}/${routeId}/${bindAppId}`, method: "get" });
  },
  /** 解绑路由与应用 */
  removeBind(routeId: string, bindAppId: string) {
    return request({ url: `${REMOVE_BIND_URL}/${routeId}/${bindAppId}`, method: "get" });
  },
};

export default AppRouteAPI;
