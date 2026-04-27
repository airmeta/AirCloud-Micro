import request from "@/utils/request";
import { EncryptUtil } from '@/store/modules/client/encrypt';
import { useSettingsStore } from "@/store";
const AUTH_BASE_URL = "/v1/security";

const AuthAPI = {
  /** 登录接口*/
  login(data: LoginFormData) {
    const data1 = {
      Account: data.username,
      Password: data.password,
      Code: data.code
    };
    const appStore = useSettingsStore();
    const appPublicKey: string = appStore.appPublicKey as string;
    console.log("ticketEncrypt", EncryptUtil.encryptData("8e58de088abe464e80a27d40613dbfe7", appPublicKey));
    const loginContent = EncryptUtil.encryptData(JSON.stringify(data1), appPublicKey) as string;
    return request<any, LoginResult>({
      url: `${AUTH_BASE_URL}/account/login`,
      method: "post",
      data: {
        content: loginContent
      }
    });
  },
  /** 退出登录接口 */
  logout() {
    return request({
      url: `${AUTH_BASE_URL}/logout`,
      method: "delete",
    });
  },

  /** 获取验证码接口*/
  getCaptcha() {
    return request<any, CaptchaInfo>({
      url: `${AUTH_BASE_URL}/pub/captcha`,
      method: "get",
    });
  },
};

export default AuthAPI;

/** 登录表单数据 */
export interface LoginFormData {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 验证码 */
  code: string;
  /** 图形验证码 */
  captchaCode?: string;
  /** 验证码键 */
  captchaKey?: string;
}

/** 登录响应 */
export interface LoginResult {
  accountStatus: number;
  ticket: string;
  expiredTime: string;
  payload: Object;
  enableMFA: number;
}

/** 验证码信息 */
export interface CaptchaInfo {
  /** 验证码图片Base64字符串 */
  captchaBase64: string;
  /** 验证码键 */
  captchaKey: string;
}
