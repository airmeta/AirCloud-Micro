import request from "@/utils/request";

import { accountAppIdsRDto } from "../../app-center/dto/accountAppIdsRDto";

const APP_CENTER_API = {
  queryAccountApps() {
    return request<any, accountAppIdsRDto[]>({
      url: `/v1/security/account/apps`,
      method: "get"
    });
  },
  goToApp(appId: string) {
    return request<any, string>({
      url: `/v1/security/apps/go/` + appId,
      method: "get"
    });
  }
}

export default APP_CENTER_API;

