
import request from "../../../utils/request";
import { LoginResult } from "./dtos/loginResult";
import { accountInfo, appInfo } from "./dtos/loginResult";
import {
  setAccountInfo as authSetAccountInfo,
  setChooseApp as authSetChooseApp,
  setApp as authSetApp,
  setTicket as authSetTicket
} from "../../../utils/auth";
import { setClientAppConfig, setClientConfig } from "../../../store/modules/client/client";
import { authorityTree,appUserInfo,convertAuthorityToTree } from "./dtos/appUserInfo";
const AppLoginService = {
  /** 获取用户信息 */
  async getAppUser() {
     const result =await  request<any, appUserInfo>({ url: `/v1/security/apps/authority`, method: "get" });
     console.log("getAppUser",result);
     const menus:authorityTree[]=convertAuthorityToTree(result.authoritys);
     return menus;
  },
  /** 应用自动登录 */
  autoLogin(key: string, options?: { onSuccess?: () => void; onFail?: () => void }) {
    request<any, LoginResult>({
      url: `/v1/security/apps/autologin/${key}`,
      method: "get"
    }).then((response) => {
      if (response) {
        //账户载荷信息
        const account = response.account as accountInfo;
        //客户端信息
        const app = response.app as appInfo;

        // 1) 优先存储客户端信息（client_config / app_config）
        try {
          if (app?.client) setClientConfig(app.client);
          if (app?.appId) setClientAppConfig({ appName: app.appName, appId: app.appId } as any);
        } catch (e) { }

        // 2) 票据：仍然调用 auth.ts 的 setTicket（内部会同步/兜底）
        try {
          if (account?.ticket) authSetTicket(account.ticket);
        } catch (e) { }

        // 3) 选择的应用：permission-store 依赖 CHOSEE_APP
        if (app?.appId) authSetChooseApp(app.appId);

        try {
          // 仅存储 payload（保持与 login() 中 setAccountInfo(data.payload) 的使用方式一致）
          authSetAccountInfo(account?.payload as any);
        } catch (e) { }
        try {
          authSetApp(app);
        } catch (e) { }
        //自动登录成功，默认刷新页面；若传入回调则由调用方决定后续动作
        if (options?.onSuccess) options.onSuccess();
        else window.location.reload();
      } else {
        //自动登录失败，默认跳转到登录页面；若传入回调则由调用方决定后续动作
        if (options?.onFail) options.onFail();
        else window.location.href = '/login';
      }
    });
  },
  rejectAuthorization(key: string,options?: { onSuccess?: () => void; onFail?: () => void }) {
    console.log("rejectAuthorization key=",key);

    request<any, boolean>({
      url: `/v1/security/apps/reject/${key}`,
      method: "get"
    }).then(() => {
      if (options?.onSuccess) options.onSuccess();
    }).catch(() => {
      if (options?.onFail) options.onFail();
    });
  }
};

export default AppLoginService;


