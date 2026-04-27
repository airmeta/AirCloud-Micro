import { InjectFormData } from "../dto/InjectFormData";

import request from "@/utils/request";
import { useSettingsStore } from "@/store";

const INJECT_API = {
  createDefaultApp(data: InjectFormData) {
    const appStore = useSettingsStore();
    const appId: string = appStore.appId as string;
    data.defaultAppId = appId;
    return request<any, Boolean>({
      url: `/v1/security/app/inject`,
      method: "post",
      data: data
    });
  }
}

export default INJECT_API;

