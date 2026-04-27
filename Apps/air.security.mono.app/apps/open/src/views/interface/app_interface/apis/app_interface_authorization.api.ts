import { QueryResult } from "@root/base/components/air/AirTable/dtos/PageQuery"
import request from "@root/base/utils/request"
import type {
  AppInterfaceAuthorizationCheckDto,
  AppInterfaceAuthorizationRemoveDto,
  AppInterfaceAuthorizationForm,
} from "../dtos/app_interface_authorization.dto"

const BASE = "/v1/open/config/app_auth"
const URL_CHECK = `${BASE}/check`
const URL_REMOVE = `${BASE}/remove`
const URL_DETAIL = `${BASE}/detail`
const URL_QUERY = `${BASE}/query`
const URL_SAVE = `${BASE}/save`

const AppInterfaceAuthorizationAPI = {
  check(data: AppInterfaceAuthorizationCheckDto) {
    return request<any, boolean>({ url: URL_CHECK, method: "post", data })
  },
  query(params?: any) {
    return request<any, QueryResult<AppInterfaceAuthorizationForm>>({ url: URL_QUERY, method: "post", data: params })
  },
  detail(appId?: string, actionId?: string) {
    if (!appId || !actionId) return Promise.resolve(null as AppInterfaceAuthorizationForm | null)
    return request<any, AppInterfaceAuthorizationForm | null>({ url: `${URL_DETAIL}/${appId}/${actionId}`, method: "get" })
  },
  save(data: AppInterfaceAuthorizationForm) {
    return request<any, string>({ url: URL_SAVE, method: "post", data })
  },
  remove(data: AppInterfaceAuthorizationRemoveDto) {
    return request<any, boolean>({ url: URL_REMOVE, method: "post", data })
  },
}

export default AppInterfaceAuthorizationAPI
