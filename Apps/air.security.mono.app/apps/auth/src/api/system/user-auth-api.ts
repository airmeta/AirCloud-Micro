import request from "@/utils/request";
import { appStatusDto } from "@/store/modules/login/appStatusDto";
import BaseUserAPI from "@root/base/api/system/user-api";
export * from "@root/base/api/system/user-api";

const UserAuthAPI = {
  ...BaseUserAPI,
  userInit() {
    return request<any, appStatusDto>({
      url: `/v1/security/pub/init`,
      method: "get",
    });
  },
};

export default UserAuthAPI;
