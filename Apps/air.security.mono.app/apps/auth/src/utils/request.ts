import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import qs from "qs";
import { ApiCodeEnum } from "@/enums/api/code-enum";
import { redirectToLogin, getTicket } from "@/utils/auth";
import { useTokenRefresh } from "@/composables/auth/useTokenRefresh";
import { useSettingsStore } from "@/store";
import { v4 as uuidv4 } from 'uuid';
import { SignatureUtil } from '@/utils/signature';
// 初始化token刷新组合式函数
const { refreshTokenAndRetry } = useTokenRefresh();

/**
 * 创建 HTTP 请求实例
 */
const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  paramsSerializer: (params) => qs.stringify(params),
});

/**
 * 请求拦截器
 */
httpRequest.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    const ticket = getTicket();
    if (ticket) {
      config.headers['Ticket'] = `${ticket}`;
    }
    const appStore = useSettingsStore();
    const appId: string = appStore.appId as string;
    if (appId) {
      config.headers["AppId"] = appId;
    }
    config.headers["Timestamp"] = (Math.floor(Date.now() / 1000) + "") as string;
    const uniqueId: string = uuidv4();
    config.headers["Nonce"] = uniqueId;
    const method = config.method as string;
    const signUtil = new SignatureUtil(appId as string,config.url as string, config.headers["Timestamp"] as string, ticket as string, uniqueId);
    const signData: any = signUtil.getSignString(method, config);
    config.headers["Signature"] = signData;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器 - 统一处理响应和错误
 */
httpRequest.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 如果响应是二进制数据，则直接返回response对象（用于文件下载、Excel导出、图片显示等）
    if (response.config.responseType === "blob" || response.config.responseType === "arraybuffer") {
      return response;
    }

    const { code, data, errors,message } = response.data;

    // 请求成功
    if (code === ApiCodeEnum.SUCCESS) {
      return data;
    }

    // 业务错误
    ElMessage.error(errors||message || "系统出错");
    return Promise.reject(new Error(errors ||message|| "Business Error"));
  },
  async (error) => {
    const { config, response } = error;
    // 网络错误或服务器无响应
    if (!response) {
      ElMessage.error("网络连接失败，请检查网络设置");
      return Promise.reject(error);
    }
    const {  errors,message } = response.data as ApiResponse;
    const code=response.status;
    switch (code) {
      case ApiCodeEnum.ACCOUNT_INVALID:
        await redirectToLogin("登录已过期，请重新登录");
        return Promise.reject(new Error(errors||message  || "Access Token Invalid"));
      default:
        ElMessage.error(message || "请求失败");
        return Promise.reject(new Error(errors||message  || "Request Error"));
    }
  }
);
export default httpRequest;
